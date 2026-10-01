import { Box, Typography, Stack, LinearProgress } from '@mui/material';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { Icon } from '@iconify/react';

export const DailyLimitCard = () => {
    return (
        <Stack spacing={3}>
            <DashboardCard sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Hạn mức chi tiêu</Typography>
                    <Icon icon="eva:more-horizontal-fill" width={20} />
                </Stack>

                <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>
                    17.500k <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>đã chi trên 25.000k</Typography>
                    <Typography component="span" sx={{ float: 'right', fontWeight: 700 }}>70.0%</Typography>
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={70}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(0,167,111,0.08)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#007867',
                            borderRadius: 4
                        }
                    }}
                />
            </DashboardCard>

            <Box sx={{
                bgcolor: '#004B50',
                borderRadius: '16px',
                p: 1.5,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1
            }}>
                {[
                    { label: 'Giao dịch', icon: 'solar:card-2-bold-duotone' },
                    { label: 'Ngân sách', icon: 'solar:chart-2-bold-duotone' },
                    { label: 'Mục tiêu', icon: 'solar:medal-star-bold-duotone' },
                    { label: 'Báo cáo', icon: 'solar:document-bold-duotone' }
                ].map((item, index) => (
                    <Stack
                        key={item.label}
                        alignItems="center"
                        spacing={0.5}
                        sx={{
                            color: index === 0 ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            '&:hover': { color: 'white' }
                        }}
                    >
                        <Icon icon={item.icon} width={24} />
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '10px' }}>{item.label}</Typography>
                    </Stack>
                ))}
            </Box>
        </Stack>
    );
};
