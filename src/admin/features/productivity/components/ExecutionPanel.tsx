import { Box, Paper, Typography, Stack, Checkbox, IconButton, Button, ButtonGroup, useTheme, LinearProgress, Divider, alpha, Collapse } from "@mui/material";
import { useProductivityStore } from "../stores/useProductivityStore";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExecution, updateWeeklyPlanning } from "../api/productivity.api";
import { motion, AnimatePresence } from "framer-motion";

export const ExecutionPanel = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { activePlan, currentWeekIndex, setActivePlan } = useProductivityStore();
    const [view, setView] = useState<'checklist' | 'calendar'>('checklist');

    // Dữ liệu gốc từ Store
    const weekData = activePlan?.weeklyExecution?.find((w: any) => w.weekIndex === currentWeekIndex);

    // Local state để chỉnh sửa thoải mái trước khi lưu
    const [localGoals, setLocalGoals] = useState<any[]>([]);
    const [expandedGoals, setExpandedGoals] = useState<Record<number, boolean>>({});

    // Đồng bộ local state khi weekData thay đổi (lần đầu load hoặc sau khi lưu)
    useEffect(() => {
        if (weekData) {
            setLocalGoals(weekData.weeklyGoals || []);
        }
    }, [weekData]);

    const mutation = useMutation({
        mutationFn: updateExecution,
        onSuccess: (response: any) => {
            if (response.code === 200) {
                setActivePlan(response.data);
            }
            queryClient.invalidateQueries({ queryKey: ["active-plan"] });
        }
    });

    const planningMutation = useMutation({
        mutationFn: updateWeeklyPlanning,
        onSuccess: (response: any) => {
            if (response.code === 200) {
                setActivePlan(response.data);
                setLocalGoals(response.data.weeklyExecution?.find((w: any) => w.weekIndex === currentWeekIndex)?.weeklyGoals || []);
            }
            queryClient.invalidateQueries({ queryKey: ["active-plan"] });
        }
    });

    const handleApplyUpdate = () => {
        const cleanGoals = localGoals
            .filter(g => g.title?.trim())
            .map(g => ({
                ...g,
                subGoals: (g.subGoals || []).filter((s: any) => s.title?.trim())
            }));

        planningMutation.mutate({
            planId: activePlan._id,
            weekIndex: currentWeekIndex,
            weeklyGoals: cleanGoals
        } as any);
    };

    const handleToggleWeeklyGoal = (goalIdx: number) => {
        const goals = [...localGoals];
        if (goals[goalIdx]) {
            const newCompleted = !goals[goalIdx].isCompleted;
            goals[goalIdx] = { ...goals[goalIdx], isCompleted: newCompleted };
            
            // Tùy chọn: tự động check/uncheck toàn bộ subgoals
            if (goals[goalIdx].subGoals && goals[goalIdx].subGoals.length > 0) {
                goals[goalIdx].subGoals = goals[goalIdx].subGoals.map((s: any) => ({ ...s, isCompleted: newCompleted }));
            }
            setLocalGoals(goals);
        }
    };

    const focusLastEditable = (selector: string) => {
        setTimeout(() => {
            const editables = document.querySelectorAll(selector);
            if (editables.length > 0) {
                const last = editables[editables.length - 1] as HTMLElement;
                last.focus();
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(last);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
            }
        }, 50); // Mượt hơn vì ko đợi server
    };

    const handleUpdateWeeklyGoalText = (idx: number, title: string) => {
        const goals = [...localGoals];
        if (goals[idx]) {
            goals[idx] = { ...goals[idx], title };
            setLocalGoals(goals);
        }
    };

    const handleAddWeeklyGoal = () => {
        setLocalGoals([...localGoals, { title: "", isCompleted: false, subGoals: [] }]);
        focusLastEditable('.weekly-goal-input');
    };

    const handleRemoveWeeklyGoal = (idx: number) => {
        setLocalGoals(localGoals.filter((_, i) => i !== idx));
    };

    const toggleExpand = (idx: number) => {
        setExpandedGoals(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    // --- SUB-GOALS HANDLERS ---
    const handleAddSubGoal = (goalIdx: number) => {
        const goals = [...localGoals];
        const subGoals = [...(goals[goalIdx].subGoals || [])];
        subGoals.push({ title: "", isCompleted: false });
        
        goals[goalIdx] = { ...goals[goalIdx], subGoals, isCompleted: false };
        setLocalGoals(goals);
        
        setExpandedGoals(prev => ({ ...prev, [goalIdx]: true }));
        focusLastEditable(`.subgoal-input-${goalIdx}`);
    };

    const handleToggleSubGoal = (goalIdx: number, subIdx: number) => {
        const goals = [...localGoals];
        const subGoals = [...(goals[goalIdx].subGoals || [])];
        subGoals[subIdx] = { ...subGoals[subIdx], isCompleted: !subGoals[subIdx].isCompleted };
        
        const allChecked = subGoals.length > 0 && subGoals.every(s => s.isCompleted);
        goals[goalIdx] = { ...goals[goalIdx], subGoals, isCompleted: allChecked };
        setLocalGoals(goals);
    };

    const handleRemoveSubGoal = (goalIdx: number, subIdx: number) => {
        const goals = [...localGoals];
        const subGoals = [...(goals[goalIdx].subGoals || [])];
        subGoals.splice(subIdx, 1);
        
        const allChecked = subGoals.length > 0 ? subGoals.every(s => s.isCompleted) : goals[goalIdx].isCompleted;
        goals[goalIdx] = { ...goals[goalIdx], subGoals, isCompleted: allChecked };
        setLocalGoals(goals);
    };

    const handleUpdateSubGoalText = (goalIdx: number, subIdx: number, title: string) => {
        const goals = [...localGoals];
        const subGoals = [...(goals[goalIdx].subGoals || [])];
        subGoals[subIdx] = { ...subGoals[subIdx], title };
        goals[goalIdx] = { ...goals[goalIdx], subGoals };
        setLocalGoals(goals);
    };

    // --- END SUB-GOALS HANDLERS ---

    const handleToggleCheck = (tacticId: string, isCompleted: boolean) => {
        mutation.mutate({
            planId: activePlan._id,
            weekIndex: currentWeekIndex,
            tacticId,
            isCompleted: !isCompleted
        });
    };

    const handleToggleDate = (tacticId: string, date: string) => {
        mutation.mutate({
            planId: activePlan._id,
            weekIndex: currentWeekIndex,
            tacticId,
            completedDate: date
        });
    };

    const getWeekDates = (startIndex: number) => {
        const dates: Date[] = [];
        const start = new Date(activePlan.startDate);
        start.setDate(start.getDate() + (startIndex - 1) * 7);
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const allTactics = (activePlan?.goals || []).reduce((acc: any[], goal: any) => {
        return [...acc, ...(goal.tactics || [])];
    }, []);

    const weekDates = getWeekDates(currentWeekIndex);
    const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

    return (
        <Paper elevation={0} sx={{
            p: 3,
            borderRadius: '16px',
            boxShadow: 'var(--customShadows-card)',
            bgcolor: 'background.paper',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Tuần {currentWeekIndex}</Typography>
                <ButtonGroup size="small" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <Button
                        variant={view === 'checklist' ? 'contained' : 'outlined'}
                        onClick={() => setView('checklist')}
                    >
                        <Icon icon="solar:checklist-bold" />
                    </Button>
                    <Button
                        variant={view === 'calendar' ? 'contained' : 'outlined'}
                        onClick={() => setView('calendar')}
                    >
                        <Icon icon="solar:calendar-bold" />
                    </Button>
                </ButtonGroup>
            </Stack>

            <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Hiệu suất tuần</Typography>
                    <Typography variant="body2" fontWeight={700}>{weekData?.score || 0}%</Typography>
                </Stack>
                <LinearProgress
                    variant="determinate"
                    value={weekData?.score || 0}
                    sx={{ height: 8, borderRadius: 4 }}
                />
            </Box>

            <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                <Stack spacing={2.5} sx={{ mb: 4 }}>
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, display: 'block' }}>
                                🎯 Mục tiêu trọng tâm tuần {currentWeekIndex}
                            </Typography>
                            <Button
                                size="small"
                                startIcon={<Icon icon="solar:diskette-bold" />}
                                onClick={handleApplyUpdate}
                                disabled={planningMutation.isPending}
                                variant="contained"
                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                            >
                                {planningMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </Stack>
                        <Stack spacing={1} sx={{ minHeight: '50px' }}>
                            {localGoals.map((goal: any, idx: number) => {
                                const isExpanded = !!expandedGoals[idx];
                                const hasSubGoals = goal.subGoals && goal.subGoals.length > 0;
                                
                                return (
                                <Paper
                                    key={idx}
                                    elevation={0}
                                    sx={{
                                        p: 1.5, borderRadius: '12px',
                                        bgcolor: goal.isCompleted ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.primary.main, 0.03),
                                        border: '1px solid',
                                        borderColor: goal.isCompleted ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.primary.main, 0.1),
                                        display: 'flex', flexDirection: 'column'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Checkbox
                                            size="small"
                                            checked={goal.isCompleted}
                                            onChange={() => handleToggleWeeklyGoal(idx)}
                                            sx={{ p: 0, color: theme.palette.primary.main }}
                                        />
                                        <Typography variant="body2" fontWeight={700} sx={{ minWidth: 20, color: 'text.disabled', userSelect: 'none' }}>
                                            {idx + 1}.
                                        </Typography>
                                        <Box sx={{ flex: 1, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => toggleExpand(idx)}>
                                            <Typography
                                                className="weekly-goal-input"
                                                contentEditable
                                                suppressContentEditableWarning
                                                onClick={(e) => e.stopPropagation()}
                                                onBlur={(e) => handleUpdateWeeklyGoalText(idx, e.currentTarget.textContent || "")}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleUpdateWeeklyGoalText(idx, e.currentTarget.textContent || "");
                                                        handleAddWeeklyGoal();
                                                    }
                                                }}
                                                variant="body2"
                                                fontWeight={600}
                                                sx={{
                                                    outline: 'none',
                                                    textDecoration: goal.isCompleted ? 'line-through' : 'none',
                                                    opacity: goal.isCompleted ? 0.5 : 1,
                                                    minHeight: '1.2em',
                                                    color: 'text.primary',
                                                    position: 'relative',
                                                    zIndex: 1,
                                                    '&:empty::before': {
                                                        content: '"Nhấn để nhập mục tiêu tuần..."',
                                                        color: 'text.disabled',
                                                        pointerEvents: 'none',
                                                        opacity: 0.7,
                                                        fontWeight: 600,
                                                    }
                                                }}
                                            >
                                                {goal.title}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={0.5}>
                                            {hasSubGoals && (
                                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleExpand(idx); }} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
                                                    <Icon icon={isExpanded ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"} />
                                                </IconButton>
                                            )}
                                            <IconButton size="small" onMouseDown={(e) => { e.preventDefault(); handleAddSubGoal(idx); }} sx={{ opacity: 0.3, '&:hover': { opacity: 1 }, color: 'primary.main' }}>
                                                <Icon icon="solar:align-bottom-bold" /> {/* Icon to add sub-goal */}
                                            </IconButton>
                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRemoveWeeklyGoal(idx); }} sx={{ opacity: 0.3, '&:hover': { opacity: 1 }, color: 'error.main' }}>
                                                <Icon icon="solar:trash-bin-minimalistic-bold" />
                                            </IconButton>
                                        </Stack>
                                    </Box>

                                    {/* Subgoals Section */}
                                    <Collapse in={isExpanded || !hasSubGoals}>
                                        <Box sx={{ mt: hasSubGoals ? 1.5 : 0, pl: 4, pr: 1 }}>
                                            <Stack spacing={1}>
                                                {(goal.subGoals || []).map((sub: any, subIdx: number) => (
                                                    <Box key={subIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Checkbox
                                                            size="small"
                                                            checked={sub.isCompleted}
                                                            onChange={() => handleToggleSubGoal(idx, subIdx)}
                                                            sx={{ p: 0, color: 'text.secondary', transform: 'scale(0.85)' }}
                                                        />
                                                        <Typography variant="caption" fontWeight={700} sx={{ minWidth: 24, color: 'text.disabled', userSelect: 'none' }}>
                                                            {idx + 1}.{subIdx + 1}
                                                        </Typography>
                                                        <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                            <Typography
                                                                className={`subgoal-input-${idx}`}
                                                                contentEditable
                                                                suppressContentEditableWarning
                                                                onBlur={(e) => handleUpdateSubGoalText(idx, subIdx, e.currentTarget.textContent || "")}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        handleUpdateSubGoalText(idx, subIdx, e.currentTarget.textContent || "");
                                                                        handleAddSubGoal(idx);
                                                                    }
                                                                }}
                                                                variant="caption"
                                                                fontWeight={500}
                                                                sx={{
                                                                    outline: 'none',
                                                                    textDecoration: sub.isCompleted ? 'line-through' : 'none',
                                                                    opacity: sub.isCompleted ? 0.5 : 1,
                                                                    minHeight: '1.2em',
                                                                    color: 'text.secondary',
                                                                    display: 'block',
                                                                    '&:empty::before': {
                                                                        content: '"Nhiệm vụ con..."',
                                                                        color: 'text.disabled',
                                                                        pointerEvents: 'none',
                                                                    }
                                                                }}
                                                            >
                                                                {sub.title}
                                                            </Typography>
                                                        </Box>
                                                        <IconButton size="small" onClick={() => handleRemoveSubGoal(idx, subIdx)} sx={{ opacity: 0.2, '&:hover': { opacity: 1 }, padding: 0.5 }}>
                                                            <Icon icon="solar:close-circle-bold" width={16} />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Collapse>
                                </Paper>
                            )})}
                            
                            {localGoals.length === 0 && (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={handleAddWeeklyGoal}
                                    startIcon={<Icon icon="solar:add-circle-bold" />}
                                    sx={{ borderRadius: '12px', borderStyle: 'dashed', py: 1.5 }}
                                >
                                    Thêm mục tiêu tuần mới
                                </Button>
                            )}
                            {localGoals.length > 0 && (
                                <Button
                                    fullWidth
                                    variant="text"
                                    onClick={handleAddWeeklyGoal}
                                    startIcon={<Icon icon="solar:add-circle-bold" />}
                                    sx={{ borderRadius: '12px', py: 1, color: 'text.secondary' }}
                                >
                                    Thêm mục tiêu tuần
                                </Button>
                            )}
                        </Stack>
                    </Box>


                </Stack>
            </Box>

            <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

            <AnimatePresence mode="wait">
                {view === 'checklist' ? (
                    <motion.div
                        key="checklist"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Stack spacing={2}>
                            {allTactics.map((tactic: any) => {
                                const exec = weekData?.executions?.find((e: any) => e.tacticId === tactic._id);
                                const isDone = exec?.isCompleted || (exec?.completedDates?.length >= (tactic.targetPerWeek || 1));

                                return (
                                    <Box
                                        key={tactic._id}
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            bgcolor: isDone ? alpha(theme.palette.success.main, 0.05) : theme.palette.action.hover,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Checkbox
                                            checked={isDone}
                                            onChange={() => handleToggleCheck(tactic._id, exec?.isCompleted || false)}
                                            sx={{ color: theme.palette.success.main }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight={600} sx={{ textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.5 : 1 }}>
                                                {tactic.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Mục tiêu: {tactic.targetPerWeek} lần/tuần
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </motion.div>
                ) : (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr repeat(7, 40px)', gap: 1 }}>
                            <Box />
                            {dayNames.map(day => (
                                <Typography key={day} variant="caption" align="center" fontWeight={700} color="text.secondary">
                                    {day}
                                </Typography>
                            ))}

                            {allTactics.map((tactic: any) => {
                                const exec = weekData?.executions?.find((e: any) => e.tacticId === tactic._id);
                                return (
                                    <Box key={tactic._id} sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr repeat(7, 40px)', gap: 1, alignItems: 'center', py: 1 }}>
                                        <Typography variant="caption" fontWeight={600} noWrap>{tactic.title}</Typography>
                                        {weekDates.map((date, idx) => {
                                            const isDone = exec?.completedDates?.some((d: any) => new Date(d).toDateString() === date.toDateString());
                                            return (
                                                <IconButton
                                                    key={idx}
                                                    size="small"
                                                    onClick={() => handleToggleDate(tactic._id, date.toISOString())}
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        m: 'auto',
                                                        bgcolor: isDone ? theme.palette.primary.main : theme.palette.action.hover,
                                                        color: isDone ? '#fff' : 'transparent',
                                                        '&:hover': { bgcolor: isDone ? theme.palette.primary.dark : theme.palette.action.selected }
                                                    }}
                                                >
                                                    <Icon icon="solar:check-read-bold" width={14} />
                                                </IconButton>
                                            );
                                        })}
                                    </Box>
                                );
                            })}
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            {currentWeekIndex === 13 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: '12px' }}>
                    <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>
                        Tuần Đánh giá (Week 13)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Đây là thời gian để nhìn lại, ăn mừng chiến thắng và chuẩn bị cho chu kỳ 12 tuần tiếp theo. Hãy ghi lại những bài học kinh nghiệm của bạn.
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};
