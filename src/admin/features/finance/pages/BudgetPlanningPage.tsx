import {
    Box, Typography, Stack, Button, MenuItem, Select,
    LinearProgress, TextField, InputAdornment, CircularProgress
} from '@mui/material';
import { Icon } from '@iconify/react';
import { alpha } from '@mui/material/styles';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { AddCategoryDialog } from './sections/AddCategoryDialog';
import { EditBudgetDialog } from './sections/EditBudgetDialog';
import { useState, useEffect } from 'react';
import { getBudgets, getBreakdownStats, createTransaction } from '../api/finance.api';
import dayjs from 'dayjs';

const SUGGESTIONS = [
    { title: 'Giải trí', desc: 'Bạn thường xuyên vượt ngân sách. Hãy cân nhắc giảm bớt khoảng 30k.', icon: 'solar:double-alt-arrow-down-bold-duotone', color: 'error' },
    { title: 'Mua sắm', desc: 'Bạn đã dưới mức ngân sách trong 3 tháng. Bạn có thể phân bổ thêm vào đây.', icon: 'solar:double-alt-arrow-up-bold-duotone', color: 'success' },
    { title: 'Ăn uống', desc: 'Chi tiêu của bạn đang tăng dần. Hãy cân nhắc thiết lập giới hạn chặt chẽ hơn.', icon: 'solar:danger-circle-bold-duotone', color: 'warning' },
];

