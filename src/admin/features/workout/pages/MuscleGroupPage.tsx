import { useState } from 'react';
import { Box, Typography, Button, Card, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { useMuscleGroups } from '../hooks/useWorkout';

export const MuscleGroupPage = () => {
    const { data: res, createGroup, editGroup, deleteGroup } = useMuscleGroups();
    const groups = res?.data || [];
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', description: '' });

    const handleSave = () => {
        if (!formData.name) return;
        if (formData.id) {
            editGroup({ id: formData.id, data: { name: formData.name, description: formData.description } });
        } else {
            createGroup({ name: formData.name, description: formData.description });
        }
        setOpen(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Quản lý Nhóm cơ</Typography>
                <Button variant="contained" startIcon={<Icon icon="solar:add-circle-bold" />} onClick={() => { setFormData({ id: '', name: '', description: '' }); setOpen(true); }} sx={{ bgcolor: 'text.primary', borderRadius: '10px' }}>
                    Thêm Nhóm Cơ
                </Button>
            </Box>

            <Grid container spacing={3}>
                {groups.map((g: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={g._id}>
                        <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700}>{g.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{g.description || 'Không có mô tả'}</Typography>
                                </Box>
                                <Stack direction="row">
                                    <IconButton onClick={() => { setFormData({ id: g._id, name: g.name, description: g.description || '' }); setOpen(true); }}>
                                        <Icon icon="solar:pen-bold" />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => { if(window.confirm('Xóa?')) deleteGroup(g._id); }}>
                                        <Icon icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>{formData.id ? 'Sửa Nhóm Cơ' : 'Thêm Nhóm Cơ'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Tên nhóm cơ" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <TextField fullWidth label="Mô tả" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ bgcolor: 'text.primary', borderRadius: '10px' }}>Hoàn tất</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
