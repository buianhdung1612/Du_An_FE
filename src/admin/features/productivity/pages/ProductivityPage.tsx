import { Box, Grid, Typography, useTheme, Stack, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActivePlan } from "../api/productivity.api";
import { useProductivityStore } from "../stores/useProductivityStore";
import { TwelveWeekHeader } from "../components/TwelveWeekHeader";
import { WeeklyMap } from "../components/WeeklyMap";
import { ExecutionPanel } from "../components/ExecutionPanel";
import { GoalBoard } from "../components/GoalBoard";
import { IdealWeekCalendar } from "../components/IdealWeekCalendar";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { prefixAdmin } from "../../../shared/constants/routes";

export const ProductivityPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { activePlan, setActivePlan } = useProductivityStore();
    const [viewMode, setViewMode] = useState<'dashboard' | 'goals' | 'schedule'>('dashboard');

    const { data: planData, isLoading } = useQuery({
        queryKey: ["active-plan"],
        queryFn: getActivePlan,
    });

    useEffect(() => {
        if (planData?.code === 200) {
            setActivePlan(planData.data);
        }
    }, [planData, setActivePlan]);

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>Loading...</Box>;

    if (!activePlan && !isLoading) {
        return (
            <Box sx={{
                height: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                textAlign: 'center'
            }}>
                <Icon icon="solar:calendar-bold-duotone" width={120} style={{ color: theme.palette.primary.main, opacity: 0.2 }} />
                <Typography variant="h4" fontWeight={700}>Bắt đầu Năm 12 Tuần của bạn</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                    Bạn chưa có kế hoạch nào đang hoạt động. Hãy thiết lập mục tiêu và chiến thuật để tối đa hóa hiệu suất ngay hôm nay.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(`/${prefixAdmin}/productivity/create`)}
                    startIcon={<Icon icon="solar:add-circle-bold" />}
                    sx={{ borderRadius: '12px', px: 4 }}
                >
                    Tạo kế hoạch mới
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 8 }}>
            <TwelveWeekHeader plan={activePlan} />

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    mb: 4,
                    mt: 2,
                    overflowX: 'auto',
                    pb: 1,
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                }}
            >
                <Button
                    variant={viewMode === 'dashboard' ? 'contained' : 'text'}
                    onClick={() => setViewMode('dashboard')}
                    startIcon={<Icon icon="solar:widget-bold-duotone" />}
                    sx={{ borderRadius: '10px' }}
                >
                    Bảng điều khiển
                </Button>
                <Button
                    variant={viewMode === 'goals' ? 'contained' : 'text'}
                    onClick={() => setViewMode('goals')}
                    startIcon={<Icon icon="solar:target-bold-duotone" />}
                    sx={{ borderRadius: '10px' }}
                >
                    Mục tiêu & Chiến thuật
                </Button>
                <Button
                    variant={viewMode === 'schedule' ? 'contained' : 'text'}
                    onClick={() => setViewMode('schedule')}
                    startIcon={<Icon icon="solar:calendar-minimalistic-bold-duotone" />}
                    sx={{ borderRadius: '10px' }}
                >
                    Lịch trình ngày
                </Button>
            </Stack>

            <AnimatePresence mode="wait">
                {viewMode === 'dashboard' ? (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stack spacing={3}>
                            <WeeklyMap />
                            <Grid container spacing={3}>
                                <Grid size={12}>
                                    <ExecutionPanel />
                                </Grid>
                            </Grid>
                        </Stack>
                    </motion.div>
                ) : viewMode === 'goals' ? (
                    <motion.div
                        key="goals"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <GoalBoard />
                    </motion.div>
                ) : (
                    <motion.div
                        key="schedule"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IdealWeekCalendar />
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};
