import { Box, Typography, Stack, Avatar } from '@mui/material';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { getTransactions } from '../../api/finance.api';
import dayjs from 'dayjs';

const MOCK_ACTIVITIES = [
    {
        _id: '1',
        description: 'đã thêm chi tiêu mớ trong Ăn uống & Đồ uống',
        amount: 150,
        type: 'expense',
        date: new Date(),
        categoryId: { title: 'Ăn uống', color: '#007867', icon: 'solar:chef-hat-bold-duotone' }
    },
    {
        _id: '2',
        description: 'Lương tháng 4',
        amount: 7500,
        type: 'income',
        date: new Date(),
        categoryId: { title: 'Lương thưởng', color: '#004B50', icon: 'solar:wad-of-money-bold-duotone' }
    },
    {
        _id: '3',
        description: 'Tiền điện tháng này',
        amount: 450,
        type: 'expense',
        date: dayjs().subtract(1, 'day').toDate(),
        categoryId: { title: 'Nhà cửa', color: '#004B50', icon: 'solar:home-bold-duotone' }
    }
];

export const RecentActivity = () => {
    const [activities, setActivities] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await getTransactions();
            if (response.data && response.data.length > 0) {
                setActivities(response.data);
            } else {
                setActivities(MOCK_ACTIVITIES);
            }
        } catch (error) {
            setActivities(MOCK_ACTIVITIES);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const groupedActivities = activities.reduce((acc: any, curr: any) => {
        const date = dayjs(curr.date);
        let groupLabel = date.format('DD/MM/YYYY');

        if (date.isSame(dayjs(), 'day')) groupLabel = 'Hôm nay';
        else if (date.isSame(dayjs().subtract(1, 'day'), 'day')) groupLabel = 'Hôm qua';

        if (!acc[groupLabel]) acc[groupLabel] = [];
        acc[groupLabel].push(curr);
        return acc;
    }, {});

    return (
        <DashboardCard sx={{ p: 3, height: '100%', minHeight: 600 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Hoạt động gần đây</Typography>
                <Icon icon="eva:more-vertical-fill" width={20} />
            </Stack>

            <Stack spacing={4} sx={{ position: 'relative' }}>
                <Box sx={{
                    position: 'absolute', left: 24, top: 0, bottom: 0,
                    width: 2, bgcolor: 'divider',
                    borderStyle: 'dashed', opacity: 0.5
                }} />

                {Object.entries(groupedActivities).map(([group, items]: [string, any]) => (
                    <Box key={group}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 700 }}>{group}</Typography>
                        <Stack spacing={3}>
                            {items.map((activity: any) => (
                                <Stack key={activity._id} direction="row" spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                                    <Avatar
                                        sx={{
                                            width: 44, height: 44,
                                            bgcolor: activity.categoryId?.color || 'primary.main',
                                            border: '2px solid white'
                                        }}
                                    >
                                        <Icon icon={activity.categoryId?.icon || 'solar:wallet-bold-duotone'} width={24} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {activity.description}
                                            <Typography component="span" variant="body2" sx={{ color: activity.type === 'income' ? 'success.main' : 'error.main', mx: 0.5 }}>
                                                {activity.type === 'income' ? '+' : '-'}{activity.amount.toLocaleString()}k
                                            </Typography>
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                                            {dayjs(activity.date).format('HH:mm')} • {activity.categoryId?.title || 'Không phân loại'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </DashboardCard>
    );
};
