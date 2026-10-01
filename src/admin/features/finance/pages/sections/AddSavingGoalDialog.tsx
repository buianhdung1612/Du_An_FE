import {
    Dialog, DialogContent, DialogActions,
    Button, TextField, Box, Typography, Stack,
    IconButton, MenuItem, Select, InputAdornment, alpha, CircularProgress
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { getCategories, createSavingGoal } from '../../api/finance.api';
import { toast } from 'react-toastify';

interface AddSavingGoalDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AddSavingGoalDialog = ({ open, onClose, onSuccess }: AddSavingGoalDialogProps) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        categoryId: '',
        description: '',
        recurringAmount: '',
        recurringFrequency: 'none'
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        if (open) fetchCategories();
    }, [open]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.targetAmount) {
            toast.error('Vui lòng nhập tên mục tiêu và số tiền');
            return;
        }

        setLoading(true);
        try {
            await createSavingGoal({
                ...formData,
                targetAmount: Number(formData.targetAmount),
                currentAmount: Number(formData.currentAmount) || 0,
                recurringAmount: Number(formData.recurringAmount) || 0
            });
            toast.success('Thêm mục tiêu thành công!');
            if (onSuccess) onSuccess();
            onClose();
            // Reset form
            setFormData({
                title: '',
                targetAmount: '',
                currentAmount: '',
                deadline: '',
                categoryId: '',
                description: '',
                recurringAmount: '',
                recurringFrequency: 'none'
            });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm mục tiêu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{
            '& .MuiPaper-root': { borderRadius: '20px', p: 1 }
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, pt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Thêm mục tiêu tiết kiệm</Typography>
                <IconButton onClick={onClose} size="small"><Icon icon="solar:close-circle-bold-duotone" /></IconButton>
            </Stack>

            <DialogContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Đặt ra mục tiêu và theo dõi tiến trình tiết kiệm của bạn
                </Typography>

                <Stack spacing={2.5}>
                    {/* Goal Name */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Tên mục tiêu</Typography>
                        <TextField
                            fullWidth
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ví dụ: Quỹ du lịch, Mua xe mới..."
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Box>

                    {/* Target Amount & Initial Deposit */}
                    <Stack direction="row" spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Số tiền mục tiêu</Typography>
                            <TextField
                                fullWidth
                                name="targetAmount"
                                type="number"
                                value={formData.targetAmount}
                                onChange={handleChange}
                                placeholder="0"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Tiền gửi ban đầu (Tùy chọn)</Typography>
                            <TextField
                                fullWidth
                                name="currentAmount"
                                type="number"
                                value={formData.currentAmount}
                                onChange={handleChange}
                                placeholder="0"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Box>
                    </Stack>

                    {/* Target Date & Category */}
                    <Stack direction="row" spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Ngày hoàn thành</Typography>
                            <TextField
                                fullWidth
                                name="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Danh mục</Typography>
                            <Select
                                fullWidth
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                displayEmpty
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="" disabled>Chọn danh mục</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </Stack>

                    {/* Description */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Mô tả (Tùy chọn)</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Thêm chi tiết về mục tiêu tiết kiệm của bạn..."
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Box>

                    {/* Recurring Contribution */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Đóng góp định kỳ (Tùy chọn)</Typography>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                name="recurringAmount"
                                type="number"
                                value={formData.recurringAmount}
                                onChange={handleChange}
                                placeholder="0"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                            <Select
                                sx={{ flex: 1, borderRadius: '12px' }}
                                name="recurringFrequency"
                                value={formData.recurringFrequency}
                                onChange={handleChange}
                            >
                                <MenuItem value="none">Không định kỳ</MenuItem>
                                <MenuItem value="weekly">Hàng tuần</MenuItem>
                                <MenuItem value="bi-weekly">Mỗi 2 tuần</MenuItem>
                                <MenuItem value="monthly">Hàng tháng</MenuItem>
                            </Select>
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} sx={{ height: '44px', borderRadius: '12px', fontWeight: 700, color: 'text.secondary', textTransform: 'none', px: 3 }}>Hủy</Button>
                <Button
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    onClick={handleSave}
                    sx={{
                        height: '44px', borderRadius: '12px', fontWeight: 700, textTransform: 'none',
                        bgcolor: '#1C252E', '&:hover': { bgcolor: '#454F5B' }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Lưu mục tiêu'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
