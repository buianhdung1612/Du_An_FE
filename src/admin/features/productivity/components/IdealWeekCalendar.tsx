import { useRef, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Paper, Typography, useTheme, alpha, Button, Stack } from "@mui/material";
import { useProductivityStore } from "../stores/useProductivityStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTimeBlocks } from "../api/productivity.api";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import dayjs from 'dayjs';

export const IdealWeekCalendar = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { activePlan } = useProductivityStore();
    const calendarRef = useRef<FullCalendar>(null);

    // Convert timeBlocks to FullCalendar events
    // Assuming timeBlocks use dayIndex (0-6) and HH:mm
    const events = useMemo(() => {
        if (!activePlan?.timeBlocks) return [];

        // FullCalendar 1-7 for Mon-Sun in some locales, or specific dates
        // For an "Ideal Week", we can use a fixed week (e.g., 2024-01-01 is Mon)
        const baseDate = "2024-01-0"; // Mon is 01, Tue 02... Sun 07

        return activePlan.timeBlocks.map((block: any, index: number) => {
            const dayNum = block.dayIndex + 1;
            return {
                id: block._id || `block-${index}`,
                title: block.title,
                start: `${baseDate}${dayNum}T${block.startTime}`,
                end: `${baseDate}${dayNum}T${block.endTime}`,
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderColor: theme.palette.primary.main,
                textColor: theme.palette.primary.dark,
                extendedProps: { ...block }
            };
        });
    }, [activePlan, theme]);

    const mutation = useMutation({
        mutationFn: updateTimeBlocks,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["active-plan"] });
            toast.success("Đã cập nhật lịch tuần lý tưởng!");
        }
    });



    const handleEventChange = (info: any) => {
        const { event } = info;
        const newStartTime = dayjs(event.start).format("HH:mm");
        const newEndTime = dayjs(event.end).format("HH:mm");
        const dayIndex = dayjs(event.start).date() - 1;

        const updatedBlocks = [...(activePlan?.timeBlocks || [])];
        const blockIdx = updatedBlocks.findIndex(b => b.title === event.title && b.dayIndex === dayIndex);

        if (blockIdx > -1) {
            updatedBlocks[blockIdx] = {
                ...updatedBlocks[blockIdx],
                startTime: newStartTime,
                endTime: newEndTime
            };

            mutation.mutate({
                planId: activePlan._id,
                timeBlocks: updatedBlocks
            });
        }
    };

    return (
        <Paper elevation={0} sx={{
            p: 3, borderRadius: '24px',
            bgcolor: 'background.paper',
            boxShadow: 'var(--customShadows-card)',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
            overflow: 'hidden'
        }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        Lịch Tuần Lý Tưởng
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Thiết lập các khung giờ cố định để tối ưu hóa hiệu suất của bạn.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Icon icon="solar:magic-stick-bold" />}
                    sx={{ borderRadius: '12px', flexShrink: 0 }}
                >
                    Tự động tối ưu
                </Button>
            </Stack>

            <Box sx={{
                overflowX: 'auto',
                '& .fc': {
                    '--fc-border-color': alpha(theme.palette.divider, 0.1),
                    '--fc-today-bg-color': alpha(theme.palette.primary.main, 0.05),
                    fontFamily: theme.typography.fontFamily,
                    minWidth: { xs: '600px', sm: 'auto' }, // Force min width on mobile for scroll
                },
                '& .fc-col-header-cell': {
                    py: 1.5,
                    bgcolor: alpha(theme.palette.divider, 0.05),
                },
                '& .fc-timegrid-slot': {
                    height: '50px !important',
                },
                '& .fc-event': {
                    borderRadius: '8px',
                    border: 'none',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    p: 0.5,
                },
                '& .fc-col-header-cell-cushion': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    textDecoration: 'none !important',
                    color: 'text.primary',
                }
            }}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={false}
                    initialDate="2024-01-01" // Base week for ideal week
                    dayHeaderFormat={{ weekday: 'short' }}
                    slotMinTime="05:00:00"
                    slotMaxTime="23:00:00"
                    allDaySlot={false}
                    height="700px"
                    editable={true}
                    selectable={true}
                    events={events}
                    eventChange={handleEventChange}
                    locale="vi"
                    firstDay={1}
                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }}
                />
            </Box>
        </Paper>
    );
};
