import React, { useEffect, useState } from "react";
import { 
    Box, Grid, Card, Typography, Button, TextField, 
    Stack, MenuItem, IconButton, Divider, CircularProgress,
    Autocomplete
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getBookDetail, createBook, editBook, Book, BookPractice } from "../api/book.api";
import { getCategoryBooks, CategoryBook } from "../api/category-book.api";
import { getVocabularies } from "../../vocabulary/api/vocabulary.api"; // For context
import { getCategoryMindMaps } from "../../mind-map/api/category-mindmap.api";
import { Title } from "../../../shared/components/ui/Title";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { prefixAdmin } from "../../../shared/constants/routes";
import { apiApp } from "../../../shared/api/core"; // Low level for other lists
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from "react-toastify";

export const BookFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<CategoryBook[]>([]);
    const [blogList, setBlogList] = useState<{_id: string, name: string}[]>([]);
    const [mindMapList, setMindMapList] = useState<{_id: string, title: string}[]>([]);

    const [formData, setFormData] = useState<any>({
        title: "",
        author: "",
        description: "",
        avatar: "",
        status: "reading",
        categoryId: "",
        blogId: "",
        mindMapId: "",
        practices: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch dependencies
            const catRes = await getCategoryBooks();
            if (catRes.code === 200) setCategories(catRes.data);

            const blogsRes = await apiApp.get("/api/v1/admin/article");
            if (blogsRes.data.code === 200) setBlogList(blogsRes.data.data);

            const mmsRes = await apiApp.get("/api/v1/admin/mind-maps");
            if (mmsRes.data.code === 200) setMindMapList(mmsRes.data.data);

            if (isEdit) {
                const res = await getBookDetail(id!);
                if (res.code === 200) {
                    const data = res.data;
                    setFormData({
                        ...data,
                        categoryId: data.categoryId?._id || "",
                        blogId: data.blogId?._id || "",
                        mindMapId: data.mindMapId?._id || "",
                    });
                }
            }
        } catch (error) {
            toast.error("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleAddPractice = () => {
        setFormData({
            ...formData,
            practices: [...formData.practices, { title: "", frequency: "daily", importance: 3 }]
        });
    };

    const handleRemovePractice = (index: number) => {
        const newPractices = [...formData.practices];
        newPractices.splice(index, 1);
        setFormData({ ...formData, practices: newPractices });
    };

    const handlePracticeChange = (index: number, field: string, value: any) => {
        const newPractices = [...formData.practices];
        newPractices[index][field] = value;
        setFormData({ ...formData, practices: newPractices });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await editBook(id!, formData);
                toast.success("Đã cập nhật cuốn sách");
            } else {
                await createBook(formData);
                toast.success("Đã thêm sách mới");
            }
            navigate(`/${prefixAdmin}/books`);
        } catch (error) {
            toast.error("Thao tác thất bại");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <IconButton onClick={() => navigate(-1)} size="small"><ArrowBackIcon /></IconButton>
                        <Title title={isEdit ? "Chỉnh sửa sách" : "Thêm sách mới"} />
                    </Stack>
                    <Breadcrumb
                        items={[
                            { label: "Quản lý Sách", to: `/${prefixAdmin}/books` },
                            { label: isEdit ? "Edit" : "Create" }
                        ]}
                    />
                </Box>
                <Button variant="contained" type="submit" sx={{ borderRadius: "10px", bgcolor: '#1C252E', px: 4 }}>
                    {isEdit ? "Lưu thay đổi" : "Lưu sách mới"}
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ p: 3, borderRadius: '24px' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Thông tin cơ bản</Typography>
                        <Stack spacing={3}>
                            <TextField fullWidth label="Tên cuốn sách" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                            <TextField fullWidth label="Tác giả" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} />
                            
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField select fullWidth label="Danh mục" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                                        <MenuItem value="">Chọn danh mục</MenuItem>
                                        {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField select fullWidth label="Trạng thái" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                                        <MenuItem value="reading">Đang đọc</MenuItem>
                                        <MenuItem value="finished">Đã hoàn thành</MenuItem>
                                        <MenuItem value="archived">Lưu trữ</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>

                            <TextField fullWidth multiline rows={4} label="Mô tả / Bài học tâm đắc" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                            <TextField fullWidth label="URL Ảnh bìa (Hoặc để trống)" value={formData.avatar} onChange={(e) => setFormData({...formData, avatar: e.target.value})} />
                        </Stack>
                    </Card>

                    <Card sx={{ p: 3, borderRadius: '24px', mt: 3 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Liên kết tri thức</Typography>
                        <Stack spacing={3}>
                            <TextField select fullWidth label="Liên kết bài Review (Blog)" value={formData.blogId} onChange={(e) => setFormData({...formData, blogId: e.target.value})}>
                                <MenuItem value="">Không liên kết</MenuItem>
                                {blogList.map(blog => <MenuItem key={blog._id} value={blog._id}>{blog.name}</MenuItem>)}
                            </TextField>

                            <TextField select fullWidth label="Liên kết Sơ đồ tóm tắt (Mind Map)" value={formData.mindMapId} onChange={(e) => setFormData({...formData, mindMapId: e.target.value})}>
                                <MenuItem value="">Không liên kết</MenuItem>
                                {mindMapList.map(mm => <MenuItem key={mm._id} value={mm._id}>{mm.title}</MenuItem>)}
                            </TextField>
                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{ p: 3, borderRadius: '24px', minHeight: '100%' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight={700}>Kế hoạch thực hành</Typography>
                            <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={handleAddPractice}>Thêm mục</Button>
                        </Stack>

                        <Stack spacing={2}>
                            {formData.practices.map((practice: any, index: number) => (
                                <Box key={index} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '16px', position: 'relative' }}>
                                    <IconButton 
                                        size="small" 
                                        color="error" 
                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                        onClick={() => handleRemovePractice(index)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    
                                    <Stack spacing={2}>
                                        <TextField 
                                            fullWidth 
                                            size="small" 
                                            label="Hành động" 
                                            placeholder="Ví dụ: Dậy sớm lúc 5h"
                                            value={practice.title} 
                                            onChange={(e) => handlePracticeChange(index, "title", e.target.value)} 
                                        />
                                        <Stack direction="row" spacing={1}>
                                            <TextField 
                                                select 
                                                fullWidth 
                                                size="small" 
                                                label="Tần suất" 
                                                value={practice.frequency} 
                                                onChange={(e) => handlePracticeChange(index, "frequency", e.target.value)}
                                            >
                                                <MenuItem value="daily">Hàng ngày</MenuItem>
                                                <MenuItem value="weekly">Hàng tuần</MenuItem>
                                            </TextField>
                                            <TextField 
                                                select 
                                                fullWidth 
                                                size="small" 
                                                label="Độ ưu tiên" 
                                                value={practice.importance} 
                                                onChange={(e) => handlePracticeChange(index, "importance", e.target.value)}
                                            >
                                                {[1,2,3,4,5].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                                            </TextField>
                                        </Stack>
                                    </Stack>
                                </Box>
                            ))}
                            
                            {formData.practices.length === 0 && (
                                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                                    Hãy thêm các hành động thực hành để chuyển hóa tri thức.
                                </Typography>
                            )}
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
