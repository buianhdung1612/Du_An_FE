import { Box, Paper, Typography, useTheme, alpha } from "@mui/material";
import { useProductivityStore } from "../stores/useProductivityStore";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

export const WeeklyMap = () => {
    const theme = useTheme();
    const { activePlan, currentWeekIndex, setCurrentWeekIndex } = useProductivityStore();

    const getScoreColor = (score: number) => {
        if (score === 0) return theme.palette.action.hover;
        if (score < 60) return alpha(theme.palette.error.main, 0.1);
        if (score < 85) return alpha(theme.palette.warning.main, 0.1);
        return alpha(theme.palette.primary.main, 0.1);
    };

    const getScoreTextColor = (score: number) => {
        if (score === 0) return theme.palette.text.secondary;
        if (score < 60) return theme.palette.error.main;
        if (score < 85) return theme.palette.warning.main;
        return theme.palette.primary.main;
    };

    return (
        <Paper elevation={0} sx={{
            p: 3,
            borderRadius: '16px',
            boxShadow: 'var(--customShadows-card)',
            bgcolor: 'background.paper'
        }}>
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                <Typography variant="h6" fontWeight={700}>Bản đồ 13 Tuần</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.success.main }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>&gt;85%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.warning.main }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>60-85%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.error.main }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>&lt;60%</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                gap: 1,
                width: '100%',
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.divider, 0.1), borderRadius: 2 }
            }}>
                {activePlan.weeklyExecution.map((week: any) => {
                    const isActive = currentWeekIndex === week.weekIndex;
                    return (
                        <Box
                            key={week.weekIndex}
                            sx={{
                                flex: '1 1 0',
                                minWidth: { xs: 80, sm: 60, md: 0 }, // Allow to shrink to almost zero on desktop
                            }}
                        >
                            <motion.div
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Box
                                    onClick={() => setCurrentWeekIndex(week.weekIndex)}
                                    sx={{
                                        p: { xs: 1.5, md: 2 },
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: '2px solid',
                                        borderColor: isActive ? theme.palette.primary.main : 'transparent',
                                        bgcolor: getScoreColor(week.score),
                                        position: 'relative',
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: isActive ? `0 8px 16px ${theme.palette.primary.main}40` : 'none',
                                        minHeight: { xs: 100, md: 120 }
                                    }}
                                >
                                    {isActive && (
                                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                            <Icon icon="solar:pin-bold" style={{ color: theme.palette.primary.main, fontSize: '12px' }} />
                                        </Box>
                                    )}
                                    <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, fontSize: { xs: '0.6rem', md: '0.7rem' } }}>
                                        TUẦN
                                    </Typography>
                                    <Typography variant="h5" fontWeight={900} sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                                        {week.weekIndex}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        fontWeight={800}
                                        sx={{ color: getScoreTextColor(week.score), fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                                    >
                                        {week.score}%
                                    </Typography>

                                    {(() => {
                                        const start = dayjs(activePlan.startDate).add((week.weekIndex - 1) * 7, 'day');
                                        const end = start.add(6, 'day');
                                        return (
                                            <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.6, mt: 0.5 }}>
                                                {start.format('DD/MM')} - {end.format('DD/MM')}
                                            </Typography>
                                        );
                                    })()}

                                    {week.weekIndex === 13 && (
                                        <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 800, fontSize: '0.7rem', mt: 0.5 }}>
                                            REVIEW
                                        </Typography>
                                    )}
                                </Box>
                            </motion.div>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};
