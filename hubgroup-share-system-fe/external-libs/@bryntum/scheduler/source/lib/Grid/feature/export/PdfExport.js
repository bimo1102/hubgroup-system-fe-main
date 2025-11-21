import AjaxHelper from '../../../Core/helper/AjaxHelper.js';
import InstancePlugin from '../../../Core/mixin/InstancePlugin.js';
import MultiPageExporter from './exporter/MultiPageExporter.js';
import MultiPageVerticalExporter from './exporter/MultiPageVerticalExporter.js';
import SinglePageExporter from './exporter/SinglePageExporter.js';
import ObjectHelper from '../../../Core/helper/ObjectHelper.js';
import ExportDialog from '../../view/export/ExportDialog.js';
import GridFeatureManager from '../GridFeatureManager.js';
import Toast from '../../../Core/widget/Toast.js';
import Mask from '../../../Core/widget/Mask.js';
import { FileMIMEType } from './Utils.js';

/**
 * @module Grid/feature/export/PdfExport
 */

/**
 * Generates PDF/PNG files from the Grid component.
 *
 * **NOTE:** Server side is required to make export work!
 *
 * The export server is written in nodejs and it is shipped with our examples. You can find setup instructions in
 * `examples/_shared/server/README.md` and `examples/export/README.md` files.
 *
 * When your server is up and running, it listens to requests. The Export feature sends a request to the specified URL
 * with the HTML fragments. The server generates a PDF (or PNG) file and returns a download link (or binary, depending
 * on {@link #config-sendAsBinary} config). Then the Export feature opens the link in a new tab and the file is
 * automatically downloaded by your browser. This is configurable, see {@link #config-openAfterExport} config.
 *
 * The {@link #config-exportServer} URL must be configured. The URL can be localhost if you start the server locally,
 * or your remote server address.
 *
 * ## Usage
 *
 * ```javascript
 * const grid = new Grid({
 *     features : {
 *         pdfExport : {
 *             exportServer : 'http://localhost:8080' // Required
 *         }
 *     }
 * })
 *
 * // Opens popup allowing to customize export settings
 * grid.features.pdfExport.showExportDialog();
 *
 * // Simple export
 * grid.features.pdfExport.export({
 *     // Required, set list of column ids to export
 *     columns : grid.columns.map(c => c.id)
 * }).then(result => {
 *     // Response instance and response content in JSON
 *     let { response } = result;
 * });
 * ```
 *
 * ## Exporters
 *
 * There are three exporters available by default: `singlepage`, `multipage` and `multipagevertical`:
 *  * `singlepage` -  generates single page with content scaled to fit the provided {@link #config-paperFormat}
 *  * `multipage` - generates as many pages as required to fit all requested content, unscaled
 *  * `multipagevertical` - a combination of two above: it scales content horizontally to fit into page width and then
 *  puts overflowing content on vertical pages. Like a scroll.
 *
 * ## Loading resources
 *
 * If you face a problem with loading resources when exporting, the cause might be that the application and the export server are hosted on different servers.
 * This is due to [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (CORS). There are 2 options how to handle this:
 * - Allow cross origin requests from the server where your export is hosted to the server where your application is hosted;
 * - Copy all resources keeping the folder hierarchy from the server where your application is hosted to the server where your export is hosted
 * and setup paths using {@link #config-translateURLsToAbsolute} config and configure the export server to give access to the path:
 *
 * ```javascript
 * const grid = new Grid({
 *     features : {
 *         pdfExport : {
 *             exportServer : 'http://localhost:8080',
 *             // '/resources' is hardcoded in WebServer implementation
 *             translateURLsToAbsolute : 'http://localhost:8080/resources'
 *         }
 *     }
 * })
 * ```
 *
 * ```javascript
 * // Following path would be served by this address: http://localhost:8080/resources/
 * node ./src/server.js -h 8080 -r web/application/styles
 * ```
 *
 * where `web/application/styles` is a physical root location of the copied resources, for example:
 *
 * <img src="Grid/export-server-resources.png" style="max-width : 500px" alt="Export server structure with copied resources" />
 *
 * @extends Core/mixin/InstancePlugin
 *
 * @demo Grid/export
 * @classtype pdfExport
 * @feature
 */
