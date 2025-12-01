declare module 'GeneralApplication/store' {
    export const store: any;
    export const storeReady: Promise<any>;
    export type RootState = any;
    export type Dispatch = any;
}

declare module 'GeneralReactModule/*' {
    const Component: React.ComponentType<any>;
    export default Component;
}
