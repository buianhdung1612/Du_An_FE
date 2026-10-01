import {
    Box, Stack, Typography, LinearProgress,
    IconButton, MenuItem, Select, Chip, Paper, alpha, useTheme
} from '@mui/material';
import { Icon } from '@iconify/react';
import ReactApexChart from 'react-apexcharts';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { useState } from 'react';

const EXPENSES_CATEGORY_DATA = [
    { label: 'Nhà ở', value: 1200, color: '#1C252E', percent: 55 },
    { label: 'Ăn uống', value: 350, color: '#00A76F', percent: 16 },
    { label: 'Giải trí', value: 150, color: '#FFAB00', percent: 7 },
    { label: 'Tiện ích', value: 120, color: '#FF5630', percent: 5 },
    { label: 'Di chuyển', value: 180, color: '#8E33FF', percent: 8 },
    { label: 'Mua sắm', value: 200, color: '#00B8D9', percent: 9 },
];

const CATEGORY_ANALYSIS = [
    { label: 'Nhà ở', spent: 1200, budget: 1500, projected: 1450, status: 'Đúng kế hoạch', color: 'success', trend: 'stable' },
    { label: 'Ăn uống', spent: 350, budget: 500, projected: 480, status: 'Dưới ngân sách', color: 'success', trend: 'down' },
    { label: 'Di chuyển', spent: 180, budget: 200, projected: 220, status: 'Cảnh báo', color: 'warning', trend: 'up' },
    { label: 'Giải trí', spent: 150, budget: 120, projected: 180, status: 'Vượt ngân sách', color: 'error', trend: 'up' },
];

const RECOMMENDATIONS = [
    { text: 'Cân nhắc giảm chi tiêu giải trí khoảng $30 để duy trì ngân sách', color: '#1976D2' },
    { text: 'Bạn đang quản lý tốt chi phí ăn uống - hãy duy trì nhé!', color: '#388E3C' },
    { text: 'Chi phí di chuyển đang có xu hướng tăng - hãy kiểm tra các khoản gần đây', color: '#F57C00' },
];

