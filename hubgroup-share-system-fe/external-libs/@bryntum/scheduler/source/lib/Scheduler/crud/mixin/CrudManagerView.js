/**
 * @module Scheduler/crud/mixin/CrudManagerView
 */

import LoadMaskable from '../../../Core/mixin/LoadMaskable.js';
import Mask from '../../../Core/widget/Mask.js';

/**
 * Mixin to track Crud Manager requests to the server and mask the view during them. For masking it
 * uses the {@link Core.mixin.LoadMaskable#config-loadMask} and {@link Core.mixin.LoadMaskable#config-syncMask}
 * properties.
 *
 * @mixin
 * @extends Core/mixin/LoadMaskable
 */
export default Target => class CrudManagerView extends Target.mixin(LoadMaskable) {
    static get $name() {
        return 'CrudManagerView';
    }

    //region Init

    afterConstruct() {
        super.afterConstruct();

        const { crudManager, project } = this;

        if (this.loadMask && (crudManager || project).isCrudManagerLoading) {
            // Show loadMask if crud manager is already loading
            this.onCrudManagerLoadStart();
        }
    }

    //endregion

    /**
     * Applies the {@link Scheduler.crud.mixin.CrudManagerView#config-syncMask} as the
     * {@link Core.widget.Widget#config-masked mask} for this widget.
     * @internal
     */
    applySyncMask() {
        const { syncMask } = this;

        if (syncMask) {
            this.masked = Mask.mergeConfigs(this.loadMaskDefaults, syncMask);
        }
    }

    /**
     * Hooks up crud manager listeners
     * @private
     * @category Store
     */
    bindCrudManager(crudManager) {
        this.detachListeners('crudManager');

        crudManager?.on({
            name         : 'crudManager',
            loadStart    : 'onCrudManagerLoadStart',
            load         : 'onCrudManagerLoad',
            loadCanceled : 'onCrudManagerLoadCanceled',
            syncStart    : 'onCrudManagerSyncStart',
            sync         : 'onCrudManagerSync',
            syncCanceled : 'onCrudManagerSyncCanceled',
            requestFail  : 'onCrudManagerRequestFail',
            thisObj      : this
        });
    }

    onCrudManagerLoadStart() {
        // Show loadMask before crud manager starts loading
        this.applyLoadMask();
        this.toggleEmptyText?.();
    }

    onCrudManagerSyncStart() {
        this.applySyncMask();
    }

    onCrudManagerRequestFinalize(successful = true, requestType, response) {
        const me = this;

        if (successful) {
            me.masked = null;
            me.toggleEmptyText?.();
        }
        else {
            // Do not remove. Assertion strings for Localization sanity check.
            // 'L{GridBase.loadFailedMessage}'
            // 'L{GridBase.syncFailedMessage}'

            me.applyMaskError(
                `<div class="b-grid-load-failure">
                    <div class="b-grid-load-fail">${me.L(`L{GridBase.${requestType}FailedMessage}`)}</div>
                    ${response && response.message ? `<div class="b-grid-load-fail">${me.L('L{CrudManagerView.serverResponseLabel}')} ${response.message}</div>` : ''}
                </div>`);
        }
    }

    onCrudManagerLoadCanceled() {
        this.onCrudManagerRequestFinalize(true, 'load');
    }

    onCrudManagerSyncCanceled() {
        this.onCrudManagerRequestFinalize(true, 'sync');
    }

    onCrudManagerLoad() {
        this.onCrudManagerRequestFinalize(true, 'load');
    }

    onCrudManagerSync() {
        this.onCrudManagerRequestFinalize(true, 'sync');

        // Repaint rows to have "b-sch-dirty" class up-to-date on the event elements.
        // Needed when no new changes come from server, and there is nothing to apply back to the records.
        // TODO: when https://github.com/bryntum/support/issues/2720 is done, we can refresh specific rows (note, Calendar has many views)
        this.refresh();
    }

    onCrudManagerRequestFail({ requestType, response }) {
        this.onCrudManagerRequestFinalize(false, requestType, response);
    }

    get widgetClass() {}
};
