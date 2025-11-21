import { useEffect, useMemo, useRef, useState } from 'react';
import { SelectProps, Spin } from 'antd';
import { Select } from 'antd';
import { debounce } from 'lodash';
import React from 'react';
import { DefaultOptionType } from 'antd/es/select';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
    forceFetchingOptionsFirstRender?: boolean
}

export default function DebounceSelect<
    ValueType extends {
        key?: string;
        label: React.ReactNode;
        value: string | number;
        image?: string;
    } = any
>({
    fetchOptions,
    debounceTimeout = 300,
    forceFetchingOptionsFirstRender = false,
    ...props
}: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<DefaultOptionType[]>([]);
    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            // setOptions([]);
            setFetching(true);
            fetchOptions(value).then(newOptions => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    // first render options
    useEffect(() => {
        if (forceFetchingOptionsFirstRender == true) {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setFetching(true);
            fetchOptions('').then(newOptions => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        }
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            showSearch
            onOpenChange={open => open && debounceFetcher('')}
            onSearch={debounceFetcher}
            notFoundContent={
                fetching ? <Spin size='small' /> : 'No results found'
            }
            {...props}
            options={options}
        // optionRender={(option) => (
        //     <div style={{display: 'flex', alignItems: 'center'}}>
        //         {option.label}
        //     </div>
        // )}
        />
    );
}
