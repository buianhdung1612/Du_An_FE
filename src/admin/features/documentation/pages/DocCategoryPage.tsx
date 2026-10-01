import React, { useEffect, useState } from 'react';
import { 
    Button, Card, Box, MenuItem, Select, FormControl, InputLabel,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import * as docApi from '../api/doc.api';
import { toast } from 'react-toastify';
import { DocCategoryToolbar } from './sections/DocCategoryToolbar';
import { dataGridCardStyles, dataGridContainerStyles, dataGridStyles } from './configs/styles.config';
import { RenderTitleCell, RenderActionsCell, RenderCreatedAtCell, RenderStatusCell } from './utils/render-cells';
import { SortAscendingIcon, SortDescendingIcon, UnsortedIcon } from '../../../assets/icons';
import { DATA_GRID_LOCALE_VN } from './configs/localeText.config';

export const DocCategoryPage = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '', avatar: '', parentId: '', status: 'active' });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await docApi.getCategories();
            if (res.success) setCategories(res.data);
        } catch (error) {
            toast.error("Không thể tải danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpen = (category: any = null) => {
        if (category) {
            setEditData(category);
            setFormData({ 
                name: category.name, 
                description: category.description || '', 
                avatar: category.avatar || '',
                parentId: category.parentId || '',
                status: category.status || 'active'
            });
        } else {
            setEditData(null);
            setFormData({ name: '', description: '', avatar: '', parentId: '', status: 'active' });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        try {
            const payload = { ...formData, parentId: formData.parentId || null };
            if (editData) {
                await docApi.updateCategory(editData._id, payload);
                toast.success("Cập nhật thành công");
            } else {
                await docApi.createCategory(payload);
                toast.success("Tạo thành công");
            }
            handleClose();
            fetchCategories();
        } catch (error) {
            toast.error("Lỗi khi lưu dữ liệu");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await docApi.deleteCategory(id);
                toast.success("Xóa thành công");
                fetchCategories();
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Lỗi khi xóa");
            }
        }
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    const columns: GridColDef[] = [
        { 
            field: 'name', 
            headerName: 'Tên danh mục', 
            flex: 1,
            minWidth: 200,
            renderCell: RenderTitleCell
        },
        { 
            field: 'parentId', 
            headerName: 'Danh mục cha', 
            width: 180,
            valueGetter: (value) => {
                const parent = categories.find(c => c._id === value);
                return parent ? parent.name : '';
            }
        },
        { 
            field: 'createdAt', 
            headerName: 'Thời gian tạo', 
            width: 160,
            renderCell: RenderCreatedAtCell
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 140,
            renderCell: RenderStatusCell
        },
        {
            field: 'actions',
            headerName: '',
            width: 80,
            sortable: false,
            align: 'right',
            renderCell: RenderActionsCell(handleOpen, handleDelete)
        }
    ];

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Danh mục tài liệu"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Tài liệu", to: `/${prefixAdmin}/docs/category/list` },
                            { label: "Danh mục" }
                        ]}
                    />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                        onClick={() => handleOpen()}
                        sx={{
                            background: 'var(--palette-text-primary)',
                            minHeight: "2.25rem",
                            minWidth: "4rem",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            padding: "6px 12px",
                            borderRadius: "var(--shape-borderRadius)",
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": {
                                background: "var(--palette-grey-700)",
                                boxShadow: "var(--customShadows-z8)"
                            }
                        }}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        {"Thêm danh mục"}
                    </Button>
                </div>
            </div>

            <Card sx={dataGridCardStyles}>
                <DocCategoryToolbar search={search} onSearchChange={setSearch} />
                <Box sx={dataGridContainerStyles}>
                    <DataGrid
                        rows={filteredCategories}
                        getRowId={(row) => row._id}
                        columns={columns}
                        loading={loading}
                        density="comfortable"
                        checkboxSelection
                        disableRowSelectionOnClick
                        getRowHeight={() => 'auto'}
                        slots={{
                            columnSortedAscendingIcon: SortAscendingIcon,
                            columnSortedDescendingIcon: SortDescendingIcon,
                            columnUnsortedIcon: UnsortedIcon,
                            noRowsOverlay: () => (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <span className='text-[1.125rem]'>Không có dữ liệu để hiển thị</span>
                                </Box>
                            )
                        }}
                        localeText={DATA_GRID_LOCALE_VN}
                        sx={dataGridStyles}
                    />
                </Box>
            </Card>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', p: 3 }}>{editData ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
                <DialogContent sx={{ p: 3, pt: 1 }}>
                    <TextField fullWidth label="Tên danh mục" margin="normal" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} variant="outlined" />
                    
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Danh mục cha</InputLabel>
                        <Select
                            value={formData.parentId}
                            label="Danh mục cha"
                            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                        >
                            <MenuItem value=""><em>Không có</em></MenuItem>
                            {categories.filter(c => c._id !== editData?._id).map(cat => (
                                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={formData.status}
                            label="Trạng thái"
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <MenuItem value="active">Hoạt động</MenuItem>
                            <MenuItem value="inactive">Tạm dừng</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField fullWidth label="Mô tả" margin="normal" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} variant="outlined" />
                    <TextField fullWidth label="Icon / Avatar URL" margin="normal" value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} variant="outlined" />
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 600 }}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ background: 'var(--palette-text-primary)', fontWeight: 600 }}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
