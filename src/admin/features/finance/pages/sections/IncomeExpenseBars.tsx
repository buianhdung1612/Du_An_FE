import { useEffect, useState } from 'react';
import { Typography, useTheme, alpha, Box, CircularProgress } from '@mui/material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { getTrendStats } from '../../api/finance.api';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const IncomeExpenseBars = () => {
    const theme = useTheme();
    const [categories, setCategories] = useState<string[]>([]);
    const [incomeData, setIncomeData] = useState<number[]>([]);
    const [expenseData, setExpenseData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTrendStats();
                if (res.data?.code === 200 && res.data.data.length > 0) {
                    const stats = res.data.data;
                    const labels: string[] = [];
                    const incomeMap: Record<string, number> = {};
                    const expenseMap: Record<string, number> = {};

                    stats.forEach((item: any) => {
                        const label = `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`;
                        if (!labels.includes(label)) labels.push(label);

                        if (item._id.type === 'income') {
                            incomeMap[label] = item.total / 1000;
                        } else if (item._id.type === 'expense') {
                            expenseMap[label] = item.total / 1000;
                        }
                    });

                    setCategories(labels);
                    setIncomeData(labels.map(l => incomeMap[l] || 0));
                    setExpenseData(labels.map(l => expenseMap[l] || 0));
                }
            } catch (error) {
                console.error("Failed to fetch trend stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: theme.typography.fontFamily,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%', // Tăng độ rộng cột lên 60%
                borderRadius: 4,
                borderRadiusApplication: 'around',
                borderRadiusWhenStacked: 'all',
                dataLabels: { position: 'top' }
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2, // Khoảng cách 2px giữa 2 cột trong cùng 1 tháng
            colors: ['transparent']
        },
        xaxis: {
            categories: categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: theme.palette.text.secondary, fontWeight: 600 }
            }
        },
        yaxis: {
            labels: {
                formatter: (val) => `${val}k`,
                style: { colors: theme.palette.text.secondary }
            }
        },
        fill: { opacity: 1 },
        colors: ['#004B50', '#36B37E'], // #36B37E cho Chi tiêu (Expense)
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
            fontWeight: 600,
            itemMargin: { horizontal: 10 }
        },
        grid: {
            borderColor: alpha(theme.palette.divider, 0.1),
            strokeDashArray: 3,
            padding: {
                left: 20,
                right: 20
            }
        },
        tooltip: {
            y: {
                formatter: (val) => `${val}k`
            }
        }
    };

    const chartSeries = [
        { name: 'Thu nhập', data: incomeData },
        { name: 'Chi tiêu', data: expenseData }
    ];

    return (
        <DashboardCard sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Thu nhập vs. Chi tiêu</Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <CircularProgress />
                </Box>
            ) : categories.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <Typography variant="body1" color="text.secondary">Chưa có dữ liệu thống kê</Typography>
                </Box>
            ) : (
                <Chart options={chartOptions} series={chartSeries} type="bar" height={400} />
            )}
        </DashboardCard>
    );
};
