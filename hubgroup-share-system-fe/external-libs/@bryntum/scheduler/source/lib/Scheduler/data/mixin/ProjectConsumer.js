import Base from '../../../Core/Base.js';
import ProjectModel from '../../model/ProjectModel.js';
import StringHelper from '../../../Core/helper/StringHelper.js';

/**
 * @module Scheduler/data/mixin/ProjectConsumer
 */

/**
 * Creates a Project using any configured stores, and sets the stores configured into the project into
 * the host object.
 *
 * @mixin
 */
export default Target => class ProjectConsumer extends (Target || Base) {
    static get $name() {
        return 'ProjectConsumer';
    }

    //region Default config

    static get declarable() {
        return ['projectStores'];
    }

    static get configurable() {
        return {
            projectModelClass : ProjectModel,

            // TODO: move to SchedulerProBase and SchedulerBase to specify different types
            /**
             * The {@link Scheduler.model.ProjectModel} instance, containing the data visualized by the Scheduler.
             *
             * **Note:** In SchedulerPro the project is instance of SchedulerPro.model.ProjectModel class.
             * @member {Scheduler.model.ProjectModel} project
             */
            /**
             * A {@link Scheduler.model.ProjectModel} instance or a config object. The project holds all Scheduler data.
             * Can be omitted in favor of individual store configs or {@link Scheduler.view.mixin.SchedulerStores#config-crudManager} config.
             *
             * **Note:** This config is **mandatory** in SchedulerPro. See SchedulerPro.model.ProjectModel class.
             * @config {Scheduler.model.ProjectModel|Object} project
             */
            project : {},

            /**
             * Configure as `true` to destroy the Project and stores when `this` is destroyed.
             * @config {Boolean}
             */
            destroyStores : null,

            // Will be populated by AttachToProjectMixin which features mix in
            projectSubscribers : []
        };
    }

    //endregion

    startConfigure(config) {
        // process the project first which ingests any configured data sources,
        this.getConfig('project');

        super.startConfigure(config);
    }

    //region Project

    // This is where all the ingestion happens.
    // At config time, the changers inject incoming values into the project config object
    // that we are building. At the end we instantiate the project with all incoming
    // config values filled in.
    changeProject(project, oldProject) {
        const
            me = this,
            {
                projectStoreNames,
                projectDataNames
            }  = me.constructor;

        me.projectCallbacks = new Set();

        if (project) {
            // Flag for changes to know what stage we are at
            me.buildingProjectConfig = true;

            if (!project.isModel) {
                // When configuring, prio order:
                // 1. If using an already existing CrudManager, it is assumed to already have the stores we should use,
                //    adopt them as ours.
                // 2. If a supplied store already has a project, it is assumed to be shared with another scheduler and
                //    that project is adopted as ours.
                // 3. Use stores from a supplied project config.
                // 4. Use stores configured on scheduler.
                // + Pass on inline data (events, resources, dependencies, assignments -> xxData on the project config)
                //
                // What happens during project initialization is this:
                // this._project is the project *config* object.
                // changeXxxx methods put incoming values directly into it through this.project
                // to be used as its configuration.
                // So when it is instantiated, it has had all configs injected.
                if (me.isConfiguring) {
                    // Set property for changers to put incoming values into
                    me._project = project;

                    // crudManager will be a clone of the raw config if it is a raw config.
                    const { crudManager } = me;

                    // Pull in stores from the crudManager config first
                    if (crudManager) {
                        const { isCrudManager } = crudManager;

                        for (const storeName of projectStoreNames) {
                            if (crudManager[storeName]) {

                                // We configure the project with the stores, and *not* the CrudManager.
                                // The CrudManager ends up having its project set and thereby adopting ours.
                                me[storeName] = crudManager[storeName];

                                // If it's just a config, take the stores out.
                                // We will *configure* it with this project and it will ingest
                                // its stores from there.
                                if (!isCrudManager) {
                                    delete crudManager[storeName];
                                }
                            }
                        }
                    }

                    // Pull in all our configured stores into the project config object.
                    // That also extracts any project into this._sharedProject
                    me.getConfig('projectStores');

                    // Referencing these data configs causes them to be pulled into
                    // the _project.xxxData config property if they are present.
                    for (const dataName of projectDataNames) {
                        me.getConfig(dataName);
                    }
                }

                const { eventStore } = project;

                // Delay autoLoading until listeners are set up, to be able to inject params
                if (eventStore && !eventStore.isEventStoreMixin && eventStore.autoLoad && !eventStore.count) {
                    eventStore.autoLoad = false;
                    me.delayAutoLoad = true;
                }

                // Use sharedProject if found, else instantiate our config.
                project = me._sharedProject || new me.projectModelClass(project);

                // Clear the property so that the updater is called.
                delete me._project;
            }

            // In the updater, configs are live
            me.buildingProjectConfig = false;
        }

        return project;
    }

    /**
     * Implement in subclass to take action when project is replaced.
     *
     * __`super.updateProject(...arguments)` must be called first.__
     *
     * @param {Scheduler.model.ProjectModel} project
     */
    updateProject(project, oldProject) {
        const
            me = this,
            {
                projectListeners,
                crudManager
            }  = me;

        me.detachListeners('projectConsumer');

        // When we set the crudManager now, it will go through to the CrudManagerVIew
        delete me._crudManager;

        if (project) {
            projectListeners.thisObj = me;
            project.on(projectListeners);

            // If the project is a CrudManager, use it as such.
            if (project.isCrudManager) {
                me.crudManager = project;
            }
            // Apply the project to CrudManager, making sure the same stores are used there and here
            else if (crudManager) {
                crudManager.project = project;

                // CrudManager goes through the changer as usual and is initialized
                // from the Project, not any stores it was originally configured with.
                me.crudManager = crudManager;
            }

            // Notifies classes that mix AttachToProjectMixin that we have a new project
            me.projectSubscribers.forEach(subscriber => subscriber.attachToProject(project));

            // Sets the project's stores into the host object
            for (const storeName of me.constructor.projectStoreNames) {
                me[storeName] = project[storeName];
            }

            // Listeners are set up, if EventStore was configured with autoLoad now is the time to load
            if (me.delayAutoLoad) {
                // Restore the flag, not needed but to look good on inspection
                project.eventStore.autoLoad = true;
                project.eventStore.load();
            }
        }

        me.trigger('projectChange', { project });
    }

    // Implementation here because we need to get first look at it to adopt its stores
    changeCrudManager(crudManager) {
        // Set the property to be scanned for incoming stores.
        // If it's a config, it will be stripped of those stores prior to construction.
        if (this.buildingProjectConfig) {
            this._crudManager = crudManager.isCrudManager ? crudManager : Object.assign({}, crudManager);
        }
        else {
            return super.changeCrudManager(crudManager);
        }
    }

    // Called when project changes are committed, after data is written back to records
    onProjectDataReady() {
        if (this.projectCallbacks.size) {
            this.projectCallbacks.forEach(callback => callback());
            this.projectCallbacks.clear();
        }
    }

    /**
     * Accepts a callback that will be called when the underlying project is ready (no commit pending and current commit
     * finalized)
     * @param {Function} callback
     */
    whenProjectReady(callback) {
        // Might already be ready, call directly
        if (this.isEngineReady) {
            callback();
        }
        else {
            this.projectCallbacks.add(callback);
        }
    }

    /**
     * Returns `true` if engine is in a stable calculated state, `false` otherwise.
     * @property {Boolean}
     */
    get isEngineReady() {
        // NonWorkingTime calls this during destruction, hence the ?.
        return Boolean(this.project.isEngineReady?.());
    }

    //endregion

    //region Destroy

    // Cleanup, destroys stores if this.destroyStores is true.
    doDestroy() {
        super.doDestroy();

        if (this.destroyStores) {
            // Shared project might already be destroyed
            !this.project.isDestroyed && this.project.destroy();
        }
    }

    //endregion

    get projectStores() {
        const { projectStoreNames } = this.constructor;

        return projectStoreNames.map(storeName => this[storeName]);
    }

    static get projectStoreNames() {
        return Object.keys(this.projectStores);
    }

    static get projectDataNames() {
        return this.projectStoreNames.reduce((result, storeName) => {
            const { dataName } = this.projectStores[storeName];

            if (dataName) {
                result.push(dataName);
            }
            return result;
        }, []);
    }

    static setupProjectStores(cls, meta) {
        const { projectStores } = cls;

        if (projectStores) {
            const
                projectListeners  = {
                    name      : 'projectConsumer',
                    dataReady : 'onProjectDataReady'
                },
                storeConfigs      = {
                    projectListeners
                };

            // Create property for dataName and change and updater for stores
            for (const storeName in projectStores) {
                const { dataName } = projectStores[storeName];

                // Define "eventStore" config
                storeConfigs[storeName] = null;

                // Define up the "events" property
                if (dataName) {
                    // Getter to return store data
                    // Setter to update project config or live project
                    Object.defineProperty(meta.class.prototype, dataName, {
                        get() {
                            // get events() { return this.project.eventStore.records; }
                            return this.project[storeName]?.records;
                        },
                        set(data) {
                            const { project } = this;

                            if (this.buildingProjectConfig) {
                                // Set the property in the project config object.
                                // eg project.eventsData = [...]
                                project[`${dataName}Data`] = data;
                            }
                            else {
                                // Live update the project when in use.
                                project[storeName].data = data;
                            }
                        }
                    });
                }

                this.createStoreDescriptor(meta, storeName, projectStores[storeName], projectListeners);
            }

            // Create the projectListeners config.
            this.setupConfigs(meta, storeConfigs);
        }
    }

    static createStoreDescriptor(meta, storeName, { listeners }, projectListeners) {
        const
            { prototype : clsProto } = meta.class,
            storeNameCap             = StringHelper.capitalize(storeName);

        // Set up onProjectEventStoreChange to set this.eventStore
        projectListeners[`${storeName}Change`] = function({ store }) {
            this[storeName] = store;
        };

        // create changeEventStore
        clsProto[`change${storeNameCap}`] = function(store, oldStore) {
            const
                me           = this,
                { project }  = me,
                storeProject = store?.project;

            if (me.buildingProjectConfig) {
                // Capture any project found at project config time
                // to use as our shared project
                if (storeProject && storeProject.isProjectModel) {
                    me._sharedProject = storeProject;
                }

                // Set the property in the project config object.
                // Must not go through the updater. It's too early to
                // inform host of store change.
                project[storeName] = store;
                return;
            }

            // Live update the project when in use.
            if (!me.initializingProject) {
                if (project[storeName] !== store) {
                    project[`set${storeNameCap}`](store);
                    store = project[storeName];
                }
            }

            // Implement processing here instead of creating a separate updater.
            // Subclasses can implement updaters.
            if (store !== oldStore) {
                if (listeners) {
                    listeners.thisObj = me;
                    listeners.name = `${storeName}Listeners`;

                    me.detachListeners(listeners.name);

                    store.on(listeners);
                }

                // Notifies classes that mix AttachToProjectMixin that we have a new XxxxxStore
                me.projectSubscribers.forEach(subscriber => {
                    subscriber[`attachTo${storeNameCap}`]?.(store);
                });
            }
            return store;
        };
    }

    //region WidgetClass

    // This does not need a className on Widgets.
    // Each *Class* which doesn't need 'b-' + constructor.name.toLowerCase() automatically adding
    // to the Widget it's mixed in to should implement thus.
    get widgetClass() {}

    //endregion
};
