import Base from '../Base.js';
import DynamicObject from '../util/DynamicObject.js';

/**
 * @module Core/mixin/Featureable
 */

/**
 * This mixin provides management of a set of features that can be manipulated via the `features` config.
 *
 * The first step in using `Featureable` is to define the family of features using `Factoryable` to declare a base
 * class for features to extend:
 * ```
 *  class SuperWidgetFeature extends InstancePlugin.mixin(Factoryable) {
 *      static get factoryable() {
 *          //
 *      }
 *  }
 * ```
 *
 * The various feature classes extend the `SuperWidgetFeature` base class and call `initClass()` to register themselves:
 * ```
 *  export default class AmazingSuperWidgetFeature extends SuperWidgetFeature {
 *      static get type() {
 *          return 'amazing';
 *      }
 *  }
 *
 *  AmazingSuperWidgetFeature.initClass();
 * ```
 *
 * A class that supports these features via `Featureable` is declared like so:
 * ```
 *  class SuperWidget extends Widget.mixin(Featureable) {
 *      static get featureable() {
 *          return {
 *              factory : SuperWidgetFeature
 *          };
 *      }
 *
 *      static get configurable() {
 *          return {
 *              // Declare the default features. These can be disabled by setting them to a falsy value. Using
 *              // configurable(), the value defined by this class is merged with values defined by derived classes
 *              // and ultimately the instance.
 *              features : {
 *                  amazing : {
 *                      ...
 *                  }
 *              }
 *          };
 *      }
 *  }
 *```
 * @mixin
 * @internal
 */
export default Target => class Featureable extends (Target || Base) {
    static get $name() {
        return 'Featureable';
    }

    static get configurable() {
        return {
            /**
             * Specifies the features to create and associated with the instance. The keys of this object are the names
             * of features. The values are config objects for those feature instances.
             *
             * After construction, this property can be used to access the feature instances and even reconfigure them.
             *
             * For example:
             * ```
             *  instance.features.amazing = {
             *      // reconfigure this feature
             *  }
             * ```
             * This can also be done in bulk:
             * ```
             *  instance.features = {
             *      amazing : {
             *          // reconfigure this feature
             *      },
             *      // reconfigure other features
             *  }
             * ```
             * @config {Object}
             */
            features : null
        };
    }

    static get declarable() {
        return [
            /**
             * This property getter returns options that control feature management for the derived class. This
             * property getter must be defined by the class that mixes in `Featureable` in order to initialize the
             * class properly.
             * ```
             *  class SuperWidget extends Widget.mixin(Featureable) {
             *      static get featureable() {
             *          return {
             *              factory : SuperWidgetFeature
             *          };
             *      }
             *      ...
             *  }
             * ```
             * @static
             * @member {Object} featureable
             * @property {Core.mixin.Factoryable} featureable.factory The factoryable class (not one of its instances)
             * that will be used to create feature instances.
             * @property {String} [featureable.ownerName='client'] The config or property to assign on each feature as
             * a reference to its creator, the `Featureable` instance.
             * @internal
             */
            'featureable'
        ];
    }

    static setupFeatureable(cls) {
        const featureable = {
            ownerName : 'client',
            ...cls.featureable
        };

        featureable.factory.initClass();

        // Replace the class/static getter with a new one that returns the complete featureable object:
        Reflect.defineProperty(cls, 'featureable', {
            get() {
                return featureable;
            }
        });
    }

    doDestroy() {
        const features = this.features;

        super.doDestroy();

        for (const name in features) {
            const feature = features[name];
            // Feature might be false or destroyed already by Grid (EventList mixes in CalendarMixin which has this mixin)
            feature.destroy?.();
        }
    }

    /**
     * Returns `true` if the specified feature is active for this instance and `false` otherwise.
     * @param {String} name The feature name
     * @returns {Boolean}
     */
    hasFeature(name) {
        return Boolean(this.features?.[name]);
    }

    changeFeatures(features, was) {
        if (this.isDestroying) {
            return;
        }

        const
            me = this,
            { featureable } = me.constructor,
            manager = me.$features || (me.$features = new DynamicObject({
                configName : 'features',
                factory    : featureable.factory,
                owner      : me,
                ownerName  : featureable.ownerName
            }));

        manager.update(features);

        if (!was) {
            // Only return the target once. Further calls are processed above so we need to return undefined to ensure
            // onConfigChange is called. By returning the same target on 2nd+ call, it passes the === test and won't
            // trigger onConfigChange.
            return manager.target;
        }
    }

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}
};
