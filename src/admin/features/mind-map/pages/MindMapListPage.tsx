import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Stack, useTheme, IconButton, Chip, CircularProgress } from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMindMaps } from '../api/mind-map.api';
import { getCategoryMindMaps, CategoryMindMap } from '../api/category-mindmap.api';
import { motion } from 'framer-motion';
import { prefixAdmin } from '@shared/constants/routes';
import { TextField, MenuItem } from '@mui/material';

export const MindMapListPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [selectedCategoryId, setSelectedCategoryId] = React.useState('all');
    const [categories, setCategories] = React.useState<CategoryMindMap[]>([]);

    const { data: mindMaps, isLoading } = useQuery({
        queryKey: ['mind-maps', selectedCategoryId],
        queryFn: () => getMindMaps(selectedCategoryId !== 'all' ? { categoryId: selectedCategoryId } : {})
    });

    React.useEffect(() => {
        getCategoryMindMaps().then(res => {
            if (res.code === 200) setCategories(res.data);
        });
    }, []);

    if (isLoading) return <Box p={4} sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: { xs: 1, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 4 }} spacing={2}>
                <Box>
                    <Typography variant="h3" fontWeight={800} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>Sơ Đồ Tư Duy</Typography>
                    <Typography variant="body1" color="text.secondary">Quản lý và sáng tạo các ý tưởng của bạn.</Typography>
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/${prefixAdmin}/mind-maps/categories`)}
                        sx={{ borderRadius: '12px', borderColor: '#1C252E', color: '#1C252E' }}
                    >
                        Quản lý danh mục
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Icon icon="solar:add-circle-bold" />}
                        onClick={() => navigate(`/${prefixAdmin}/mind-maps/create`)}
                        sx={{ borderRadius: '12px', px: 3, bgcolor: '#1C252E' }}
                    >
                        Tạo sơ đồ mới
                    </Button>
                </Stack>
            </Stack>

            <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(145, 158, 171, 0.08)', borderRadius: '16px' }}>
                <TextField
                    select
                    size="small"
                    label="Lọc theo mục"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}
                >
                    <MenuItem value="all">Tất cả danh mục</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                </TextField>
            </Box>

            <Grid container spacing={3}>
                {(mindMaps?.data || []).map((map: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={map._id}>
                        <Card
                            component={motion.div}
                            whileHover={{ y: -8 }}
                            sx={{
                                borderRadius: '20px',
                                border: `1px solid ${theme.palette.divider}`,
                                height: '100%',
                                position: 'relative',
                                boxShadow: 'none',
                                '&:hover': { boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.12)' }
                            }}
                        >
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(28, 37, 46, 0.05)', color: '#1C252E' }}>
                                        <Icon icon="solar:hierarchy-bold-duotone" width={32} />
                                    </Box>
                                    <Stack direction="row" spacing={0.5}>
                                        <IconButton onClick={() => navigate(`/${prefixAdmin}/mind-maps/edit/${map._id}`)}>
                                            <Icon icon="solar:pen-bold" />
                                        </IconButton>
                                    </Stack>
                                </Stack>

                                {map.categoryId && (
                                    <Chip
                                        label={map.categoryId.name}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mb: 1, fontWeight: 700, borderRadius: '6px' }}
                                    />
                                )}

                                <Typography variant="h6" fontWeight={700} gutterBottom>{map.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                                    {map.description || 'Không có mô tả'}
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {map.tags?.map((tag: string) => (
                                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
