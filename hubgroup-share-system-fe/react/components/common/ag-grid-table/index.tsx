import React, { forwardRef, useMemo } from 'react';
import {
    GridOptions,
    SizeColumnsToContentStrategy,
    SizeColumnsToFitGridStrategy,
    SizeColumnsToFitProvidedWidthStrategy,
    themeQuartz
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Flex, Pagination, PaginationProps } from 'antd';
import classNames from 'classnames';

type Props = GridOptions & {
    className?: string;
    
    warpperClassName?: string;
    showPagination?: PaginationProps;

    cellSelection?: boolean;
};

const AgGridTable: React.FC<Props> = forwardRef<AgGridReact, Props>(
    ({ showPagination, warpperClassName, cellSelection = true, ...props }, ref) => {
        const myTheme = useMemo(
            () =>
                themeQuartz.withParams({
                    accentColor: '#A8A8A8',
                    borderColor: '#14141426',
                    borderRadius: 2,
                    browserColorScheme: 'light',
                    columnBorder: true,
                    headerBackgroundColor: '#FAFAFA',
                    headerFontSize: 14,
                    headerFontWeight: 500,
                    headerRowBorder: true,
                    headerTextColor: '#000000D9',
                    // oddRowBackgroundColor: '#FFFFFF',
                    spacing: '5px',
                    wrapperBorder: true,
                    wrapperBorderRadius: 2,

                    rowBorder: { style: 'solid' },
                    // headerBackgroundColor: '#dee9fc',
                    fontSize: 12,
                    oddRowBackgroundColor: '#e7f6ff',
                    selectedRowBackgroundColor: '#008eff42',
                    checkboxCheckedBackgroundColor: '#1677ff'
                }),
            []
        );

        const autoSizeStrategy =
            props.autoSizeStrategy ||
            useMemo<
                | SizeColumnsToContentStrategy
                | SizeColumnsToFitGridStrategy
                | SizeColumnsToFitProvidedWidthStrategy
            >(() => {
                return {
                    type: 'fitCellContents'
                };
            }, []);

        return (
            <div
                className={classNames(warpperClassName,{
                    'grid-has-result':
                        props.rowData && props.rowData.length > 0
                })}>
                <AgGridReact
                    ref={ref}
                    theme={myTheme}
                    // debug={process.env.NODE_ENV === 'development'}
                    autoSizeStrategy={autoSizeStrategy}
                    domLayout={props.domLayout || 'autoHeight'}
                    cellSelection={cellSelection}
                    animateRows={false}
                    {...props}
                />
                {showPagination && (
                    <Flex justify="end" className="mt-2">
                        <Pagination
                            size={showPagination.size || 'small'}
                            showSizeChanger={
                                showPagination.showSizeChanger || false
                            }
                            {...showPagination}
                        />
                    </Flex>
                )}
            </div>
        );
    }
);

export default AgGridTable;
