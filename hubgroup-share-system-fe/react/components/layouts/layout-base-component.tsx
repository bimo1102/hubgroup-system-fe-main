import React from 'react';
import classNames from 'classnames';

type Props = {
    header: {
        title: React.ReactNode;
        toolbar?: React.ReactNode;
        className?: string;
        classNameLeftBar?: string;
        classNameToolbar?: string;
        isSticky?: boolean;
    };
    bodyClass?: string;
    body: React.ReactNode;
    footer?: React.ReactNode;
    footerClass?: string;
    className?: string;
};

const LayoutBaseComponent: React.FC<Props> = ({
    header,
    body,
    bodyClass,
    footer,
    footerClass,
    className,
}): React.ReactNode => {
    return (
        <div className={classNames('card card-bordered', className)}>
            <div
                className={classNames(
                    'card-header',
                    {
                        'bg-white position-sticky top-0 z-index-3':
                            header?.isSticky,
                    },
                    header.className
                )}>
                <div
                    className={classNames(
                        'card-title',
                        header.classNameLeftBar
                    )}>
                    {header.title}
                </div>
                {header.toolbar && (
                    <div
                        className={classNames(
                            'card-toolbar',
                            header.classNameToolbar
                        )}>
                        {header.toolbar}
                    </div>
                )}
            </div>
            <div className={classNames('card-body', bodyClass)}>{body}</div>
            {footer && (
                <div className={classNames('card-footer', footerClass)}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export default LayoutBaseComponent;
