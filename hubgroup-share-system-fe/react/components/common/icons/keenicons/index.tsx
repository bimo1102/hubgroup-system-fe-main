import React from 'react';
import icons from "./icons.json";

type Props = {
    name: string;
    className: string;
    type: string;
    styles?: React.CSSProperties
}

const KeenIconsComponent: React.FC<Props> = ({
    className,
    name,
    styles,
    type = 'duotone',
}): React.ReactNode => {

    let pathsNumber: number = 0;

    if (type === 'duotone') {
        // @ts-ignore
        pathsNumber = icons[type + '-paths'][name] ?? 0;
    }
    
    return (
        <React.Fragment>
            {type === 'duotone' ? (
                <i style={styles} className={`ki-${type} ki-${name}${className ? ' ' + className : ''}`}>
                    {[...Array(pathsNumber).keys()].map((data: any,index: number) => {
                        return <span className={`path${index + 1}`}></span>
                    })}
                </i>
            ) : (
                <i style={styles} className={`ki-${type} ki-${name}${className ? ' ' + className : ''}`}></i>
            )}
        </React.Fragment >
    )
};

export default React.memo(KeenIconsComponent);