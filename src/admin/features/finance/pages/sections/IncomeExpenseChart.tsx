import { Typography, useTheme, alpha } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import DashboardCard from "@shared/components/dashboard/DashboardCard";

export const IncomeExpenseChart = () => {
    const theme = useTheme();

    const chartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            fontFamily: theme.typography.fontFamily,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            title: { text: '$ (thousands)' },
        },
        fill: { opacity: 1 },
        colors: [theme.palette.success.main, theme.palette.error.main],
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        grid: {
            borderColor: alpha(theme.palette.divider, 0.1),
            strokeDashArray: 3,
        }
    };

    const chartSeries = [
        {
            name: 'Thu nhập',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
            name: 'Chi tiêu',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
    ];

    return (
        <DashboardCard sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Thu nhập vs Chi tiêu</Typography>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={364} />
        </DashboardCard>
    );
};
