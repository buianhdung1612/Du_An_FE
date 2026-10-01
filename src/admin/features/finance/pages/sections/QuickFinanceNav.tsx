import { Box, Typography } from '@mui/material';
import { Icon } from '@iconify/react';


const NAV_ITEMS = [
    { label: 'Transaction', icon: 'solar:card-2-bold-duotone' },
    { label: 'Budget', icon: 'solar:chart-2-bold-duotone' },
    { label: 'Goals', icon: 'solar:medal-star-bold-duotone' },
    { label: 'Reports', icon: 'solar:document-bold-duotone' }
];

export const QuickFinanceNav = () => {
    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2,
            mb: 3
        }}>
            {NAV_ITEMS.map((item) => (
                <Box
                    key={item.label}
                    sx={{
                        aspectRatio: '1/0.8',
                        bgcolor: '#004B50',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                            bgcolor: '#00363a',
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 16px rgba(0,75,80,0.2)'
                        }
                    }}
                >
                    <Icon icon={item.icon} width={28} />
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 700, fontSize: '12px' }}>{item.label}</Typography>
                </Box>
            ))}
        </Box>
    );
};
