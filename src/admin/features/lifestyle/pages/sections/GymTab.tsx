import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Stack,
    TextField,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    Divider,
    alpha
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useWorkouts } from '../../hooks/useLifestyle';
import dayjs from 'dayjs';

export const GymTab = () => {
    const theme = useTheme();
    const { data: res, createWorkout } = useWorkouts();
    const workouts = res?.data || [];
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        date: dayjs().format('YYYY-MM-DD'),
        exercises: [{ name: '', sets: [{ reps: '', weight: '' }, { reps: '', weight: '' }, { reps: '', weight: '' }, { reps: '', weight: '' }] }]
    });

    const handleSave = () => {
        if (!formData.name) return;
        createWorkout({
            ...formData,
            exercises: formData.exercises.map(ex => ({
                ...ex,
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
            exercises: [...formData.exercises, { name: '', sets: [{ reps: '', weight: '' }, { reps: '', weight: '' }, { reps: '', weight: '' }, { reps: '', weight: '' }] }]
        });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Nhật ký luyện tập</Typography>
                <Button
                    variant="contained"
                    startIcon={<Icon icon="solar:gym-bold" />}
                    onClick={() => setOpen(true)}
                    sx={{ bgcolor: 'text.primary', borderRadius: '10px' }}
                >
                    Ghi buổi tập mới
                </Button>
            </Box>

            <Grid container spacing={3}>
                {workouts.map((w: any) => (
                    <Grid key={w._id} sx={{ flexBasis: { xs: '100%', md: '50%' } }}>
                        <Card sx={{ p: 3, borderRadius: '16px', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={700}>{w.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{dayjs(w.date).format('DD/MM/YYYY')}</Typography>
                                </Box>
                                <Icon icon="solar:dumbbell-large-minimalistic-bold" width={24} color={theme.palette.primary.main} />
                            </Stack>
                            <Stack spacing={1.5}>
                                {w.exercises.map((ex: any, idx: number) => (
                                    <Box key={idx} sx={{ p: 1.5, bgcolor: 'background.neutral', borderRadius: '10px' }}>
                                        <Typography variant="body2" fontWeight={600}>{ex.name}</Typography>
                                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                                            {ex.sets.map((s: any, sIdx: number) => (
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
                        <TextField
                            fullWidth
                            label="Tên buổi tập (VD: Ngực & Tay sau)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            type="date"
                            label="Ngày tập"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />

                        <Divider />

                        {formData.exercises.map((ex, exIdx) => (
                            <Box key={exIdx} sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: '12px' }}>
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Tên bài tập"
                                        value={ex.name}
                                        onChange={(e) => {
                                            const newEx = [...formData.exercises];
                                            newEx[exIdx].name = e.target.value;
                                            setFormData({ ...formData, exercises: newEx });
                                        }}
                                    />
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
                                        <TextField
                                            size="small"
                                            label="Khối lượng (kg)"
                                            type="number"
                                            value={set.weight}
                                            onChange={(e) => {
                                                const newEx = [...formData.exercises];
                                                newEx[exIdx].sets[setIdx].weight = e.target.value;
                                                setFormData({ ...formData, exercises: newEx });
                                            }}
                                        />
                                        <TextField
                                            size="small"
                                            label="Số reps"
                                            type="number"
                                            value={set.reps}
                                            onChange={(e) => {
                                                const newEx = [...formData.exercises];
                                                newEx[exIdx].sets[setIdx].reps = e.target.value;
                                                setFormData({ ...formData, exercises: newEx });
                                            }}
                                        />
                                        <Button
                                            color="error"
                                            sx={{ minWidth: 40 }}
                                            onClick={() => {
                                                const newEx = [...formData.exercises];
                                                newEx[exIdx].sets = newEx[exIdx].sets.filter((_, i) => i !== setIdx);
                                                setFormData({ ...formData, exercises: newEx });
                                            }}
                                        >
                                            <Icon icon="solar:close-circle-bold" width={20} />
                                        </Button>
                                    </Stack>
                                ))}
                                <Button
                                    size="small"
                                    startIcon={<Icon icon="solar:add-circle-bold" />}
                                    onClick={() => {
                                        const newEx = [...formData.exercises];
                                        newEx[exIdx].sets.push({ reps: '', weight: '' });
                                        setFormData({ ...formData, exercises: newEx });
                                    }}
                                    sx={{ mt: 1 }}
                                >
                                    Thêm Set
                                </Button>
                            </Box>
                        ))}
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
