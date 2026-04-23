import { Box, Grid, Typography, Stack, useTheme, Card, CardContent } from "@mui/material";
import { useProductivityStore } from "../stores/useProductivityStore";
import { Icon } from "@iconify/react";

export const GoalBoard = () => {
    const theme = useTheme();
    const { activePlan } = useProductivityStore();

    return (
        <Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Bản đồ Mục tiêu & Chiến thuật</Typography>

            <Grid container spacing={3}>
                {activePlan.goals.map((goal: any, index: number) => (
                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                        <Card elevation={0} sx={{
                            borderRadius: '16px',
                            boxShadow: 'var(--customShadows-card)',
                            bgcolor: 'background.paper',
                            border: 'none'
                        }}>
                            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: { xs: 2, md: 3 } }}>
                                    <Box sx={{
                                        width: { xs: 40, md: 48 },
                                        height: { xs: 40, md: 48 },
                                        borderRadius: '12px',
                                        bgcolor: theme.palette.primary.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        flexShrink: 0
                                    }}>
                                        <Typography variant="h5" fontWeight={900}>{index + 1}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>{goal.title}</Typography>
                                        {goal.description && <Typography variant="body2" color="text.secondary">{goal.description}</Typography>}
                                    </Box>
                                </Stack>

                                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, fontWeight: 700 }}>
                                    CHIẾN THUẬT THỰC THI
                                </Typography>

                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    {(goal.tactics || []).map((tactic: any) => (
                                        <Box
                                            key={tactic._id}
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                bgcolor: theme.palette.action.hover,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2
                                            }}
                                        >
                                            <Icon icon="solar:round-transfer-horizontal-bold" style={{ color: theme.palette.primary.main }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" fontWeight={700}>{tactic.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Tần suất: {tactic.targetPerWeek} lần/tuần
                                                </Typography>
                                            </Box>
                                        </Box>
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
