import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Stack,
    Box,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    useTheme,
    alpha,
    Checkbox
} from '@mui/material';
import { useCalendarCategories, useCreateCalendarCategory } from '../hooks/useCalendar';
import { useTasks } from '../hooks/useTasks';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CloseIcon, CalendarIcon } from "@assets/icons";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { getActivePlan } from '../../../productivity/api/productivity.api';
import { Icon as Iconify } from '@iconify/react';

interface TaskDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (task: any) => void;
    initialDate?: Date;
    initialTask?: any;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
    open,
    onClose,
    onSave,
    initialDate,
    initialTask
}) => {
    const theme = useTheme();
    const isEdit = !!initialTask;
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [notes, setNotes] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [parentId, setParentId] = useState('');
    const [tacticId, setTacticId] = useState('');

    const { data: catRes } = useCalendarCategories();
    const { mutate: createCategory } = useCreateCalendarCategory();
    const categories = catRes?.data || [];

    const [showAddCat, setShowAddCat] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState('#00A76F');

    const handleQuickAddCategory = () => {
        if (!newCatName.trim()) return;
        createCategory({ name: newCatName, color: newCatColor }, {
            onSuccess: (res: any) => {
                if (res.success || res.code === 200) {
                    toast.success('Đã thêm chủ đề mới thành công!');
                    const newId = res.data?._id;
                    if (newId) {
                        setCategoryId(newId);
                    }
                    setNewCatName('');
                    setShowAddCat(false);
                } else {
                    toast.error(res.message || 'Lỗi thêm chủ đề');
                }
            }
        });
    };

    const { tasks: allTasks } = useTasks();

    const { data: planRes } = useQuery({
        queryKey: ["active-plan"],
        queryFn: getActivePlan,
        enabled: open
    });
    const activePlan = planRes?.data;
    const allTactics = activePlan?.goals?.flatMap((g: any) => g.tactics.map((t: any) => ({ ...t, goalTitle: g.title }))) || [];

    useEffect(() => {
        if (open) {
            if (initialTask) {
                const data = initialTask.extendedProps || initialTask;
                setTitle(initialTask.title || '');
                setStartDate(dayjs(initialTask.start));
                setEndDate(dayjs(initialTask.end || initialTask.start));
                setNotes(data.notes || '');
                setCategoryId(data.categoryId?._id || data.categoryId || '');
                setIsCompleted(data.isCompleted || false);
                setParentId(data.parentId || '');
                setTacticId(data.tacticId || '');
            } else {
                setTitle('');
                const baseDate = initialDate || new Date();
                setStartDate(dayjs(baseDate));
                setEndDate(dayjs(baseDate).add(1, 'hour'));
                setNotes('');
                setIsCompleted(false);
                setParentId('');
                setTacticId('');
                if (categories.length > 0 && !categoryId) {
                    setCategoryId(categories[0]._id);
                }
            }
        }
    }, [open, initialTask, initialDate, categories]);

    const handleSave = () => {
        if (!title || !startDate) return;

        onSave({
            type: 'task',
            title,
            categoryId,
            notes,
            start: startDate?.toISOString(),
            end: endDate?.toISOString(),
            isCompleted,
            parentId: parentId || null,
            tacticId: tacticId || null,
        });

        onClose();
    };

    const commonPickerStyles = {
        '& .MuiOutlinedInput-root': {
            fontSize: '0.9375rem',
            borderRadius: "var(--shape-borderRadius)",
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--palette-text-disabled)33 !important',
                borderWidth: '1px',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--palette-text-primary) !important',
                borderWidth: '2px !important',
            },
        },
        '& .MuiInputLabel-root': {
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--palette-text-secondary)',
            '&.Mui-focused': { color: 'var(--palette-text-primary)' }
        },
        '& .MuiInputBase-input': {
            fontSize: '0.9375rem',
            padding: '12px 14px',
        },
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: "var(--shape-borderRadius-lg)",
                        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.16)',
                        backgroundImage: 'none',
                        maxWidth: '550px',
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '16px 24px',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    color: 'var(--palette-text-primary)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="solar:checklist-bold-duotone" width={24} color={theme.palette.success.main} />
                        {isEdit ? 'Chỉnh sửa nhiệm vụ' : 'Thêm nhiệm vụ mới'}
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'var(--palette-text-secondary)' }}>
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, bgcolor: 'var(--palette-background-paper)' }}>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: alpha(theme.palette.success.main, 0.08), borderRadius: '12px' }}>
                            <Checkbox
                                icon={<Iconify icon="solar:circle-outline" width={24} />}
                                checkedIcon={<Iconify icon="solar:check-circle-bold" width={24} />}
                                checked={isCompleted}
                                onChange={(e) => setIsCompleted(e.target.checked)}
                                sx={{ color: theme.palette.success.main, '&.Mui-checked': { color: theme.palette.success.main } }}
                            />
                            <Typography variant="subtitle2" fontWeight={700} color="success.dark">
                                Đánh dấu đã hoàn thành
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="Tên nhiệm vụ"
                            placeholder="Ví dụ: Hoàn thành báo cáo tháng..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={commonPickerStyles}
                        />

                        <FormControl fullWidth sx={commonPickerStyles}>
                            <InputLabel shrink>Nhiệm vụ cha (nếu có)</InputLabel>
                            <Select
                                value={parentId}
                                label="Nhiệm vụ cha (nếu có)"
                                onChange={(e) => setParentId(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value=""><em>-- Nhiệm vụ chính --</em></MenuItem>
                                {allTasks.filter((t: any) => t._id !== (initialTask?.id || initialTask?._id)).map((t: any) => (
                                    <MenuItem key={t._id} value={t._id}>
                                        <Typography variant="body2">{t.title}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {allTactics.length > 0 && (
                            <FormControl fullWidth sx={commonPickerStyles}>
                                <InputLabel shrink>Chiến thuật liên kết</InputLabel>
                                <Select
                                    value={tacticId}
                                    label="Chiến thuật liên kết"
                                    onChange={(e) => setTacticId(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value=""><em>-- Không liên kết --</em></MenuItem>
                                    {allTactics.map((t: any) => (
                                        <MenuItem key={t._id} value={t._id}>
                                            <Box>
                                                <Typography variant="body2" fontWeight={700}>{t.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">Mục tiêu: {t.goalTitle}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <FormControl fullWidth sx={commonPickerStyles}>
                                    <InputLabel shrink>Chủ đề</InputLabel>
                                    <Select
                                        value={categoryId}
                                        label="Chủ đề"
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled sx={{ fontStyle: 'italic', color: 'text.disabled' }}>Chọn chủ đề...</MenuItem>
                                        {categories.map((cat: any) => (
                                            <MenuItem key={cat._id} value={cat._id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color }} />
                                                    {cat.name}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <IconButton 
                                    color={showAddCat ? "error" : "primary"}
                                    onClick={() => setShowAddCat(!showAddCat)}
                                    sx={{ 
                                        border: '1px solid rgba(145, 158, 171, 0.2)',
                                        borderRadius: '8px',
                                        p: 1.5,
                                        height: '48px',
                                        width: '48px'
                                    }}
                                >
                                    <Iconify icon={showAddCat ? "solar:close-circle-bold" : "solar:add-circle-bold"} width={24} />
                                </IconButton>
                            </Stack>

                            {showAddCat && (
                                <Box sx={{ 
                                    p: 2, 
                                    border: '1px dashed rgba(145, 158, 171, 0.3)', 
                                    borderRadius: '12px',
                                    bgcolor: 'rgba(145, 158, 171, 0.04)',
                                    mt: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                        THÊM NHANH CHỦ ĐỀ
                                    </Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                        <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Tên chủ đề..."
                                            value={newCatName}
                                            onChange={(e) => setNewCatName(e.target.value)}
                                            sx={{ ...commonPickerStyles, bgcolor: 'background.paper' }}
                                        />
                                        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                                            {['#00A76F', '#FFAB00', '#00B8D9', '#FF5630', '#22C55E', '#8E33FF', '#4361EE'].map((c) => (
                                                <Box
                                                    key={c}
                                                    onClick={() => setNewCatColor(c)}
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: '50%',
                                                        bgcolor: c,
                                                        cursor: 'pointer',
                                                        border: newCatColor === c ? '2px solid' : 'none',
                                                        borderColor: 'text.primary',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    {newCatColor === c && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white' }} />}
                                                </Box>
                                            ))}
                                        </Stack>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={handleQuickAddCategory}
                                            sx={{ 
                                                bgcolor: 'var(--palette-text-primary)', 
                                                color: 'var(--palette-background-paper)', 
                                                textTransform: 'none', 
                                                fontWeight: 700,
                                                px: 2,
                                                height: '36px',
                                                borderRadius: '8px',
                                                '&:hover': { bgcolor: 'var(--palette-grey-800)' }
                                            }}
                                        >
                                            Thêm
                                        </Button>
                                    </Stack>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <DateTimePicker
                                label="Thời hạn"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                format="DD/MM/YYYY HH:mm"
                                ampm={false}
                                slots={{
                                    openPickerIcon: (props) => <CalendarIcon {...props} sx={{ fontSize: 24, color: 'var(--palette-text-secondary)' }} />,
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        InputLabelProps: { shrink: true },
                                        sx: { ...commonPickerStyles }
                                    }
                                }}
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Ghi chú"
                            placeholder="Mô tả nhiệm vụ..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={commonPickerStyles}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: '16px 24px', gap: 1 }}>
                    <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "var(--shape-borderRadius)", textTransform: 'none', fontWeight: 700, px: 3 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: "var(--shape-borderRadius)", textTransform: 'none', fontWeight: 700, px: 3, bgcolor: theme.palette.success.main, '&:hover': { bgcolor: theme.palette.success.dark } }}>
                        {isEdit ? 'Cập nhật' : 'Thêm nhiệm vụ'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};
