import { Box, TextField, Button, Grid, Typography, Stack, alpha, useTheme, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlan } from "../api/productivity.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { prefixAdmin } from "../../../shared/constants/routes";
import { Title } from "../../../shared/components/ui/Title";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { CollapsibleCard } from "../../../shared/components/ui/CollapsibleCard";
import { useForm, useFieldArray } from "react-hook-form";

const TacticList = ({ control, register, gIdx }: any) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `goals.${gIdx}.tactics` as const
    });

    return (
        <>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#637381', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Hành động thực thi hàng tuần
            </Typography>

            <Stack spacing={2}>
                {fields.map((tactic, tIdx) => (
                    <Stack key={tactic.id} direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                        <Typography variant="body2" sx={{ minWidth: 20, fontWeight: 700, color: 'text.disabled' }}>
                            {tIdx + 1}.
                        </Typography>
                        <TextField
                            placeholder="Chiến thuật..."
                            sx={{ flex: 1 }}
                            {...register(`goals.${gIdx}.tactics.${tIdx}.title` as const)}
                        />
                        <Box sx={{ width: 110 }}>
                            <TextField
                                label="Lần/tuần"
                                type="number"
                                fullWidth
                                {...register(`goals.${gIdx}.tactics.${tIdx}.targetPerWeek` as const, { valueAsNumber: true })}
                            />
                        </Box>
                        {fields.length > 1 && (
                            <IconButton size="small" onClick={() => remove(tIdx)}>
                                <Icon icon="solar:close-circle-bold" />
                            </IconButton>
                        )}
                    </Stack>
                ))}
            </Stack>

            <Button
                size="small"
                startIcon={<Icon icon="solar:add-circle-bold" />}
                onClick={() => append({ title: "", targetPerWeek: 7, _id: undefined })}
                sx={{ mt: 2.5, fontWeight: 700, color: 'primary.main' }}
            >
                Thêm chiến thuật
            </Button>
        </>
    );
};

export const ProductivityCreatePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [expandedInfo, setExpandedInfo] = useState(true);

    const calculateEndDate = (dateStr: string) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + (12 * 7));
        return date.toISOString().split('T', 1)[0];
    };

    const { register, control, handleSubmit, setValue } = useForm({
        defaultValues: {
            title: "Bứt phá 12 Tuần",
            startDate: new Date().toISOString().split('T')[0],
            endDate: calculateEndDate(new Date().toISOString().split('T')[0]),
            goals: [
                {
                    title: "",
                    tactics: [{ title: "", targetPerWeek: 7, _id: undefined }]
                }
            ] as any[]
        }
    });

    const { fields: goalFields, append: appendGoal, remove: removeGoal } = useFieldArray({
        control,
        name: "goals"
    });

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

    const onFormSubmit = (data: any) => {
        const validGoals = data.goals.filter((g: any) => g.title).map((g: any) => {
            const goalData: any = {
                title: g.title,
                tactics: g.tactics.filter((t: any) => t.title).map((t: any) => ({
                    title: t.title,
                    targetPerWeek: t.targetPerWeek,
                    _id: (t._id && t._id.length === 24) ? t._id : undefined
                }))
            };
            if (g._id && g._id.length === 24) goalData._id = g._id;
            return goalData;
        });

        if (validGoals.length === 0) {
            toast.warning("Vui lòng nhập ít nhất một mục tiêu!");
            return;
        }

        const planPayload = {
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            goals: validGoals
        };
        mutation.mutate(planPayload);
    };

    return (
        <ThemeProvider theme={localTheme}>
            <Box sx={{ pb: 10 }}>
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
                            onClick={handleSubmit(onFormSubmit)}
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
                                        {...register("title")}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        label="Ngày bắt đầu"
                                        type="date"
                                        fullWidth
                                        {...register("startDate", {
                                            onChange: (e) => {
                                                setValue("endDate", calculateEndDate(e.target.value));
                                            }
                                        })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        label="Ngày kết thúc (Dự kiến)"
                                        type="date"
                                        fullWidth
                                        {...register("endDate")}
                                        InputLabelProps={{ shrink: true }}
                                        helperText="Mặc định 12 tuần"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </CollapsibleCard>

                    {goalFields.map((goal, gIdx) => (
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
                                        {...register(`goals.${gIdx}.title` as const)}
                                        sx={{
                                            flex: 1,
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: alpha(theme.palette.grey?.[500] || '#919EAB', 0.08)
                                            }
                                        }}
                                    />
                                    {goalFields.length > 1 && (
                                        <IconButton
                                            size="medium"
                                            color="error"
                                            onClick={() => removeGoal(gIdx)}
                                            sx={{ bgcolor: alpha(theme.palette.error.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.16) } }}
                                        >
                                            <Icon icon="solar:trash-bin-minimalistic-bold" />
                                        </IconButton>
                                    )}
                                </Stack>

                                <TacticList control={control} register={register} gIdx={gIdx} />

                            </Box>
                        </CollapsibleCard>
                    ))}

                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        startIcon={<Icon icon="solar:magic-stick-3-bold-duotone" width={24} />}
                        onClick={() => appendGoal({ title: "", tactics: [{ title: "", targetPerWeek: 7, _id: undefined }] })}
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
