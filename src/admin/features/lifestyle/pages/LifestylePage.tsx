import { useState } from 'react';
import {
    Box,
    Card,
    Container,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Title } from "@shared/components/ui/Title";
import { GymTab } from './sections/GymTab';
import { NutritionTab } from './sections/NutritionTab';

export const LifestylePage = () => {
    const [currentTab, setCurrentTab] = useState('gym');

    const TABS = [
        { value: 'gym', label: 'Vận động', icon: <Icon icon="solar:dumbbells-bold-duotone" width={24} /> },
        { value: 'nutrition', label: 'Dinh dưỡng', icon: <Icon icon="solar:plate-bold-duotone" width={24} /> },
    ];

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 5 }}>
                <Title title="Quản lý đời sống" />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Theo dõi sức khỏe, ăn uống và vận động hàng ngày
                </Typography>
            </Box>

            <Card
                sx={{
                    borderRadius: 'var(--shape-borderRadius-lg)',
                    boxShadow: 'var(--customShadows-card)',
                    bgcolor: 'var(--palette-background-paper)',
                    backgroundImage: 'none',
                    overflow: 'hidden'
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={(_, val) => setCurrentTab(val)}
                    sx={{
                        px: 3,
                        bgcolor: 'var(--palette-background-neutral)',
                        borderBottom: '1px solid rgba(145, 158, 171, 0.12)',
                        '& .MuiTab-root': {
                            minHeight: 64,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            gap: 1
                        }
                    }}
                >
                    {TABS.map((tab) => (
                        <Tab key={tab.value} value={tab.value} icon={tab.icon} iconPosition="start" label={tab.label} />
                    ))}
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {currentTab === 'gym' && <GymTab />}
                    {currentTab === 'nutrition' && <NutritionTab />}
                </Box>
            </Card>
        </Container>
    );
};
