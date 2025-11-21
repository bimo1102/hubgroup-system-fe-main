// components/CustomRadioGroup.tsx
import React from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

export type CustomRadioOption = {
    label: React.ReactNode;
    value: string | number;
    disabled?: boolean;
    className?: string;
};

type CustomRadioGroupProps = {
    options: CustomRadioOption[];
    value?: CustomRadioOption['value'];
    onChange?: (value: CustomRadioOption['value']) => void;
    optionType?: 'button' | 'default';
    buttonStyle?: 'outline' | 'solid';
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
};

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
    options,
    value,
    onChange,
    optionType = 'button',
    buttonStyle = 'solid',
    className,
    disabled = false,
    readOnly = false,
}) => {
    const handleChange = (e: RadioChangeEvent) => {
        if (!readOnly && onChange) {
            onChange(e.target.value);
        }
    };
    const processedOptions = options.map(opt => ({
        ...opt,
        disabled: disabled || opt.disabled,
    }));
    return (
        <Radio.Group
            className={className}
            options={processedOptions}
            value={value}
            onChange={handleChange}
            optionType={optionType}
            buttonStyle={buttonStyle}
        />
    );
};

export default CustomRadioGroup;
