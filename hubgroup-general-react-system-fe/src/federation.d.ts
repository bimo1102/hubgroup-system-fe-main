declare module 'GeneralApplication/store' {
    export const store: any;
    export type RootState = any;
    export type Dispatch = any;
}

declare module 'GeneralApplication/commonActions' {
    export const commonActions: any;
}

declare module 'GeneralReactModule/*' {
    const Component: React.ComponentType<any>;
    export default Component;
}
