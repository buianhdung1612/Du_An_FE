
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import {
    RenderActionsCell,
    RenderTitleCell,
    RenderStatusCell,
    RenderCreatedAtCell
} from '../utils/render-cells';

export const useProductCategoryColumns = (isTrash: boolean = false) => {
    

    const columns: GridColDef<any>[] = useMemo(() => [
        {
            field: "name",
            headerName: "Tên danh mục",
            flex: 1,
            minWidth: 200,
            hideable: false,
            renderCell: RenderTitleCell,
        },
        {
            field: "parentName",
            headerName: "Danh mục cha",
            width: 180,
        },
        {
            field: "createdAt",
            headerName: "Ngày tạo",
            width: 160,
            filterable: true,
            type: "dateTime",
            valueGetter: (value) => value ? new Date(value) : null,
            renderCell: (params) => <RenderCreatedAtCell value={params.value} />,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 140,
            renderCell: RenderStatusCell,
        },
        {
            field: "productCount",
            headerName: "Số sản phẩm",
            width: 140,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            headerName: '',
            width: 80,
            sortable: false,
            filterable: false,
            align: 'right',
            renderCell: (params) => <RenderActionsCell {...params} isTrash={isTrash} />,
        },
    ], [isTrash]);

    return columns;
};





