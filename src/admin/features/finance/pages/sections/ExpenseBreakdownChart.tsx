import { Typography, Box, useTheme } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import DashboardCard from "@shared/components/dashboard/DashboardCard";

export const ExpenseBreakdownChart = () => {
    const theme = useTheme();

    const chartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: theme.typography.fontFamily,
        },
        labels: ['Nhà cửa', 'Ăn uống', 'Giáo dục', 'Y tế', 'Di chuyển', 'Giải trí'],
        colors: [
            theme.palette.primary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main,
            theme.palette.info.main,
            theme.palette.secondary.main,
        ],
        stroke: { show: false },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px',
            fontWeight: 500,
            itemMargin: { horizontal: 10, vertical: 5 },
            markers: {}
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Tổng chi',
                            formatter: () => '$4.050',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: theme.palette.text.secondary
                        },
                        value: {
                            fontSize: '24px',
                            fontWeight: 800,
                            color: theme.palette.text.primary,
                            offsetY: 8
                        }
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        tooltip: { fillSeriesColor: false }
    };

    const chartSeries = [1800, 900, 270, 360, 450, 270];

    return (
        <DashboardCard sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Phân bổ chi tiêu</Typography>
            <Box sx={{ position: 'relative' }}>
                <Chart options={chartOptions} series={chartSeries} type="donut" height={340} />
            </Box>
        </DashboardCard>
    );
};
