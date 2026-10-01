import React, { useEffect, useState } from "react";
import {
    Box, Grid, Card, Typography, Button, IconButton,
    Stack, Chip, CircularProgress, TextField, MenuItem,
    CardMedia, CardContent, CardActionArea, Fab, Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Title } from "../../../shared/components/ui/Title";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { prefixAdmin } from "../../../shared/constants/routes";
import { getBooks, Book } from "../api/book.api";
import { getCategoryBooks, CategoryBook } from "../api/category-book.api";
import { useNavigate } from "react-router-dom";

export const BookListPage = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<CategoryBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ categoryId: "all", status: "all" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filter.categoryId !== "all") params.categoryId = filter.categoryId;
            if (filter.status !== "all") params.status = filter.status;

            const res = await getBooks(params);
            if (res.code === 200) {
                const data = res.data.recordList || res.data;
                setBooks(Array.isArray(data) ? data : []);
            }

            const catRes = await getCategoryBooks();
            if (catRes.code === 200) {
                const data = catRes.data.recordList || catRes.data;
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "reading": return { label: "Đang đọc", color: "info" };
            case "finished": return { label: "Đã xong", color: "success" };
            case "archived": return { label: "Lưu trữ", color: "default" };
            default: return { label: status, color: "default" };
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <Box>
                    <Title title="Thư viện & Thực hành" />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Quản lý Sách" }
                        ]}
                    />
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/${prefixAdmin}/books/categories`)}
                        sx={{ borderRadius: "10px", borderColor: '#1C252E', color: '#1C252E' }}
                    >
                        Quản lý danh mục
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/${prefixAdmin}/books/create`)}
                        sx={{ borderRadius: "10px", bgcolor: '#1C252E' }}
                    >
                        Thêm sách mới
                    </Button>
                </Stack>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', p: 2, bgcolor: 'rgba(145, 158, 171, 0.08)', borderRadius: '16px' }}>
                <TextField
                    select
                    size="small"
                    label="Danh mục"
                    value={filter.categoryId}
                    onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })}
                    sx={{ minWidth: 150, bgcolor: 'white', borderRadius: 1 }}
                >
                    <MenuItem value="all">Tất cả danh mục</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    size="small"
                    label="Trạng thái"
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    sx={{ minWidth: 150, bgcolor: 'white', borderRadius: 1 }}
                >
                    <MenuItem value="all">Tất cả trạng thái</MenuItem>
                    <MenuItem value="reading">Đang đọc</MenuItem>
                    <MenuItem value="finished">Đã hoàn thành</MenuItem>
                    <MenuItem value="archived">Đã lưu trữ</MenuItem>
                </TextField>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={3}>
                    {books.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#F4F6F8', borderRadius: '16px', border: '2px dashed #919eab33' }}>
                                <AutoStoriesIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                <Typography color="text.secondary">Chưa có cuốn sách nào. Thêm cuốn sách đầu tiên của bạn ngay!</Typography>
                            </Box>
                        </Grid>
                    ) : (
                        books.map((book) => {
                            const status = getStatusLabel(book.status);
                            return (
                                <Grid item xs={12} sm={6} md={3} key={book._id}>
                                    <Card sx={{
                                        borderRadius: "16px",
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.16)' }
                                    }}>
                                        <CardActionArea onClick={() => navigate(`/${prefixAdmin}/books/detail/${book._id}`)} sx={{ flex: 1 }}>
                                            <CardMedia
                                                component="img"
                                                height="240"
                                                image={book.avatar || "https://images.unsplash.com/photo-1543003923-388902506821?q=80&w=300&auto=format&fit=crop"}
                                                alt={book.title}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent>
                                                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Chip label={status.label} color={status.color as any} size="small" variant="soft" sx={{ fontWeight: 700 }} />
                                                    <Typography variant="caption" color="text.disabled">{new Date(book.createdAt).toLocaleDateString()}</Typography>
                                                </Box>
                                                <Typography gutterBottom variant="h6" component="div" fontWeight={700} noWrap>
                                                    {book.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Tác giả: {book.author || "Khuyết danh"}
                                                </Typography>
                                                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'primary.main', fontWeight: 700 }}>
                                                    {book.practices?.length || 0} bài thực hành
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            );
                        })
                    )}
                </Grid>
            )}

            <Tooltip title="Thêm sách mới">
                <Fab
                    color="primary"
                    sx={{ position: 'fixed', bottom: 32, right: 32, bgcolor: '#1C252E', '&:hover': { bgcolor: '#454f5b' } }}
                    onClick={() => navigate(`/${prefixAdmin}/books/create`)}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
        </Box>
    );
};
