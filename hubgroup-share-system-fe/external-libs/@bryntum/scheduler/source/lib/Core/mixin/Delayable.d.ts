import Base from "../Base.js";

// to avoid dependency on `chronograph`
type AnyConstructor<A = any>   = new (...input: any[]) => A

export declare class DelayableMixin {
    hasTimeout (name : string) : boolean

    setTimeout (
        timeoutSpec :
            { fn : Function | string, delay : number, name? : string, runOnDestroy? : boolean, cancelOutstanding? : boolean, args? : any[] }
    ) : number


    clearTimeout (idOrName : number | string) : number

    setInterval (fn : Function, delay : number) : number

    clearInterval (id : number)

    // better type would be:
    // buffer<T extends Function>(fn : T | string, options : number | { delay : number, appendArgs : any[], thisObj : any }) : T
    // but the `| string` part messes it up
    buffer (fn : Function | string, options : number | { delay : number, appendArgs? : any[], thisObj : any }) : Function
}


declare const Delayable : <T extends AnyConstructor<Base>>(base : T) => AnyConstructor<InstanceType<T> & DelayableMixin>

export default Delayable
