/**
 * @module Scheduler/data/mixin/AttachToProjectMixin
 */

/**
 * Mixin that calls the target class `attachToProject()` function when a new project is assigned to Scheduler/Gantt.
 *
 * @mixin
 */
export default Target => class AttachToProjectMixin extends Target {
    static get $name() {
        return 'AttachToProjectMixin';
    }

    async afterConstruct() {
        super.afterConstruct();

        const
            me            = this,
            projectHolder = (me.client || me.grid),
            { project }   = projectHolder;

        projectHolder.projectSubscribers.push(me);

        // Attach to already existing stores
        if (project) {
            me.attachToProject(project);
            me.attachToResourceStore(project.resourceStore);
            me.attachToEventStore(project.eventStore);
            me.attachToAssignmentStore(project.assignmentStore);
            me.attachToDependencyStore(project.dependencyStore);
            me.attachToCalendarManagerStore(project.calendarManagerStore);
        }
    }

    /**
     * Override to take action when the project instance is replaced.
     *
     * @param {Scheduler.model.ProjectModel} project
     */
    attachToProject(project) {
        this.detachListeners('project');

        this._project = project;
    }

    /**
     * Override to take action when the EventStore instance is replaced, either from being replaced on the project or
     * from assigning a new project.
     *
     * @param {Scheduler.data.EventStore} store
     */
    attachToEventStore(store) {
        this.detachListeners('eventStore');
    }

    /**
     * Override to take action when the ResourceStore instance is replaced, either from being replaced on the project
     * or from assigning a new project.
     *
     * @param {Scheduler.data.ResourceStore} store
     */
    attachToResourceStore(store) {
        this.detachListeners('resourceStore');
    }

    /**
     * Override to take action when the AssignmentStore instance is replaced, either from being replaced on the project
     * or from assigning a new project.
     *
     * @param {Scheduler.data.AssignmentStore} store
     */
    attachToAssignmentStore(store) {
        this.detachListeners('assignmentStore');
    }

    /**
     * Override to take action when the DependencyStore instance is replaced, either from being replaced on the project
     * or from assigning a new project.
     *
     * @param {Scheduler.data.DependencyStore} store
     */
    attachToDependencyStore(store) {
        this.detachListeners('dependencyStore');
    }

    // TODO: Move attachToCalendarMangerStore to Pro somehow

    /**
     * Override to take action when the CalendarManagerStore instance is replaced, either from being replaced on the
     * project or from assigning a new project.
     *
     * @param {Core.data.Store} store
     */
    attachToCalendarManagerStore(store) {
        this.detachListeners('calendarManagerStore');
    }

    get project() {
        return this._project;
    }

    get calendarManagerStore() {
        return this.project.calendarManagerStore;
    }

    get assignmentStore() {
        return this.project.assignmentStore;
    }

    get resourceStore() {
        return this.project.resourceStore;
    }

    get eventStore() {
        return this.project.eventStore;
    }

    get dependencyStore() {
        return this.project.dependencyStore;
    }
};
