import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Card,
    Box,
    CircularProgress,
    Stack,
    Typography,
    IconButton,
    Chip,
    Pagination,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Icon } from '@iconify/react';
import { SortAscendingIcon, SortDescendingIcon, UnsortedIcon } from '../../../../assets/icons';
import { getColumnsConfig, columnsInitialState } from '../configs/column.config';
import { BlogCategoryToolbar } from './BlogCategoryToolbar';
import { DATA_GRID_LOCALE_VN } from '../configs/localeText.config';
import {
    dataGridCardStyles,
    dataGridContainerStyles,
    dataGridStyles
} from '../configs/styles.config';
import {
    useBlogCategories,
    useDeleteBlogCategory,
    useRestoreBlogCategory
} from '../hooks/useBlogCategory';
import { confirmDelete } from '@shared/utils/swal';
import { toast } from 'react-toastify';

interface BlogCategoryListProps {
    isTrash?: boolean;
    onEdit?: (row: any) => void;
}

export const BlogCategoryList = ({ isTrash = false, onEdit }: BlogCategoryListProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string[]>([]);

    const params = {
        page: page + 1,
        limit: pageSize,
        keyword: search,
        status: status.length > 0 ? status.join(',') : undefined,
        is_trash: isTrash || undefined,
    };

    const { data: res, isLoading } = useBlogCategories(params);
    const { mutate: deleteCategory } = useDeleteBlogCategory();
    const { mutate: restoreCategory } = useRestoreBlogCategory();

    const categories = res?.data?.recordList || [];
    const pagination = res?.data?.pagination || { totalRecords: 0 };

    const handleDelete = (id: string) => {
        confirmDelete("Bạn có chắc chắn muốn xóa danh mục này?", () => {
            deleteCategory(id, {
                onSuccess: (response: any) => {
                    if (response.success) toast.success("Xóa danh mục thành công");
                    else toast.error(response.message);
                }
            });
        });
    };

    const handleRestore = (id: string) => {
        restoreCategory(id, {
            onSuccess: (response: any) => {
                if (response.success) toast.success("Khôi phục danh mục thành công");
                else toast.error(response.message);
            }
        });
    };

    if (isMobile) {
        return (
            <Box sx={{ px: 2, pb: 4 }}>
                <BlogCategoryToolbar
                    search={search}
                    onSearchChange={(val) => { setSearch(val); setPage(0); }}
                    status={status}
                    onStatusChange={(val) => { setStatus(val); setPage(0); }}
                />

                <Stack spacing={2} sx={{ mt: 2 }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress size={32} /></Box>
                    ) : categories.length === 0 ? (
                        <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 5 }}>Không có dữ liệu</Typography>
                    ) : (
                        categories.map((row: any) => (
                            <Card key={row._id} sx={{ p: 2, borderRadius: '16px', boxShadow: 'var(--customShadows-card)' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                                            {row.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {row.description || "Không có mô tả"}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={row.status === 'active' ? "Hoạt động" : "Tạm ngưng"}
                                        size="small"
                                        color={row.status === 'active' ? "success" : "default"}
                                        variant="outlined"
                                    />
                                </Stack>

                                <Stack direction="row" spacing={1} sx={{ mt: 2, pt: 1, borderTop: '1px dashed #919eab33' }} justifyContent="flex-end">
                                    {isTrash ? (
                                        <IconButton size="small" color="info" onClick={() => handleRestore(row._id)}>
                                            <Icon icon="solar:history-bold" width={20} />
                                        </IconButton>
                                    ) : (
                                        <IconButton size="small" color="inherit" onClick={() => onEdit?.(row)}>
                                            <Icon icon="solar:pen-bold" width={20} />
                                        </IconButton>
                                    )}
                                    <IconButton size="small" color="error" onClick={() => handleDelete(row._id)}>
                                        <Icon icon="solar:trash-bin-trash-bold" width={20} />
                                    </IconButton>
                                </Stack>
                            </Card>
                        ))
                    )}
                </Stack>

                {pagination.totalRecords > pageSize && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={Math.ceil(pagination.totalRecords / pageSize)}
                            page={page + 1}
                            onChange={(_, val) => setPage(val - 1)}
                            color="primary"
                            size="small"
                        />
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Card elevation={0} sx={dataGridCardStyles}>
            <div style={dataGridContainerStyles}>
                <DataGrid
                    rows={categories}
                    getRowId={(row) => row._id}
                    loading={isLoading}
                    columns={getColumnsConfig(isTrash)}
                    density="comfortable"
                    slots={{
                        toolbar: BlogCategoryToolbar as any,
                        columnSortedAscendingIcon: SortAscendingIcon,
                        columnSortedDescendingIcon: SortDescendingIcon,
                        columnUnsortedIcon: UnsortedIcon,
                        noRowsOverlay: () => (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                {isLoading ? <CircularProgress size={32} /> : <span className='text-[1.125rem]'>Không có dữ liệu để hiển thị</span>}
                            </Box>
                        )
                    }}
                    slotProps={{
                        toolbar: {
                            search,
                            onSearchChange: (val: string) => { setSearch(val); setPage(0); },
                            status,
                            onStatusChange: (val: string[]) => { setStatus(val); setPage(0); }
                        } as any
                    }}
                    localeText={DATA_GRID_LOCALE_VN}
                    pagination
                    paginationMode="server"
                    rowCount={pagination.totalRecords || 0}
                    paginationModel={{
                        page,
                        pageSize,
                    }}
                    onPaginationModelChange={(model) => {
                        setPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={columnsInitialState}
                    getRowHeight={() => 'auto'}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={dataGridStyles}
                />
            </div>
        </Card>
    );
};




