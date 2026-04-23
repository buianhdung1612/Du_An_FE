import React, { useEffect, useState } from "react";
import { 
    Box, Grid, Card, Typography, Button, IconButton, 
    Stack, Chip, CircularProgress, Divider, Paper,
    List, ListItem, ListItemText, ListItemIcon, Checkbox
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getBookDetail, logBookPractice, Book, BookPractice } from "../api/book.api";
import { Title } from "../../../shared/components/ui/Title";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { prefixAdmin } from "../../../shared/constants/routes";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { toast } from "react-toastify";
import { Icon } from '@iconify/react';

export const BookDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await getBookDetail(id);
            if (res.code === 200) setBook(res.data);
        } catch (error) {
            toast.error("Không thể tải thông tin sách");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleLogPractice = async (practiceId: string) => {
        if (!id) return;
        try {
            const res = await logBookPractice(id, practiceId);
            if (res.code === 200) {
                toast.success("Tuyệt vời! Bạn đã duy trì thực hành.");
                fetchData();
            }
        } catch (error) {
            toast.error("Thao tác thất bại");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
    if (!book) return <Typography align="center" sx={{ py: 10 }}>Không tìm thấy cuốn sách này</Typography>;

    return (
        <Box>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <IconButton onClick={() => navigate(-1)} size="small"><ArrowBackIcon /></IconButton>
                        <Title title={book.title} />
                    </Stack>
                    <Breadcrumb
                        items={[
                            { label: "Quản lý Sách", to: `/${prefixAdmin}/books` },
                            { label: "Chi tiết" }
                        ]}
                    />
                </Box>
                <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/${prefixAdmin}/books/edit/${book._id}`)}
                    sx={{ borderRadius: "10px", borderColor: '#1C252E', color: '#1C252E' }}
                >
                    Chỉnh sửa sách
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* Left side: Information & Links */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'none', border: '1px solid #919eab1f', mb: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Box 
                                component="img" 
                                src={book.avatar || "https://images.unsplash.com/photo-1543003923-388902506821?q=80&w=300&auto=format&fit=crop"} 
                                sx={{ width: '100%', height: 320, objectFit: 'cover' }} 
                            />
                            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                                <Chip label={book.status.toUpperCase()} color="primary" sx={{ fontWeight: 800 }} />
                            </Box>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h5" fontWeight={800} gutterBottom>{book.title}</Typography>
                            <Typography color="text.secondary" gutterBottom>Tác giả: <b>{book.author}</b></Typography>
                            <Typography variant="body2" sx={{ my: 2 }}>{book.description || "Chưa có mô tả ngắn..."}</Typography>
                            
                            <Divider sx={{ my: 3 }} />
                            
                            <Stack spacing={2}>
                                {book.mindMapId && (
                                    <Button 
                                        fullWidth 
                                        variant="soft" 
                                        startIcon={<AccountTreeIcon />}
                                        onClick={() => navigate(`/${prefixAdmin}/mind-maps/edit/${book.mindMapId._id}`)}
                                        sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: '12px' }}
                                    >
                                        Xem sơ đồ tóm tắt: {book.mindMapId.title}
                                    </Button>
                                )}
                                {book.blogId && (
                                    <Button 
                                        fullWidth 
                                        variant="soft" 
                                        startIcon={<MenuBookIcon />}
                                        onClick={() => navigate(`/${prefixAdmin}/article/edit/${book.blogId._id}`)}
                                        sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: '12px', bgcolor: 'rgba(32, 101, 209, 0.08)', color: 'info.main' }}
                                    >
                                        Đọc bài review: {book.blogId.name}
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                {/* Right side: Practice Tracker */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid #919eab1f', bgcolor: 'background.default' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AutoGraphIcon color="primary" />
                                <Typography variant="h6" fontWeight={800}>Hành động & Thực hành</Typography>
                            </Stack>
                            <Chip label={`${book.practices.length} mục`} size="small" variant="outlined" />
                        </Stack>

                        {book.practices.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'action.hover', borderRadius: '16px', border: '1px dashed #919eab33' }}>
                                <Typography color="text.secondary">Chưa có mục thực hành nào cho cuốn sách này.</Typography>
                            </Box>
                        ) : (
                            <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid #919eab1f' }}>
                                {book.practices.map((item, index) => {
                                    const lastDate = item.lastCompletedAt ? new Date(item.lastCompletedAt).toLocaleDateString() : 'Chưa thực hiện';
                                    const isDoneToday = item.lastCompletedAt && new Date(item.lastCompletedAt).toDateString() === new Date().toDateString();
                                    
                                    return (
                                        <React.Fragment key={item._id}>
                                            <ListItem 
                                                secondaryAction={
                                                    <Button 
                                                        variant={isDoneToday ? "contained" : "soft"} 
                                                        disabled={isDoneToday}
                                                        onClick={() => handleLogPractice(item._id)}
                                                        sx={{ borderRadius: '10px' }}
                                                    >
                                                        {isDoneToday ? "Đã xong" : "Hoàn thành"}
                                                    </Button>
                                                }
                                                sx={{ py: 2 }}
                                            >
                                                <ListItemIcon>
                                                    {isDoneToday ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={<Typography fontWeight={700}>{item.title}</Typography>}
                                                    secondary={
                                                        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                                            <Typography variant="caption">Tần suất: <b>{item.frequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần'}</b></Typography>
                                                            <Typography variant="caption">Lần cuối: {lastDate}</Typography>
                                                            <Typography variant="caption">Độ quan trọng: <b>{item.importance}/5</b></Typography>
                                                        </Stack>
                                                    }
                                                />
                                            </ListItem>
                                            {index < book.practices.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    );
                                })}
                            </List>
                        )}

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Mẹo thực hành</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                "Biết mà không làm thì cũng giống như không biết. Hãy biến tri thức từ trang giấy thành thói quen thực tế mỗi ngày."
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
