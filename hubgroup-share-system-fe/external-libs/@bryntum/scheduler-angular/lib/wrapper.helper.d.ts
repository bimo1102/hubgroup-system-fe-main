export default class WrapperHelper {
    /**
     * Development warning. Showed when environment is set to 'development'.
     */
    static devWarning(clsName: String, msg: String): void;
    /**
     * Development warning for container parameter.
     */
    static devWarningContainer(clsName: String, containerParam: String): void;
    /**
     * Development warning for config parameter.
     */
    static devWarningConfigProp(clsName: String, prop: String): void;
    /**
     * Development warning for config property.
     */
    static devWarningUpdateProp(clsName: String, prop: String): void;
    /**
     * Applies property value to Bryntum config or instance.
     * @param {any} configOrInstance target object
     * @param {any} prop property name
     * @param {any} value value
     * @param {Boolean} isConfig config setting mode
     */
    static applyPropValue(configOrInstance: any, prop: any, value: any, isConfig?: Boolean): void;
}
