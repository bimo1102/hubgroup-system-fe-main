import { isDevMode } from '@angular/core';
export default class WrapperHelper {
    /**
     * Development warning. Showed when environment is set to 'development'.
     */
    static devWarning(clsName, msg) {
        if ((bryntum && bryntum.isTestEnv) || isDevMode()) {
            console.warn(`Bryntum${clsName}Component development warning!\n${msg}\n` +
                'Please check integration guide: https://www.bryntum.com/docs/scheduler/#guides/integration/angular.md');
        }
    }
    /**
     * Development warning for container parameter.
     */
    static devWarningContainer(clsName, containerParam) {
        WrapperHelper.devWarning(clsName, `Using "${containerParam}" parameter for configuration is not recommended.\n` +
            'Widget is placed automatically inside it\'s container element' +
            `Solution: remove "${containerParam}" parameter from configuration.`);
    }
    /**
     * Development warning for config parameter.
     */
    static devWarningConfigProp(clsName, prop) {
        WrapperHelper.devWarning(clsName, `Using "${prop}" parameter for configuration is not recommended.\n` +
            `Solution: Use separate parameter for each "${prop}" value to enable reactive updates of the API instance`);
    }
    /**
     * Development warning for config property.
     */
    static devWarningUpdateProp(clsName, prop) {
        WrapperHelper.devWarning(clsName, `"${prop}" is a static config option for component constructor only. No runtime changes are supported!`);
    }
    /**
     * Applies property value to Bryntum config or instance.
     * @param {any} configOrInstance target object
     * @param {any} prop property name
     * @param {any} value value
     * @param {Boolean} isConfig config setting mode
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static applyPropValue(configOrInstance, prop, value, isConfig = true) {
        if (prop === 'features' && (typeof value === 'object')) {
            Object.keys(value).forEach(key => WrapperHelper.applyPropValue(configOrInstance, `${key}Feature`, value[key], isConfig));
        }
        else if (prop === 'config' && (typeof value === 'object')) {
            Object.keys(value).forEach(key => WrapperHelper.applyPropValue(configOrInstance, key, value[key], isConfig));
        }
        else if (prop === 'columns' && !isConfig) {
            configOrInstance['columns'].data = value;
        }
        else if (prop.endsWith('Feature')) {
            const features = configOrInstance['features'], featureName = prop.replace('Feature', '');
            if (isConfig) {
                features[featureName] = value;
            }
            else {
                const feature = features[featureName];
                if (feature) {
                    feature.setConfig(value);
                }
            }
        }
        else {
            configOrInstance[prop] = value;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlci5oZWxwZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi93cmFwcGVyLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDLE1BQU0sQ0FBQyxPQUFPLE9BQU8sYUFBYTtJQUM5Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBZSxFQUFFLEdBQVc7UUFDakQsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxFQUFFLEVBQUU7WUFDL0MsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLE9BQU8sbUNBQW1DLEdBQUcsSUFBSTtnQkFDeEUsdUdBQXVHLENBQ3RHLENBQUM7U0FDTDtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFlLEVBQUUsY0FBc0I7UUFDckUsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQzVCLFVBQVUsY0FBYyxxREFBcUQ7WUFDN0UsK0RBQStEO1lBQy9ELHFCQUFxQixjQUFjLGlDQUFpQyxDQUN2RSxDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLE9BQWUsRUFBRSxJQUFZO1FBQzVELGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUM1QixVQUFVLElBQUkscURBQXFEO1lBQ25FLDhDQUE4QyxJQUFJLHdEQUF3RCxDQUM3RyxDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLE9BQWUsRUFBRSxJQUFZO1FBQzVELGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUM1QixJQUFJLElBQUksK0ZBQStGLENBQzFHLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsNkVBQTZFO0lBQ3RFLE1BQU0sQ0FBQyxjQUFjLENBQUMsZ0JBQXFCLEVBQUUsSUFBUyxFQUFFLEtBQVUsRUFBRSxXQUFvQixJQUFJO1FBRS9GLElBQUksSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxFQUFFO1lBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEdBQUcsU0FBUyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzVIO2FBQ0ksSUFBSSxJQUFJLEtBQUssUUFBUSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLEVBQUU7WUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUNoSDthQUNJLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUN0QyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1NBQzVDO2FBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQy9CLE1BQ0ksUUFBUSxHQUFNLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxFQUMxQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUMsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQzthQUNqQztpQkFDSTtnQkFDRCxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksT0FBTyxFQUFFO29CQUNULE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzVCO2FBQ0o7U0FDSjthQUNJO1lBQ0QsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ2xDO0lBQ0wsQ0FBQztDQUVKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNEZXZNb2RlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmRlY2xhcmUgbGV0IGJyeW50dW06IGFueTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JhcHBlckhlbHBlciB7XG4gICAgLyoqXG4gICAgICogRGV2ZWxvcG1lbnQgd2FybmluZy4gU2hvd2VkIHdoZW4gZW52aXJvbm1lbnQgaXMgc2V0IHRvICdkZXZlbG9wbWVudCcuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkZXZXYXJuaW5nKGNsc05hbWU6IFN0cmluZywgbXNnOiBTdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIGlmICgoYnJ5bnR1bSAmJiBicnludHVtLmlzVGVzdEVudikgfHwgaXNEZXZNb2RlKCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgQnJ5bnR1bSR7Y2xzTmFtZX1Db21wb25lbnQgZGV2ZWxvcG1lbnQgd2FybmluZyFcXG4ke21zZ31cXG5gICtcbiAgICAgICAgICAgICdQbGVhc2UgY2hlY2sgaW50ZWdyYXRpb24gZ3VpZGU6IGh0dHBzOi8vd3d3LmJyeW50dW0uY29tL2RvY3Mvc2NoZWR1bGVyLyNndWlkZXMvaW50ZWdyYXRpb24vYW5ndWxhci5tZCdcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXZlbG9wbWVudCB3YXJuaW5nIGZvciBjb250YWluZXIgcGFyYW1ldGVyLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZGV2V2FybmluZ0NvbnRhaW5lcihjbHNOYW1lOiBTdHJpbmcsIGNvbnRhaW5lclBhcmFtOiBTdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZyhjbHNOYW1lLFxuICAgICAgICAgICAgYFVzaW5nIFwiJHtjb250YWluZXJQYXJhbX1cIiBwYXJhbWV0ZXIgZm9yIGNvbmZpZ3VyYXRpb24gaXMgbm90IHJlY29tbWVuZGVkLlxcbmAgK1xuICAgICAgICAgICAgJ1dpZGdldCBpcyBwbGFjZWQgYXV0b21hdGljYWxseSBpbnNpZGUgaXRcXCdzIGNvbnRhaW5lciBlbGVtZW50JyArXG4gICAgICAgICAgICBgU29sdXRpb246IHJlbW92ZSBcIiR7Y29udGFpbmVyUGFyYW19XCIgcGFyYW1ldGVyIGZyb20gY29uZmlndXJhdGlvbi5gXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGV2ZWxvcG1lbnQgd2FybmluZyBmb3IgY29uZmlnIHBhcmFtZXRlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRldldhcm5pbmdDb25maWdQcm9wKGNsc05hbWU6IFN0cmluZywgcHJvcDogU3RyaW5nKSA6IHZvaWQge1xuICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmcoY2xzTmFtZSxcbiAgICAgICAgICAgIGBVc2luZyBcIiR7cHJvcH1cIiBwYXJhbWV0ZXIgZm9yIGNvbmZpZ3VyYXRpb24gaXMgbm90IHJlY29tbWVuZGVkLlxcbmAgK1xuICAgICAgICAgICAgYFNvbHV0aW9uOiBVc2Ugc2VwYXJhdGUgcGFyYW1ldGVyIGZvciBlYWNoIFwiJHtwcm9wfVwiIHZhbHVlIHRvIGVuYWJsZSByZWFjdGl2ZSB1cGRhdGVzIG9mIHRoZSBBUEkgaW5zdGFuY2VgXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGV2ZWxvcG1lbnQgd2FybmluZyBmb3IgY29uZmlnIHByb3BlcnR5LlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZGV2V2FybmluZ1VwZGF0ZVByb3AoY2xzTmFtZTogU3RyaW5nLCBwcm9wOiBTdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nKGNsc05hbWUsXG4gICAgICAgICAgICBgXCIke3Byb3B9XCIgaXMgYSBzdGF0aWMgY29uZmlnIG9wdGlvbiBmb3IgY29tcG9uZW50IGNvbnN0cnVjdG9yIG9ubHkuIE5vIHJ1bnRpbWUgY2hhbmdlcyBhcmUgc3VwcG9ydGVkIWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHByb3BlcnR5IHZhbHVlIHRvIEJyeW50dW0gY29uZmlnIG9yIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7YW55fSBjb25maWdPckluc3RhbmNlIHRhcmdldCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge2FueX0gcHJvcCBwcm9wZXJ0eSBuYW1lXG4gICAgICogQHBhcmFtIHthbnl9IHZhbHVlIHZhbHVlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBpc0NvbmZpZyBjb25maWcgc2V0dGluZyBtb2RlXG4gICAgICovXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9leHBsaWNpdC1tb2R1bGUtYm91bmRhcnktdHlwZXNcbiAgICBwdWJsaWMgc3RhdGljIGFwcGx5UHJvcFZhbHVlKGNvbmZpZ09ySW5zdGFuY2U6IGFueSwgcHJvcDogYW55LCB2YWx1ZTogYW55LCBpc0NvbmZpZzogQm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcblxuICAgICAgICBpZiAocHJvcCA9PT0gJ2ZlYXR1cmVzJyAmJiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGtleSA9PiBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGNvbmZpZ09ySW5zdGFuY2UsIGAke2tleX1GZWF0dXJlYCwgdmFsdWVba2V5XSwgaXNDb25maWcpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwcm9wID09PSAnY29uZmlnJyAmJiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGtleSA9PiBXcmFwcGVySGVscGVyLmFwcGx5UHJvcFZhbHVlKGNvbmZpZ09ySW5zdGFuY2UsIGtleSwgdmFsdWVba2V5XSwgaXNDb25maWcpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwcm9wID09PSAnY29sdW1ucycgJiYgIWlzQ29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWdPckluc3RhbmNlWydjb2x1bW5zJ10uZGF0YSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHByb3AuZW5kc1dpdGgoJ0ZlYXR1cmUnKSkge1xuICAgICAgICAgICAgY29uc3RcbiAgICAgICAgICAgICAgICBmZWF0dXJlcyAgICA9IGNvbmZpZ09ySW5zdGFuY2VbJ2ZlYXR1cmVzJ10sXG4gICAgICAgICAgICAgICAgZmVhdHVyZU5hbWUgPSBwcm9wLnJlcGxhY2UoJ0ZlYXR1cmUnLCAnJyk7XG4gICAgICAgICAgICBpZiAoaXNDb25maWcpIHtcbiAgICAgICAgICAgICAgICBmZWF0dXJlc1tmZWF0dXJlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZlYXR1cmUgPSBmZWF0dXJlc1tmZWF0dXJlTmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKGZlYXR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5zZXRDb25maWcodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ09ySW5zdGFuY2VbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuIl19