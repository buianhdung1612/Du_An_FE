import { useState } from 'react';
import { Box, Typography, Button, Card, Stack, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, Divider, alpha, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Icon } from '@iconify/react';
import { useWorkouts, useExercises, useMuscleGroups } from '../hooks/useWorkout';
import dayjs from 'dayjs';

export const WorkoutLogPage = () => {
    const theme = useTheme();
    const { data: res, createWorkout, deleteWorkout } = useWorkouts();
    const { data: exRes } = useExercises();
    const { data: mgRes } = useMuscleGroups();
    
    const workouts = res?.data || [];
    const allExercises = exRes?.data || [];
    const muscleGroups = mgRes?.data || [];

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        date: dayjs().format('YYYY-MM-DD'),
        exercises: [{ exerciseId: '', tempMuscleGroup: '', sets: [{ weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }] }]
    });

    const handleSave = () => {
        if (!formData.title) return;
        createWorkout({
            title: formData.title,
            date: formData.date,
            exercises: formData.exercises
                .filter(ex => ex.exerciseId)
                .map(ex => ({
                    exercise: ex.exerciseId,
                    sets: ex.sets
                        .filter(s => s.reps !== '' || s.weight !== '')
                        .map(s => ({ reps: Number(s.reps) || 0, weight: Number(s.weight) || 0 }))
                }))
        });
        setOpen(false);
    };

    const addExercise = () => {
        setFormData({
            ...formData,
            exercises: [...formData.exercises, { exerciseId: '', tempMuscleGroup: '', sets: [{ weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }] }]
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>Thống kê Tập luyện</Typography>
                <Button variant="contained" startIcon={<Icon icon="solar:gym-bold" />} onClick={() => {
                    setFormData({
                        title: '',
                        date: dayjs().format('YYYY-MM-DD'),
                        exercises: [{ exerciseId: '', tempMuscleGroup: '', sets: [{ weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }, { weight: '', reps: '' }] }]
                    });
                    setOpen(true);
                }} sx={{ bgcolor: 'text.primary', borderRadius: '10px' }}>
                    Ghi buổi tập mới
                </Button>
            </Box>

            <Grid container spacing={3}>
                {workouts.map((w: any) => (
                    <Grid key={w._id} size={{ xs: 12, md: 6 }}>
                        <Card sx={{ p: 3, borderRadius: '16px', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700}>{w.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">{dayjs(w.date).format('DD/MM/YYYY')}</Typography>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Icon icon="solar:dumbbell-large-minimalistic-bold" width={24} color={theme.palette.primary.main} />
                                    <IconButton size="small" color="error" onClick={() => { if(window.confirm('Xóa buổi tập?')) deleteWorkout(w._id); }}>
                                        <Icon icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                            <Stack spacing={1.5}>
                                {w.exercises.map((exItem: any, idx: number) => (
                                    <Box key={idx} sx={{ p: 1.5, bgcolor: 'background.neutral', borderRadius: '10px' }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" fontWeight={600}>{exItem.exercise?.name || 'Bài tập đã xóa'}</Typography>
                                            <Typography variant="caption" color="primary">{exItem.exercise?.muscleGroup?.name}</Typography>
                                        </Stack>
                                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                                            {exItem.sets.map((s: any, sIdx: number) => (
                                                <Typography key={sIdx} variant="caption" color="text.secondary">
                                                    Set {sIdx + 1}: {s.weight}kg {s.reps}rep
                                                </Typography>
                                            ))}
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>Ghi chú buổi tập</DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        <TextField fullWidth label="Tên buổi tập (VD: Ngực & Tay sau)" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        <TextField fullWidth type="date" label="Ngày tập" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} InputLabelProps={{ shrink: true }} />

                        <Divider />

                        {formData.exercises.map((ex, exIdx) => {
                            const filteredEx = allExercises.filter((e: any) => e.muscleGroup?._id === ex.tempMuscleGroup);
                            return (
                            <Box key={exIdx} sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: '12px' }}>
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Nhóm cơ</InputLabel>
                                        <Select value={ex.tempMuscleGroup} label="Nhóm cơ" onChange={(e) => {
                                            const newEx = [...formData.exercises];
                                            newEx[exIdx].tempMuscleGroup = e.target.value;
                                            newEx[exIdx].exerciseId = ''; // reset exercise when changing muscle group
                                            setFormData({ ...formData, exercises: newEx });
                                        }}>
                                            {muscleGroups.map((g: any) => <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth size="small" disabled={!ex.tempMuscleGroup}>
                                        <InputLabel>Bài tập</InputLabel>
                                        <Select value={ex.exerciseId} label="Bài tập" onChange={(e) => {
                                            const newEx = [...formData.exercises];
                                            newEx[exIdx].exerciseId = e.target.value;
                                            setFormData({ ...formData, exercises: newEx });
                                        }}>
                                            {filteredEx.map((e: any) => <MenuItem key={e._id} value={e._id}>{e.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <Button color="error" sx={{ minWidth: 40 }} onClick={() => {
                                        const newEx = formData.exercises.filter((_, i) => i !== exIdx);
                                        setFormData({ ...formData, exercises: newEx });
                                    }}>
                                        <Icon icon="solar:trash-bin-trash-bold" width={24} />
                                    </Button>
                                </Stack>
                                {ex.sets.map((set, setIdx) => (
                                    <Stack key={setIdx} direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ minWidth: 45, fontWeight: 600 }}>Set {setIdx + 1}</Typography>
                                        <TextField size="small" label="Khối lượng (kg)" type="number" value={set.weight} onChange={(e) => {
                                            const newEx = [...formData.exercises];
                                            newEx[exIdx].sets[setIdx].weight = e.target.value;
                                            setFormData({ ...formData, exercises: newEx });
                                        }} />
                                        <TextField size="small" label="Số reps" type="number" value={set.reps} onChange={(e) => {
                                            const newEx = [...formData.exercises];
                                            newEx[exIdx].sets[setIdx].reps = e.target.value;
                                            setFormData({ ...formData, exercises: newEx });
                                        }} />
                                        <Button color="error" sx={{ minWidth: 40 }} onClick={() => {
                                            const newEx = [...formData.exercises];
                                            newEx[exIdx].sets = newEx[exIdx].sets.filter((_, i) => i !== setIdx);
                                            setFormData({ ...formData, exercises: newEx });
                                        }}>
                                            <Icon icon="solar:close-circle-bold" width={20} />
                                        </Button>
                                    </Stack>
                                ))}
                                <Button size="small" startIcon={<Icon icon="solar:add-circle-bold" />} onClick={() => {
                                    const newEx = [...formData.exercises];
                                    newEx[exIdx].sets.push({ reps: '', weight: '' });
                                    setFormData({ ...formData, exercises: newEx });
                                }} sx={{ mt: 1 }}>Thêm Set</Button>
                            </Box>
                        )})}
                        <Button startIcon={<Icon icon="solar:add-circle-bold" />} onClick={addExercise}>Thêm bài tập</Button>
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
