declare global {
    // Khai báo module để mở rộng @types/react
    module 'react' {
        interface FunctionComponent<P> {
            (props: P): ReactNode | Promise<ReactNode>;
            /**
             * Ignored by React.
             * @deprecated Only kept in types for backwards compatibility. Will be removed in a future major release.
             */
            propTypes?: any;
            /**
             * Used in debugging messages. You might want to set it
             * explicitly if you want to display a different name for
             * debugging purposes.
             *
             * @see {@link https://legacy.reactjs.org/docs/react-component.html#displayname Legacy React Docs}
             *
             * @example
             *
             * ```tsx
             *
             * const MyComponent: FC = () => {
             *   return <div>Hello!</div>
             * }
             *
             * MyComponent.displayName = 'MyAwesomeComponent'
             * ```
             */
            displayName?: string | undefined;
        }
    }
    namespace React {
        interface HTMLAttributes {
            modalRef?: {
                destroy?: () => void;
                data?: any;
            };
        }
    }
    module '*scss';
}

export {};
