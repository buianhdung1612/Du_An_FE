import { GridLocaleText } from "@mui/x-data-grid";
import { useMemo } from "react";

export const useDataGridLocale = (): Partial<GridLocaleText> => {

    const localeText = useMemo(() => ({
        // Filter
        filterPanelDeleteIconLabel: "Xóa",
        filterPanelLogicOperator: "Toán tử logic",
        filterPanelOperator: "Toán tử",
        filterPanelColumns: "Cột",
        filterPanelInputLabel: "Giá trị",
        filterPanelInputPlaceholder: "Nhập giá trị",

        filterOperatorContains: "chứa",
        filterOperatorDoesNotContain: "không chứa",
        filterOperatorEquals: "bằng",
        filterOperatorDoesNotEqual: "không bằng",
        filterOperatorStartsWith: "bắt đầu bằng",
        filterOperatorEndsWith: "kết thúc bằng",
        filterOperatorIsEmpty: "rỗng",
        filterOperatorIsNotEmpty: "không rỗng",
        filterOperatorIsAnyOf: "là một trong",

        // Columns
        toolbarColumns: "Cột",
        columnsManagementSearchTitle: "Tìm kiếm cột",
        columnsManagementShowHideAllText: "Hiện tất cả",

        columnsPanelTextFieldLabel: "Tìm kiếm cột",
        columnsPanelTextFieldPlaceholder: "Tiêu đề cột",
        columnsPanelDragIconLabel: "Sắp xếp lại cột",
        columnsPanelShowAllButton: "Hiện tất cả",
        columnsPanelHideAllButton: "Ẩn tất cả",

        // Pagination
        paginationRowsPerPage: "Số hàng mỗi trang:",
        paginationDisplayedRows: ({ from, to, count }: { from: number, to: number, count: number }) => {
            return `${from}-${to} của ${count === -1 ? "..." : count}`;
        },

        // Toolbar
        toolbarFilters: "Bộ lọc",
        toolbarDensity: "Độ giãn",
        toolbarDensityLabel: "Độ giãn",
        toolbarDensityCompact: "Trung bình",
        toolbarDensityStandard: "Tiêu chuẩn",
        toolbarDensityComfortable: "Rộng",
        toolbarExport: "Xuất",
        toolbarExportLabel: "Xuất",
        toolbarExportCSV: "Tải xuống CSV",
        toolbarExportPrint: "In",

        // Column Menu
        columnMenuLabel: "Menu",
        columnMenuShowColumns: "Hiện cột",
        columnMenuFilter: "Lọc",
        columnMenuHideColumn: "Ẩn",
        columnMenuUnsort: "Bỏ sắp xếp",
        columnMenuSortAsc: "Sắp xếp tăng dần",
        columnMenuSortDesc: "Sắp xếp giảm dần",
        columnHeaderSortIconLabel: "Sắp xếp",

        // Footer
        footerRowSelected: (count: number) => `${count.toLocaleString()} hàng đã chọn`,
        footerTotalRows: "Tổng số hàng:",

        // Global
        noRowsLabel: "Không có dữ liệu",
        noResultsOverlayLabel: "Không tìm thấy kết quả.",
        errorOverlayDefaultLabel: "Có lỗi xảy ra.",

    }), []);

    return localeText as Partial<GridLocaleText>;
};
