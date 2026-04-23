import { Box, Paper, Typography, Stack, useTheme, IconButton, Button, alpha, Tooltip, Grid, LinearProgress } from "@mui/material";
import { Icon } from "@iconify/react";
import { useProductivityStore } from "../stores/useProductivityStore";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTimeBlocks } from "../api/productivity.api";
import { toast } from "react-toastify";

// --- Sub-components for DND ---

const DraggableTask = ({ task, id }: { task: any, id: string }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
    const theme = useTheme();

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        opacity: isDragging ? 0.5 : 1
    } : undefined;

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            sx={{
                p: 1.5, mb: 1.5, borderRadius: '12px',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
                boxShadow: 'var(--customShadows-z1)',
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
                display: 'flex', alignItems: 'center', gap: 1.5,
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.02)
                }
            }}
        >
            <Box sx={{ color: 'primary.main', display: 'flex' }}>
                <Icon icon="solar:reorder-bold" width={18} />
            </Box>
            <Typography variant="body2" fontWeight={700} noWrap>{task.title}</Typography>
        </Box>
    );
};

const TimeSlot = ({ hour, tasks }: { hour: number, tasks: any[] }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `slot-${hour}` });
    const theme = useTheme();

    return (
        <Box
            ref={setNodeRef}
            sx={{
                height: 80, borderBottom: '1px dashed', borderColor: alpha(theme.palette.divider, 0.2),
                position: 'relative',
                bgcolor: isOver ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                transition: 'background-color 0.2s'
            }}
        >
            <Stack direction="row" sx={{ height: '100%', position: 'relative' }}>
                <Box sx={{ width: 60, pr: 2, textAlign: 'right', pt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ fontSize: '0.65rem' }}>
                        {hour}:00
                    </Typography>
                </Box>
                <Box sx={{ flex: 1, p: 0.5, display: 'flex', gap: 1 }}>
                    <AnimatePresence>
                        {tasks.map((task, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ flex: 1 }}
                            >
                                <Box 
                                    sx={{ 
                                        height: '100%', 
                                        borderRadius: '12px',
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                                        p: 1.5,
                                        backdropFilter: 'blur(8px)',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                        boxShadow: 'inset 0 0 10px rgba(255,255,255,0.5)'
                                    }}
                                >
                                    <Typography variant="caption" fontWeight={800} color="primary.dark" noWrap>
                                        {task.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.7 }} noWrap>
                                        Khung giờ cố định
                                    </Typography>
                                </Box>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Box>
            </Stack>
        </Box>
    );
};

// --- Main component ---

