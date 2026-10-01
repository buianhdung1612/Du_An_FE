import { Box, Typography, Stack } from '@mui/material';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { Icon } from '@iconify/react';

export const CreditCardWidget = () => {
    return (
        <DashboardCard sx={{
            p: 3,
            bgcolor: '#004B50',
            color: 'white',
            backgroundImage: 'linear-gradient(135deg, #004B50 0%, #007867 100%)',
            position: 'relative',
            overflow: 'hidden',
            aspectRatio: '1.6 / 1'
        }}>
            {/* Background pattern */}
            <Box sx={{
                position: 'absolute', right: -40, bottom: -40,
                width: 160, height: 160, borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.05)'
            }} />

            <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Icon icon="logos:mastercard" width={40} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Visa Gold</Typography>
                </Stack>

                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}>12.500k</Typography>
                    <Typography variant="subtitle1" sx={{ letterSpacing: 4, fontWeight: 500 }}>**** **** **** 1234</Typography>
                </Box>

                <Stack direction="row" spacing={4}>
                    <Box>
                        <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '10px', textTransform: 'uppercase' }}>Chủ thẻ</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>John Doe</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '10px', textTransform: 'uppercase' }}>Hết hạn</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>12/27</Typography>
                    </Box>
                </Stack>
            </Stack>
        </DashboardCard>
    );
};
