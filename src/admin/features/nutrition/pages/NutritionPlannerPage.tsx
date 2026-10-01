import React, { useState, useEffect } from "react";
import {
    Grid, Box, Typography, Stack, Button, IconButton, TextField,
    InputAdornment, LinearProgress, Divider, Avatar, Card, CardContent,
    Tooltip, CircularProgress, Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNutrition, useSaveNutrition, useAnalyzeFood } from "../hooks/useNutrition";
import DashboardCard from "../../../shared/components/dashboard/DashboardCard";
import { Title } from "../../../shared/components/ui/Title";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import Chart from 'react-apexcharts';
import { toast } from "react-toastify";

const MEAL_TYPES = ['Sáng', 'Trưa', 'Chiều', 'Tối', 'Phụ'];

export const NutritionPlannerPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { data: nutritionRes, isLoading } = useNutrition(selectedDate);
    const saveMutation = useSaveNutrition();
    const analyzeMutation = useAnalyzeFood();
    const [aiInput, setAiInput] = useState("");
    const [planData, setPlanData] = useState<any>(null);

    useEffect(() => {
        if (nutritionRes?.data?.length > 0) {
            setPlanData(nutritionRes.data[0]);
        } else {
            setPlanData({
                date: selectedDate,
                meals: MEAL_TYPES.map(type => ({ type, items: [] })),
                waterIntake: 0,
                totalCalories: 0,
                notes: ""
            });
        }
    }, [nutritionRes, selectedDate]);

    const handleAddFoodAI = async () => {
        if (!aiInput.trim()) return;
        try {
            const res = await analyzeMutation.mutateAsync(aiInput);
            if (res.success) {
                const aiData = JSON.parse(res.data);
                // For simplicity, add to 'Sáng' if not specified or just pick one
                const newPlan = { ...planData };
                const morningMeal = newPlan.meals.find((m: any) => m.type === 'Sáng');
                
                if (aiData.items) {
                    morningMeal.items.push(...aiData.items);
                } else {
                    morningMeal.items.push(aiData);
                }
                
                // Recalculate total calories
                newPlan.totalCalories = newPlan.meals.reduce((total: number, meal: any) => 
                    total + meal.items.reduce((mTotal: number, item: any) => mTotal + (item.calories || 0), 0)
                , 0);

                setPlanData(newPlan);
                setAiInput("");
                toast.success("Đã thêm thực phẩm vào kế hoạch!");
            }
        } catch (error) {
            console.error("AI Analysis Error:", error);
            toast.error("Không thể phân tích thực phẩm!");
        }
    };

    const handleSave = () => {
        saveMutation.mutate(planData);
    };

    const handleWaterChange = (amount: number) => {
        setPlanData({ ...planData, waterIntake: Math.max(0, planData.waterIntake + amount) });
    };

    if (isLoading || !planData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    const totalMacros = planData.meals.reduce((acc: any, meal: any) => {
        meal.items.forEach((item: any) => {
            acc.protein += (item.protein || 0);
            acc.carbs += (item.carbs || 0);
            acc.fat += (item.fat || 0);
        });
        return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    const macroChartOptions: any = {
        chart: { type: 'donut' },
        labels: ['Protein', 'Carbs', 'Fat'],
        colors: ['#00A76F', '#FFAB00', '#FF5630'],
        legend: { position: 'bottom' },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Calories',
                            formatter: () => planData.totalCalories
                        }
                    }
                }
            }
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Title title="Kế hoạch Dinh dưỡng" />
                    <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Dinh dưỡng" }]} />
                </Box>
                <Stack direction="row" spacing={2}>
                    <TextField
                        type="date"
                        size="small"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        sx={{ bgcolor: 'var(--palette-background-paper)', borderRadius: 1 }}
                    />
                    <Button variant="contained" onClick={handleSave} loading={saveMutation.isPending}>
                        Lưu kế hoạch
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {/* AI Assistant Card */}
                <Grid item xs={12}>
                    <DashboardCard sx={{ p: 3, background: 'linear-gradient(135deg, #007867 0%, #004B50 100%)', color: 'white' }}>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon icon="solar:magic-stick-3-bold-duotone" width={24} />
                            Trợ lý Dinh dưỡng AI
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                            Nhập bất kỳ món ăn nào (vd: "1 lát bánh mì", "1 bát phở bò") để AI tự động tính toán dinh dưỡng và thêm vào kế hoạch.
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Vd: 1 lát bánh mì, 2 quả trứng ốp la..."
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddFoodAI()}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleAddFoodAI} disabled={analyzeMutation.isPending} sx={{ color: 'white' }}>
                                            {analyzeMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <Icon icon="solar:plain-2-bold-duotone" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { 
                                    color: 'white', 
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                                }
                            }}
                        />
                    </DashboardCard>
                </Grid>

                {/* Summary Stats */}
                <Grid item xs={12} md={4}>
                    <DashboardCard sx={{ p: 3, height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>Tổng quan Dinh dưỡng</Typography>
                        <Chart 
                            options={macroChartOptions} 
                            series={[totalMacros.protein, totalMacros.carbs, totalMacros.fat]} 
                            type="donut" 
                            height={280} 
                        />
                        <Stack spacing={2} sx={{ mt: 3 }}>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Protein</Typography>
                                    <Typography variant="subtitle2">{totalMacros.protein}g</Typography>
                                </Stack>
                                <LinearProgress variant="determinate" value={Math.min(100, (totalMacros.protein / 150) * 100)} color="success" />
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Carbs</Typography>
                                    <Typography variant="subtitle2">{totalMacros.carbs}g</Typography>
                                </Stack>
                                <LinearProgress variant="determinate" value={Math.min(100, (totalMacros.carbs / 250) * 100)} color="warning" />
                            </Box>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Fat</Typography>
                                    <Typography variant="subtitle2">{totalMacros.fat}g</Typography>
                                </Stack>
                                <LinearProgress variant="determinate" value={Math.min(100, (totalMacros.fat / 70) * 100)} color="error" />
                            </Box>
                        </Stack>
                    </DashboardCard>
                </Grid>

                {/* Meal Breakdown */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        {planData.meals.map((meal: any, idx: number) => (
                            <DashboardCard key={idx} sx={{ p: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar sx={{ bgcolor: 'rgba(0,167,111,0.1)', color: '#00A76F', width: 32, height: 32 }}>
                                            <Icon icon={
                                                meal.type === 'Sáng' ? "solar:sun-2-bold-duotone" :
                                                meal.type === 'Trưa' ? "solar:sun-fog-bold-duotone" :
                                                meal.type === 'Chiều' ? "solar:sunset-bold-duotone" :
                                                meal.type === 'Tối' ? "solar:moon-bold-duotone" : "solar:tea-cup-bold-duotone"
                                            } />
                                        </Avatar>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{meal.type}</Typography>
                                    </Stack>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                        {meal.items.reduce((sum: number, item: any) => sum + (item.calories || 0), 0)} kcal
                                    </Typography>
                                </Stack>
                                <Stack spacing={1}>
                                    {meal.items.map((item: any, i: number) => (
                                        <Box key={i} sx={{ 
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            p: 1.5, borderRadius: 1, border: '1px dashed var(--palette-divider)',
                                            '&:hover': { bgcolor: 'var(--palette-action-hover)' }
                                        }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                                                </Typography>
                                            </Box>
                                            <Typography variant="subtitle2">{item.calories} kcal</Typography>
                                        </Box>
                                    ))}
                                    {meal.items.length === 0 && (
                                        <Typography variant="caption" sx={{ color: 'text.disabled', textAlign: 'center', py: 1 }}>
                                            Chưa có món ăn nào
                                        </Typography>
                                    )}
                                </Stack>
                            </DashboardCard>
                        ))}
                    </Stack>
                </Grid>

                {/* Water Intake */}
                <Grid item xs={12} md={6}>
                    <DashboardCard sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant="determinate" value={Math.min(100, (planData.waterIntake / 2000) * 100)} size={80} thickness={4} color="info" />
                            <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon icon="solar:water-bold-duotone" color="#00B8D9" width={32} />
                            </Box>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Lượng nước</Typography>
                            <Typography variant="h4">{planData.waterIntake} <Typography component="span" variant="body1">ml</Typography></Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Mục tiêu: 2000ml</Typography>
                        </Box>
                        <Stack spacing={1}>
                            <Button size="small" variant="outlined" onClick={() => handleWaterChange(250)} startIcon={<Icon icon="solar:add-circle-bold" />}>250ml</Button>
                            <Button size="small" variant="outlined" onClick={() => handleWaterChange(500)} startIcon={<Icon icon="solar:add-circle-bold" />}>500ml</Button>
                        </Stack>
                    </DashboardCard>
                </Grid>
            </Grid>
        </Box>
    );
};
