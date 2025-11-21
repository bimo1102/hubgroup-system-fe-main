import Column from '../../Grid/column/Column.js';
import ColumnStore from '../../Grid/data/ColumnStore.js';
import StringHelper from '../../Core/helper/StringHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import AvatarRendering from '../../Core/widget/util/AvatarRendering.js';

/**
 * @module Scheduler/column/ResourceInfoColumn
 */

/**
 * Displays basic resource information. Defaults to showing an image + name + event count (all configurable).
 *
 * If a resource has no image, you can either provide an icon using `iconCls` in the data (you then need to specify
 * `image === false` in your data) or the resource initials will be shown.
 *
 * Be sure to specify {@link Scheduler.view.mixin.SchedulerEventRendering#config-resourceImagePath} to instruct the
 * column where to look for the images.
 *
 * If a image fails to load or if a resource lacks an image, the resource name initials will be rendered. If the
 * resource has an {@link Scheduler/model/mixin/ResourceModelMixin#field-eventColor} specified, it will be used as the
 * background color of the initials.
 *
 * @inlineexample Scheduler/column/ResourceInfoColumn.js
 * @classType resourceInfo
 * @extends Grid/column/Column
 */
export default class ResourceInfoColumn extends Column {

    static get $name() {
        return 'ResourceInfoColumn';
    }

    static get type() {
        return 'resourceInfo';
    }

    static get fields() {
        return ['showEventCount', 'showRole', 'showMeta', 'showImage', 'validNames', 'autoScaleThreshold', 'useNameAsImageName'];
    }

    static get defaults() {
        return {
            /** @hideconfigs renderer */

            /**
             * Show image. Looks for image name in fields on the resource in the following order: 'imageUrl', 'image',
             * 'name'. Set `showImage` to a field name to use a custom field. Set `Scheduler.resourceImagePath` to
             * specify where to load images from. If no extension found, defaults to
             * {@link Scheduler.view.mixin.SchedulerEventRendering#config-resourceImageExtension}.
             * @config {Boolean}
             * @default
             */
            showImage : true,

            /**
             * Show number of events assigned to the resource below the name.
             * @config {Boolean}
             * @default
             */
            showEventCount : true,

            /**
             * A template string to render any extra information about the resource below the name
             * @config {Function}
             * @param {Scheduler.model.ResourceModel} resourceRecord The record representing the current row
             */
            showMeta : null,

            /**
             * Show resource role below the name. Specify `true` to display data from the `role` field, or specify a field
             * name to read this value from.
             * @config {Boolean|String}
             * @default
             */
            showRole : false,

            /**
             * Valid image names. Set to `null` to allow all names.
             * @config {String[]}
             * @default
             */
            validNames : [
                'amit',
                'angelo',
                'arcady',
                'arnold',
                'celia',
                'chang',
                'dan',
                'dave',
                'emilia',
                'george',
                'gloria',
                'henrik',
                'hitomi',
                'jong',
                'kate',
                'lee',
                'linda',
                'lisa',
                'lola',
                'macy',
                'madison',
                'malik',
                'mark',
                'maxim',
                'mike',
                'rob',
                'steve'
            ],

            /**
             * Specify 0 to prevent the column from adapting its content according to the used row height, or specify a
             * a threshold (row height) at which scaling should start.
             * @config {Number}
             * @default
             */
            autoScaleThreshold : 40,

            field              : 'name',
            htmlEncode         : false,
            width              : 140,
            cellCls            : 'b-resourceinfo-cell',
            useNameAsImageName : true,
            editor             : VersionHelper.isTestEnv ? false : 'text'
        };
    }

    construct(...args) {
        super.construct(...args);

        this.avatarRendering = new AvatarRendering({
            element : this.grid.element
        });
    }

    doDestroy() {
        super.doDestroy();

        this.avatarRendering.destroy();
    }

    getImageURL(imageName) {
        return StringHelper.joinPaths([this.grid.resourceImagePath || '', imageName || '']);
    }

    template(resourceRecord, value) {
        const me        = this,
            {
                showImage,
                showRole,
                showMeta,
                showEventCount,
                grid
            }         = me,
            {
                timeAxis,
                resourceImageExtension = '',
                defaultResourceImageName
            }         = grid,
            roleField = typeof showRole === 'string' ? showRole : 'role',
            count     = showEventCount && resourceRecord.eventStore.getEvents({
                includeOccurrences : grid.enableRecurringEvents,
                resourceRecord,
                startDate          : timeAxis.startDate,
                endDate            : timeAxis.endDate
            }).length;

        let imageUrl;

        if (showImage && resourceRecord.image !== false) {
            if (resourceRecord.imageUrl) {
                imageUrl = resourceRecord.imageUrl;
            }
            else {
                // record.image supposed to be a file name, located at resourceImagePath
                const
                    imageName = typeof showImage === 'string'
                        ? showImage
                        : (resourceRecord.image || value && me.useNameAsImageName && (value.toLowerCase() + resourceImageExtension) || defaultResourceImageName) || '';

                imageUrl = imageName && me.getImageURL(imageName);

                // Image name should have an extension
                if (!imageName.includes('.')) {
                    // If validNames is specified, check that imageName is valid
                    if (!me.validNames || me.validNames.includes(imageName)) {
                        imageUrl += resourceImageExtension;
                    }
                }
            }
        }

        value = StringHelper.encodeHtml(value);

        return {
            class    : 'b-resource-info',
            children : [
                showImage && me.avatarRendering.getResourceAvatar({
                    initials        : resourceRecord.initials,
                    color           : resourceRecord.eventColor,
                    iconCls         : resourceRecord.iconCls,
                    imageUrl,
                    defaultImageUrl : defaultResourceImageName && this.getImageURL(defaultResourceImageName)
                }),
                showRole || showEventCount || showMeta ? {
                    tag      : 'dl',
                    children : [
                        {
                            tag  : 'dt',
                            html : value
                        },
                        showRole ? {
                            tag   : 'dd',
                            class : 'b-resource-role',
                            html  : StringHelper.encodeHtml(resourceRecord[roleField])
                        } : null,

                        showEventCount ? {
                            tag   : 'dd',
                            class : 'b-resource-events',
                            html  : me.L('L{eventCountText}', count)
                        } : null,

                        showMeta ? {
                            tag   : 'dd',
                            class : 'b-resource-meta',
                            html  : me.showMeta(resourceRecord)
                        } : null
                    ]
                } : value
            ]
        };

    }

    defaultRenderer({ grid, record, cellElement, value, isExport }) {
        let result;

        if (record.isSpecialRow) {
            result = '';
        }
        else if (isExport) {
            result = value;
        }
        else {
            if (this.autoScaleThreshold && grid.rowHeight < this.autoScaleThreshold) {
                cellElement.style.fontSize = (grid.rowHeight / 40) + 'em';
            }
            else {
                cellElement.style.fontSize = '';
            }

            result = this.template(record, value);
        }

        return result;
    }
}

ColumnStore.registerColumnType(ResourceInfoColumn);
