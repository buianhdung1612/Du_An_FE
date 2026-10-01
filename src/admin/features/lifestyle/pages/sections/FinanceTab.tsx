import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Stack,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    alpha,
    useTheme,
    Grid
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useFinance } from '../../hooks/useLifestyle';
import dayjs from 'dayjs';

const CATEGORIES = [
    { label: 'Ăn uống', icon: 'solar:hamburger-food-bold-duotone', color: '#FFAB00' },
    { label: 'Di chuyển', icon: 'solar:bus-bold-duotone', color: '#00B8D9' },
    { label: 'Mua sắm', icon: 'solar:cart-large-2-bold-duotone', color: '#8E33FF' },
    { label: 'Giải trí', icon: 'solar:gamepad-bold-duotone', color: '#FF5630' },
    { label: 'Tiền lương', icon: 'solar:banknote-bold-duotone', color: '#22C55E' },
    { label: 'Khác', icon: 'solar:widget-bold-duotone', color: '#919EAB' },
];

export const FinanceTab = () => {
    const theme = useTheme();
    const { data: res, createFinance } = useFinance();
    const transactions = res?.data || [];
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Chi tiêu',
        amount: '',
        category: 'Ăn uống',
        description: '',
        date: dayjs().format('YYYY-MM-DD')
    });

    const handleSave = () => {
        if (!formData.amount) return;
        createFinance({ ...formData, amount: Number(formData.amount) });
        setOpen(false);
    };

    const totalIncome = transactions.filter((t: any) => t.type === 'Thu nhập').reduce((sum: number, t: any) => sum + t.amount, 0);
    const totalExpense = transactions.filter((t: any) => t.type === 'Chi tiêu').reduce((sum: number, t: any) => sum + t.amount, 0);

    return (
        <Box>
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{ flexBasis: { xs: '100%', md: '33.33%' } }}>
                    <Card sx={{ p: 3, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.dark', borderRadius: '16px' }}>
                        <Typography variant="overline" sx={{ opacity: 0.8 }}>Tổng thu nhập</Typography>
                        <Typography variant="h4">{totalIncome.toLocaleString()} đ</Typography>
                    </Card>
                </Grid>
                <Grid sx={{ flexBasis: { xs: '100%', md: '33.33%' } }}>
                    <Card sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.dark', borderRadius: '16px' }}>
                        <Typography variant="overline" sx={{ opacity: 0.8 }}>Tổng chi tiêu</Typography>
                        <Typography variant="h4">{totalExpense.toLocaleString()} đ</Typography>
                    </Card>
                </Grid>
                <Grid sx={{ flexBasis: { xs: '100%', md: '33.33%' } }}>
                    <Card sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.dark', borderRadius: '16px' }}>
                        <Typography variant="overline" sx={{ opacity: 0.8 }}>Số dư</Typography>
                        <Typography variant="h4">{(totalIncome - totalExpense).toLocaleString()} đ</Typography>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Giao dịch gần đây</Typography>
                <Button
                    variant="contained"
                    startIcon={<Icon icon="solar:add-circle-bold" />}
                    onClick={() => setOpen(true)}
                    sx={{ bgcolor: 'text.primary', borderRadius: '10px' }}
                >
                    Thêm giao dịch
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Loại</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell align="right">Số tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((t: any) => (
                            <TableRow key={t._id}>
                                <TableCell>{dayjs(t.date).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{
                                        px: 1, py: 0.5, borderRadius: '6px',
                                        bgcolor: t.type === 'Thu nhập' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                                        color: t.type === 'Thu nhập' ? 'success.main' : 'error.main',
                                        fontWeight: 700
                                    }}>
                                        {t.type}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Icon icon={CATEGORIES.find(c => c.label === t.category)?.icon || 'solar:widget-bold-duotone'} width={18} />
                                        <Typography variant="body2">{t.category}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>{t.description}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: t.type === 'Thu nhập' ? 'success.main' : 'error.main' }}>
                                    {t.type === 'Thu nhập' ? '+' : '-'}{t.amount.toLocaleString()} đ
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 700 }}>Thêm giao dịch mới</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField
                            select
                            fullWidth
                            label="Loại giao dịch"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <MenuItem value="Thu nhập">Thu nhập</MenuItem>
                            <MenuItem value="Chi tiêu">Chi tiêu</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            label="Số tiền (đ)"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />

                        <TextField
                            select
                            fullWidth
                            label="Danh mục"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.map((c) => (
                                <MenuItem key={c.label} value={c.label}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Icon icon={c.icon} width={20} color={c.color} />
                                        <Typography>{c.label}</Typography>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            label="Ngày"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            fullWidth
                            label="Ghi chú"
                            multiline
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'text.primary', borderRadius: '10px' }}>Lưu giao dịch</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
