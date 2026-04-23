import { GridColDef } from '@mui/x-data-grid';
import { RenderActionsCell, RenderProductCell, RenderStatusCell, RenderStockCell } from '../utils/render-cells';
import { IProduct } from '../configs/types';
import { useMemo } from 'react';

export const useProductColumns = (isTrash: boolean = false) => {
    const columns: GridColDef<IProduct>[] = useMemo(() => [
        {
            field: "product",
            headerName: "Tên sản phẩm",
            flex: 1,
            hideable: false,
            filterable: true,
            renderCell: RenderProductCell,
        },
        {
            field: "category",
            headerName: "Danh mục",
            width: 180,
            filterable: true,
        },
        {
            field: "stock",
            headerName: "Tồn kho",
            width: 160,
            filterable: false,
            renderCell: (params) => <RenderStockCell {...params} />,
        },
        {
            field: "price",
            headerName: "Giá",
            width: 120,
            filterable: true,
            valueFormatter: (value: any) => value ? `${value.toLocaleString()}đ` : '0đ',
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 120,
            filterable: false,
            renderCell: (params) => <RenderStatusCell {...params} />,
        },
        {
            field: 'actions',
            headerName: '',
            sortable: false,
            filterable: false,
            hideable: false,
            disableColumnMenu: true,
            width: 64,
            align: 'right',
            renderCell: (params) => <RenderActionsCell {...params} isTrash={isTrash} />,
        },
    ], [isTrash]);

    return columns;
};
