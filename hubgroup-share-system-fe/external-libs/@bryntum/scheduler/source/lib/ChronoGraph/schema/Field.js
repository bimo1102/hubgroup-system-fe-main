import { Meta } from "../chrono/Identifier.js";
import { MinimalFieldIdentifierGen, MinimalFieldIdentifierSync, MinimalFieldVariable } from "../replica/Identifier.js";
import { isGeneratorFunction } from "../util/Helpers.js";
export class Field extends Meta {
    constructor() {
        super(...arguments);
        this.persistent = true;
    }
    getIdentifierClass(calculationFunction) {
        if (this.identifierCls)
            return this.identifierCls;
        if (!calculationFunction)
            return MinimalFieldVariable;
        return isGeneratorFunction(calculationFunction) ? MinimalFieldIdentifierGen : MinimalFieldIdentifierSync;
    }
}