export const BudgetPlanningPage = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [addParentId, setAddParentId] = useState<string>('');
    const [editCategory, setEditCategory] = useState<any>(null);
    const [period, setPeriod] = useState(dayjs().format('YYYY-MM'));
    const [budgetCategories, setBudgetCategories] = useState<any[]>([]);
    const [summary, setSummary] = useState({ totalBudget: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const handleQuickPay = async (cat: any) => {
        if (cat.spent >= cat.budget) return; // Already fully paid
        
        setActionLoading(true);
        try {
            const remainingAmount = (cat.budget - cat.spent) * 1000;
            const res = await createTransaction({
                title: `Thanh toán ${cat.title}`,
                description: `Thanh toán nhanh ngân sách ${cat.title}`,
                amount: remainingAmount,
                categoryId: cat.id,
                type: 'expense',
                date: new Date().toISOString()
            });

            if (res.data?.code === 200 || res.data?.code === 201) {
                fetchData();
            }
        } catch (error) {
            console.error("Failed to quick pay", error);
        } finally {
            setActionLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [year, month] = period.split('-');
            const startDate = new Date(Number(year), Number(month) - 1, 1).toISOString();
            const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59).toISOString();

            const [budgetsRes, statsRes] = await Promise.all([
                getBudgets({ period }),
                getBreakdownStats({ startDate, endDate })
            ]);

            if (budgetsRes.data?.code === 200 && statsRes.data?.code === 200) {
                const budgetsData = budgetsRes.data.data || [];
                const statsData = statsRes.data.data || [];

                let totalB = 0;
                let totalS = 0;

                const merged = budgetsData.map((b: any) => {
                    const cat = b.categoryId;
                    if (!cat) return null;
                    const spentItem = statsData.find((s: any) => s.label === cat.title);
                    const spent = spentItem ? spentItem.value / 1000 : 0;
                    const budget = b.amount / 1000;
                    
                    totalB += budget;
                    totalS += spent;

                    return {
                        id: cat._id,
                        title: cat.title,
                        icon: cat.icon || 'solar:wallet-bold-duotone',
                        color: cat.color || '#1976D2',
                        parentId: cat.parentId || null,
                        budget,
                        spent,
                        percent: budget > 0 ? Math.round((spent / budget) * 100) : 0
                    };
                }).filter(Boolean);

                statsData.forEach((s: any) => {
                    if (!merged.find(m => m.title === s.label)) {
                        const spent = s.value / 1000;
                        totalS += spent;
                        merged.push({
                            id: s.label,
                            title: s.label,
                            icon: s.icon || 'solar:wallet-bold-duotone',
                            color: s.color || '#D32F2F',
                            parentId: null,
                            budget: 0,
                            spent,
                            percent: spent > 0 ? 100 : 0
                        });
                    }
                });

                const rootCategories = merged.filter(c => !c.parentId);
                const childCategories = merged.filter(c => c.parentId);
                
                const finalCategories: any[] = [];
                rootCategories.forEach(root => {
                    finalCategories.push(root);
                    finalCategories.push(...childCategories.filter(c => c.parentId === root.id));
                });
                
                const mappedIds = new Set(finalCategories.map(c => c.id));
                const orphans = merged.filter(c => !mappedIds.has(c.id));
                finalCategories.push(...orphans);

                setBudgetCategories(finalCategories);
                setSummary({ totalBudget: totalB, totalSpent: totalS });
            }
        } catch (error) {
            console.error("Failed to fetch budget data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [period]);

    const totalPercent = summary.totalBudget > 0 ? Math.round((summary.totalSpent / summary.totalBudget) * 100) : 0;
    const remaining = Math.max(summary.totalBudget - summary.totalSpent, 0);
    const topCategories = [...budgetCategories].sort((a, b) => b.spent - a.spent).slice(0, 3).map(c => ({
        label: c.title,
        val: summary.totalSpent > 0 ? Math.round((c.spent / summary.totalSpent) * 100) : 0,
        color: c.color
    }));

    return (
        <Box sx={{ pb: 5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Lập kế hoạch ngân sách</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        size="small"
                        sx={{
                            borderRadius: '12px', bgcolor: 'white', minWidth: 150,
                            height: '44px', '& .MuiSelect-select': { py: 0 }
                        }}
                    >
                        <MenuItem value={dayjs().format('YYYY-MM')}>Tháng này</MenuItem>
                        <MenuItem value={dayjs().subtract(1, 'month').format('YYYY-MM')}>Tháng trước</MenuItem>
                        <MenuItem value={dayjs().subtract(2, 'month').format('YYYY-MM')}>2 tháng trước</MenuItem>
                    </Select>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setAddParentId('');
                            setOpenAdd(true);
                        }}
                        sx={{
                            bgcolor: '#1C252E', borderRadius: '12px', px: 3, fontWeight: 700,
                            height: '44px', textTransform: 'none', boxShadow: 'none',
                            '&:hover': { bgcolor: '#454F5B', boxShadow: 'none' }
                        }}
                    >
                        Thêm danh mục
                    </Button>
                </Stack>
            </Stack>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
                gap: 3
            }}>
                {/* Cột trái: Tóm tắt */}
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' } }}>
                    <Stack spacing={3}>
                        <DashboardCard sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>Tổng quan ngân sách</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 3, display: 'block' }}>Kỳ: {period}</Typography>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 4 }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Tổng NS</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{summary.totalBudget.toLocaleString('vi-VN')}k</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Đã chi</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{summary.totalSpent.toLocaleString('vi-VN')}k</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>Còn lại</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main' }}>{remaining.toLocaleString('vi-VN')}k</Typography>
                                </Box>
                            </Box>

                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Đã sử dụng</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{totalPercent}%</Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate" value={Math.min(totalPercent, 100)}
                                sx={{ height: 10, borderRadius: 5, bgcolor: alpha('#004B50', 0.08), '& .MuiLinearProgress-bar': { bgcolor: totalPercent > 100 ? 'error.main' : '#004B50' } }}
                            />
                        </DashboardCard>

                        <Box sx={{
                            p: 3, borderRadius: '24px', position: 'relative', overflow: 'hidden',
                            bgcolor: alpha('#919EAB', 0.08), border: theme => `1px solid ${alpha(theme.palette.divider, 0.1)}`
                        }}>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1 }}>Ngân sách mỗi ngày</Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>{Math.round(remaining / 30)}k</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>ước tính / ngày</Typography>
                            <Box sx={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1, color: '#004B50' }}>
                                <Icon icon="solar:bank-note-bold-duotone" width={100} />
                            </Box>
                        </Box>

                        <DashboardCard sx={{ p: 3 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3 }}>Danh mục chi tiêu hàng đầu</Typography>
                            <Stack spacing={3}>
                                {topCategories.length === 0 ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chưa có dữ liệu chi tiêu</Typography>
                                ) : (
                                    topCategories.map((item, idx) => (
                                        <Box key={idx}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.label}</Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.val}%</Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate" value={item.val}
                                                sx={{ height: 4, borderRadius: 2, bgcolor: item.color.startsWith('var') ? alpha('#919eab', 0.08) : alpha(item.color, 0.08), '& .MuiLinearProgress-bar': { bgcolor: item.color } }}
                                            />
                                        </Box>
                                    ))
                                )}
                            </Stack>
                        </DashboardCard>
                    </Stack>
                </Box>

                {/* Cột phải: Chi tiết danh mục */}
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
                    <DashboardCard sx={{ p: 3, mb: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>Danh mục ngân sách</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    Tổng ngân sách: <Typography component="span" variant="body2" sx={{ color: 'success.main', fontWeight: 800 }}>{summary.totalBudget.toLocaleString('vi-VN')}k</Typography> |
                                    Đã chi: <Typography component="span" variant="body2" sx={{ color: 'primary.main', fontWeight: 800 }}> {summary.totalSpent.toLocaleString('vi-VN')}k</Typography>
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>Quản lý ngân sách:</Typography>
                                <TextField
                                    size="small" placeholder="Ngân sách mới"

                                    sx={{
                                        width: 100,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            height: '36px'
                                        }
                                    }}
                                    InputProps={{ endAdornment: <InputAdornment position="end">k</InputAdornment> }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#1C252E', borderRadius: '8px', fontWeight: 700,
                                        height: '36px', textTransform: 'none',
                                        '&:hover': { bgcolor: '#454F5B' }
                                    }}
                                >
                                    Cập nhật
                                </Button>
                            </Stack>
                        </Stack>

                        <Stack spacing={2}>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : budgetCategories.length === 0 ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <Typography variant="body1" color="text.secondary">Chưa có dữ liệu danh mục</Typography>
                                </Box>
                            ) : (
                                budgetCategories.map((cat) => (
                                    <Box key={cat.id || cat.title} sx={{
                                        p: 2.5, borderRadius: '20px',
                                        border: theme => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        ml: cat.parentId ? 4 : 0,
                                        position: 'relative',
                                        transition: 'all 0.2s', '&:hover': { bgcolor: 'background.neutral' }
                                    }}>
                                        {cat.parentId && (
                                            <Box sx={{
                                                position: 'absolute', left: -20, top: '50%',
                                                width: 16, height: 2, bgcolor: 'divider'
                                            }} />
                                        )}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Box sx={{
                                                    width: 44, height: 44, borderRadius: '14px', 
                                                    bgcolor: cat.color.startsWith('var') ? alpha('#919eab', 0.1) : alpha(cat.color, 0.1),
                                                    color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Icon icon={cat.icon} width={24} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{cat.title}</Typography>
                                                    <Button 
                                                        size="small" 
                                                        onClick={() => setEditCategory(cat)}
                                                        sx={{ p: 0, minWidth: 'auto', fontSize: '12px', fontWeight: 600, color: 'text.secondary', '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
                                                    >
                                                        Sửa ngân sách
                                                    </Button>
                                                </Box>
                                            </Stack>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: cat.spent > cat.budget && cat.budget > 0 ? 'error.main' : 'text.primary' }}>
                                                    {cat.spent.toLocaleString('vi-VN')}k / {cat.budget.toLocaleString('vi-VN')}k
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>{cat.percent}%</Typography>
                                            </Box>
                                        </Stack>

                                        <LinearProgress
                                            variant="determinate" value={Math.min(cat.percent, 100)}
                                            sx={{
                                                height: 8, borderRadius: 4, mb: 2,
                                                bgcolor: cat.color.startsWith('var') ? alpha('#919eab', 0.08) : alpha(cat.color, 0.08),
                                                '& .MuiLinearProgress-bar': { bgcolor: cat.percent > 100 ? 'error.main' : cat.color }
                                            }}
                                        />

                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    size="small" endIcon={<Icon icon="solar:alt-arrow-down-bold-duotone" />}
                                                    sx={{ color: 'text.secondary', fontSize: '12px', fontWeight: 700 }}
                                                >
                                                    Xem giao dịch
                                                </Button>

                                                {!cat.parentId && (
                                                    <Button
                                                        size="small"
                                                        startIcon={<Icon icon="solar:add-circle-bold-duotone" />}
                                                        onClick={() => {
                                                            setAddParentId(cat.id);
                                                            setOpenAdd(true);
                                                        }}
                                                        sx={{ color: 'primary.main', fontSize: '12px', fontWeight: 700 }}
                                                    >
                                                        Thêm mục con
                                                    </Button>
                                                )}
                                            </Stack>

                                            {cat.budget > 0 && cat.spent < cat.budget && (
                                                <Button
                                                    size="small" 
                                                    startIcon={<Icon icon="solar:check-circle-bold-duotone" />}
                                                    disabled={actionLoading}
                                                    onClick={() => handleQuickPay(cat)}
                                                    sx={{ 
                                                        color: 'success.main', fontSize: '12px', fontWeight: 700,
                                                        bgcolor: alpha('#22C55E', 0.1), borderRadius: '8px', px: 1.5,
                                                        '&:hover': { bgcolor: alpha('#22C55E', 0.2) }
                                                    }}
                                                >
                                                    Tích trả đủ
                                                </Button>
                                            )}
                                        </Stack>
                                    </Box>
                                ))
                            )}
                        </Stack>

                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                            <Button variant="outlined" sx={{ borderRadius: '8px', color: 'text.secondary', borderColor: 'divider', px: 3, height: '36px', textTransform: 'none' }}>Đặt lại</Button>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: '#1C252E', borderRadius: '8px', px: 4, fontWeight: 700,
                                    height: '36px', textTransform: 'none',
                                    '&:hover': { bgcolor: '#454F5B' }
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </Stack>
                    </DashboardCard>

                    <DashboardCard sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Gợi ý ngân sách</Typography>
                        <Stack spacing={2}>
                            {SUGGESTIONS.map((sug, idx) => (
                                <Box key={idx} sx={{
                                    p: 2, borderRadius: '16px', bgcolor: alpha(sug.color === 'error' ? '#FF5630' : sug.color === 'warning' ? '#FFAB00' : '#22C55E', 0.05),
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box sx={{
                                            width: 40, height: 40, borderRadius: '50%',
                                            bgcolor: alpha(sug.color === 'error' ? '#FF5630' : sug.color === 'warning' ? '#FFAB00' : '#22C55E', 0.1),
                                            color: sug.color === 'error' ? 'error.main' : sug.color === 'warning' ? 'warning.main' : 'success.main',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Icon icon={sug.icon} width={24} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{sug.title}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{sug.desc}</Typography>
                                        </Box>
                                    </Stack>
                                    <Button
                                        size="small" endIcon={<Icon icon="solar:alt-arrow-right-bold-duotone" />}
                                        sx={{ borderRadius: '8px', fontWeight: 700, px: 2 }}
                                    >
                                        Áp dụng
                                    </Button>
                                </Box>
                            ))}
                        </Stack>
                    </DashboardCard>
                </Box>
            </Box>

            <AddCategoryDialog 
                open={openAdd} 
                onClose={() => setOpenAdd(false)} 
                period={period}
                initialParentId={addParentId}
                onSuccess={() => {
                    setOpenAdd(false);
                    setAddParentId('');
                    fetchData();
                }}
            />

            <EditBudgetDialog 
                open={!!editCategory} 
                onClose={() => setEditCategory(null)} 
                period={period}
                category={editCategory}
                onSuccess={() => {
                    setEditCategory(null);
                    fetchData();
                }}
            />
        </Box>
    );
};
