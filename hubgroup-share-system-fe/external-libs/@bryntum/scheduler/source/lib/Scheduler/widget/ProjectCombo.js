import Combo from '../../Core/widget/Combo.js';

/**
 * @module Scheduler/widget/ProjectCombo
 */

/**
 * Combo that allows picking a dataset to use for a {@link Scheduler.model.ProjectModel}. Each item holds a title and
 * a load url to reconfigure the project with.
 *
 * @extends Core/widget/Combo
 * @classType projectcombo
 */
export default class ProjectCombo extends Combo {
    static get $name() {
        return 'ProjectCombo';
    }

    static get type() {
        return 'projectcombo';
    }

    static get configurable() {
        return {
            /**
             * Project to reconfigure when picking an item.
             * @config {Scheduler.model.ProjectModel}
             * @category Common
             */
            project : null,

            /**
             * Field used as projects title.
             * @config {String}
             * @default
             * @category Common
             */
            displayField : 'title',

            /**
             * Field used as projects load url.
             * @config {String}
             * @default
             * @category Common
             */
            valueField : 'url',

            highlightExternalChange : false,
            editable                : false
        };
    }

    updateProject(project) {
        if (project.transport.load.url) {
            this.value = project.transport.load.url;
        }
    }

    onChange({ value, userAction }) {
        if (userAction && this.project) {
            this.project.transport.load.url = value;
            this.project.load();
        }
    }
}

// Register this widget type with its Factory
ProjectCombo.initClass();
