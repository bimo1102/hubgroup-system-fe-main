import { CycleResolutionInput } from "../cycle_resolver/CycleResolver.js";
import { HasProposedValue, PreviousValueOf } from "./Effect.js";
export class CycleResolutionInputChrono extends CycleResolutionInput {
    collectInfo(Y, identifier, symbol) {
        if (Y(PreviousValueOf(identifier)) != null)
            this.addPreviousValueFlag(symbol);
        if (Y(HasProposedValue(identifier)))
            this.addProposedValueFlag(symbol);
    }
}
