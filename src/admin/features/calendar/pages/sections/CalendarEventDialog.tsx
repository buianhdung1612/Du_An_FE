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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CloseIcon, CalendarIcon } from "@assets/icons";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';

interface CalendarEventDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (event: any) => void;
    initialDate?: Date;
}

export const CalendarEventDialog: React.FC<CalendarEventDialogProps> = ({
    open,
    onClose,
    onSave,
    initialDate,
}) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(initialDate || new Date()));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(initialDate || new Date()).add(1, 'hour'));
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (open && initialDate) {
            setStartDate(dayjs(initialDate));
            setEndDate(dayjs(initialDate).add(1, 'hour'));
        }
    }, [open, initialDate]);

    const handleSave = () => {
        if (!title || !startDate || !endDate) return;

        onSave({
            serviceId: { name: title },
            userId: { fullName: 'Admin' },
            notes,
            start: startDate?.toISOString(),
            end: endDate?.toISOString(),
            bookingStatus: 'confirmed',
        });

        // Reset and close
        setTitle('');
        setNotes('');
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
                        maxWidth: '600px',
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
                    Lên lịch công việc
                    <IconButton onClick={onClose} size="small" sx={{ color: 'var(--palette-text-secondary)' }}>
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: '8px 24px 24px !important', bgcolor: 'var(--palette-background-neutral)' }}>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Công việc/Sự kiện"
                            placeholder="Ví dụ: Học lập trình..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={commonPickerStyles}
                        />

                        <DateTimePicker
                            label="Bắt đầu"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            format="DD/MM/YYYY HH:mm"
                            ampm={false}
                            minutesStep={15}
                            slots={{
                                openPickerIcon: (props) => <CalendarIcon {...props} sx={{ fontSize: 24, color: 'var(--palette-text-secondary)' }} />,
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    InputLabelProps: { shrink: true },
                                    sx: { ...commonPickerStyles, '& .MuiOutlinedInput-root': { ...commonPickerStyles['& .MuiOutlinedInput-root'], bgcolor: 'transparent' } }
                                }
                            }}
                        />

                        <DateTimePicker
                            label="Kết thúc"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            format="DD/MM/YYYY HH:mm"
                            ampm={false}
                            minutesStep={15}
                            slots={{
                                openPickerIcon: (props) => <CalendarIcon {...props} sx={{ fontSize: 24, color: 'var(--palette-text-secondary)' }} />,
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    InputLabelProps: { shrink: true },
                                    sx: { ...commonPickerStyles, '& .MuiOutlinedInput-root': { ...commonPickerStyles['& .MuiOutlinedInput-root'], bgcolor: 'transparent' } }
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Ghi chú thêm"
                            placeholder="Mô tả công việc..."
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
                    <Button onClick={handleSave} variant="contained" sx={{ borderRadius: "var(--shape-borderRadius)", textTransform: 'none', fontWeight: 700, px: 3, bgcolor: 'var(--palette-text-primary)' }}>
                        Thêm vào lịch
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};
