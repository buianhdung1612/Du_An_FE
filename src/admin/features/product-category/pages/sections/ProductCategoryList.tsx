import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import { useTheme, useMediaQuery } from '@mui/material';
import { Icon } from '@iconify/react';
import { SortAscendingIcon, SortDescendingIcon, UnsortedIcon } from '../../../../assets/icons';
import { ProductCategoryToolbar } from './ProductCategoryToolbar';
import { useDataGridLocale } from '@shared/hooks/useDataGridLocale';

import { useProductCategoryColumns } from '../hooks/useProductCategoryColumns';
import { columnsInitialState } from '../configs/column.config';
import {
    dataGridCardStyles,
    dataGridContainerStyles,
    dataGridStyles
} from '../configs/styles.config';
import { useProductCategoryData, useDeleteProductCategory, useRestoreProductCategory } from '../hooks/useProductCategory';
import { useEffect } from 'react';
import { confirmDelete } from '@shared/utils/swal';
import { toast } from 'react-toastify';

export const ProductCategoryList = ({ isTrash = false }: { isTrash?: boolean }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const {
        categories,
        pagination,
        isLoading,
        page,
        setPage,
        pageSize,
        setPageSize,
        search,
        setSearch,
        status,
        setStatus,
        setIsTrash
    } = useProductCategoryData();

    const { mutate: deleteCategory } = useDeleteProductCategory();
    const { mutate: restoreCategory } = useRestoreProductCategory();

    // Đồng bộ prop isTrash vào hook khi thay đổi
    useEffect(() => {
        setIsTrash(isTrash);
    }, [isTrash, setIsTrash]);

    const columns = useProductCategoryColumns(isTrash);
    const localeText = useDataGridLocale();

    const handleDelete = (id: string) => {
        confirmDelete("Bạn có chắc chắn muốn xóa danh mục này?", () => {
            deleteCategory(id, {
                onSuccess: (res: any) => {
                    if (res.success) toast.success("Xóa danh mục thành công");
                    else toast.error(res.message);
                }
            });
        });
    };

    const handleRestore = (id: string) => {
        restoreCategory(id, {
            onSuccess: (res: any) => {
                if (res.success) toast.success("Khôi phục danh mục thành công");
                else toast.error(res.message);
            }
        });
    };

    if (isMobile) {
        return (
            <Box sx={{ px: 2, pb: 4 }}>
                <ProductCategoryToolbar
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
                        categories.map((row) => (
                            <Card key={row._id} sx={{ p: 2, borderRadius: '16px', boxShadow: 'var(--customShadows-card)' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                                            {row.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            Code: {row.code}
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
                                        <IconButton size="small" color="inherit">
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
                    showToolbar
                    loading={isLoading}
                    columns={columns}
                    density="comfortable"
                    slots={{
                        toolbar: ProductCategoryToolbar as any,
                        columnSortedAscendingIcon: SortAscendingIcon,
                        columnSortedDescendingIcon: SortDescendingIcon,
                        columnUnsortedIcon: UnsortedIcon,
                        noRowsOverlay: () => (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                {isLoading ? <CircularProgress size={32} /> : <span className='text-[1.125rem]'>{"Chưa có dữ liệu"}</span>}
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
                    localeText={localeText}
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





