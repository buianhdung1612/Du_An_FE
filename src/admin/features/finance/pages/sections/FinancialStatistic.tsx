import { Box, Typography, Stack, useTheme, Button } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { useEffect, useState } from 'react';
import { getBreakdownStats } from '../../api/finance.api';

const MOCK_DATA = [
    { label: 'Nhà cửa & Tiện ích', value: 1800, color: '#004B50' },
    { label: 'Ăn uống', value: 900, color: '#007867' },
    { label: 'Giáo dục', value: 270, color: '#5BE49B' },
    { label: 'Y tế', value: 360, color: '#36B37E' },
    { label: 'Di chuyển', value: 450, color: '#4cf5e1' },
    { label: 'Giải trí', value: 270, color: '#C8FACD' },
];

export const FinancialStatistic = () => {
    const theme = useTheme();
    const [categories, setCategories] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await getBreakdownStats();
            if (response.data && response.data.length > 0) {
                const fetchedTotal = response.data.reduce((acc: number, cur: any) => acc + cur.value, 0);
                const processed = response.data.map((cat: any) => ({
                    ...cat,
                    percent: Math.round((cat.value / fetchedTotal) * 100),
                    formattedValue: `${cat.value.toLocaleString()}k`
                }));
                setCategories(processed);
            } else {
                // Fallback nếu DB trống
                const total = MOCK_DATA.reduce((acc, cur) => acc + cur.value, 0);
                setCategories(MOCK_DATA.map(item => ({
                    ...item,
                    percent: Math.round((item.value / total) * 100),
                    formattedValue: `${item.value.toLocaleString()}k`
                })));
            }
        } catch (error) {
            // Fallback nếu lỗi API
            const total = MOCK_DATA.reduce((acc, cur) => acc + cur.value, 0);
            setCategories(MOCK_DATA.map(item => ({
                ...item,
                percent: Math.round((item.value / total) * 100),
                formattedValue: `${item.value.toLocaleString()}k`
            })));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const total = categories.reduce((acc, cur) => acc + cur.value, 0);

    const chartOptions: ApexOptions = {
        chart: { type: 'donut' },
        labels: categories.map(c => c.label),
        colors: categories.map(c => c.color),
        stroke: { show: false },
        legend: { show: false },
        dataLabels: { enabled: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '80%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Tổng chi tiêu',
                            formatter: () => `${total.toLocaleString()}k`,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                        },
                        value: {
                            fontSize: '22px',
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            offsetY: 4
                        }
                    }
                }
            }
        }
    };

    return (
        <DashboardCard sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Thống kê</Typography>
                <Stack direction="row" spacing={1} sx={{ bgcolor: 'background.neutral', p: 0.5, borderRadius: '8px' }}>
                    <Button size="small" variant="text" sx={{ color: 'text.secondary', fontWeight: 600 }}>Thu nhập</Button>
                    <Button size="small" variant="contained" sx={{ bgcolor: '#004B50', color: 'white', '&:hover': { bgcolor: '#00363a' } }}>Chi tiêu</Button>
                </Stack>
            </Stack>

            <Box sx={{ position: 'relative', mb: 4 }}>
                <Chart options={chartOptions} series={categories.map(c => c.percent)} type="donut" height={280} />
            </Box>

            <Stack spacing={2.5}>
                {categories.map((item) => (
                    <Stack key={item.label} direction="row" alignItems="center" spacing={2}>
                        <Box sx={{
                            minWidth: 40, height: 20,
                            borderRadius: '4px',
                            bgcolor: item.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '10px', fontWeight: 700
                        }}>
                            {item.percent}%
                        </Box>
                        <Typography sx={{ flexGrow: 1, fontSize: '13px', fontWeight: 600 }}>{item.label}</Typography>
                        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{item.formattedValue}</Typography>
                    </Stack>
                ))}
            </Stack>
        </DashboardCard>
    );
};
