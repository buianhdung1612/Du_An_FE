import React from 'react';
import {
    Box,
    Drawer,
    Typography,
    IconButton,
    Divider,
    Badge,
    Stack,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReloadIcon, CloseIcon, CalendarIcon } from "@assets/icons";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

interface Event {
    id: string;
    title: string;
    start: string;
    color: string;
}

interface CalendarFiltersDrawerProps {
    open: boolean;
    onClose: () => void;
    events: Event[];
}

export const CalendarFiltersDrawer: React.FC<CalendarFiltersDrawerProps> = ({
    open,
    onClose,
    events,
}) => {
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: 320,
                        bgcolor: 'background.paper',
                        boxShadow: '-24px 12px 32px -4px rgba(145, 158, 171, 0.16)',
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ py: 2, pl: 2, pr: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Bộ lọc lịch tuần
                    </Typography>
                    <Box>
                        <IconButton size="medium" onClick={onClose}>
                            <CloseIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {/* Content */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
                    <Stack spacing={4}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                                Khoảng thời gian
                            </Typography>
                            <Stack spacing={2}>
                                <DatePicker
                                    label="Bắt đầu"
                                    value={startDate}
                                    onChange={(v) => setStartDate(v)}
                                    format="DD/MM/YYYY"
                                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                />
                                <DatePicker
                                    label="Kết thúc"
                                    value={endDate}
                                    onChange={(v) => setEndDate(v)}
                                    format="DD/MM/YYYY"
                                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                />
                            </Stack>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                                Danh sách công việc ({events.length})
                            </Typography>
                            <Stack spacing={1}>
                                {events.map((event) => (
                                    <ListItemButton
                                        key={event.id}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 1,
                                            border: '1px solid rgba(145, 158, 171, 0.12)',
                                            '&:hover': { bgcolor: 'rgba(145, 158, 171, 0.08)' }
                                        }}
                                    >
                                        <Box sx={{ width: 4, height: 24, bgcolor: event.color, borderRadius: 1, mr: 1.5 }} />
                                        <ListItemText
                                            primary={<Typography variant="subtitle2">{event.title}</Typography>}
                                            secondary={<Typography variant="caption">{dayjs(event.start).format('HH:mm, DD/MM')}</Typography>}
                                        />
                                    </ListItemButton>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </Drawer>
        </LocalizationProvider>
    );
};
