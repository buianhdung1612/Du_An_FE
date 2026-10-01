import {
    Box, Stack, Typography, Button, TextField, InputAdornment,
    MenuItem, Select, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, IconButton, Divider
} from '@mui/material';
import { Icon } from '@iconify/react';
import { alpha, useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { useState, useEffect } from 'react';
import { getTransactions, getBreakdownStats } from '../api/finance.api';
import dayjs from 'dayjs';

const UPCOMING_PAYMENTS = [
    { id: 1, name: 'Hóa đơn điện', category: 'Tiện ích', dueDate: 'Hạn 25 thg 5', amount: 120.35, status: 'due-soon', daysLeft: 3, recurring: true },
    { id: 2, name: 'Dịch vụ Internet', category: 'Tiện ích', dueDate: 'Hạn 28 thg 5', amount: 79.99, status: 'this-week', daysLeft: 6, recurring: true },
    { id: 3, name: 'Học phí', category: 'Giáo dục', dueDate: 'Hạn 30 thg 5', amount: 2500.00, status: 'upcoming', daysLeft: 8, recurring: false },
    { id: 4, name: 'Bảo hiểm xe', category: 'Di chuyển', dueDate: 'Hạn 1 thg 6', amount: 156.75, status: 'upcoming', daysLeft: 10, recurring: true },
    { id: 5, name: 'Thẻ tập Gym', category: 'Sức khỏe', dueDate: 'Hạn 3 thg 6', amount: 45.00, status: 'upcoming', daysLeft: 12, recurring: true },
];

export const ExpensesPage = () => {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [breakdownData, setBreakdownData] = useState<any[]>([]);
    const [totalSpent, setTotalSpent] = useState(0);

    const fetchData = async () => {
        try {
            const now = dayjs();
            const startDate = now.startOf('month').toISOString();
            const endDate = now.endOf('month').toISOString();

            const [transRes, statsRes] = await Promise.all([
                getTransactions({ limit: 50, startDate, endDate }),
                getBreakdownStats({ startDate, endDate })
            ]);

            if (transRes.data?.code === 200) {
                setTransactions(transRes.data.data.transactions || []);
            }
            if (statsRes.data?.code === 200) {
                const stats = statsRes.data.data || [];
                setBreakdownData(stats);
                const total = stats.reduce((acc: number, curr: any) => acc + curr.value, 0);
                setTotalSpent(total / 1000);
            }
        } catch (error) {
            console.error("Failed to fetch expenses data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const chartOptions: any = {
        chart: { type: 'donut' },
        labels: breakdownData.length > 0 ? breakdownData.map(d => d.label) : ['Chưa có dữ liệu'],
        colors: breakdownData.length > 0 ? breakdownData.map(d => d.color) : ['#919EAB'],
        stroke: { show: false },
        dataLabels: { enabled: false },
        legend: { show: false },
        plotOptions: {
            pie: {
                donut: {
                    size: '85%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Tổng chi tiêu',
                            formatter: () => `${totalSpent.toLocaleString('vi-VN')}k`,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 700,
                            formatter: (val: string) => `$${val}`,
                            offsetY: 8
                        }
                    }
                }
            }
        },
        tooltip: {
            y: {
                formatter: (val: number) => `$${val}`
            }
        }
    };

    return (
        <Box sx={{ pb: 5 }}>
            {/* Header section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Chi tiêu</Typography>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#1C252E', borderRadius: '12px', px: 3, height: '44px',
                        fontWeight: 700, textTransform: 'none', boxShadow: 'none',
                        '&:hover': { bgcolor: '#454F5B', boxShadow: 'none' }
                    }}
                >
                    Thêm giao dịch
                </Button>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 4, alignItems: 'start' }}>

                {/* Main Content (Left) */}
                <Stack spacing={4}>

                    {/* Filters & Table */}
                    <DashboardCard sx={{ p: 0, overflow: 'hidden' }}>
                        {/* Table Filters */}
                        <Stack direction="row" spacing={2} sx={{ p: 2, borderBottom: '1px solid #f4f6f8' }} alignItems="center">
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Tìm kiếm giao dịch..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon icon="solar:magnifer-linear" width={20} />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '10px', bgcolor: 'background.neutral' }
                                }}
                            />
                            <Select defaultValue="all" size="small" sx={{ minWidth: 120, borderRadius: '10px', height: '40px' }}>
                                <MenuItem value="all">Tất cả loại</MenuItem>
                                <MenuItem value="income">Thu nhập</MenuItem>
                                <MenuItem value="expense">Chi tiêu</MenuItem>
                            </Select>
                            <Select defaultValue="all" size="small" sx={{ minWidth: 140, borderRadius: '10px', height: '40px' }}>
                                <MenuItem value="all">Tất cả danh mục</MenuItem>
                                <MenuItem value="food">Ăn uống</MenuItem>
                                <MenuItem value="housing">Nhà ở</MenuItem>
                            </Select>
                            <IconButton sx={{ borderRadius: '10px', border: '1px solid #eee' }}>
                                <Icon icon="solar:filter-linear" />
                            </IconButton>
                        </Stack>

                        <TableContainer>
                            <Table sx={{ minWidth: 800 }}>
                                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Giao dịch</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Danh mục</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Tài khoản</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Ngày</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Số tiền</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Ghi chú</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                Chưa có giao dịch nào
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((row) => (
                                            <TableRow key={row._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell sx={{ fontWeight: 600 }}>{row.title || row.description}</TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Icon icon={row.categoryId?.icon || "solar:tag-bold-duotone"} width={18} />
                                                        <Typography variant="body2">{row.categoryId?.title || 'Không rõ'}</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell sx={{ color: 'text.secondary' }}>Tiền mặt</TableCell>
                                                <TableCell sx={{ color: 'text.secondary' }}>{row._id.slice(-6)}</TableCell>
                                                <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>{dayjs(row.date).format('DD/MM/YYYY HH:mm')}</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: row.type === 'income' ? 'success.main' : 'error.main' }}>
                                                    {row.type === 'income' ? '+' : '-'}{(row.amount / 1000).toLocaleString('vi-VN')}k
                                                </TableCell>
                                                <TableCell sx={{ color: 'text.secondary', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {row.description}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
                            <Typography variant="caption" color="text.secondary">Đang hiển thị 10 trên 46</Typography>
                            <Stack direction="row" spacing={1}>
                                {[1, 2, 3, 4, 5].map((p) => (
                                    <Button key={p} size="small" variant={p === 1 ? 'contained' : 'text'} sx={{
                                        minWidth: 32, p: 0, borderRadius: '8px',
                                        bgcolor: p === 1 ? '#1C252E' : 'transparent',
                                        color: p === 1 ? 'white' : 'text.primary',
                                        '&:hover': { bgcolor: p === 1 ? '#454F5B' : alpha('#1C252E', 0.04) }
                                    }}>{p}</Button>
                                ))}
                            </Stack>
                        </Stack>
                    </DashboardCard>

                    {/* Upcoming Payments */}
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                            <Icon icon="solar:calendar-date-bold-duotone" width={24} color="#1C252E" />
                            <Typography variant="h6" fontWeight={800}>Thanh toán sắp tới</Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>Hóa đơn đến hạn trong 2 tuần tới</Typography>

                        <Stack spacing={1.5}>
                            {UPCOMING_PAYMENTS.map((payment) => (
                                <Paper key={payment.id} sx={{
                                    p: 2, borderRadius: '16px', border: '1px solid #f4f6f8',
                                    transition: 'all 0.2s'
                                }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ textAlign: 'center', minWidth: 60, p: 1, borderRadius: '12px', bgcolor: alpha(payment.status === 'due-soon' ? '#FF5630' : payment.status === 'this-week' ? '#FFAB00' : '#1C252E', 0.08) }}>
                                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: payment.status === 'due-soon' ? 'error.main' : payment.status === 'this-week' ? 'warning.main' : 'text.primary' }}>
                                                    {payment.daysLeft} ngày
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary' }}>
                                                    {payment.status === 'due-soon' ? 'Đến hạn ngay' : payment.status === 'this-week' ? 'Tuần này' : 'Sắp tới'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="subtitle2" fontWeight={800}>{payment.name}</Typography>
                                                    {payment.recurring && <Chip label="Định kỳ" size="small" sx={{ height: 18, fontSize: '10px', bgcolor: 'rgba(0, 167, 111, 0.1)', color: 'success.main', fontWeight: 700 }} />}
                                                </Stack>
                                                <Typography variant="caption" color="text.secondary">{payment.category} • {payment.dueDate}</Typography>
                                            </Box>
                                        </Stack>
                                        <Stack direction="row" spacing={3} alignItems="center">
                                            <Typography variant="subtitle1" fontWeight={800}>${payment.amount.toLocaleString()}</Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    color: '#1C252E',
                                                    borderColor: '#1C252E',
                                                    '&:hover': {
                                                        bgcolor: '#1C252E',
                                                        color: 'white',
                                                        borderColor: '#1C252E'
                                                    }
                                                }}
                                            >
                                                Thanh toán ngay
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                        <Button fullWidth sx={{ mt: 3, py: 1, borderRadius: '12px', color: 'text.secondary', fontWeight: 800 }}>Xem tất cả hóa đơn</Button>
                    </Box>
                </Stack>

                {/* Sidebar (Right) - Sticky */}
                <Box sx={{ position: { lg: 'sticky' }, top: '24px' }}>
                    <DashboardCard sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={800}>Phân bổ chi tiêu</Typography>
                        <Typography variant="caption" color="text.secondary">Chi tiêu tháng hiện tại theo danh mục</Typography>

                        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <ReactApexChart
                                options={chartOptions}
                                series={breakdownData.length > 0 ? breakdownData.map(d => d.value) : [1]}
                                type="donut"
                                width={280}
                            />
                        </Box>

                        <Stack spacing={2}>
                            {breakdownData.length === 0 ? (
                                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>Chưa có dữ liệu thống kê</Typography>
                            ) : (
                                breakdownData.map((item) => (
                                    <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.label}</Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                            {(item.value / 1000).toLocaleString('vi-VN')}k ({totalSpent > 0 ? Math.round((item.value / 1000 / totalSpent) * 100) : 0}%)
                                        </Typography>
                                    </Stack>
                                ))
                            )}
                        </Stack>

                        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

                        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>So sánh theo tháng</Typography>
                        <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" color="text.secondary">Tháng trước</Typography>
                                <Typography variant="caption" fontWeight={700}>$2,150</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" color="text.secondary">Tháng này</Typography>
                                <Typography variant="caption" fontWeight={700}>$2,200</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" color="text.secondary">Chênh lệch</Typography>
                                <Typography variant="caption" fontWeight={800} color="error.main">+$50 (2.3%)</Typography>
                            </Stack>
                        </Stack>
                    </DashboardCard>
                </Box>
            </Box>
        </Box>
    );
};