export default class PdfExport extends InstancePlugin {
    static get $name() {
        return 'PdfExport';
    }

    static get configurable() {
        return {
            dialogClass  : ExportDialog,
            /**
             * URL of the print server.
             * @config {String}
             */
            exportServer : undefined,

            /**
             * Returns the instantiated export dialog widget as configured by {@link #config-exportDialog}
             * @property {Grid.view.export.ExportDialog}
             * @name exportDialog
             */
            /**
             * A config object to apply to the {@link Grid.view.export.ExportDialog} widget.
             * @config {Object}
             */
            exportDialog : {
                value : true,

                $config : ['lazy']
            },

            /**
             * Name of the exported file.
             * @config {String}
             */
            fileName : null,

            /**
             * Format of the exported file, either `pdf` or `png`.
             * @config {String}
             * @default
             * @category Export file config
             */
            fileFormat : 'pdf',

            /**
             * Export server will navigate to this url first and then will change page content to whatever client sent.
             * This option is useful with react dev server, which uses a strict CORS policy.
             * @config {String}
             */
            clientURL : null,

            /**
             * Export paper format. Available options are A1...A5, Legal, Letter.
             * @config {String}
             * @default
             * @category Export file config
             */
            paperFormat : 'A4',

            /**
             * Orientation. Options are `portrait` and `landscape`.
             * @config {String}
             * @default
             * @category Export file config
             */
            orientation : 'portrait',

            /**
             * Specifies which rows to export. `all` for complete set of rows, `visible` for only rows currently visible.
             * @config {String}
             * @category Export file config
             */
            rowsRange : 'all',

            /**
             * Set to true to align row top to the page top on every exported page. Only applied to multipage export.
             * @config {Boolean}
             * @default
             */
            alignRows : false,

            /**
             * Set to true to show column headers on every page. This will also set {@link #config-alignRows} to true.
             * Only applies to MultiPageVertical exporter.
             * @config {Boolean}
             * @default
             */
            repeatHeader : false,

            /**
             * By default subGrid width is changed to fit all exported columns. To keep certain subGrid size specify it
             * in the following form:
             * ```
             * keepRegionSizes : {
             *     locked : true
             * }
             * ```
             * @config {Object}
             * @default
             */
            keepRegionSizes : null,

            /**
             * When exporting large views (hundreds of pages) stringified HTML may exceed browser or server request
             * length limit. This config allows to specify how many pages to send to server in one request.
             * @config {Number}
             * @default
             * @private
             */
            pagesPerRequest : 0,

            /**
             * Config for exporter.
             * @config {Object}
             * @private
             */
            exporterConfig : null,

            /**
             * Type of the exporter to use. Should be one of the configured {@link #config-exporters}
             * @config {String}
             * @default
             */
            exporterType : 'singlepage',

            /**
             * List of exporter classes to use in export feature
             * @config {Grid.feature.export.exporter.Exporter[]}
             * @default
             */
            exporters : [SinglePageExporter, MultiPageExporter, MultiPageVerticalExporter],

            /**
             * `True` to replace all linked CSS files URLs to absolute before passing HTML to the server.
             * When passing a string the current origin of the CSS files URLS will be replaced by the passed origin.
             *
             * For example: css files pointing to /app.css will be translated from current origin to {translateURLsToAbsolute}/app.css
             * @config {Boolean|String}
             * @default
             */
            translateURLsToAbsolute : true,

            /**
             * When true links are converted to absolute by combining current window location (with replaced origin) with
             * resource link.
             * When false links are converted by combining new origin with resource link (for angular)
             * @config {Boolean}
             * @default
             */
            keepPathName : true,

            /**
             * When true, page will attempt to download generated file.
             * @config {Boolean}
             * @default
             */
            openAfterExport : true,

            /**
             * Set to true to receive binary file from the server instead of download link.
             * @config {Boolean}
             * @default
             */
            sendAsBinary : false,

            /**
             * False to open in the current tab, true - in a new tab
             * @config {Boolean}
             * @default
             */
            openInNewTab : false,

            /**
             * A template function used to generate a page header. It is passed an object with ´currentPage´ and `totalPages´ properties.
             *
             * ```javascript
             * let grid = new Grid({
             *     appendTo   : 'container',
             *     features : {
             *         pdfExport : {
             *             exportServer : 'http://localhost:8080/',
             *             headerTpl : ({ currentPage, totalPages }) => `
             *                 <div class="demo-export-header">
             *                     <img src="coolcorp-logo.png"/>
             *                     <dl>
             *                         <dt>Date: ${DateHelper.format(new Date(), 'll LT')}</dt>
             *                         <dd>${totalPages ? `Page: ${currentPage + 1}/${totalPages}` : ''}</dd>
             *                     </dl>
             *                 </div>`
             *          }
             *     }
             * });
             * ```
             * @config {Function}
             */
            headerTpl : null,

            /**
             * A template function used to generate a page footer. It is passed an object with ´currentPage´ and `totalPages´ properties.
             *
             * ```javascript
             * let grid = new Grid({
             *      appendTo   : 'container',
             *      features : {
             *          pdfExport : {
             *              exportServer : 'http://localhost:8080/',
             *              footerTpl    : () => '<div class="demo-export-footer"><h3>© 2020 CoolCorp Inc</h3></div>'
             *          }
             *      }
             * });
             * ```
             * @config {Function}
             */
            footerTpl : null,

            /**
             * An object containing the Fetch options to pass to the export server request. Use this to control if credentials are sent
             * and other options, read more at [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
             * @config {Object}
             */
            fetchOptions : null,

            /**
             * A message to be shown when Export feature is performing export.
             * @config {String}
             * @default "Generating pages..."
             */
            exportMask : 'L{Generating pages}',

            /**
             * A message to be shown when export is almost done.
             * @config {String}
             * @default "Waiting for response from server..."
             */
            exportProgressMask : 'L{Waiting for response from server}',

            /**
             * Set to false to not show Toast message on export error.
             * @config {Boolean}
             * @default
             */
            showErrorToast : true,

            localizableProperties : ['exportMask', 'exportProgressMask']
        };
    }

