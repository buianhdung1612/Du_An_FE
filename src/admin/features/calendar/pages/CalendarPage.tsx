import React, { useState, useRef, useEffect } from 'react';


import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import {
    CalendarViewAgendaIcon,
    CalendarViewDayIcon,
    CalendarViewMonthIcon,
    CalendarViewWeekIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CalendarFilterIcon,
} from "@assets/icons";
import { CalendarFiltersDrawer } from './sections/CalendarFiltersDrawer';
import { EventDialog } from './sections/EventDialog';
import { TaskDialog } from './sections/TaskDialog';
import { DailyTaskList } from '../components/DailyTaskList';
import { toast } from "react-toastify";
import { Title } from "@shared/components/ui/Title";
import { Icon } from '@iconify/react';
import {
    useCalendarEvents,
    useCreateCalendarEvent,
    useUpdateCalendarEvent,
    useCalendarCategories,
    useCreateCalendarCategory,
    useDeleteCalendarCategory,
    useDeleteCalendarEvent
} from './hooks/useCalendar';
import { useTasks } from './hooks/useTasks';
import {
    Badge,
    Box,
    Card,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
    Popover,
    TextField,
    Checkbox,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    alpha
} from "@mui/material";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const CalendarPage = () => {
    const calendarRef = useRef<FullCalendar>(null);
    const [view, setView] = useState('dayGridMonth');
    const [date, setDate] = useState(new Date());
    const [openFilters, setOpenFilters] = useState(false);
    const [openEventDialog, setOpenEventDialog] = useState(false);
    const [openTaskDialog, setOpenTaskDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [anchorElCat, setAnchorElCat] = useState<HTMLButtonElement | null>(null);
    const [newCat, setNewCat] = useState({ name: '', color: '#00A76F' });
    const [anchorElTasks, setAnchorElTasks] = useState<HTMLButtonElement | null>(null);
    const COLORS = ['#00A76F', '#FFAB00', '#00B8D9', '#FF5630', '#22C55E', '#06AED4', '#7A0C2E', '#8E33FF', '#4361EE', '#F72585'];

    // Fetch real data
    const { data: eventsRes } = useCalendarEvents();
    const { data: catRes } = useCalendarCategories();
    const { mutate: createEvent } = useCreateCalendarEvent();
    const { mutate: updateEvent } = useUpdateCalendarEvent();
    const { mutate: createCategory } = useCreateCalendarCategory();
    const { mutate: deleteCategory } = useDeleteCalendarCategory();
    const { mutate: deleteEvent } = useDeleteCalendarEvent();
    const { tasks: allTasks, createTask, editTask, deleteTask: deleteTaskApi } = useTasks();

    const categories = (catRes as any)?.data || [];
    const allEvents = (eventsRes as any)?.data || [];

    // Sync selected categories on first load
    useEffect(() => {
        if (categories.length > 0 && selectedCategories.length === 0) {
            setSelectedCategories(categories.map((c: any) => c._id));
        }
    }, [categories]);

    // Filtering logic
    const filteredEvents = React.useMemo(() => {
        const events = allEvents.map((event: any) => ({
            id: event._id,
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            backgroundColor: event.categoryId?.color || '#2065D1',
            borderColor: event.categoryId?.color || '#2065D1',
            extendedProps: { ...event, type: 'event' }
        }));

        const tasks = allTasks.map((task: any) => ({
            id: task._id,
            title: task.title,
            start: task.start,
            end: task.end || task.start,
            allDay: false,
            backgroundColor: task.categoryId?.color || '#00A76F',
            borderColor: task.categoryId?.color || '#00A76F',
            extendedProps: { ...task, type: 'task' }
        }));

        const merged = [...events, ...tasks];

        return merged.filter((event: any) => {
            const catId = event.extendedProps?.categoryId?._id || event.extendedProps?.categoryId;
            if (!catId) return true;
            return selectedCategories.includes(catId);
        });
    }, [allEvents, allTasks, selectedCategories]);

    const handleCategoryToggle = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };



    const handleOpenFilters = () => setOpenFilters(true);
    const handleCloseFilters = () => setOpenFilters(false);

    const handleOpenEventDialog = (date?: Date, event?: any) => {
        setSelectedDate(date);
        setSelectedEvent(event);
        setOpenEventDialog(true);
    };

    const handleOpenTaskDialog = (date?: Date, task?: any) => {
        setSelectedDate(date);
        setSelectedEvent(task);
        setOpenTaskDialog(true);
    };

    const handleCloseEventDialog = () => {
        setSelectedDate(undefined);
        setSelectedEvent(null);
        setOpenEventDialog(false);
    };

    const handleCloseTaskDialog = () => {
        setSelectedDate(undefined);
        setSelectedEvent(null);
        setOpenTaskDialog(false);
    };

    const handleOpenCatPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElCat(event.currentTarget);
    };
    const handleCloseCatPopover = () => {
        setAnchorElCat(null);
        setNewCat({ name: '', color: '#00A76F' });
    };
    const handleSaveCategory = () => {
        if (!newCat.name.trim()) return;
        createCategory(newCat, {
            onSuccess: () => {
                toast.success('Đã thêm chủ đề!');
                setNewCat({ name: '', color: '#00A76F' });
            }
        });
    };
    const handleDeleteCategory = (id: string) => {
        deleteCategory(id, {
            onSuccess: () => toast.success('Đã xóa chủ đề')
        });
    };

    const handleSaveEvent = (eventData: any) => {
        if (selectedEvent) {
            updateEvent({ id: selectedEvent._id || selectedEvent.id, data: eventData }, {
                onSuccess: () => {
                    toast.success('Đã cập nhật sự kiện!');
                    handleCloseEventDialog();
                }
            });
        } else {
            createEvent(eventData, {
                onSuccess: () => {
                    toast.success('Đã lên lịch thành công!');
                    handleCloseEventDialog();
                }
            });
        }
    };

    const handleSaveTask = async (taskData: any) => {
        if (selectedEvent) {
            await editTask({ id: selectedEvent._id || selectedEvent.id, data: taskData });
            handleCloseTaskDialog();
        } else {
            await createTask(taskData);
            handleCloseTaskDialog();
        }
    };

    const handleEventDrop = (info: any) => {
        const { event } = info;
        const isTask = event.extendedProps?.type === 'task';
        const data = {
            start: event.start?.toISOString(),
            end: event.end?.toISOString()
        };

        if (isTask) {
            editTask({ id: event.id, data });
        } else {
            updateEvent({ id: event.id, data }, {
                onSuccess: () => toast.success('Đã cập nhật thời gian')
            });
        }
    };

    const handleToggleTask = (id: string, isCompleted: boolean) => {
        // Find if it's a task or event
        const item = filteredEvents.find(e => e.id === id);
        const isTask = item?.extendedProps?.type === 'task';

        if (isTask) {
            editTask({ id, data: { isCompleted } });
        } else {
            updateEvent({
                id,
                data: { isCompleted }
            }, {
                onSuccess: () => toast.success(isCompleted ? 'Đã hoàn thành nhiệm vụ!' : 'Đã mở lại nhiệm vụ')
            });
        }
    };

    const handleDeleteTask = async (id: string) => {
        const item = filteredEvents.find(e => e.id === id);
        const isTask = item?.extendedProps?.type === 'task';

        if (isTask) {
            await deleteTaskApi(id);
            toast.success('Đã xóa nhiệm vụ vĩnh viễn!');
        } else {
            deleteEvent(id, {
                onSuccess: () => toast.success('Đã xóa nhiệm vụ vĩnh viễn!')
            });
        }
    };

    const handleViewChange = (
        _event: React.MouseEvent<HTMLElement>,
        newView: string | null,
    ) => {
        if (newView !== null) {
            setView(newView);
            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi) {
                calendarApi.changeView(newView);
            }
        }
    };

    const handleToday = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.today();
            setDate(calendarApi.getDate());
        }
    };

    const handlePrev = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleNext = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title="Lịch" />
                </div>
                <Button
                    onClick={() => handleOpenEventDialog()}
                    sx={{
                        background: 'var(--palette-text-primary)',
                        minHeight: "2.25rem",
                        minWidth: "4rem",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        padding: "6px 12px",
                        borderRadius: "var(--shape-borderRadius)",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                            background: "var(--palette-grey-700)",
                            boxShadow: "var(--customShadows-z8)"
                        }
                    }}
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Thêm sự kiện
                </Button>
            </div>




            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                <Card
                    elevation={0}
                    sx={{
                        flex: 1,
                        bgcolor: "var(--palette-background-paper)",
                        backgroundImage: 'none',
                        borderRadius: "var(--shape-borderRadius-lg)",
                        boxShadow: "var(--customShadows-card)",
                        color: "var(--palette-text-primary)",
                        height: 'calc(100vh - 180px)',
                        minHeight: '750px',
                        display: 'flex',
                        flexDirection: 'column',
                        '& .fc': {
                            flex: '1 1 auto',
                            marginLeft: '-1px',
                            marginBottom: '-1px',
                            width: 'calc(100% + 2px)',
                            fontSize: '1rem',
                            '--fc-border-color': 'rgba(145, 158, 171, 0.2)',
                            '--fc-page-bg-color': '#fff',
                            '--fc-neutral-bg-color': 'var(--palette-background-neutral)',
                            '--fc-neutral-text-color': 'var(--palette-text-secondary)',
                            '--fc-button-text-color': '#fff',
                            '--fc-button-bg-color': 'var(--palette-primary-main)',
                            '--fc-button-border-color': 'var(--palette-primary-main)',
                            '--fc-button-hover-bg-color': '#007B55',
                            '--fc-button-hover-border-color': '#007B55',
                            '--fc-button-active-bg-color': '#005249',
                            '--fc-button-active-border-color': '#005249',
                            '--fc-event-bg-color': 'var(--palette-primary-main)',
                            '--fc-event-border-color': 'var(--palette-primary-main)',
                            '--fc-event-text-color': '#fff',
                            '--fc-event-selected-overlay-color': 'rgba(0, 0, 0, 0.25)',
                            '--fc-more-link-bg-color': 'rgba(145, 158, 171, 0.12)',
                            '--fc-more-link-text-color': 'var(--palette-text-primary)',
                            '--fc-non-business-color': 'rgba(145, 158, 171, 0.08)',
                            '--fc-highlight-color': 'rgba(0, 167, 111, 0.08)',
                            '--fc-today-bg-color': 'rgba(255, 171, 0, 0.08)',
                            '--fc-now-indicator-color': 'var(--palette-error-main)',
                            '--fc-daygrid-event-dot-width': '8px',
                            '--fc-list-event-dot-width': '10px',
                            '--fc-list-event-hover-bg-color': 'rgba(145, 158, 171, 0.08)',
                        },
                        '& .fc-theme-standard .fc-scrollgrid': {
                            border: 'none',
                        },
                        '& .fc table': {
                            width: '100% !important',
                        },
                        '& .fc-view-harness': {
                            flexGrow: 1,
                        },
                        '& .fc .fc-scrollgrid': {
                            border: 'none',
                        },

                        '& .fc .fc-col-header': {
                            borderTop: '1px solid var(--fc-border-color)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 3,
                            backgroundColor: "var(--palette-background-paper)",
                        },
                        '& .fc .fc-col-header-cell': {
                            height: '47.8px',
                            padding: '0',
                            borderLeft: 'none',
                            borderRight: 'none',
                            verticalAlign: 'middle',
                            '& .fc-col-header-cell-cushion': {
                                fontWeight: 700,
                                fontSize: '0.9375rem',
                                color: 'var(--palette-text-primary)',
                                textTransform: 'capitalize',
                                textDecoration: 'none !important',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }
                        },
                        '& .fc .fc-timegrid-axis': {
                            verticalAlign: 'middle !important',
                        },
                        '& .fc .fc-timegrid-axis-cushion': {
                            color: 'var(--palette-text-secondary)',
                            fontSize: '0.875rem',
                            fontWeight: 400,
                            textDecoration: 'none !important',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        '& .fc .fc-timegrid-slot-label-cushion': {
                            color: 'var(--palette-text-secondary)',
                            fontSize: '0.875rem',
                            fontWeight: 400,
                            textAlign: 'right',
                            paddingRight: '8px',
                        },
                        '& .fc .fc-daygrid-day': {
                            '&.fc-day-today': {
                                '& .fc-daygrid-day-number': {
                                    bgcolor: 'var(--palette-error-main)',
                                    color: "var(--palette-common-white)",
                                    borderRadius: '50%',
                                    width: '26px',
                                    height: '26px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '4px',
                                }
                            }
                        },
                        '& .fc .fc-daygrid-day-number': {
                            fontSize: '0.875rem',
                            fontWeight: 400,
                            padding: '4px 8px',
                            color: 'var(--palette-text-secondary)',
                            textDecoration: 'none !important',
                        },
                        '& .fc .fc-day-has-event .fc-daygrid-day-number': {
                            color: 'var(--palette-text-primary)',
                        },
                        '& .fc .fc-daygrid-event': {
                            borderRadius: "var(--shape-borderRadius-sm)",
                            padding: 0,
                            border: 'none !important',
                            marginLeft: '4px',
                            marginRight: '4px',
                            marginBottom: '4px',
                            marginTop: 0,
                            overflow: 'hidden',
                            minWidth: 0,
                        },
                        '& .fc .fc-daygrid-event-dot': {
                            display: 'none',
                        },
                        '& .fc .fc-event-main': {
                            padding: '2px 6px',
                            fontSize: '0.8125rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            minWidth: 0,
                            maxWidth: '100%',
                        },
                        '& .fc .fc-event-time': {
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                        },
                        '& .fc .fc-event-title': {
                            fontSize: '0.8125rem',
                            fontWeight: 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                            minWidth: 0,
                        },
                        '& .fc .fc-event-title *': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        },
                        '& .fc .fc-list': {
                            border: 'none',
                        },
                        '& .fc .fc-list-event': {
                            '&:hover td': {
                                bgcolor: 'rgba(145, 158, 171, 0.08)',
                            }
                        },
                        '& .fc .fc-list-event-time': {
                            fontSize: '0.875rem',
                            color: 'var(--palette-text-secondary)',
                            fontWeight: 400,
                        },
                        '& .fc .fc-list-event-title': {
                            fontSize: '0.875rem',
                            fontWeight: 400,
                        },
                        '& .fc .fc-list-day-cushion': {
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        },
                    }}
                >
                    <Box sx={{ p: { xs: "12px", md: "20px" }, pr: { xs: "12px", md: "16px" }, display: "flex", flexWrap: 'wrap', alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={handleViewChange}
                            aria-label="calendar view"
                            sx={{
                                gap: '4px',
                                p: 0.5,
                                border: '1px solid var(--palette-text-disabled)29',
                                borderRadius: "10px",
                                '& .MuiToggleButton-root': {
                                    border: 'none !important',
                                    borderRadius: '8px !important',
                                    p: '4px !important',
                                    '&.Mui-selected': {
                                        bgcolor: 'rgba(28, 37, 46, 0.08)',
                                        color: 'var(--palette-text-primary)',
                                        '&:hover': {
                                            bgcolor: 'rgba(28, 37, 46, 0.16)',
                                        }
                                    }
                                }
                            }}
                        >
                            <Tooltip title="Tháng" placement="bottom">
                                <ToggleButton value="dayGridMonth" aria-label="Month view">
                                    <CalendarViewMonthIcon sx={{ fontSize: 20 }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Tuần" placement="bottom">
                                <ToggleButton value="timeGridWeek" aria-label="Week view">
                                    <CalendarViewWeekIcon sx={{ fontSize: 20 }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Ngày" placement="bottom">
                                <ToggleButton value="timeGridDay" aria-label="Day view">
                                    <CalendarViewDayIcon sx={{ fontSize: 20 }} />
                                </ToggleButton>
                            </Tooltip>
                            <Tooltip title="Chương trình" placement="bottom">
                                <ToggleButton value="listWeek" aria-label="Agenda view">
                                    <CalendarViewAgendaIcon sx={{ fontSize: 20 }} />
                                </ToggleButton>
                            </Tooltip>
                        </ToggleButtonGroup>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconButton size="medium" onClick={handlePrev}>
                                <ChevronLeftIcon sx={{ fontSize: 20, color: 'var(--palette-text-secondary)' }} />
                            </IconButton>

                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.0625rem', minWidth: '160px', textAlign: 'center', color: "var(--palette-text-primary)" }}>
                                {capitalizeFirstLetter(dayjs(date).format('MMMM YYYY'))}
                            </Typography>

                            <IconButton size="medium" onClick={handleNext}>
                                <ChevronRightIcon sx={{ fontSize: 20, color: 'var(--palette-text-secondary)' }} />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleToday}
                                sx={{
                                    bgcolor: 'var(--palette-error-main)',
                                    borderRadius: "var(--shape-borderRadius)",
                                    minHeight: "30px",
                                    minWidth: "64px",
                                    fontSize: "0.75rem",
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    padding: "4px 8px",
                                    '&:hover': {
                                        bgcolor: '#B71D18'
                                    }
                                }}
                            >
                                Today
                            </Button>
                            <Button
                                size="small"
                                onClick={handleOpenCatPopover}
                                startIcon={<AddIcon />}
                                sx={{
                                    color: 'var(--palette-text-primary)',
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    bgcolor: alpha('#919EAB', 0.08),
                                    px: 1.5,
                                    '&:hover': { bgcolor: alpha('#919EAB', 0.16) }
                                }}
                            >
                                Chủ đề
                            </Button>

                            <IconButton size="medium" onClick={(e) => setAnchorElTasks(e.currentTarget)}>
                                <Icon
                                    icon="solar:checklist-bold-duotone"
                                    width={20}
                                    style={{ color: anchorElTasks ? 'var(--palette-primary-main)' : 'var(--palette-text-secondary)' }}
                                />
                            </IconButton>

                            <IconButton size="medium" onClick={handleOpenFilters}>
                                <Badge variant="dot" sx={{ '& .MuiBadge-badge': { bgcolor: 'var(--palette-error-main)' } }} invisible={true}>
                                    <CalendarFilterIcon sx={{ color: 'var(--palette-text-secondary)', fontSize: 20 }} />
                                </Badge>
                            </IconButton>
                        </Box>
                    </Box>

                    <Popover
                        open={Boolean(anchorElCat)}
                        anchorEl={anchorElCat}
                        onClose={handleCloseCatPopover}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{ sx: { p: 2, width: 280, borderRadius: '16px', mt: 1, boxShadow: 'var(--customShadows-z20)' } }}
                    >
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Danh sách chủ đề</Typography>

                        <List sx={{ maxHeight: 200, overflow: 'auto', mb: 1 }}>
                            {categories.map((cat: any) => (
                                <ListItem
                                    key={cat._id}
                                    disableGutters
                                    sx={{ py: 0.5 }}
                                    secondaryAction={
                                        <IconButton size="small" onClick={() => handleDeleteCategory(cat._id)}>
                                            <Icon icon="solar:trash-bin-trash-bold" width={14} color="var(--palette-error-main)" />
                                        </IconButton>
                                    }
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Checkbox
                                            size="small"
                                            checked={selectedCategories.includes(cat._id)}
                                            onChange={() => handleCategoryToggle(cat._id)}
                                            sx={{
                                                color: cat.color,
                                                p: 0,
                                                '&.Mui-checked': { color: cat.color }
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={cat.name}
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Thêm chủ đề mới</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tên chủ đề..."
                            value={newCat.name}
                            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1, display: 'block' }}>Màu sắc:</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, mb: 2 }}>
                            {COLORS.map((c) => (
                                <Box
                                    key={c}
                                    onClick={() => setNewCat({ ...newCat, color: c })}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        bgcolor: c,
                                        cursor: 'pointer',
                                        border: newCat.color === c ? '2px solid' : 'none',
                                        borderColor: 'text.primary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {newCat.color === c && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />}
                                </Box>
                            ))}
                        </Box>
                        <Button fullWidth variant="contained" onClick={handleSaveCategory} sx={{ background: 'var(--palette-text-primary)', borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}>Thêm mới</Button>
                    </Popover>

                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        initialView={view}
                        locale="vi"
                        firstDay={1}
                        initialDate={new Date()}
                        events={filteredEvents}
                        headerToolbar={false}
                        height="100%"
                        expandRows={true}
                        selectable={true}
                        editable={true}
                        dayMaxEventRows={3}
                        eventDisplay="block"
                        allDayText="Cả ngày"
                        slotLabelFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                        select={(info) => handleOpenEventDialog(info.start)}
                        eventClick={(info) => {
                            const isTask = info.event.extendedProps?.type === 'task';
                            if (isTask) {
                                handleOpenTaskDialog(undefined, info.event);
                            } else {
                                handleOpenEventDialog(undefined, info.event);
                            }
                        }}
                        eventDrop={handleEventDrop}
                        eventResize={handleEventDrop}
                        displayEventEnd={true}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                        allDaySlot={false}
                        eventContent={(eventInfo) => {
                            const { extendedProps } = eventInfo.event;
                            const isTask = extendedProps.type === 'task';
                            const isCompleted = extendedProps.isCompleted;

                            const start = dayjs(eventInfo.event.start).format('HH:mm');
                            const end = dayjs(eventInfo.event.end).format('HH:mm');
                            const timeText = `${start} - ${end}`;

                            return (
                                <Tooltip
                                    title={
                                        <Box sx={{ p: 0.5 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {isTask ? '[NHIỆM VỤ] ' : ''}{eventInfo.event.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>Giờ: {timeText}</Typography>
                                            {isTask && <Typography variant="caption" sx={{ display: 'block', color: isCompleted ? 'success.light' : 'warning.light' }}>
                                                Trạng thái: {isCompleted ? 'Đã hoàn thành' : 'Đang thực hiện'}
                                            </Typography>}
                                            {extendedProps.notes && <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>Ghi chú: {extendedProps.notes}</Typography>}
                                        </Box>
                                    }
                                    arrow
                                    placement="top"
                                >
                                    <Box sx={{
                                        width: '100%',
                                        overflow: 'hidden',
                                        px: 0.5,
                                        py: 0.25,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0.1,
                                        opacity: isCompleted ? 0.6 : 1,
                                        position: 'relative'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {isTask && (
                                                <Icon
                                                    icon={isCompleted ? "solar:check-circle-bold" : "solar:checklist-bold-duotone"}
                                                    width={12}
                                                    color={isCompleted ? "#54D62C" : "inherit"}
                                                />
                                            )}
                                            <Typography variant="caption" sx={{
                                                fontWeight: 700,
                                                fontSize: '0.65rem',
                                                lineHeight: 1.1,
                                                color: 'inherit',
                                                opacity: 0.9
                                            }}>
                                                {timeText}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            lineHeight: 1.2,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            color: 'inherit',
                                            textDecoration: isCompleted ? 'line-through' : 'none'
                                        }}>
                                            {eventInfo.event.title}
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            );
                        }}
                    />
                    <Popover
                        open={Boolean(anchorElTasks)}
                        anchorEl={anchorElTasks}
                        onClose={() => setAnchorElTasks(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                p: 0,
                                width: 360,
                                height: 600,
                                borderRadius: '16px',
                                mt: 1,
                                boxShadow: 'var(--customShadows-z24)',
                                overflow: 'hidden'
                            }
                        }}
                    >
                        <DailyTaskList
                            tasks={filteredEvents}
                            onToggleTask={handleToggleTask}
                            onEditTask={(task) => handleOpenTaskDialog(undefined, task)}
                            onDeleteTask={handleDeleteTask}
                            onClose={() => setAnchorElTasks(null)}
                            onAddTask={() => {
                                setAnchorElTasks(null);
                                handleOpenTaskDialog();
                            }}
                        />
                    </Popover>
                </Card>
            </Box>

            <CalendarFiltersDrawer
                open={openFilters}
                onClose={handleCloseFilters}
                events={filteredEvents as any}
            />

            <EventDialog
                open={openEventDialog}
                onClose={handleCloseEventDialog}
                onSave={handleSaveEvent}
                initialDate={selectedDate}
                initialEvent={selectedEvent}
            />

            <TaskDialog
                open={openTaskDialog}
                onClose={handleCloseTaskDialog}
                onSave={handleSaveTask}
                initialDate={selectedDate}
                initialTask={selectedEvent}
            />
        </>
    );
};






