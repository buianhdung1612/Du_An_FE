import { GridColDef } from "@mui/x-data-grid";
import {
    getRenderActionsCell,
    RenderTitleCell,
    RenderStatusCell,
    RenderCreatedAtCell
} from '../utils/render-cells';
import { IBookCategory } from "./types";

export const getColumnsConfig = (isTrash: boolean, onEdit: (row: any) => void): GridColDef<IBookCategory>[] => [
    {
        field: "name",
        headerName: "Tên danh mục",
        flex: 1,
        minWidth: 200,
        hideable: false,
        renderCell: RenderTitleCell,
    },
    {
        field: "description",
        headerName: "Mô tả",
        width: 250,
    },
    {
        field: "createdAt",
        headerName: "Thời gian tạo",
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
        field: 'actions',
        headerName: '',
        width: 80,
        sortable: false,
        filterable: false,
        align: 'right',
        renderCell: getRenderActionsCell(isTrash, onEdit),
    },
];

export const columnsInitialState = {
    pagination: {
        paginationModel: { page: 0, pageSize: 10 },
    },
};
