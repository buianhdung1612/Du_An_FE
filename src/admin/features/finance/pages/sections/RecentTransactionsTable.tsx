import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Pagination, Chip, IconButton, CircularProgress } from '@mui/material';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { Icon } from '@iconify/react';
import { alpha } from '@mui/material/styles';
import { getTransactions } from '../../api/finance.api';
import dayjs from 'dayjs';

export const RecentTransactionsTable = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTransactions({ limit: 5 });
                if (res.data?.code === 200) {
                    setTransactions(res.data.data.transactions);
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardCard sx={{ p: 0 }}>
            <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Giao dịch gần đây</Typography>
                    <Select defaultValue="month" size="small" sx={{ borderRadius: '8px', minWidth: 120 }}>
                        <MenuItem value="month">Tháng này</MenuItem>
                        <MenuItem value="week">Tuần này</MenuItem>
                        <MenuItem value="year">Năm nay</MenuItem>
                    </Select>
                </Stack>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'background.neutral' }}>
                                <TableCell sx={{ fontWeight: 700 }}>Tên</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Danh mục</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Số tiền</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress size={24} />
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                                            Chưa có dữ liệu giao dịch
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((row) => (
                                    <TableRow key={row._id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.note || "Không có ghi chú"}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{row.categoryId?.title || "Không rõ"}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>{dayjs(row.date).format('YYYY-MM-DD HH:mm')}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: row.type === 'income' ? 'success.main' : 'error.main' }}>
                                            {row.type === 'income' ? '+' : '-'}{(row.amount / 1000).toLocaleString('vi-VN')}k
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label="Hoàn tất"
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                                                    color: 'success.main',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small">
                                                <Icon icon="eva:more-vertical-fill" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Hiển thị 1 đến 5 trên 10 mục</Typography>
                    <Pagination count={2} shape="rounded" color="primary" size="small" />
                </Stack>
            </Box>
        </DashboardCard>
    );
};