    doDestroy() {
        this.exportDialog?.destroy();

        this.exportersMap.forEach(exporter => exporter.destroy());

        super.doDestroy();
    }

    /**
     * When export is started from GUI ({@link Grid.view.export.ExportDialog}), export promise can be accessed via
     * this property.
     * @property {Promise|null}
     */
    get currentExportPromise() {
        return this._currentExportPromise;
    }

    set currentExportPromise(value) {
        this._currentExportPromise = value;
    }

    get exportersMap() {
        return this._exportersMap || (this._exportersMap = new Map());
    }

    getExporter(config = {}) {
        const
            me               = this,
            { exportersMap } = me,
            { type }         = config;

        let exporter;

        if (exportersMap.has(type)) {
            exporter = exportersMap.get(type);
        }
        else {
            const exporterClass = this.exporters.find(cls => cls.type === type);

            if (!exporterClass) {
                throw new Error(`Exporter type ${type} is not found. Make sure you've configured it`);
            }

            config = ObjectHelper.clone(config);
            delete config.type;

            exporter = new exporterClass(config);

            exporter.relayAll(me);

            exportersMap.set(type, exporter);
        }

        return exporter;
    }

    buildRequest(pages, config) {
        return {
            html        : JSON.stringify(pages),
            fileFormat  : config.fileFormat,
            format      : config.paperFormat,
            orientation : config.orientation
        };
    }

