import { useEffect, useState } from 'react';
import { Box, Typography, Stack, LinearProgress, alpha, IconButton, CircularProgress } from '@mui/material';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { Icon } from '@iconify/react';
import { getSavingGoals } from '../../api/finance.api';

export const SavingPlans = () => {
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await getSavingGoals();
                if (res.data?.code === 200) {
                    setGoals(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch saving goals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    return (
        <DashboardCard sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Kế hoạch tiết kiệm</Typography>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700, cursor: 'pointer' }}>Thêm kế hoạch</Typography>
            </Stack>

            <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Tổng quỹ tiết kiệm</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>24.250k</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'success.main', mb: 0.5 }}>
                        <Icon icon="solar:double-alt-arrow-up-bold-duotone" width={16} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>+12% <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Tháng này</Typography></Typography>
                    </Stack>
                </Stack>
            </Box>

            <Stack spacing={3}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : goals.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chưa có kế hoạch tiết kiệm nào</Typography>
                    </Box>
                ) : (
                    goals.map((goal) => {
                        const current = goal.currentAmount || 0;
                        const target = goal.targetAmount || 1;
                        const percent = Math.min((current / target) * 100, 100);
                        return (
                            <Box key={goal._id} sx={{
                                p: 2.5,
                                borderRadius: '16px',
                                border: theme => `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                '&:hover': { bgcolor: 'background.neutral' }
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box sx={{
                                            width: 36, height: 36, borderRadius: '10px',
                                            bgcolor: goal.color || '#004B50', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', color: 'white'
                                        }}>
                                            <Icon icon={goal.icon || 'solar:wallet-bold-duotone'} width={20} />
                                        </Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{goal.title}</Typography>
                                    </Stack>
                                    <IconButton size="small">
                                        <Icon icon="eva:more-vertical-fill" />
                                    </IconButton>
                                </Stack>

                                <LinearProgress
                                    variant="determinate"
                                    value={percent}
                                    sx={{
                                        height: 6, borderRadius: 3, mb: 1.5,
                                        bgcolor: theme => alpha(theme.palette.divider, 0.1),
                                        '& .MuiLinearProgress-bar': { bgcolor: goal.color || '#004B50', borderRadius: 3 }
                                    }}
                                />

                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                                        {(current / 1000).toLocaleString('vi-VN')}k <Typography component="span" variant="caption" sx={{ fontWeight: 600 }}>({percent.toFixed(2)}%)</Typography>
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                        Mục tiêu: <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>{(target / 1000).toLocaleString('vi-VN')}k</Typography>
                                    </Typography>
                                </Stack>
                            </Box>
                        );
                    })
                )}
            </Stack>
        </DashboardCard>
    );
};
