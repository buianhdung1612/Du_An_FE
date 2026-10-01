import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Stack,
    TextField,
    Grid,
    alpha,
    useTheme,
    LinearProgress,
    MenuItem
} from '@mui/material';
import { useNutrition } from '../../hooks/useLifestyle';
import dayjs from 'dayjs';

const MEAL_TYPES = ['Sáng', 'Trưa', 'Chiều', 'Tối', 'Phụ'];

export const NutritionTab = () => {
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const { data: res, saveNutrition } = useNutrition(selectedDate);
    const nutritionData = res?.data?.[0] || { meals: [], waterIntake: 0, totalCalories: 0 };

    const [newItem, setNewItem] = useState({ mealType: 'Sáng', name: '', calories: '' });

    const handleAddItem = () => {
        if (!newItem.name || !newItem.calories) return;

        const updatedMeals = [...nutritionData.meals];
        let meal = updatedMeals.find((m: any) => m.type === newItem.mealType);

        if (!meal) {
            meal = { type: newItem.mealType, items: [] };
            updatedMeals.push(meal);
        }

        meal.items.push({ name: newItem.name, calories: Number(newItem.calories) });

        const totalCalories = updatedMeals.reduce((sum: number, m: any) =>
            sum + m.items.reduce((mSum: number, item: any) => mSum + item.calories, 0), 0
        );

        saveNutrition({
            date: selectedDate,
            meals: updatedMeals,
            totalCalories
        });

        setNewItem({ ...newItem, name: '', calories: '' });
    };

    const calorieGoal = 2000;
    const progress = Math.min((nutritionData.totalCalories / calorieGoal) * 100, 100);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Nhật ký ăn uống</Typography>
                <TextField
                    type="date"
                    size="small"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    sx={{ width: 150 }}
                />
            </Box>

            <Grid container spacing={3}>
                <Grid sx={{ flexBasis: { xs: '100%', md: '33.33%' } }}>
                    <Card sx={{ p: 3, borderRadius: '16px' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Tổng calo tiêu thụ</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="h3" fontWeight={800}>{nutritionData.totalCalories}</Typography>
                            <Typography variant="body2" color="text.secondary">/ {calorieGoal} kcal</Typography>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ height: 10, borderRadius: 5, bgcolor: alpha(theme.palette.success.main, 0.1), '& .MuiLinearProgress-bar': { bgcolor: theme.palette.success.main } }}
                            />
                        </Box>
                    </Card>
                </Grid>

                <Grid sx={{ flexBasis: { xs: '100%', md: '66.66%' } }}>
                    <Card sx={{ p: 3, borderRadius: '16px' }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Thêm món ăn</Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                select
                                label="Bữa"
                                size="small"
                                value={newItem.mealType}
                                onChange={(e) => setNewItem({ ...newItem, mealType: e.target.value })}
                                sx={{ minWidth: 120 }}
                            >
                                {MEAL_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                            </TextField>
                            <TextField
                                fullWidth
                                label="Tên món"
                                size="small"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            />
                            <TextField
                                label="Calo"
                                size="small"
                                type="number"
                                value={newItem.calories}
                                onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
                                sx={{ width: 100 }}
                            />
                            <Button variant="contained" onClick={handleAddItem} sx={{ bgcolor: 'text.primary', borderRadius: '8px' }}>
                                Thêm
                            </Button>
                        </Stack>
                    </Card>
                </Grid>

                <Grid sx={{ flexBasis: '100%' }}>
                    <Stack spacing={2}>
                        {MEAL_TYPES.map(type => {
                            const meal = nutritionData.meals.find((m: any) => m.type === type);
                            if (!meal) return null;
                            return (
                                <Card key={type} sx={{ p: 2, borderRadius: '12px', border: '1px solid rgba(145, 158, 171, 0.12)' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={800} color="primary.main">{type}</Typography>
                                        <Typography variant="caption" fontWeight={700}>
                                            {meal.items.reduce((sum: number, i: any) => sum + i.calories, 0)} kcal
                                        </Typography>
                                    </Box>
                                    <Stack spacing={0.5}>
                                        {meal.items.map((item: any, idx: number) => (
                                            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2">{item.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">{item.calories} kcal</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Card>
                            );
                        })}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