    buildExportConfig(config = {}) {
        const
            me = this,
            {
                client,
                exportServer,
                clientURL,
                fileFormat,
                fileName,
                paperFormat,
                rowsRange,
                alignRows,
                repeatHeader,
                keepRegionSizes,
                orientation,
                translateURLsToAbsolute,
                keepPathName,
                sendAsBinary,
                headerTpl,
                footerTpl
            }  = me;

        if (!config.columns) {
            config.columns = client.columns.visibleColumns.filter(column => column.exportable).map(column => column.id);
        }

        const result = ObjectHelper.assign({
            client,
            exportServer,
            clientURL,
            fileFormat,
            paperFormat,
            rowsRange,
            alignRows,
            repeatHeader,
            keepRegionSizes,
            orientation,
            translateURLsToAbsolute,
            keepPathName,
            sendAsBinary,
            headerTpl,
            footerTpl,
            exporterType : me.exporterType,
            fileName     : fileName || client.$$name
        }, config);

        // slice columns array to not modify it during export
        result.columns = config.columns.slice();

        // Only vertical exporter is supported
        if (result.exporterType !== 'multipagevertical') {
            result.repeatHeader = false;
        }

        // Align rows by default
        if (!('alignRows' in config) && config.repeatHeader) {
            result.alignRows = true;
        }

        // Only change this setting if it is default (false) and not provided directly in config
        if (!('keepRegionSizes' in config) && !result.keepRegionSizes) {
            const
                collapsed       = [],
                keepRegionSizes = {};

            // If there's at least one collapsed region - lock other region sizes
            client.eachSubGrid(s => s.collapsed && collapsed.push(s.region));

            if (collapsed.length) {
                client.eachSubGrid(s => {
                    if (!collapsed.includes(s.region)) {
                        keepRegionSizes[s.region] = true;
                    }
                });

                result.keepRegionSizes = keepRegionSizes;
            }
        }

        result.exporterConfig = ObjectHelper.assign({
            type                    : result.exporterType,
            translateURLsToAbsolute : result.translateURLsToAbsolute,
            keepPathName            : result.keepPathName
        }, result.exporterConfig || {});

        delete result.exporterType;
        delete result.translateURLsToAbsolute;
        delete result.keepPathName;

        return result;
    }

    /**
     * Starts the export process. Accepts a config object which overrides any default configs.
     * **NOTE**. Component should not be interacted with when export is in progress
     *
     * @param {Object} config
     * @param {String[]} config.columns (required) List of column ids to export. E.g.
     *
     * ```javascript
     * grid.features.pdfExport.export({ columns : grid.columns.map(c => c.id) })
     * ```
     * @returns {Promise} Object of the following structure
     * ```
     * {
     *     response // Response instance
     * }
     * ```
     * @async
     */
    async export(config = {}) {
        const
            me = this,
            {
                client,
                pagesPerRequest
            }  = me;

        config = me.buildExportConfig(config);

        let result;

        /**
         * Fires on the owning Grid before export started. Return `false` to cancel the export.
         * @event beforeExport
         * @preventable
         * @on-owner
         * @param {Object} config Export config
         */
        // Fix signature for 4.3.0 - remove ...config
        // https://github.com/bryntum/support/issues/3240
        if (client.trigger('beforeExport', { ...config, config }) !== false) {
            // This mask should be always visible to protect grid from changes even if the mask message is not visible
            // due to the export dialog which is rendered above the grid's mask. The dialog has its own mask which shares the export message.
            client.mask(me.exportMask);

            try {
                const exporter = me.getExporter(config.exporterConfig);

                if (pagesPerRequest === 0) {
                    const pages = await exporter.export(config);

                    /**
                     * Fires when export progress changes
                     * @event exportStep
                     * @param {Number} progress Current progress, 0-100
                     * @param {String} text Optional text to show
                     */
                    me.trigger('exportStep', { progress : 90, text : me.exportProgressMask });

                    const response = await me.receiveExportContent(pages, config);

                    result = { response };

                    await me.processExportContent(response, config);
                }
            }
            catch (error) {
                if (error instanceof Response) {
                    result = { response : error };
                }
                else {
                    result = { error };
                }

                throw error;
            }
            finally {
                if (!me.isDestroying) {
                    me.exportDialog?.close();

                    client.unmask();

                    // Remove event for 4.3.0
                    // https://github.com/bryntum/support/issues/3240
                    me.trigger('export', result);

                    if (me.showErrorToast) {
                        if (result.error) {
                            Toast.show({
                                html        : me.L('L{Export failed}'),
                                rootElement : this.rootElement
                            });
                        }
                        else if (!result.response.ok) {
                            Toast.show({
                                html        : me.L('L{Server error}'),
                                rootElement : this.rootElement
                            });
                        }
                    }

                    /**
                     * Fires on the owning Grid when export has finished
                     * @event export
                     * @on-owner
                     * @param {Response} [response] Optional response, if received
                     * @param {Error} [error] Optional error, if exception occurred
                     */
                    client.trigger('export', result);
                }
            }
        }

        return result;
    }

