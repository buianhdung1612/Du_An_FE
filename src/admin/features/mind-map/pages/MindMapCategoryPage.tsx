import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { useState } from "react";
import { MindMapCategoryList } from "./sections/MindMapCategoryList";
import DeleteIcon from '@mui/icons-material/Delete';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    TextField, Stack, FormControl, InputLabel, Select, MenuItem 
} from "@mui/material";
import { 
    useCreateMindMapCategory, 
    useUpdateMindMapCategory 
} from "./hooks/useMindMapCategory";
import { toast } from "react-toastify";

export const MindMapCategoryPage = () => {
    const [isTrash, setIsTrash] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", description: "", status: "active" });

    const createMutation = useCreateMindMapCategory();
    const updateMutation = useUpdateMindMapCategory();

    const handleOpenDialog = (category?: any) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({ 
                name: category.name, 
                description: category.description || "",
                status: category.status
            });
        } else {
            setSelectedCategory(null);
            setFormData({ name: "", description: "", status: "active" });
        }
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (selectedCategory) {
            updateMutation.mutate({ id: selectedCategory._id, data: formData }, {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Cập nhật thành công");
                        setDialogOpen(false);
                    } else {
                        toast.error(res.message);
                    }
                }
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Tạo mới thành công");
                        setDialogOpen(false);
                    } else {
                        toast.error(res.message);
                    }
                }
            });
        }
    };

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Danh mục Sơ đồ tư duy"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Sơ đồ tư duy", to: `/${prefixAdmin}/mind-maps` },
                            { label: "Danh mục" }
                        ]}
                    />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                        onClick={() => setIsTrash(!isTrash)}
                        sx={{
                            background: isTrash ? 'var(--palette-error-main)' : 'rgba(255, 86, 48, 0.16)',
                            color: isTrash ? '#fff' : 'var(--palette-error-main)',
                            minHeight: "2.25rem",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            padding: "6px 12px",
                            borderRadius: "var(--shape-borderRadius)",
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": {
                                background: isTrash ? 'var(--palette-error-dark)' : 'rgba(255, 86, 48, 0.24)',
                            }
                        }}
                        variant="contained"
                        startIcon={<DeleteIcon />}
                    >
                        {isTrash ? "Quay lại" : "Thùng rác"}
                    </Button>
                    <Button
                        onClick={() => handleOpenDialog()}
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
                        {"Tạo danh mục"}
                    </Button>
                </div>
            </div>
            
            <MindMapCategoryList isTrash={isTrash} onEdit={handleOpenDialog} />

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    {selectedCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1.5 }}>
                        <TextField 
                            fullWidth 
                            label="Tên danh mục" 
                            variant="outlined" 
                            value={formData.name} 
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        />
                        <TextField 
                            fullWidth 
                            multiline 
                            rows={3} 
                            label="Mô tả" 
                            variant="outlined" 
                            value={formData.description} 
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        />
                        <FormControl fullWidth>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={formData.status}
                                label="Trạng thái"
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <MenuItem value="active">Hoạt động</MenuItem>
                                <MenuItem value="inactive">Tạm dừng</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Hủy bỏ</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSubmit} 
                        loading={createMutation.isPending || updateMutation.isPending}
                        sx={{ bgcolor: 'var(--palette-text-primary)', borderRadius: '8px', fontWeight: 700 }}
                    >
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
