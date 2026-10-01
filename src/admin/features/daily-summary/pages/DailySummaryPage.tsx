import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Stack, useTheme, TextField, Button, IconButton, Card, Chip, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayContent, getSummaryByDate, upsertSummary, getStatistics } from '../api/daily-summary.api';
import { toast } from 'react-toastify';

export const DailySummaryPage = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const dateQuery = selectedDate?.format('YYYY-MM-DD') || '';

    // Data queries
    const { data: contentData, isLoading: isContentLoading } = useQuery({
        queryKey: ['daily-content', dateQuery],
        queryFn: () => getTodayContent(dateQuery),
        enabled: !!dateQuery
    });

    const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
        queryKey: ['daily-summary', dateQuery],
        queryFn: () => getSummaryByDate(dateQuery),
        enabled: !!dateQuery
    });

    const { data: statsRes, isLoading: isStatsLoading } = useQuery({
        queryKey: ['daily-summary-stats'],
        queryFn: getStatistics
    });
    
    const stats = statsRes?.data || { today: { blogs: 0, mindMaps: 0, vocabularies: 0 }, yesterday: { blogs: 0, mindMaps: 0, vocabularies: 0 }, thisWeek: { blogs: 0, mindMaps: 0, vocabularies: 0 } };

    const [summaryItems, setSummaryItems] = useState<any[]>([]);
    const [reflection, setReflection] = useState('');

    useEffect(() => {
        if (summaryData?.code === 200 && summaryData.data) {
            setSummaryItems(summaryData.data.items || []);
            setReflection(summaryData.data.reflection || '');
        } else {
            setSummaryItems([]);
            setReflection('');
        }
    }, [summaryData]);

    const upsertMutation = useMutation({
        mutationFn: upsertSummary,
        onSuccess: (res) => {
            if (res.code === 200) {
                toast.success('Đã lưu bản tổng kết ngày!');
                queryClient.invalidateQueries({ queryKey: ['daily-summary', dateQuery] });
            } else {
                toast.error(res.message || 'Có lỗi xảy ra');
            }
        }
    });

    const handleAddItem = (item: any) => {
        if (summaryItems.some(i => i.itemId === item.id)) {
            toast.warning('Mục này đã có trong bản tổng kết');
            return;
        }
        setSummaryItems([...summaryItems, { type: item.type, itemId: item.id, title: item.title }]);
    };

    const handleRemoveItem = (id: string) => {
        setSummaryItems(summaryItems.filter(i => i.itemId !== id));
    };

    const handleSave = () => {
        upsertMutation.mutate({
            date: dateQuery,
            items: summaryItems,
            reflection
        });
    };

    const availableItems = [
        ...(contentData?.data?.blogs || []),
        ...(contentData?.data?.mindMaps || []),
        ...(contentData?.data?.vocabularies || [])
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h3" fontWeight={800} sx={{
                            color: '#1C252E',
                            mb: 1
                        }}>
                            Tổng Kết Ngày
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Ghi lại những thành quả và dấu ấn của bạn trong ngày.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <DatePicker
                            label="Chọn ngày"
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            slotProps={{ textField: { size: 'small', sx: { bgcolor: 'background.paper', borderRadius: '12px' } } }}
                        />
                        <Button 
                            variant="contained" 
                            startIcon={<Icon icon="solar:diskette-bold-duotone" />}
                            onClick={handleSave}
                            disabled={upsertMutation.isPending}
                            sx={{ borderRadius: '12px', px: 3, py: 1 }}
                        >
                            Lưu tổng kết
                        </Button>
                    </Stack>
                </Stack>

                {/* Thống kê học tập */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon icon="solar:chart-square-bold-duotone" width={24} color={theme.palette.primary.main} />
                        Thống kê học tập
                    </Typography>
                    <Grid container spacing={3}>
                        {[
                            { label: 'Hôm nay', data: stats.today, icon: 'solar:calendar-date-bold-duotone', color: '#00A76F' },
                            { label: 'Hôm qua', data: stats.yesterday, icon: 'solar:history-bold-duotone', color: '#FFAB00' },
                            { label: 'Tuần này', data: stats.thisWeek, icon: 'solar:calendar-bold-duotone', color: '#00B8D9' }
                        ].map((stat, idx) => (
                            <Grid item xs={12} md={4} key={idx}>
                                <Paper elevation={0} sx={{
                                    p: 3,
                                    borderRadius: '24px',
                                    border: `1px solid ${theme.palette.divider}`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                                        <Icon icon={stat.icon} width={120} color={stat.color} />
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
                                        {stat.label}
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Icon icon="solar:document-bold" color={theme.palette.text.secondary} />
                                                Bài viết
                                            </Typography>
                                            <Typography variant="subtitle2" fontWeight={700}>{stat.data.blogs}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Icon icon="solar:letter-bold" color={theme.palette.text.secondary} />
                                                Từ vựng
                                            </Typography>
                                            <Typography variant="subtitle2" fontWeight={700}>{stat.data.vocabularies}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Icon icon="solar:hierarchy-bold" color={theme.palette.text.secondary} />
                                                Sơ đồ tư duy
                                            </Typography>
                                            <Typography variant="subtitle2" fontWeight={700}>{stat.data.mindMaps}</Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Grid container spacing={4}>
                    {/* Left Panel: Available Content */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ 
                            p: 3, 
                            borderRadius: '24px', 
                            bgcolor: 'background.paper', 
                            border: `1px solid ${theme.palette.divider}`,
                            height: 'calc(100vh - 250px)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                <Icon icon="solar:box-minimalistic-bold-duotone" width={24} color={theme.palette.primary.main} />
                                <Typography variant="h6" fontWeight={700}>Thành quả hôm nay</Typography>
                            </Stack>

                            {isContentLoading ? (
                                <Typography variant="body2" color="text.secondary">Đang tải dữ liệu...</Typography>
                            ) : availableItems.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 5, opacity: 0.5 }}>
                                    <Icon icon="solar:ghost-bold" width={64} />
                                    <Typography variant="body2" sx={{ mt: 1 }}>Hôm nay chưa có hoạt động nào được ghi lại</Typography>
                                </Box>
                            ) : (
                                <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
                                    <Stack spacing={2}>
                                        {availableItems.map((item) => (
                                            <Card 
                                                key={item.id}
                                                component={motion.div}
                                                whileHover={{ scale: 1.02 }}
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: '16px', 
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    cursor: 'pointer',
                                                    '&:hover': { bgcolor: 'action.hover' }
                                                }}
                                                onClick={() => handleAddItem(item)}
                                            >
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Box sx={{ 
                                                        p: 1, 
                                                        borderRadius: '10px', 
                                                        bgcolor: 'action.hover',
                                                        display: 'flex'
                                                    }}>
                                                        <Icon 
                                                            icon={item.type === 'blog' ? 'solar:document-bold' : item.type === 'mind-map' ? 'solar:hierarchy-bold' : 'solar:letter-bold'} 
                                                            width={20}
                                                        />
                                                    </Box>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="subtitle2" fontWeight={600} noWrap>{item.title}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{item.type.toUpperCase()}</Typography>
                                                    </Box>
                                                    <Icon icon="solar:add-circle-bold" width={24} color={theme.palette.primary.main} />
                                                </Stack>
                                            </Card>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Right Panel: Summary Canvas */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                borderRadius: '24px', 
                                bgcolor: 'background.paper', 
                                border: `1px solid ${theme.palette.divider}`,
                                minHeight: '300px'
                            }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                                    <Icon icon="solar:checklist-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={700}>Danh sách tiêu điểm</Typography>
                                    <Chip label={summaryItems.length} size="small" color="primary" sx={{ ml: 1 }} />
                                </Stack>

                                <AnimatePresence mode="popLayout">
                                    {summaryItems.length === 0 ? (
                                        <Box sx={{ 
                                            height: '200px', 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            border: `2px dashed ${theme.palette.divider}`,
                                            borderRadius: '16px',
                                            opacity: 0.5
                                        }}>
                                            <Icon icon="solar:file-download-bold-duotone" width={48} />
                                            <Typography variant="body1">Chọn các bài viết hoặc sơ đồ bên trái để thêm vào</Typography>
                                        </Box>
                                    ) : (
                                        <Stack spacing={1.5}>
                                            {summaryItems.map((item, index) => (
                                                <motion.div
                                                    key={item.itemId}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    layout
                                                >
                                                    <Paper sx={{ 
                                                        p: 2, 
                                                        borderRadius: '16px', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 2,
                                                        border: `1px solid ${theme.palette.divider}`
                                                    }}>
                                                        <Typography fontWeight={700} color="primary.main" sx={{ minWidth: 24 }}>{index + 1}.</Typography>
                                                        <Box sx={{ 
                                                            p: 0.8, 
                                                            borderRadius: '8px', 
                                                            bgcolor: 'action.hover',
                                                            display: 'flex'
                                                        }}>
                                                            <Icon 
                                                                icon={item.type === 'blog' ? 'solar:document-bold' : item.type === 'mind-map' ? 'solar:hierarchy-bold' : 'solar:letter-bold'} 
                                                                width={18}
                                                            />
                                                        </Box>
                                                        <Typography variant="body1" fontWeight={500} sx={{ flex: 1 }}>{item.title}</Typography>
                                                        <Chip label={item.type} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                                                        <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.itemId)}>
                                                            <Icon icon="solar:trash-bin-trash-bold" />
                                                        </IconButton>
                                                    </Paper>
                                                </motion.div>
                                            ))}
                                        </Stack>
                                    )}
                                </AnimatePresence>
                            </Paper>

                            <Paper elevation={0} sx={{ 
                                p: 3, 
                                borderRadius: '24px', 
                                bgcolor: 'background.paper', 
                                border: `1px solid ${theme.palette.divider}`
                            }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <Icon icon="solar:pen-new-square-bold-duotone" width={24} color={theme.palette.primary.main} />
                                    <Typography variant="h6" fontWeight={700}>Phản tư & Bài học</Typography>
                                </Stack>
                                <TextField
                                    multiline
                                    rows={6}
                                    fullWidth
                                    placeholder="Hôm nay bạn đã học được điều gì mới? Có điều gì cần cải thiện vào ngày mai không?"
                                    value={reflection}
                                    onChange={(e) => setReflection(e.target.value)}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            bgcolor: 'action.hover'
                                        }
                                    }}
                                />
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
};
