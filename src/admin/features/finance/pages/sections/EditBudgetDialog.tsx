import {
    Dialog, DialogContent, DialogActions,
    Button, Box, Typography, Stack,
    IconButton, Slider, CircularProgress
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { upsertBudget } from '../../api/finance.api';

interface EditBudgetDialogProps {
    open: boolean;
    onClose: () => void;
    period: string;
    category: any;
    onSuccess: () => void;
}

export const EditBudgetDialog = ({ open, onClose, period, category, onSuccess }: EditBudgetDialogProps) => {
    const [budget, setBudget] = useState(500);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setBudget(category.budget > 0 ? category.budget : 500);
        }
    }, [category, open]);

    const handleSubmit = async () => {
        if (!category) return;
        setLoading(true);
        try {
            const res = await upsertBudget({
                categoryId: category.id,
                period,
                amount: budget * 1000 // Convert k to VND
            });

            if (res.data?.code === 200) {
                onSuccess();
            }
        } catch (error) {
            console.error("Failed to update budget", error);
        } finally {
            setLoading(false);
        }
    };

    if (!category) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{
            '& .MuiPaper-root': { borderRadius: '20px', p: 1 }
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, pt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Tùy chỉnh ngân sách</Typography>
                <IconButton onClick={onClose} size="small" disabled={loading}><Icon icon="solar:close-circle-bold-duotone" /></IconButton>
            </Stack>

            <DialogContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4, mt: 1 }}>
                    <Box sx={{
                        width: 44, height: 44, borderRadius: '14px', 
                        bgcolor: category.color.startsWith('var') ? 'rgba(145, 158, 171, 0.1)' : category.color + '1A',
                        color: category.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Icon icon={category.icon} width={24} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{category.title}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Hạn mức ngân sách ({period})</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--palette-text-primary)' }}>{budget.toLocaleString('vi-VN')}k</Typography>
                </Stack>
                <Box sx={{ px: 1 }}>
                    <Slider
                        value={budget}
                        onChange={(_, v) => setBudget(v as number)}
                        min={50} max={20000} step={50}
                        sx={{ color: '#1C252E' }}
                    />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>50k</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>20.000k</Typography>
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} disabled={loading} sx={{ height: '36px', borderRadius: '8px', fontWeight: 700, color: 'text.secondary', textTransform: 'none' }}>Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        height: '36px', borderRadius: '8px', px: 4, fontWeight: 700, textTransform: 'none',
                        bgcolor: '#1C252E', '&:hover': { bgcolor: '#454F5B' }
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Cập nhật'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
