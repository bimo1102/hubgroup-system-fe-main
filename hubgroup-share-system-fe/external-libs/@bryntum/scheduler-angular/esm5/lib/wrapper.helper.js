import { isDevMode } from '@angular/core';
var WrapperHelper = /** @class */ (function () {
    function WrapperHelper() {
    }
    /**
     * Development warning. Showed when environment is set to 'development'.
     */
    WrapperHelper.devWarning = function (clsName, msg) {
        if ((bryntum && bryntum.isTestEnv) || isDevMode()) {
            console.warn("Bryntum" + clsName + "Component development warning!\n" + msg + "\n" +
                'Please check integration guide: https://www.bryntum.com/docs/scheduler/#guides/integration/angular.md');
        }
    };
    /**
     * Development warning for container parameter.
     */
    WrapperHelper.devWarningContainer = function (clsName, containerParam) {
        WrapperHelper.devWarning(clsName, "Using \"" + containerParam + "\" parameter for configuration is not recommended.\n" +
            'Widget is placed automatically inside it\'s container element' +
            ("Solution: remove \"" + containerParam + "\" parameter from configuration."));
    };
    /**
     * Development warning for config parameter.
     */
    WrapperHelper.devWarningConfigProp = function (clsName, prop) {
        WrapperHelper.devWarning(clsName, "Using \"" + prop + "\" parameter for configuration is not recommended.\n" +
            ("Solution: Use separate parameter for each \"" + prop + "\" value to enable reactive updates of the API instance"));
    };
    /**
     * Development warning for config property.
     */
    WrapperHelper.devWarningUpdateProp = function (clsName, prop) {
        WrapperHelper.devWarning(clsName, "\"" + prop + "\" is a static config option for component constructor only. No runtime changes are supported!");
    };
    /**
     * Applies property value to Bryntum config or instance.
     * @param {any} configOrInstance target object
     * @param {any} prop property name
     * @param {any} value value
     * @param {Boolean} isConfig config setting mode
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    WrapperHelper.applyPropValue = function (configOrInstance, prop, value, isConfig) {
        if (isConfig === void 0) { isConfig = true; }
        if (prop === 'features' && (typeof value === 'object')) {
            Object.keys(value).forEach(function (key) { return WrapperHelper.applyPropValue(configOrInstance, key + "Feature", value[key], isConfig); });
        }
        else if (prop === 'config' && (typeof value === 'object')) {
            Object.keys(value).forEach(function (key) { return WrapperHelper.applyPropValue(configOrInstance, key, value[key], isConfig); });
        }
        else if (prop === 'columns' && !isConfig) {
            configOrInstance['columns'].data = value;
        }
        else if (prop.endsWith('Feature')) {
            var features = configOrInstance['features'], featureName = prop.replace('Feature', '');
            if (isConfig) {
                features[featureName] = value;
            }
            else {
                var feature = features[featureName];
                if (feature) {
                    feature.setConfig(value);
                }
            }
        }
        else {
            configOrInstance[prop] = value;
        }
    };
    return WrapperHelper;
}());
export default WrapperHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcHBlci5oZWxwZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYnJ5bnR1bS9zY2hlZHVsZXItYW5ndWxhci8iLCJzb3VyY2VzIjpbImxpYi93cmFwcGVyLmhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDO0lBQUE7SUFnRkEsQ0FBQztJQS9FRzs7T0FFRztJQUNXLHdCQUFVLEdBQXhCLFVBQXlCLE9BQWUsRUFBRSxHQUFXO1FBQ2pELElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsRUFBRSxFQUFFO1lBQy9DLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBVSxPQUFPLHdDQUFtQyxHQUFHLE9BQUk7Z0JBQ3hFLHVHQUF1RyxDQUN0RyxDQUFDO1NBQ0w7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDVyxpQ0FBbUIsR0FBakMsVUFBa0MsT0FBZSxFQUFFLGNBQXNCO1FBQ3JFLGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUM1QixhQUFVLGNBQWMseURBQXFEO1lBQzdFLCtEQUErRDthQUMvRCx3QkFBcUIsY0FBYyxxQ0FBaUMsQ0FBQSxDQUN2RSxDQUFDO0lBQ04sQ0FBQztJQUVEOztPQUVHO0lBQ1csa0NBQW9CLEdBQWxDLFVBQW1DLE9BQWUsRUFBRSxJQUFZO1FBQzVELGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUM1QixhQUFVLElBQUkseURBQXFEO2FBQ25FLGlEQUE4QyxJQUFJLDREQUF3RCxDQUFBLENBQzdHLENBQUM7SUFDTixDQUFDO0lBRUQ7O09BRUc7SUFDVyxrQ0FBb0IsR0FBbEMsVUFBbUMsT0FBZSxFQUFFLElBQVk7UUFDNUQsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQzVCLE9BQUksSUFBSSxtR0FBK0YsQ0FDMUcsQ0FBQztJQUNOLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCw2RUFBNkU7SUFDL0QsNEJBQWMsR0FBNUIsVUFBNkIsZ0JBQXFCLEVBQUUsSUFBUyxFQUFFLEtBQVUsRUFBRSxRQUF3QjtRQUF4Qix5QkFBQSxFQUFBLGVBQXdCO1FBRS9GLElBQUksSUFBSSxLQUFLLFVBQVUsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxFQUFFO1lBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsYUFBYSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBSyxHQUFHLFlBQVMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQXJGLENBQXFGLENBQUMsQ0FBQztTQUM1SDthQUNJLElBQUksSUFBSSxLQUFLLFFBQVEsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxFQUFFO1lBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsYUFBYSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxFQUF6RSxDQUF5RSxDQUFDLENBQUM7U0FDaEg7YUFDSSxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDdEMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztTQUM1QzthQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMvQixJQUNJLFFBQVEsR0FBTSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFDMUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLElBQUksUUFBUSxFQUFFO2dCQUNWLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLENBQUM7YUFDakM7aUJBQ0k7Z0JBQ0QsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLE9BQU8sRUFBRTtvQkFDVCxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM1QjthQUNKO1NBQ0o7YUFDSTtZQUNELGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUNsQztJQUNMLENBQUM7SUFFTCxvQkFBQztBQUFELENBQUMsQUFoRkQsSUFnRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0Rldk1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZGVjbGFyZSBsZXQgYnJ5bnR1bTogYW55O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcmFwcGVySGVscGVyIHtcbiAgICAvKipcbiAgICAgKiBEZXZlbG9wbWVudCB3YXJuaW5nLiBTaG93ZWQgd2hlbiBlbnZpcm9ubWVudCBpcyBzZXQgdG8gJ2RldmVsb3BtZW50Jy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRldldhcm5pbmcoY2xzTmFtZTogU3RyaW5nLCBtc2c6IFN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgaWYgKChicnludHVtICYmIGJyeW50dW0uaXNUZXN0RW52KSB8fCBpc0Rldk1vZGUoKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBCcnludHVtJHtjbHNOYW1lfUNvbXBvbmVudCBkZXZlbG9wbWVudCB3YXJuaW5nIVxcbiR7bXNnfVxcbmAgK1xuICAgICAgICAgICAgJ1BsZWFzZSBjaGVjayBpbnRlZ3JhdGlvbiBndWlkZTogaHR0cHM6Ly93d3cuYnJ5bnR1bS5jb20vZG9jcy9zY2hlZHVsZXIvI2d1aWRlcy9pbnRlZ3JhdGlvbi9hbmd1bGFyLm1kJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERldmVsb3BtZW50IHdhcm5pbmcgZm9yIGNvbnRhaW5lciBwYXJhbWV0ZXIuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkZXZXYXJuaW5nQ29udGFpbmVyKGNsc05hbWU6IFN0cmluZywgY29udGFpbmVyUGFyYW06IFN0cmluZykgOiB2b2lkIHtcbiAgICAgICAgV3JhcHBlckhlbHBlci5kZXZXYXJuaW5nKGNsc05hbWUsXG4gICAgICAgICAgICBgVXNpbmcgXCIke2NvbnRhaW5lclBhcmFtfVwiIHBhcmFtZXRlciBmb3IgY29uZmlndXJhdGlvbiBpcyBub3QgcmVjb21tZW5kZWQuXFxuYCArXG4gICAgICAgICAgICAnV2lkZ2V0IGlzIHBsYWNlZCBhdXRvbWF0aWNhbGx5IGluc2lkZSBpdFxcJ3MgY29udGFpbmVyIGVsZW1lbnQnICtcbiAgICAgICAgICAgIGBTb2x1dGlvbjogcmVtb3ZlIFwiJHtjb250YWluZXJQYXJhbX1cIiBwYXJhbWV0ZXIgZnJvbSBjb25maWd1cmF0aW9uLmBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXZlbG9wbWVudCB3YXJuaW5nIGZvciBjb25maWcgcGFyYW1ldGVyLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZGV2V2FybmluZ0NvbmZpZ1Byb3AoY2xzTmFtZTogU3RyaW5nLCBwcm9wOiBTdHJpbmcpIDogdm9pZCB7XG4gICAgICAgIFdyYXBwZXJIZWxwZXIuZGV2V2FybmluZyhjbHNOYW1lLFxuICAgICAgICAgICAgYFVzaW5nIFwiJHtwcm9wfVwiIHBhcmFtZXRlciBmb3IgY29uZmlndXJhdGlvbiBpcyBub3QgcmVjb21tZW5kZWQuXFxuYCArXG4gICAgICAgICAgICBgU29sdXRpb246IFVzZSBzZXBhcmF0ZSBwYXJhbWV0ZXIgZm9yIGVhY2ggXCIke3Byb3B9XCIgdmFsdWUgdG8gZW5hYmxlIHJlYWN0aXZlIHVwZGF0ZXMgb2YgdGhlIEFQSSBpbnN0YW5jZWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXZlbG9wbWVudCB3YXJuaW5nIGZvciBjb25maWcgcHJvcGVydHkuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkZXZXYXJuaW5nVXBkYXRlUHJvcChjbHNOYW1lOiBTdHJpbmcsIHByb3A6IFN0cmluZyk6IHZvaWQge1xuICAgICAgICBXcmFwcGVySGVscGVyLmRldldhcm5pbmcoY2xzTmFtZSxcbiAgICAgICAgICAgIGBcIiR7cHJvcH1cIiBpcyBhIHN0YXRpYyBjb25maWcgb3B0aW9uIGZvciBjb21wb25lbnQgY29uc3RydWN0b3Igb25seS4gTm8gcnVudGltZSBjaGFuZ2VzIGFyZSBzdXBwb3J0ZWQhYFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgcHJvcGVydHkgdmFsdWUgdG8gQnJ5bnR1bSBjb25maWcgb3IgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHthbnl9IGNvbmZpZ09ySW5zdGFuY2UgdGFyZ2V0IG9iamVjdFxuICAgICAqIEBwYXJhbSB7YW55fSBwcm9wIHByb3BlcnR5IG5hbWVcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWUgdmFsdWVcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzQ29uZmlnIGNvbmZpZyBzZXR0aW5nIG1vZGVcbiAgICAgKi9cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LW1vZHVsZS1ib3VuZGFyeS10eXBlc1xuICAgIHB1YmxpYyBzdGF0aWMgYXBwbHlQcm9wVmFsdWUoY29uZmlnT3JJbnN0YW5jZTogYW55LCBwcm9wOiBhbnksIHZhbHVlOiBhbnksIGlzQ29uZmlnOiBCb29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuXG4gICAgICAgIGlmIChwcm9wID09PSAnZmVhdHVyZXMnICYmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goa2V5ID0+IFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoY29uZmlnT3JJbnN0YW5jZSwgYCR7a2V5fUZlYXR1cmVgLCB2YWx1ZVtrZXldLCBpc0NvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHByb3AgPT09ICdjb25maWcnICYmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSkge1xuICAgICAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2goa2V5ID0+IFdyYXBwZXJIZWxwZXIuYXBwbHlQcm9wVmFsdWUoY29uZmlnT3JJbnN0YW5jZSwga2V5LCB2YWx1ZVtrZXldLCBpc0NvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHByb3AgPT09ICdjb2x1bW5zJyAmJiAhaXNDb25maWcpIHtcbiAgICAgICAgICAgIGNvbmZpZ09ySW5zdGFuY2VbJ2NvbHVtbnMnXS5kYXRhID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocHJvcC5lbmRzV2l0aCgnRmVhdHVyZScpKSB7XG4gICAgICAgICAgICBjb25zdFxuICAgICAgICAgICAgICAgIGZlYXR1cmVzICAgID0gY29uZmlnT3JJbnN0YW5jZVsnZmVhdHVyZXMnXSxcbiAgICAgICAgICAgICAgICBmZWF0dXJlTmFtZSA9IHByb3AucmVwbGFjZSgnRmVhdHVyZScsICcnKTtcbiAgICAgICAgICAgIGlmIChpc0NvbmZpZykge1xuICAgICAgICAgICAgICAgIGZlYXR1cmVzW2ZlYXR1cmVOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IGZlYXR1cmVzW2ZlYXR1cmVOYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoZmVhdHVyZSkge1xuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlLnNldENvbmZpZyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnT3JJbnN0YW5jZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=