import {
    Dialog, DialogContent, DialogActions,
    Button, TextField, Box, Typography, Stack,
    IconButton, Slider, CircularProgress
} from '@mui/material';
import { Icon } from '@iconify/react';
import { alpha } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { createCategory, upsertBudget, getCategories } from '../../api/finance.api';
import { Select, MenuItem } from '@mui/material';

const ICONS = [
    'solar:bag-bold-duotone', 'solar:home-bold-duotone', 'solar:car-bold-duotone',
    'solar:hamburger-menu-bold-duotone', 'solar:video-library-bold-duotone', 'solar:wi-fi-bold-duotone',
    'solar:heart-bold-duotone', 'solar:gamepad-bold-duotone', 'solar:plain-bold-duotone',
    'solar:medal-star-bold-duotone', 'solar:cup-bold-duotone', 'solar:t-shirt-bold-duotone'
];

// Sử dụng hệ thống màu của website (như Order Status)
const COLORS = [
    { name: 'Xanh dương', hex: '#CAFDF5', text: '#003768', main: '#00B8D9' },
    { name: 'Xanh lá', hex: '#C8FAD6', text: '#08660D', main: '#22C55E' },
    { name: 'Vàng', hex: '#FFF5CC', text: '#7A4100', main: '#FFAB00' },
    { name: 'Đỏ', hex: '#FFE9D5', text: '#7A0916', main: '#FF5630' },
    { name: 'Tím', hex: '#EBE1FF', text: '#3E1C96', main: '#8A2BE2' },
    { name: 'Xám', hex: '#F4F6F8', text: '#637381', main: '#919EAB' },
    { name: 'Cam', hex: '#FFF3E0', text: '#E65100', main: '#FF9800' },
    { name: 'Hồng', hex: '#FCE4EC', text: '#880E4F', main: '#E91E63' },
];

interface AddCategoryDialogProps {
    open: boolean;
    onClose: () => void;
    period?: string;
    initialParentId?: string;
    onSuccess?: () => void;
}

export const AddCategoryDialog = ({ open, onClose, period, initialParentId, onSuccess }: AddCategoryDialogProps) => {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [budget, setBudget] = useState(500);
    const [parentId, setParentId] = useState<string>(initialParentId || '');
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setParentId(initialParentId || '');
            getCategories().then(res => {
                if (res.data?.code === 200) {
                    // Only allow root categories as parents for now
                    setCategories(res.data.data.filter((c: any) => !c.parentId));
                }
            });
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            // 1. Tạo Category
            const catRes = await createCategory({
                title: name,
                icon: selectedIcon,
                color: selectedColor.main,
                type: 'expense',
                parentId: parentId || null
            });

            if (catRes.data?.code === 200) {
                const newCategory = catRes.data.data;
                
                // 2. Cập nhật Ngân sách (nếu có period)
                if (period && budget > 0) {
                    await upsertBudget({
                        categoryId: newCategory._id,
                        period,
                        amount: budget * 1000 // Convert k to VND
                    });
                }
                
                if (onSuccess) onSuccess();
                else onClose();
            }
        } catch (error) {
            console.error("Failed to add category", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{
            '& .MuiPaper-root': { borderRadius: '20px', p: 1 }
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, pt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Thêm danh mục ngân sách</Typography>
                <IconButton onClick={onClose} size="small" disabled={loading}><Icon icon="solar:close-circle-bold-duotone" /></IconButton>
            </Stack>

            <DialogContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Tạo danh mục ngân sách mới để theo dõi chi tiêu của bạn
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Tên danh mục</Typography>
                <TextField
                    fullWidth
                    placeholder="Ví dụ: Tạp hóa, Xăng xe, Đăng ký..."
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '36px'
                        }
                    }}
                />

                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Danh mục cha (Tùy chọn)</Typography>
                <Select
                    fullWidth
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    displayEmpty
                    disabled={loading}
                    sx={{
                        mb: 3, height: '36px', borderRadius: '8px',
                        '& .MuiSelect-select': { py: 0.5 }
                    }}
                >
                    <MenuItem value=""><em>Không có (Danh mục gốc)</em></MenuItem>
                    {categories.map(c => (
                        <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
                    ))}
                </Select>

                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Chọn Icon</Typography>
                <Box sx={{
                    display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, mb: 3
                }}>
                    {ICONS.map((icon) => (
                        <IconButton
                            key={icon}
                            onClick={() => setSelectedIcon(icon)}
                            sx={{
                                width: 44, height: 44, borderRadius: '12px',
                                border: `2px solid ${selectedIcon === icon ? 'var(--palette-text-primary)' : 'transparent'}`,
                                bgcolor: alpha('#919EAB', 0.08),
                                color: selectedIcon === icon ? 'var(--palette-text-primary)' : 'text.secondary'
                            }}
                        >
                            <Icon icon={icon} />
                        </IconButton>
                    ))}
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Chọn Màu sắc</Typography>
                <Box sx={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 3
                }}>
                    {COLORS.map((color) => (
                        <Box
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            sx={{
                                height: 36, borderRadius: '10px', bgcolor: color.hex,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', border: `2px solid ${selectedColor.name === color.name ? color.main : 'transparent'}`,
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'scale(1.05)' }
                            }}
                        >
                            <Typography variant="caption" sx={{ color: color.text, fontWeight: 700 }}>{color.name}</Typography>
                        </Box>
                    ))}
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Hạn mức ngân sách tháng</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--palette-text-primary)' }}>{budget.toLocaleString()}k</Typography>
                </Stack>
                <Box sx={{ px: 1 }}>
                    <Slider
                        value={budget}
                        onChange={(_, v) => setBudget(v as number)}
                        min={50} max={2000} step={10}
                        sx={{ color: '#1C252E' }}
                    />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>50k</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>2,000k</Typography>
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} disabled={loading} sx={{ height: '36px', borderRadius: '8px', fontWeight: 700, color: 'text.secondary', textTransform: 'none' }}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !name.trim()}
                    sx={{
                        height: '36px', borderRadius: '8px', px: 4, fontWeight: 700, textTransform: 'none',
                        bgcolor: '#1C252E', '&:hover': { bgcolor: '#454F5B' }
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Thêm danh mục'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
