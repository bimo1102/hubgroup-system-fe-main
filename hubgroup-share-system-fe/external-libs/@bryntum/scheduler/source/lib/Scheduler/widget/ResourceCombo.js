import Combo from '../../Core/widget/Combo.js';
import DomHelper from '../../Core/helper/DomHelper.js';

/**
 * @module Scheduler/widget/ResourceCombo
 */

/**
 * Combo subclass which selects resources, highlighting the `eventColor` of each resource in
 * the picker and in the input area.
 *
 * @extends Core/widget/Combo
 * @classType resourceCombo
 */
export default class ResourceCombo extends Combo {
    static get $name() {
        return 'ResourceCombo';
    }

    // Factoryable type name
    static get type() {
        return 'resourcecombo';
    }

    static get configurable() {
        return {
            showEventColor : false,

            picker : {
                cls : 'b-resourcecombo-picker',

                itemIconTpl(record, i) {
                    const
                        { eventColor } = record,
                        isStyleColor   = !DomHelper.isNamedColor(eventColor),
                        style          = eventColor ? (isStyleColor ? ` style="color:${eventColor}"` : '') : ' style="display:none"',
                        colorClass     = !eventColor || isStyleColor ? '' : ` b-sch-foreground-${eventColor}`;

                    return `<div class="b-icon b-icon-square${colorClass}"${style}></div>`;
                }
            }
        };
    }

    changeShowEventColor(showEventColor) {
        return Boolean(showEventColor);
    }

    updateShowEventColor(showEventColor) {
        const
            { _picker } = this,
            methodName  = showEventColor ? 'add' : 'remove';

        this.element.classList[methodName]('b-show-event-color');
        _picker?.element.classList[methodName]('b-show-event-color');
    }

    changePicker(picker, oldPicker) {
        picker = super.changePicker(picker, oldPicker);
        picker?.element.classList[this.showEventColor ? 'add' : 'remove']('b-show-event-color');
        return picker;
    }

    // Implementation needed at this level because it has two inner elements in its inputWrap
    get innerElements() {
        return [
            {
                class     : 'b-icon b-resource-icon b-icon-square b-hide-display',
                reference : 'resourceIcon'
            },
            this.inputElement
        ];
    }

    syncInputFieldValue() {
        const
            me            = this,
            {
                resourceIcon,
                lastResourceIconCls
            }             = me,
            { classList } = resourceIcon,
            eventColor    = me.selected?.eventColor ?? '';

        super.syncInputFieldValue();

        // Remove last colour whichever way it was done
        resourceIcon.style.color = '';
        lastResourceIconCls && classList.remove(lastResourceIconCls);
        me.lastResourceIconCls = null;

        if (eventColor) {
            if (DomHelper.isNamedColor(eventColor)) {
                me.lastResourceIconCls = `b-sch-foreground-${eventColor}`;
                classList.add(me.lastResourceIconCls);
            }
            else {
                resourceIcon.style.color = eventColor;
            }
            classList.remove('b-hide-display');
        }
        else {
            classList.add('b-hide-display');
        }
    }
}

// Register this widget type with its Factory
ResourceCombo.initClass();
