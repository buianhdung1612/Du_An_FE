import React, { useEffect, useState } from 'react';
import { 
    Box, Typography, Stack, Avatar, Button, 
    CircularProgress, Divider, List, ListItem, 
    ListItemAvatar, ListItemText, IconButton, Chip 
} from '@mui/material';
import { Icon } from '@iconify/react';
import { getBooks, logBookPractice, Book } from '../api/book.api';
import { useNavigate } from 'react-router-dom';
import { prefixAdmin } from '../../../shared/constants/routes';
import { toast } from 'react-toastify';
import DashboardCard from '../../../shared/components/dashboard/DashboardCard';

export const PracticeWidget = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await getBooks({ status: 'reading' });
            if (res.code === 200) setBooks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLog = async (bookId: string, practiceId: string) => {
        try {
            const res = await logBookPractice(bookId, practiceId);
            if (res.code === 200) {
                toast.success("Đã hoàn thành mục tiêu!");
                fetchData();
            }
        } catch (error) {
            toast.error("Thất bại");
        }
    };

    // Filter only practices that are due today or not done yet
    const pendingPractices = books.flatMap(book => 
        book.practices
            .filter(p => {
                const isDoneToday = p.lastCompletedAt && new Date(p.lastCompletedAt).toDateString() === new Date().toDateString();
                return !isDoneToday;
            })
            .map(p => ({ ...p, bookId: book._id, bookTitle: book.title, bookAvatar: book.avatar }))
    ).sort((a,b) => b.importance - a.importance);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress size={24} /></Box>;

    return (
        <DashboardCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(255, 171, 0, 0.16)', color: '#ffab00' }}>
                        <Icon icon="solar:fire-bold-duotone" width={24} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>Thực hành hôm nay</Typography>
                        <Typography variant="caption" color="text.secondary">Đừng để tri thức ngủ yên</Typography>
                    </Box>
                </Stack>
                <Chip label={`${pendingPractices.length} mục`} size="small" color="primary" variant="soft" />
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2 }}>
                {pendingPractices.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Icon icon="solar:star-fall-minimalistic-bold-duotone" width={48} color="#00a76f" />
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Tuyệt vời! Bạn đã hoàn thành hết mục tiêu thực hành hôm nay.</Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {pendingPractices.map((practice, index) => (
                            <ListItem 
                                key={practice._id} 
                                sx={{ 
                                    px: 1, py: 1.5, 
                                    borderRadius: '12px', 
                                    mb: 1, 
                                    border: '1px solid #919eab1f',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                                secondaryAction={
                                    <IconButton size="small" color="success" onClick={() => handleLog(practice.bookId, practice._id)}>
                                        <Icon icon="solar:check-circle-bold" width={24} />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar sx={{ minWidth: 48 }}>
                                    <Avatar src={practice.bookAvatar} variant="rounded" sx={{ width: 36, height: 36 }} />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={<Typography variant="subtitle2" fontWeight={700}>{practice.title}</Typography>}
                                    secondary={
                                        <Typography variant="caption" noWrap sx={{ display: 'block', maxWidth: 120 }}>
                                            {practice.bookTitle}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box sx={{ p: 1.5, textAlign: 'center' }}>
                <Button 
                    size="small" 
                    fullWidth 
                    onClick={() => navigate(`/${prefixAdmin}/books`)}
                    sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
                >
                    Đến thư viện sách
                </Button>
            </Box>
        </DashboardCard>
    );
};
