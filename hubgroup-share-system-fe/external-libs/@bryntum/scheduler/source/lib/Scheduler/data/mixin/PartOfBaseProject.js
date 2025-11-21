// Private class that leverages the differences between a core and a basic project
export default Target => class PartOfBaseProject extends Target {
    static get $name() {
        return 'PartOfBaseProject';
    }

    get assignmentStore() {
        return this.project.assignmentStore;
    }

    get calendarManagerStore() {
        return this.project.calendarManagerStore;
    }

    get dependencyStore() {
        return this.project.dependencyStore;
    }

    get eventStore() {
        return this.project.eventStore;
    }

    get resourceStore() {
        return this.project.resourceStore;
    }
};
