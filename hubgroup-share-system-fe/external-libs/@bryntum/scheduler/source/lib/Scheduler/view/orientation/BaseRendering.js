import Base from '../../../Core/Base.js';

export default Target => class extends (Target || Base) {
    getElementFromAssignmentRecord(assignmentRecord, returnWrapper = false) {
        if (this.scheduler.isPainted && assignmentRecord) {
            const wrapper = this.scheduler.foregroundCanvas.syncIdMap?.[assignmentRecord.id];

            // Wrapper wont have syncIdMap when saving dragcreated event from editor
            return returnWrapper ? wrapper : wrapper?.syncIdMap?.event;
        }

        return null;
    }

    getElementFromEventRecord(eventRecord, resourceRecord = eventRecord.resources?.[0], returnWrapper = false) {
        const assignmentRecord = this.assignmentStore.getAssignmentForEventAndResource(eventRecord, resourceRecord);
        return this.getElementFromAssignmentRecord(assignmentRecord, returnWrapper);
    }

    getElementsFromEventRecord(eventRecord, resourceRecord, returnWrapper = false) {
        const me = this;

        // Single event instance, as array
        if (resourceRecord) {
            return [me.getElementFromEventRecord(eventRecord, resourceRecord, returnWrapper)];
        }
        // All instances
        else {
            return eventRecord.resources.reduce((result, resourceRecord) => {
                const el = me.getElementFromEventRecord(eventRecord, resourceRecord, returnWrapper);

                el && result.push(el);

                return result;
            }, []);
        }
    }
};