export const FinancialReportsPage = () => {
    const theme = useTheme();
    const [period, setPeriod] = useState('may-2024');

    const donutOptions: any = {
        chart: { type: 'donut' },
        labels: EXPENSES_CATEGORY_DATA.map(d => d.label),
        colors: EXPENSES_CATEGORY_DATA.map(d => d.color),
        stroke: { show: false },
        dataLabels: { enabled: false },
        legend: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '80%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Tổng chi tiêu',
                            formatter: () => `$2200`,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 700,
                            formatter: (val: string) => `$${val}`,
                            offsetY: 4
                        }
                    }
                }
            }
        }
    };

    const areaOptions: any = {
        chart: { type: 'area', toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        colors: ['#00A76F', '#FF5630'],
        xaxis: {
            categories: ['3/4', '10/4', '18/4', '26/4', '4/5', '12/5', '20/5', '28/5', '5/6', '13/6', '21/6', '30/6'],
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: false },
        grid: { show: false },
        legend: { position: 'bottom' },
        dataLabels: { enabled: false }
    };

    const barOptions: any = {
        chart: { type: 'bar', toolbar: { show: false } },
        plotOptions: {
            bar: {
                columnWidth: '45%',
                borderRadius: 4
            }
        },
        colors: ['#004B50', '#919EAB'],
        xaxis: {
            categories: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9'],
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        grid: { strokeDashArray: 3 },
        legend: { position: 'top', horizontalAlign: 'right' },
        dataLabels: { enabled: false }
    };

    const lineOptions: any = {
        chart: { type: 'line', toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 2 },
        colors: ['#004B50', '#00A76F', '#919EAB'],
        xaxis: {
            categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { min: 0, max: 3000, tickAmount: 4 },
        grid: { strokeDashArray: 3 },
        legend: { show: false },
        dataLabels: { enabled: false }
    };

    return (
        <Box sx={{ pb: 5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>Báo cáo tài chính</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Phân tích dữ liệu và xu hướng tài chính của bạn</Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <Select
                        size="small"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        sx={{ borderRadius: '10px', height: '40px', minWidth: 120, bgcolor: 'white' }}
                    >
                        <MenuItem value="may-2024">Tháng 5 2024</MenuItem>
                        <MenuItem value="jun-2024">Tháng 6 2024</MenuItem>
                    </Select>
                    <IconButton sx={{ borderRadius: '10px', border: '1px solid #eee', bgcolor: 'white' }}>
                        <Icon icon="solar:download-linear" />
                    </IconButton>
                    <IconButton sx={{ borderRadius: '10px', border: '1px solid #eee', bgcolor: 'white' }}>
                        <Icon icon="solar:share-linear" />
                    </IconButton>
                </Stack>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' }, gap: 4 }}>

                {/* Left Column */}
                <Box sx={{ gridColumn: { xs: 'span 12', lg: 'span 5' } }}>
                    <Stack spacing={4}>
                        {/* Expenses by Category */}
                        <DashboardCard sx={{ p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3 }}>Chi tiêu theo danh mục</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <ReactApexChart options={donutOptions} series={EXPENSES_CATEGORY_DATA.map(d => d.value)} type="donut" width={240} />
                            </Box>
                            <Stack spacing={2}>
                                {EXPENSES_CATEGORY_DATA.map((item) => (
                                    <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.label}</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>${item.value.toLocaleString()} ({item.percent}%)</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </DashboardCard>

                        {/* Budget Analysis */}
                        <DashboardCard sx={{ p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>Phân tích ngân sách</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>Thông tin chi tiết và dự báo được hỗ trợ bởi AI</Typography>

                            <Paper sx={{ p: 2, borderRadius: '16px', bgcolor: alpha('#919EAB', 0.05), mb: 2, boxShadow: 'none' }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={800}>Dự báo cuối tháng</Typography>
                                    <Chip label="95% ngân sách" size="small" sx={{ height: 20, bgcolor: '#00A76F', color: 'white', fontWeight: 700, fontSize: '10px' }} />
                                </Stack>
                                <Stack spacing={2}>
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">Chi tiêu hiện tại</Typography>
                                            <Typography variant="caption" fontWeight={800}>$2230</Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={78} sx={{ height: 6, borderRadius: 3, bgcolor: alpha('#00A76F', 0.1), '& .MuiLinearProgress-bar': { bgcolor: '#00A76F' } }} />
                                    </Box>
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">Tổng dự kiến</Typography>
                                            <Typography variant="caption" fontWeight={800}>$2850</Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={95} sx={{ height: 6, borderRadius: 3, bgcolor: alpha('#1976D2', 0.1), '& .MuiLinearProgress-bar': { bgcolor: '#1976D2' } }} />
                                    </Box>
                                </Stack>
                            </Paper>

                            <Stack spacing={2} sx={{ mt: 4 }}>
                                <Typography variant="caption" fontWeight={800} sx={{ mb: 1, display: 'block' }}>Phân tích danh mục</Typography>
                                {CATEGORY_ANALYSIS.map((cat) => (
                                    <Box key={cat.label} sx={{ p: 2, borderRadius: '16px', border: '1px solid #f4f6f8' }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Icon icon={cat.trend === 'up' ? "solar:double-alt-arrow-up-bold-duotone" : cat.trend === 'down' ? "solar:double-alt-arrow-down-bold-duotone" : "solar:minus-bold-duotone"} color={cat.trend === 'up' ? '#FF5630' : cat.trend === 'down' ? '#00A76F' : '#919EAB'} />
                                                <Typography variant="subtitle2" fontWeight={800}>{cat.label}</Typography>
                                            </Stack>
                                            <Chip label={cat.status} size="small" color={cat.color as any} sx={{ height: 20, fontWeight: 700, fontSize: '10px' }} />
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="caption" color="text.secondary">Đã tiêu: <Typography component="span" variant="caption" fontWeight={800} color="text.primary">${cat.spent}</Typography></Typography>
                                            <Typography variant="caption" color="text.secondary">Ngân sách: <Typography component="span" variant="caption" fontWeight={800} color="text.primary">${cat.budget}</Typography></Typography>
                                        </Stack>
                                        <LinearProgress variant="determinate" value={(cat.spent / cat.budget) * 100} sx={{ mt: 1, height: 4, borderRadius: 2 }} />
                                    </Box>
                                ))}
                            </Stack>

                            <Box sx={{ mt: 3, p: 2, borderRadius: '16px', bgcolor: alpha('#1976D2', 0.05) }}>
                                <Stack spacing={1.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Icon icon="solar:lightbulb-bold-duotone" color="#1976D2" width={18} />
                                        <Typography variant="subtitle2" fontWeight={800}>Đề xuất</Typography>
                                    </Stack>
                                    {RECOMMENDATIONS.map((rec, i) => (
                                        <Typography key={i} variant="caption" sx={{ display: 'flex', gap: 1, color: 'text.secondary', '&::before': { content: '"•"', color: rec.color, fontWeight: 800 } }}>
                                            {rec.text}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Box>
                        </DashboardCard>
                    </Stack>
                </Box>

                {/* Right Column */}
                <Box sx={{ gridColumn: { xs: 'span 12', lg: 'span 7' } }}>
                    <Stack spacing={4}>
                        {/* Monthly Trends */}
                        <DashboardCard sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>Xu hướng hàng tháng</Typography>
                                    <Typography variant="caption" color="text.secondary">Thu nhập vs chi tiêu theo thời gian</Typography>
                                </Box>
                                <Select size="small" defaultValue="3-months" sx={{ borderRadius: '8px', height: '32px', fontSize: '12px', minWidth: 120 }}>
                                    <MenuItem value="3-months">3 tháng qua</MenuItem>
                                    <MenuItem value="6-months">6 tháng qua</MenuItem>
                                </Select>
                            </Stack>
                            <ReactApexChart options={areaOptions} series={[{ name: 'Thu nhập', data: [500, 800, 600, 1100, 900, 1300, 1000, 1400, 1200, 1600, 1300, 1800] }, { name: 'Chi tiêu', data: [400, 600, 500, 900, 700, 1100, 800, 1200, 1000, 1300, 1100, 1500] }]} type="area" height={320} />
                        </DashboardCard>

                        {/* Income vs Expenses Bar Chart */}
                        <DashboardCard sx={{ p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 3 }}>Thu nhập vs Chi tiêu</Typography>
                            <ReactApexChart options={barOptions} series={[{ name: 'Thu nhập', data: [2200, 1800, 2500, 2100, 2800, 2400, 2900, 2600, 3100] }, { name: 'Chi tiêu', data: [1800, 1600, 2100, 1900, 2200, 2000, 2400, 2200, 2500] }]} type="bar" height={320} />
                        </DashboardCard>

                        {/* Income vs Savings vs Target */}
                        <DashboardCard sx={{ p: 3 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight={800}>Thu nhập vs Tiết kiệm vs Mục tiêu</Typography>
                                <Typography variant="caption" color="text.secondary">Tháng 1 - Tháng 12 2024</Typography>
                            </Box>
                            <ReactApexChart options={lineOptions} series={[{ name: 'Thu nhập', data: [2000, 1800, 2600, 2100, 2900, 2200, 1900, 2700, 2300, 2800, 2400, 2100] }, { name: 'Tiết kiệm', data: [800, 1200, 900, 1400, 1100, 800, 1300, 900, 1500, 1100, 900, 1200] }, { name: 'Mục tiêu', data: [900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900] }]} type="line" height={320} />

                            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Box sx={{ width: 12, height: 2, bgcolor: '#004B50' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Thu nhập</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Box sx={{ width: 12, height: 2, bgcolor: '#00A76F' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Tiết kiệm</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Box sx={{ width: 12, height: 2, border: '1px dashed #919EAB' }} />
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Mục tiêu</Typography>
                                </Stack>
                            </Stack>
                        </DashboardCard>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};
