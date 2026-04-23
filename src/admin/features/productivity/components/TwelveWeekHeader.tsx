import { Box, Paper, Typography, Stack, LinearProgress, useTheme, Button } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { prefixAdmin } from "../../../shared/constants/routes";

export const TwelveWeekHeader = ({ plan }: { plan: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Calculate overall progress (average score of completed weeks)
    const completedWeeks = plan.weeklyExecution.filter((w: any) => w.score > 0);
    const overallProgress = completedWeeks.length > 0
        ? Math.round(completedWeeks.reduce((acc: number, curr: any) => acc + curr.score, 0) / 12)
        : 0;

    // Flatten tactics from all goals to get total count
    const totalTacticsCount = (plan.goals || []).reduce((acc: number, goal: any) => acc + (goal.tactics?.length || 0), 0);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: '24px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                mb: 3
            }}
        >
            {/* Background Decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    opacity: 0.1,
                    transform: 'rotate(-15deg)'
                }}
            >
                <Icon icon="solar:fire-bold" width={200} />
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                <Box sx={{ flex: 1 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-start' }} spacing={2} sx={{ mb: 2 }}>
                        <Box>
                            <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
                                KẾ HOẠCH HIỆN TẠI
                            </Typography>
                            <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
                                {plan.title}
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/${prefixAdmin}/productivity/edit`)}
                            startIcon={<Icon icon="solar:pen-bold" />}
                            sx={{
                                color: '#fff',
                                borderColor: 'rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon icon="solar:calendar-date-bold" />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                {new Date(plan.startDate).toLocaleDateString('vi-VN')} - {plan.endDate ? new Date(plan.endDate).toLocaleDateString('vi-VN') : new Date(new Date(plan.startDate).getTime() + (12 * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN')}
                            </Typography>
                        </Box>
                        <Box sx={{ width: 2, height: 16, bgcolor: 'rgba(255,255,255,0.3)', display: { xs: 'none', sm: 'block' } }} />
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {plan.goals.length} Mục tiêu • {totalTacticsCount} Chiến thuật
                        </Typography>
                    </Stack>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 5 }} sx={{ minWidth: { md: 400 }, width: '100%' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" fontWeight={900}>
                            {overallProgress}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase' }}>
                            TIẾN ĐỘ NĂM
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight={600}>Hiệu suất tổng thể</Typography>
                            <Typography variant="body2" fontWeight={600}>{overallProgress}/100</Typography>
                        </Stack>
                        <LinearProgress
                            variant="determinate"
                            value={overallProgress}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: '#fff',
                                    borderRadius: 5,
                                }
                            }}
                        />
                        <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                            Mục tiêu đề ra: Duy trì trên 85%
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    );
};