    /**
     * Sends request to the export server and returns Response instance.
     * @param {Object[]} pages Array of exported pages.
     * @param {String} pages[].html pages HTML of the exported page.
     * @param {Object} config Export config
     * @param {String} config.exportServer URL of the export server.
     * @param {String} config.orientation Page orientation. portrait/landscape.
     * @param {String} config.paperFormat Paper format as supported by puppeteer. A4/A3/...
     * @param {String} config.fileFormat File format. PDF/PNG.
     * @param {String} config.fileName Name to use for the saved file.
     * @param {String} config.clientURL URL to navigate before export. See {@link #config-clientURL}.
     * @param {String} config.sendAsBinary Tells server whether to return binary file instead of download link.
     * @returns {Promise} Returns Response instance
     */
    async receiveExportContent(pages, config) {
        return AjaxHelper.post(
            config.exportServer,
            {
                html         : pages,
                orientation  : config.orientation,
                format       : config.paperFormat,
                fileFormat   : config.fileFormat,
                fileName     : config.fileName,
                clientURL    : config.clientURL,
                sendAsBinary : config.sendAsBinary
            },
            Object.assign({
                credentials : 'omit'
            }, this.fetchOptions)
        );
    }

    /**
     * Handles output of the {@link #function-receiveExportContent}. Server response can be of two different types depending
     * on {@link #config-sendAsBinary} config:
     * - `application/json` In this case JSON response contains url of the file to download
     * - `application/octet-stream` In this case response contains stream of file binary data
     *
     * If {@link #config-openAfterExport} is true, this method will try to download content.
     * @param {Response} response
     * @param {Object} config Export config
     * @param {String} config.exportServer URL of the export server.
     * @param {String} config.orientation Page orientation. portrait/landscape.
     * @param {String} config.paperFormat Paper format as supported by puppeteer. A4/A3/...
     * @param {String} config.fileFormat File format. PDF/PNG.
     * @param {String} config.fileName Name to use for the saved file.
     * @param {String} config.clientURL URL to navigate before export. See {@link #config-clientURL}.
     * @param {String} config.sendAsBinary Tells server whether to return binary file instead of download link. See {@link #config-sendAsBinary}
     * @returns {Promise}
     */
    async processExportContent(response, config) {
        const me = this;

        if (response.ok && me.openAfterExport) {
            // Clone Response to not block response stream
            response = response.clone();

            const contentType = response.headers.get('content-type');

            if (contentType.match(/application\/octet-stream/)) {
                const
                    MIMEType  = FileMIMEType[config.fileFormat],
                    objectURL = await me.responseBlobToObjectURL(response, MIMEType),
                    link      = me.getDownloadLink(config.fileName, objectURL);

                link.click();
            }
            else if (contentType.match(/application\/json/)) {
                const responseJSON = await response.json();

                if (responseJSON.success) {
                    const link = me.getDownloadLink(config.fileName, responseJSON.url);

                    link.click();
                }
                else {
                    Toast.show({
                        html        : responseJSON.msg,
                        rootElement : this.rootElement
                    });
                }
            }
        }
    }

