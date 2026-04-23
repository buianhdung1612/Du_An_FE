export const DATA_GRID_LOCALE_VN = {
    MuiTablePagination: {
        labelRowsPerPage: 'Số hàng mỗi trang:',
        labelDisplayedRows: ({ from, to, count }: any) =>
            `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`,
    },
    noRowsLabel: 'Không có dữ liệu để hiển thị',
    columnMenuLabel: 'Danh mục',
    columnMenuShowColumns: 'Hiển thị cột',
    columnMenuFilter: 'Lọc',
};
