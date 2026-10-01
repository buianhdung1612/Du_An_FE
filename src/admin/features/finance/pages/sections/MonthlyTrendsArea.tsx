import { Typography, Box, useTheme, alpha, Stack, MenuItem, Select } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { useState } from 'react';

export const MonthlyTrendsArea = () => {
    const theme = useTheme();
    const [seriesData, setSeriesData] = useState('3months');

    const chartOptions: ApexOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: theme.typography.fontFamily,
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: ['Apr 6', 'Apr 17', 'Apr 26', 'May 5', 'May 14', 'May 23', 'Jun 1', 'Jun 10', 'Jun 19', 'Jun 30'],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { labels: { show: false } },
        grid: {
            borderColor: alpha(theme.palette.divider, 0.1),
            strokeDashArray: 3,
        },
        colors: ['#007867', '#5BE49B'],
        legend: {
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 600,
            markers: {}
        }
    };

    const chartSeries = [
        {
            name: 'Thu nhập',
            data: [31, 40, 28, 51, 42, 109, 100, 120, 80, 95]
        },
        {
            name: 'Chi tiêu',
            data: [11, 32, 45, 32, 34, 52, 41, 60, 48, 55]
        }
    ];

    return (
        <DashboardCard sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Xu hướng hàng tháng</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Thu nhập và chi tiêu theo thời gian</Typography>
                </Box>

                <Select
                    value={seriesData}
                    onChange={(e) => setSeriesData(e.target.value)}
                    size="small"
                    sx={{ minWidth: 140, borderRadius: '8px' }}
                >
                    <MenuItem value="3months">3 tháng qua</MenuItem>
                    <MenuItem value="6months">6 tháng qua</MenuItem>
                    <MenuItem value="year">Cả năm</MenuItem>
                </Select>
            </Stack>

            <Chart options={chartOptions} series={chartSeries} type="area" height={260} />
        </DashboardCard>
    );
};