    /**
     * Creates object URL from response content with given mimeType
     * @param {Response} response Response instance
     * @param {String} mimeType
     * @returns {Promise} Returns string object URL
     * @private
     */
    async responseBlobToObjectURL(response, mimeType) {
        const blob = await response.blob();

        return URL.createObjectURL(blob.slice(0, blob.size, mimeType));
    }

    /**
     * Creates link to download the file.
     * @param {String} name File name
     * @param {String} href URL of the resource
     * @returns HTMLAnchorElement
     * @private
     */
    getDownloadLink(name, href) {
        const link = document.createElement('a');

        link.download = name;
        link.href = href;

        if (this.openInNewTab) {
            link.target = '_blank';
        }

        return link;
    }

    get defaultExportDialogConfig() {
        return ObjectHelper.copyProperties({}, this, [
            'client',
            'exporters',
            'exporterType',
            'orientation',
            'fileFormat',
            'paperFormat',
            'alignRows',
            'rowsRange',
            'repeatHeader'
        ]);
    }

    changeExportDialog(exportDialog, oldExportDialog) {
        const me = this;

        oldExportDialog?.destroy();

        if (exportDialog) {
            const config = me.dialogClass.mergeConfigs({
                rootElement : me.rootElement,
                client      : me.client,
                items       : {
                    rowsRangeField : {
                        value : me.rowsRange
                    },

                    exporterTypeField : {
                        value : me.exporterType
                    },

                    orientationField : {
                        value : me.orientation
                    },

                    paperFormatField : {
                        value : me.paperFormat
                    },

                    repeatHeaderField : {
                        value : me.repeatHeader
                    },

                    fileFormatField : {
                        value : me.fileFormat
                    },

                    alignRowsField : {
                        checked : me.alignRows
                    }
                }
            }, me.defaultExportDialogConfig, exportDialog);

            exportDialog = me.dialogClass.new(config);

            exportDialog.on({
                export  : me.onExportButtonClick,
                thisObj : me
            });
        }

        return exportDialog;
    }

    /**
     * Shows {@link Grid.view.export.ExportDialog export dialog}
     * @async
     * @returns {Promise}
     */
    showExportDialog() {
        return this.exportDialog.show();
    }

    onExportButtonClick({ values }) {
        const
            me = this;

        me.mask = new Mask({
            progress    : 0,
            maxProgress : 100,
            text        : me.exportMask,
            target      : me.exportDialog.element
        });

        const detacher = me.on({
            exportstep({ progress, text }) {
                me.mask.progress = progress;

                if (text != null) {
                    me.mask.text = text;
                }
            }
        });

        me.currentExportPromise = me.export(values);

        // Clear current export promise
        me.currentExportPromise.then(() => {
            me.currentExportPromise = null;
            detacher();
            return me.mask.close();
        });
    }
}

GridFeatureManager.registerFeature(PdfExport, false, 'Grid');

// Format expected by export server
// const pageFormat = {
//     html       : '',
//     column     : 1,
//     number     : 1,
//     row        : 1,
//     rowsHeight : 1
// };
//
// const format = {
//     fileFormat  : 'pdf',
//     format      : 'A4',
//     orientation : 'portrait',
//     range       : 'complete',
//     html        : { array : JSON.stringify(pageFormat) }
// };