export const DailyScheduleBoard = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { activePlan } = useProductivityStore();
    const [selectedDay, setSelectedDay] = useState(dayjs().day() === 0 ? 6 : dayjs().day() - 1);
    const [scheduledTasks, setScheduledTasks] = useState<any[]>([]);

    useEffect(() => {
        if (activePlan?.timeBlocks) {
            setScheduledTasks(activePlan.timeBlocks);
        }
    }, [activePlan]);

    const mutation = useMutation({
        mutationFn: updateTimeBlocks,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["active-plan"] });
            toast.success("Đã lưu khung giờ thành công!");
        }
    });

    const handleSave = () => {
        mutation.mutate({
            planId: activePlan._id,
            timeBlocks: scheduledTasks
        });
    };

    const handleClear = () => {
        if(window.confirm("Xóa toàn bộ lịch trình của ngày này?")) {
            setScheduledTasks(scheduledTasks.filter(t => t.dayIndex !== selectedDay));
        }
    };

    const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 10 PM

    const allTactics = useMemo(() => {
        return (activePlan?.goals || []).reduce((acc: any[], goal: any) => {
            return [...acc, ...(goal.tactics || [])];
        }, []);
    }, [activePlan]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && over.id.startsWith('slot-')) {
            const hour = parseInt(over.id.split('-')[1]);
            const task = allTactics.find(t => t._id === active.id);
            if (task) {
                // Check if already in this slot
                const exists = scheduledTasks.find(t => t.hour === hour && t.dayIndex === selectedDay && t.tacticId === task._id);
                if (!exists) {
                    setScheduledTasks([...scheduledTasks, { 
                        title: task.title,
                        hour, 
                        dayIndex: selectedDay,
                        tacticId: task._id,
                        type: 'fixed',
                        startTime: `${hour}:00`,
                        endTime: `${hour + 1}:00`
                    }]);
                }
            }
        }
    };

    const dayNames = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Grid container spacing={4}>
                {/* Left: Time Grid (Glassmorphism) */}
                <Grid item xs={12} md={8.5}>
                    <Paper elevation={0} sx={{ 
                        p: 0, borderRadius: '24px', 
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        boxShadow: 'var(--customShadows-card)',
                        height: '750px',
                        display: 'flex', flexDirection: 'column',
                        backdropFilter: 'blur(20px)',
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        position: 'relative'
                    }}>
                        {/* Day Selector Header */}
                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.neutral, 0.5), borderBottom: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {dayNames.map((name, i) => (
                                    <Button
                                        key={i}
                                        size="small"
                                        variant={selectedDay === i ? 'contained' : 'text'}
                                        onClick={() => setSelectedDay(i)}
                                        sx={{ borderRadius: '12px', minWidth: 90, py: 1 }}
                                    >
                                        {name}
                                    </Button>
                                ))}
                                <Box sx={{ flex: 1 }} />
                                <Stack direction="row" spacing={1}>
                                    <IconButton size="small" onClick={handleClear} color="error" sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                                        <Icon icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        onClick={handleSave}
                                        disabled={mutation.isPending}
                                        startIcon={<Icon icon="solar:diskette-bold" />}
                                        sx={{ borderRadius: '12px', px: 3 }}
                                    >
                                        {mutation.isPending ? 'Đang lưu...' : 'Lưu lịch'}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Scrolling Timeline */}
                        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, className: 'custom-scrollbar' }}>
                            {hours.map(h => (
                                <TimeSlot 
                                    key={h} 
                                    hour={h} 
                                    tasks={scheduledTasks.filter(t => t.hour === h && t.dayIndex === selectedDay)} 
                                />
                            ))}
                        </Box>
                        
                        {mutation.isPending && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2 }} />}
                    </Paper>
                </Grid>

                {/* Right: Task Bucket */}
                <Grid item xs={12} md={3.5}>
                    <Stack spacing={3}>
                        <Paper elevation={0} sx={{ 
                            p: 3, borderRadius: '24px', 
                            bgcolor: alpha(theme.palette.primary.main, 0.03),
                            border: '1px solid',
                            borderColor: alpha(theme.palette.primary.main, 0.1),
                            boxShadow: 'inset 0 0 20px rgba(0, 167, 111, 0.05)'
                        }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Icon icon="solar:mask-happly-bold-duotone" style={{ color: theme.palette.primary.main }} width={24} />
                                <Typography variant="h6" fontWeight={800}>Chiến thuật tuần</Typography>
                            </Stack>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3, lineHeight: 1.5 }}>
                                Kéo chiến thuật từ danh sách này vào khung giờ bạn muốn thực hiện trong lịch bên cạnh.
                            </Typography>
                            <Box sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
                                {allTactics.map(tactic => (
                                    <DraggableTask key={tactic._id} id={tactic._id} task={tactic} />
                                ))}
                            </Box>
                        </Paper>

                        <Paper elevation={0} sx={{ 
                            p: 3, borderRadius: '24px', 
                            border: '1px dashed', 
                            borderColor: theme.palette.divider,
                            bgcolor: 'background.paper'
                        }}>
                            <Typography variant="subtitle2" fontWeight={800} color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon icon="solar:lightbulb-bold" /> Mẹo hiệu suất
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                                "Lên lịch trình cố định giúp bạn giảm bớt sự mệt mỏi khi phải đưa ra quyết định mỗi ngày. Hãy biến thành công thành một thói quen."
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </DndContext>
    );
};
