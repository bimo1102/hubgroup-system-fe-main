import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, DatePickerProps } from "antd";
import { DATE_CUSTOM_FORMAT, DATE_FORMAT } from '../../../../constant/common.constant';
import dayjs, { Dayjs } from 'dayjs';

type Props = DatePickerProps;
const DatePickerComponent: React.FC<Props> = ({
    value: valueProps = '',
    onChange,
    ...props
}): React.ReactNode => {
    const datePickerRef = useRef<any>();
    const [value, setValue] = useState<any>(valueProps);
    const [isOpen, setOpen] = useState<boolean>(false);

    useEffect(() => {
        setValue(valueProps);
    }, [valueProps]);

    useEffect(() => {
        if (onChange && typeof onChange === 'function') {
            onChange(value, dayjs(value).format(DATE_FORMAT));
        }
    }, [value]);

    return (
        <React.Fragment>
            <DatePicker
                ref={datePickerRef}
                format={DATE_FORMAT}
                preserveInvalidOnBlur={false}
                open={isOpen}
                onChange={(date, dateString) => {
                    setValue(date);
                }}
                value={value}
                mode='date'
                onOpenChange={(isOpen) => setOpen(isOpen)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key.toLowerCase() == 'enter') {
                        e.preventDefault();
                        setOpen(false);
                        if (dayjs((e.target as any).value, [DATE_FORMAT, DATE_CUSTOM_FORMAT]).isValid()) {
                            setValue(dayjs((e.target as any).value, [DATE_FORMAT, DATE_CUSTOM_FORMAT]));
                            setTimeout(() => datePickerRef.current.blur());
                        }
                    }
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>, info) => {
                    if (dayjs(e.target.value, [DATE_FORMAT, DATE_CUSTOM_FORMAT]).isValid()) {
                        setValue(dayjs(e.target.value, [DATE_FORMAT, DATE_CUSTOM_FORMAT]));
                    }
                }}
                {...props}
            />
        </React.Fragment>
    )
};

export default DatePickerComponent;