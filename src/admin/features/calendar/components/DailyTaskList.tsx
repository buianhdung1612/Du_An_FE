import React from 'react';
import {
    Box,
    Typography,
    Checkbox,
    Stack,
    IconButton,
    Tooltip,
    alpha,
    useTheme,
    Button
} from '@mui/material';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';

interface DailyTaskListProps {
    tasks: any[];
    onToggleTask: (id: string, isCompleted: boolean) => void;
    onEditTask: (event: any) => void;
    onDeleteTask?: (id: string) => void;
    onClose?: () => void;
    onAddTask?: () => void;
    baseDate?: Date;
}

export const DailyTaskList: React.FC<DailyTaskListProps> = ({ tasks, onToggleTask, onEditTask, onDeleteTask, onClose, onAddTask, baseDate }) => {
    const theme = useTheme();
    const activeTasks = tasks.map(t => ({
        ...t,
        id: t.id || t._id,
        type: t.type || t.extendedProps?.type,
        parentId: t.parentId || t.extendedProps?.parentId
    })).filter(t => t.type === 'task');

    // Simple hierarchy logic: sort by parent and then by date
    const sortedTasks = React.useMemo(() => {
        const rootTasks = activeTasks.filter(t => !t.parentId);
        const childrenTasks = activeTasks.filter(t => t.parentId);

        const result: any[] = [];

        const addNode = (node: any, level: number) => {
            result.push({ ...node, level });
            const children = childrenTasks.filter(c => c.parentId === node.id);
            children.sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
            children.forEach(c => addNode(c, level + 1));
        };

        rootTasks.sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
        rootTasks.forEach(r => addNode(r, 0));

        return result;
    }, [activeTasks]);

    const [selectedDate, setSelectedDate] = React.useState(dayjs(baseDate || new Date()).startOf('day'));

    React.useEffect(() => {
        if (baseDate) {
            setSelectedDate(dayjs(baseDate).startOf('day'));
        }
    }, [baseDate]);

    const currentWeekDays = React.useMemo(() => {
        if (baseDate) {
            const start = dayjs(baseDate).startOf('day');
            return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
        }
        return Array.from({ length: 7 }, (_, i) => {
            return dayjs().startOf('week').add(1, 'day').add(i, 'day');
        });
    }, [baseDate]);

    const filteredTasks = React.useMemo(() => {
        return sortedTasks.filter(task => {
            return dayjs(task.start).isSame(selectedDate, 'day');
        });
    }, [sortedTasks, selectedDate]);

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'var(--palette-background-paper)',
                color: 'var(--palette-text-primary)',
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1 }}>
                        TASKS
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                            <Icon icon="solar:maximize-bold" width={18} />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={onClose}>
                            <Icon icon="solar:close-circle-bold" width={18} />
                        </IconButton>
                    </Stack>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        Việc cần làm của tôi
                    </Typography>
                    <Icon icon="solar:alt-arrow-down-bold" width={16} />
                </Box>
            </Box>

            {/* Add Task Button */}
            <Box sx={{ px: 1, mb: 1 }}>
                <Button
                    fullWidth
                    startIcon={<Icon icon="solar:add-circle-bold-duotone" width={24} />}
                    sx={{
                        justifyContent: 'flex-start',
                        color: 'var(--palette-primary-main)',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                    onClick={onAddTask}
                >
                    Thêm việc cần làm
                </Button>
            </Box>

            {/* Day Selector */}
            <Box sx={{ px: 2, mb: 2 }}>
                <Stack direction="row" spacing={1} justifyContent="space-between">
                    {currentWeekDays.map((date, idx) => {
                        const isSelected = selectedDate.isSame(date, 'day');
                        const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
                        return (
                            <Box
                                key={idx}
                                onClick={() => setSelectedDate(date)}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    opacity: isSelected ? 1 : 0.5,
                                    transition: '0.2s',
                                    '&:hover': { opacity: 1 }
                                }}
                            >
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                                    {dayNames[date.day()]}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: isSelected ? 'var(--palette-primary-main)' : 'transparent',
                                        color: isSelected ? '#fff' : 'inherit',
                                        mt: 0.5
                                    }}
                                >
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                        {date.date()}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
                <Stack spacing={0.5}>
                    {filteredTasks.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center', opacity: 0.3 }}>
                            <Icon icon="solar:notes-bold-duotone" width={48} />
                            <Typography variant="caption" display="block">Chưa có nhiệm vụ ngày này</Typography>
                        </Box>
                    ) : (
                        filteredTasks.map((task) => {
                            const isCompleted = task.isCompleted || task.extendedProps?.isCompleted;
                            return (
                                <Box
                                    key={task.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 1.5,
                                        py: 1,
                                        pl: (task.level || 0) * 3, // Indent based on level
                                        '&:hover .task-actions': { opacity: 1 }
                                    }}
                                >
                                    <Checkbox
                                        icon={<Icon icon="solar:circle-outline" width={20} />}
                                        checkedIcon={<Icon icon="solar:check-circle-bold" width={20} />}
                                        checked={isCompleted}
                                        onChange={(e) => onToggleTask(task.id, e.target.checked)}
                                        sx={{
                                            p: 0,
                                            mt: 0.25,
                                            color: 'text.secondary',
                                            '&.Mui-checked': { color: '#54D62C' }
                                        }}
                                    />

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 500,
                                                color: isCompleted ? 'text.disabled' : theme.palette.text.primary,
                                                textDecoration: isCompleted ? 'line-through' : 'none',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => onEditTask(task)}
                                        >
                                            {task.title || "(Không có tiêu đề)"}
                                        </Typography>

                                        <Box sx={{ mt: 0.5 }}>
                                            <Box
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    bgcolor: 'rgba(145, 158, 171, 0.08)',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(145, 158, 171, 0.2)',
                                                    cursor: 'pointer',
                                                    '&:hover': { bgcolor: 'rgba(145, 158, 171, 0.16)' }
                                                }}
                                                onClick={() => onEditTask(task)}
                                            >
                                                <Icon icon="solar:calendar-bold" width={14} color={theme.palette.primary.main} />
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                    {dayjs(task.start).format('HH:mm')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Stack direction="row" spacing={0.5} className="task-actions" sx={{ opacity: 0, transition: '0.2s' }}>
                                        <IconButton
                                            size="small"
                                            sx={{ color: 'text.secondary' }}
                                            onClick={() => onEditTask(task)}
                                        >
                                            <Icon icon="solar:pen-bold" width={16} />
                                        </IconButton>
                                        {onDeleteTask && (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    if (window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn việc cần làm này không?")) {
                                                        onDeleteTask(task.id);
                                                    }
                                                }}
                                            >
                                                <Icon icon="solar:trash-bin-trash-bold" width={16} />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </Box>
                            );
                        })
                    )}
                </Stack>
            </Box>

            {/* Bottom Menu Bar (Optional, as per screenshot) */}
            <Box sx={{ p: 1, borderTop: '1px solid rgba(145, 158, 171, 0.12)', display: 'flex', justifyContent: 'center' }}>
                <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <Icon icon="solar:info-circle-bold" width={18} />
                </IconButton>
            </Box>
        </Box>
    );
};
