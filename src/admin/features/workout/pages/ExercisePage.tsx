import { useState } from 'react';
import { Box, Typography, Button, Card, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Icon } from '@iconify/react';
import { useExercises, useMuscleGroups } from '../hooks/useWorkout';

export const ExercisePage = () => {
    const { data: res, createExercise, editExercise, deleteExercise } = useExercises();
    const { data: groupRes } = useMuscleGroups();
    const exercises = res?.data || [];
    const groups = groupRes?.data || [];
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', muscleGroup: '', youtubeLink: '', notes: '' });

    const handleSave = () => {
        if (!formData.name || !formData.muscleGroup) return;
        if (formData.id) {
            editExercise({ id: formData.id, data: { name: formData.name, muscleGroup: formData.muscleGroup, youtubeLink: formData.youtubeLink, notes: formData.notes } });
        } else {
            createExercise({ name: formData.name, muscleGroup: formData.muscleGroup, youtubeLink: formData.youtubeLink, notes: formData.notes });
        }
        setOpen(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Thư viện Bài tập</Typography>
                <Button variant="contained" startIcon={<Icon icon="solar:add-circle-bold" />} onClick={() => { setFormData({ id: '', name: '', muscleGroup: '', youtubeLink: '', notes: '' }); setOpen(true); }} sx={{ bgcolor: 'text.primary', borderRadius: '10px' }}>
                    Thêm Bài Tập
                </Button>
            </Box>

            <Grid container spacing={3}>
                {exercises.map((ex: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ex._id}>
                        <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700}>{ex.name}</Typography>
                                    <Typography variant="caption" sx={{ display: 'inline-block', bgcolor: 'primary.lighter', color: 'primary.main', px: 1, py: 0.5, borderRadius: 1, mt: 0.5 }}>
                                        {ex.muscleGroup?.name}
                                    </Typography>
                                </Box>
                                <Stack direction="row">
                                    <IconButton onClick={() => { setFormData({ id: ex._id, name: ex.name, muscleGroup: ex.muscleGroup?._id, youtubeLink: ex.youtubeLink || '', notes: ex.notes || '' }); setOpen(true); }}>
                                        <Icon icon="solar:pen-bold" />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => { if(window.confirm('Xóa?')) deleteExercise(ex._id); }}>
                                        <Icon icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                            {ex.youtubeLink && (
                                <Button size="small" startIcon={<Icon icon="logos:youtube-icon" />} sx={{ mt: 2 }} href={ex.youtubeLink} target="_blank">
                                    Xem Video
                                </Button>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>{formData.id ? 'Sửa Bài Tập' : 'Thêm Bài Tập'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Tên bài tập" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <FormControl fullWidth>
                            <InputLabel>Nhóm cơ</InputLabel>
                            <Select value={formData.muscleGroup} label="Nhóm cơ" onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}>
                                {groups.map((g: any) => <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField fullWidth label="Link Youtube" value={formData.youtubeLink} onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })} />
                        <TextField fullWidth label="Ghi chú" multiline rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
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
