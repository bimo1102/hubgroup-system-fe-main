import React from 'react';
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from 'react';
import { SelectProps, Spin, AutoComplete, Empty, Select } from 'antd';
import { debounce } from 'lodash';
import { DefaultOptionType } from 'antd/es/select';

export interface SelectFreeTextProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'children'> {
    debounceTimeout?: number;
    fetchOptions?: (search: string) => Promise<ValueType[]>;
    freeText?: boolean
}

const SelectFreeTextComponent: React.FC<SelectFreeTextProps> = ({
    debounceTimeout = 300,
    options: optionProps = [],
    fetchOptions,
    onChange,
    value: valueProps,
    freeText = false,
    ...props
}): React.ReactNode => {
    const [isFetching, setFetching] = useState(false);
    const [options, setOptions] = useState<DefaultOptionType[]>(optionProps);
    const [searchValue, setSearchValue] = useState(valueProps);
    const isFetchOptionExists = typeof fetchOptions === 'function';
    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (_value: string) => {
            if(freeText == true && _value?.length > 0) onChange('other', { label: _value, value: 'other'})
            if (!isFetchOptionExists) return;
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(_value).then(newOptions => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                setOptions(newOptions);
                setFetching(false);
            });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [
        fetchOptions,
        debounceTimeout
    ]);

    // effect watch option props
    useEffect(() => {
        if(optionProps) setOptions(optionProps);
    },[optionProps]);

    return (
        <Select
            filterOption={isFetchOptionExists ? false : (inputValue, option) =>
                (option!.label as any).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            showSearch
            allowClear={false}
            onClear={() => setSearchValue('')}
            options={options}
            suffixIcon={<DownOutlined />}
            onOpenChange={open => open && isFetchOptionExists && debounceFetcher('')}
            onChange={(_value, option) => {
                setSearchValue(_value);
                onChange(_value, option);
            }}
            value={searchValue}
            onSearch={(_value) => {
                if (_value && _value?.length > 0 && freeText) setSearchValue(_value);
                return debounceFetcher(_value);
            }}
            notFoundContent={(
                <Spin
                    spinning={isFetching}>
                    <Empty
                        styles={{
                            root: {
                                marginBlock: '5px'
                            },
                            image: {
                                height: '35px'
                            }
                        }}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Spin>
            )}
            {...props}
        />
    )
};

export default SelectFreeTextComponent;