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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    useTheme,
    Typography
} from '@mui/material';
import { useCalendarCategories, useCreateCalendarCategory } from '../hooks/useCalendar';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CloseIcon, CalendarIcon } from "@assets/icons";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { Icon as Iconify } from '@iconify/react';
import { toast } from 'react-toastify';

interface EventDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (event: any) => void;
    initialDate?: Date;
    initialEvent?: any;
    type?: 'task' | 'event';
}

export const EventDialog: React.FC<EventDialogProps> = ({
    open,
    onClose,
    onSave,
    initialDate,
    initialEvent,
    type = 'event'
}) => {
    const theme = useTheme();
    const isEdit = !!initialEvent;
    const isTask = type === 'task';
    const typeLabel = isTask ? 'nhiệm vụ' : 'sự kiện';

    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [notes, setNotes] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const [showAddCat, setShowAddCat] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState('#00A76F');

    const { data: catRes } = useCalendarCategories();
    const { mutate: createCategory } = useCreateCalendarCategory();
    const categories = catRes?.data || [];

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

    useEffect(() => {
        if (open) {
            if (initialEvent) {
                const data = initialEvent.extendedProps || initialEvent;
                setTitle(initialEvent.title || '');
                setStartDate(dayjs(initialEvent.start));
                setEndDate(dayjs(initialEvent.end));
                setNotes(data.notes || '');
                setCategoryId(data.categoryId?._id || data.categoryId || '');
            } else {
                setTitle('');
                const baseDate = initialDate || new Date();
                setStartDate(dayjs(baseDate));
                setEndDate(dayjs(baseDate).add(1, 'hour'));
                setNotes('');
                if (categories.length > 0 && !categoryId) {
                    setCategoryId(categories[0]._id);
                }
            }
        }
    }, [open, initialEvent, initialDate, categories]);

    const handleSave = () => {
        if (!title || !startDate || !endDate) return;

        onSave({
            type, // Use the prop 'task' or 'event'
            title,
            categoryId,
            notes,
            start: startDate?.toISOString(),
            end: endDate?.toISOString(),
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
                        maxWidth: '500px',
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
                        <Iconify icon="solar:calendar-bold-duotone" width={24} color={theme.palette.primary.main} />
                        {isEdit ? `Chỉnh sửa ${typeLabel}` : `Thêm ${typeLabel} mới`}
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'var(--palette-text-secondary)' }}>
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, bgcolor: 'var(--palette-background-paper)' }}>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label={`Tên ${typeLabel}`}
                            placeholder={isTask ? "Ví dụ: Hoàn thành báo cáo..." : "Ví dụ: Họp team, Đi bơi..."}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={commonPickerStyles}
                        />

                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <FormControl fullWidth sx={commonPickerStyles}>
                                    <InputLabel>Danh mục</InputLabel>
                                    <Select
                                        value={categoryId}
                                        label="Danh mục"
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled sx={{ fontStyle: 'italic', color: 'text.disabled' }}>Chọn danh mục...</MenuItem>
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
                                label="Bắt đầu"
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

                            <DateTimePicker
                                label="Kết thúc"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
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
                            rows={3}
                            label="Ghi chú"
                            placeholder={`Mô tả chi tiết ${typeLabel}...`}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            variant="outlined"
                            sx={commonPickerStyles}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: '16px 24px', gap: 1 }}>
                    <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "var(--shape-borderRadius)", textTransform: 'none', fontWeight: 700, px: 3 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: "var(--shape-borderRadius)", textTransform: 'none', fontWeight: 700, px: 3, bgcolor: 'var(--palette-text-primary)' }}>
                        {isEdit ? 'Cập nhật' : `Thêm ${typeLabel}`}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};
