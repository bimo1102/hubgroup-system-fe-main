/**
 * @module Core/data/stm/action/UpdateAction
 */
import ActionBase from './ActionBase.js';

const MODEL_PROP    = Symbol('MODEL_PROP');
const NEW_DATA_PROP = Symbol('NEW_DATA_PROP');
const OLD_DATA_PROP = Symbol('OLD_DATA_PROP');

/**
 * Action to record the fact that a model has been updated.
 * @extends Core/data/stm/action/ActionBase
 */
export default class UpdateAction extends ActionBase {

    static get defaultConfig() {
        return {
            /**
             * Reference to a model which has been updated.
             *
             * @config {Core.data.Model}
             * @default
             */
            model : undefined,

            /**
             * Map of updated properties with new values.
             *
             * @config {Object}
             * @default
             */
            newData : undefined,

            /**
             * Map of updated properties with old values.
             *
             * @config {Object}
             * @default
             */
            oldData : undefined
        };
    }

    get type() {
        return 'UpdateAction';
    }

    //<debug>
    afterConfig() {
        super.afterConfig();

        console.assert(
            this.model.isModel && typeof this.newData == 'object' && typeof this.oldData == 'object',
            "Can't create action, bad configuration!"
        );
    }
    //</debug>

    get model() {
        return this[MODEL_PROP];
    }

    set model(value) {
        //<debug>
        console.assert(
            !this[MODEL_PROP] && value.isModel,
            "Can't set model, model should be instanceof `Model` class and can be set only once!"
        );
        //</debug>
        this[MODEL_PROP] = value;
    }

    get newData() {
        return this[NEW_DATA_PROP];
    }

    set newData(value) {
        //<debug>
        console.assert(
            !this[NEW_DATA_PROP] && value && typeof value == 'object',
            "Can't set new data, new data should be an object and can be set only once!"
        );
        //</debug>
        this[NEW_DATA_PROP] = Object.assign({}, value);
    }

    get oldData() {
        return this[OLD_DATA_PROP];
    }

    set oldData(value) {
        //<debug>
        console.assert(
            !this[OLD_DATA_PROP] && value && typeof value == 'object',
            "Can't set old data, old data should be an object and can be set only once!"
        );
        //</debug>
        this[OLD_DATA_PROP] = Object.assign({}, value);
    }

    undo() {
        // it seems STM has to use `model.set()` because of `model.inSet` overrides or smth
        // w/o this call, just with `Object.assign()` below, the view is not refreshed
        // Since invoking accessor will just forward change to the engine, we need to pass `skipAccessors = true`
        // to this call to make this change on data level. Engine will be updated below.
        // Covered by TaskEdit.t `autoSync` subtest
        this.model.set(this.oldData, null, null, null, true);

        // in the same time, engine needs the setters to be activated, since there's some
        // additional logic (for example, invalidate dispatcher)
        // This will make change in the engine
        if (this.model.$) {
            Object.assign(this.model, this.oldData);
        }
    }

    redo() {
        this.model.set(this.newData, null, null, null, true);

        // see comments above
        if (this.model.$) {
            Object.assign(this.model, this.newData);
        }
    }
}
