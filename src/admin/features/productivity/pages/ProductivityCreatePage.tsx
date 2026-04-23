import { Box, TextField, Button, Grid, Typography, Stack, alpha, useTheme, IconButton, ThemeProvider, createTheme, Breadcrumbs, Link, Card } from "@mui/material";
import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan } from "../api/productivity.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { prefixAdmin } from "../../../shared/constants/routes";
import { Title } from "../../../shared/components/ui/Title";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { CollapsibleCard } from "../../../shared/components/ui/CollapsibleCard";

export const ProductivityCreatePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("Bứt phá 12 Tuần");
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [expandedInfo, setExpandedInfo] = useState(true);

    const calculateEndDate = (dateStr: string) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + (12 * 7));
        return date.toISOString().split('T', 1)[0];
    };

    const [endDate, setEndDate] = useState(calculateEndDate(new Date().toISOString().split('T')[0]));

    const [goals, setGoals] = useState([
        {
            id: crypto.randomUUID(),
            title: "",
            tactics: [{ id: crypto.randomUUID(), title: "", targetPerWeek: 7 }]
        }
    ]);

    // Local theme override matching ProductCreatePage precisely
    const localTheme = useMemo(() => createTheme(theme, {
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none !important",
                        backdropFilter: "none !important",
                        backgroundColor: "var(--palette-background-paper) !important",
                        boxShadow: "var(--customShadows-card)",
                        borderRadius: "16px",
                        color: "var(--palette-text-primary)",
                    },
                }
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontSize: "1rem",
                    }
                }
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        fontSize: "1rem",
                    }
                }
            }
        }
    }), [theme]);

    const mutation = useMutation({
        mutationFn: createPlan,
        onSuccess: (res) => {
            if (res.success) {
                queryClient.invalidateQueries({ queryKey: ["active-plan"] });
                toast.success("Kế hoạch đã sẵn sàng! Chúc bạn bứt phá! 🚀");
                navigate(`/${prefixAdmin}/productivity`);
            } else {
                toast.error(res.message || "Có lỗi xảy ra khi tạo kế hoạch!");
            }
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi tạo kế hoạch!");
        }
    });

    const handleAddGoal = () => {
        setGoals([...goals, {
            id: crypto.randomUUID(),
            title: "",
            tactics: [{ id: crypto.randomUUID(), title: "", targetPerWeek: 7 }]
        }]);
    };

    const handleRemoveGoal = (goalId: string) => {
        setGoals(goals.filter(g => g.id !== goalId));
    };

    const handleAddTactic = (goalId: string) => {
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return { ...g, tactics: [...g.tactics, { id: crypto.randomUUID(), title: "", targetPerWeek: 7 }] };
            }
            return g;
        }));
    };

    const handleRemoveTactic = (goalId: string, tacticId: string) => {
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return { ...g, tactics: g.tactics.filter(t => t.id !== tacticId) };
            }
            return g;
        }));
    };

    const handleUpdateGoalTitle = (goalId: string, value: string) => {
        setGoals(goals.map(g => g.id === goalId ? { ...g, title: value } : g));
    };

    const handleUpdateTactic = (goalId: string, tacticId: string, field: string, value: any) => {
        setGoals(goals.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    tactics: g.tactics.map(t => t.id === tacticId ? { ...t, [field]: value } : t)
                };
            }
            return g;
        }));
    };

    const handleSubmit = () => {
        const validGoals = goals.filter(g => g.title).map(g => {
            const goalData: any = {
                title: g.title,
                tactics: g.tactics.filter(t => t.title).map(t => ({
                    title: t.title,
                    targetPerWeek: t.targetPerWeek,
                    _id: (t.id && t.id.length === 24) ? t.id : undefined
                }))
            };
            // Only keep real Mongo IDs (exactly 24 chars)
            if (g.id && g.id.length === 24) goalData._id = g.id;

            return goalData;
        });

        if (validGoals.length === 0) {
            toast.warning("Vui lòng nhập ít nhất một mục tiêu!");
            return;
        }

        const planPayload = {
            title,
            startDate,
            endDate,
            goals: validGoals
        };
        mutation.mutate(planPayload);
    };

    return (
        <ThemeProvider theme={localTheme}>
            <Box sx={{ pb: 10 }}>
                {/* Header Area */}
                <Box sx={{ mb: 5, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'flex-start' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                        <Title title={"Lập kế hoạch Năm 12 Tuần"} />
                        <Breadcrumb
                            items={[
                                { label: "Bảng điều khiển", to: "/" },
                                { label: "Hiệu suất", to: `/${prefixAdmin}/productivity` },
                                { label: "Kế hoạch mới" }
                            ]}
                        />
                    </Box>
                    <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => navigate(`/${prefixAdmin}/productivity`)}
                            sx={{ borderRadius: '8px', px: 2, fontWeight: 600, borderColor: '#919eab52', bgcolor: '#fff' }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                            sx={{
                                borderRadius: '8px',
                                px: 4,
                                fontWeight: 700,
                                bgcolor: '#1C252E',
                                color: '#fff',
                                '&:hover': { bgcolor: '#454F5B' }
                            }}
                        >
                            {mutation.isPending ? "Đang lưu..." : "Lưu kế hoạch"}
                        </Button>
                    </Stack>
                </Box>

                <Stack sx={{ margin: { xs: '0', md: "0px calc(15 * var(--spacing))" }, gap: "calc(3 * var(--spacing))" }}>

                    <CollapsibleCard
                        title={"Thông tin tổng quan"}
                        subheader={"Đặt tên cho năm 12 tuần của bạn"}
                        expanded={expandedInfo}
                        onToggle={() => setExpandedInfo(!expandedInfo)}
                    >
                        <Box sx={{ p: { xs: 2, md: 4 } }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Tên kế hoạch"
                                        fullWidth
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        label="Ngày bắt đầu"
                                        type="date"
                                        fullWidth
                                        value={startDate}
                                        onChange={(e) => {
                                            const newStart = e.target.value;
                                            setStartDate(newStart);
                                            setEndDate(calculateEndDate(newStart));
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        label="Ngày kết thúc (Dự kiến)"
                                        type="date"
                                        fullWidth
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        helperText="Mặc định 12 tuần"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </CollapsibleCard>

                    {goals.map((goal, gIdx) => (
                        <CollapsibleCard
                            key={goal.id}
                            title={`MỤC TIÊU CHIẾN LƯỢC ${gIdx + 1}`}
                            subheader={"Xác định đích đến quan trọng nhất"}
                            expanded={true}
                            onToggle={() => { }}
                        >
                            <Box sx={{ p: { xs: 2, md: 4 }, pt: { xs: 2, md: 3 } }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                    <TextField
                                        placeholder="Ví dụ: Đạt mốc thu nhập thụ động 10tr/tháng"
                                        fullWidth
                                        value={goal.title}
                                        onChange={(e) => handleUpdateGoalTitle(goal.id, e.target.value)}
                                        sx={{
                                            flex: 1,
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: alpha(theme.palette.grey?.[500] || '#919EAB', 0.08)
                                            }
                                        }}
                                    />
                                    {goals.length > 1 && (
                                        <IconButton
                                            size="medium"
                                            color="error"
                                            onClick={() => handleRemoveGoal(goal.id)}
                                            sx={{ bgcolor: alpha(theme.palette.error.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.16) } }}
                                        >
                                            <Icon icon="solar:trash-bin-minimalistic-bold" />
                                        </IconButton>
                                    )}
                                </Stack>

                                <Typography variant="subtitle2" sx={{ mb: 2, color: '#637381', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                    Hành động thực thi hàng tuần
                                </Typography>

                                <Stack spacing={2}>
                                    {goal.tactics.map((tactic, tIdx) => (
                                        <Stack key={tactic.id} direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                                            <Typography variant="body2" sx={{ minWidth: 20, fontWeight: 700, color: 'text.disabled' }}>
                                                {tIdx + 1}.
                                            </Typography>
                                            <TextField
                                                placeholder="Chiến thuật..."
                                                sx={{ flex: 1 }}
                                                value={tactic.title}
                                                onChange={(e) => handleUpdateTactic(goal.id, tactic.id, 'title', e.target.value)}
                                            />
                                            <Box sx={{ width: 110 }}>
                                                <TextField
                                                    label="Lần/tuần"
                                                    type="number"
                                                    fullWidth
                                                    value={tactic.targetPerWeek}
                                                    onChange={(e) => handleUpdateTactic(goal.id, tactic.id, 'targetPerWeek', Number(e.target.value))}
                                                />
                                            </Box>
                                            {goal.tactics.length > 1 && (
                                                <IconButton size="small" onClick={() => handleRemoveTactic(goal.id, tactic.id)}>
                                                    <Icon icon="solar:close-circle-bold" />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    ))}
                                </Stack>

                                <Button
                                    size="small"
                                    startIcon={<Icon icon="solar:add-circle-bold" />}
                                    onClick={() => handleAddTactic(goal.id)}
                                    sx={{ mt: 2.5, fontWeight: 700, color: 'primary.main' }}
                                >
                                    Thêm chiến thuật
                                </Button>
                            </Box>
                        </CollapsibleCard>
                    ))}

                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        startIcon={<Icon icon="solar:magic-stick-3-bold-duotone" width={24} />}
                        onClick={handleAddGoal}
                        sx={{
                            borderRadius: '16px',
                            py: 2.5,
                            border: '2px dashed',
                            borderColor: alpha(theme.palette.text.disabled, 0.2),
                            color: 'text.secondary',
                            fontWeight: 700,
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderColor: theme.palette.primary.main }
                        }}
                    >
                        THÊM MỤC TIÊU CHIẾN LƯỢC MỚI
                    </Button>
                </Stack>
            </Box>
        </ThemeProvider>
    );
};
