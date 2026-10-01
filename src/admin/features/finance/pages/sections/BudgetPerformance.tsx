import { Box, Typography, Stack, LinearProgress, alpha } from '@mui/material';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { Icon } from '@iconify/react';

const BUDGET_DATA = [
    { label: 'Giải trí', spent: 150, budget: 120, status: 'over' },
    { label: 'Nhà cửa', spent: 1500, budget: 1350, status: 'over' },
    { label: 'Di chuyển', spent: 180, budget: 200, status: 'warning' },
    { label: 'Sức khỏe', spent: 450, budget: 500, status: 'warning' },
    { label: 'Ăn uống', spent: 350, budget: 500, status: 'ok' },
    { label: 'Mua sắm', spent: 200, budget: 300, status: 'ok' },
    { label: 'Tiện ích', spent: 250, budget: 320, status: 'ok' },
];

export const BudgetPerformance = () => {
    return (
        <DashboardCard sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Hiệu quả ngân sách</Typography>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700, cursor: 'pointer' }}>Xem tất cả</Typography>
            </Stack>

            <Stack spacing={3}>
                {BUDGET_DATA.map((item) => {
                    const percent = Math.min((item.spent / item.budget) * 100, 100);
                    let color = 'success.main';
                    let icon = 'solar:check-circle-bold-duotone';
                    let overText = '';

                    if (item.status === 'over') {
                        color = 'error.main';
                        icon = 'solar:close-circle-bold-duotone';
                        overText = `vượt ${Math.round((item.spent / item.budget - 1) * 100)}%`;
                    } else if (item.status === 'warning') {
                        color = 'warning.main';
                        icon = 'solar:danger-circle-bold-duotone';
                    }

                    return (
                        <Box key={item.label}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Icon icon={icon} width={20} color={color === 'success.main' ? '#36B37E' : color === 'error.main' ? '#FF5630' : '#FFAB00'} />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {item.spent}k / <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.budget}k</Typography>
                                </Typography>
                            </Stack>

                            <LinearProgress
                                variant="determinate"
                                value={percent}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: (theme) => alpha(theme.palette.divider, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: color,
                                        borderRadius: 3
                                    }
                                }}
                            />
                            {overText && (
                                <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 700, mt: 0.5, display: 'block' }}>
                                    {overText}
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Stack>
        </DashboardCard>
    );
};
