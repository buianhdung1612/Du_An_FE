import { useEffect, useState, useMemo } from "react";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { LoadingButton } from "../../../shared/components/ui/LoadingButton";
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getVocabularies, Vocabulary, deleteVocabulary } from "../api/vocabulary.api";
import {
    Box, Card, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Typography, Chip, LinearProgress, Stack,
    Tabs, Tab, Autocomplete, TextField, useMediaQuery, useTheme, Button, Menu, MenuItem, ListItemIcon, ListItemText,
    Dialog, TablePagination
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { VocabularyDialog } from "../components/VocabularyDialog";
import { PhrasalVerbDialog } from "../components/PhrasalVerbDialog";
import { VocabularyBulkDialog } from "../components/VocabularyBulkDialog";
import { VocabularyDetailModal } from "../components/VocabularyDetailModal";
import { VocabularyGroupDialog } from "../components/VocabularyGroupDialog";
import { getVocabularyTopics, VocabularyTopic } from "../api/vocabulary-topic.api";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FilterListIcon from '@mui/icons-material/FilterList';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const VocabularyListPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [groupDialogOpen, setGroupDialogOpen] = useState(false);
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [topics, setTopics] = useState<VocabularyTopic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
    const [selectedVocab, setSelectedVocab] = useState<Vocabulary | undefined>(undefined);
    const [detailOpen, setDetailOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState("all");
    const [selectedDateTab, setSelectedDateTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [phrasalVerbDialogOpen, setPhrasalVerbDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const topicIdParam = selectedTopicId === "all" ? undefined : selectedTopicId;
            const res = await getVocabularies(topicIdParam, selectedDateTab);
            if (res.code === 200) {
                setVocabs(res.data);
            }

            const topicsRes = await getVocabularyTopics();
            if (topicsRes.code === 200) {
                const data = topicsRes.data?.recordList || topicsRes.data || [];
                setTopics(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedTopicId, selectedDateTab]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa từ này?")) {
            try {
                const res = await deleteVocabulary(id);
                if (res.code === 200) {
                    toast.success("Đã xóa");
                    fetchData();
                }
            } catch (error) {
                toast.error("Lỗi xóa từ");
            }
        }
    };

    const speak = (text: string, audioUrl?: string) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(() => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
            });
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    const countDue = useMemo(() => vocabs.filter(v => new Date(v.nextReview) <= new Date()).length, [vocabs]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredVocabs = useMemo(() => {
        return (currentTab === "all"
            ? vocabs
            : vocabs.filter(v => (v as any).category === currentTab))
            .filter(v => v.word.toLowerCase().includes(searchQuery.toLowerCase()) || v.definition?.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [vocabs, currentTab, searchQuery]);

    const paginatedVocabs = useMemo(() => {
        return filteredVocabs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredVocabs, page, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [searchQuery, currentTab, selectedTopicId, selectedDateTab]);

    const getCategoryLabel = (cat: string) => {
        const labels: any = {
            "word": "Từ đơn",
            "phrasal_verb": "Cụm động từ",
            "collocation": "Collocation",
            "phrase": "Giao tiếp",
            "lexical_set": "Nhóm từ"
        };
        return labels[cat] || "Từ vựng";
    };

    return (
        <>
            {/* Header: Title + Buttons */}
            <div className={`mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex ${isMobile ? 'flex-col' : 'items-start justify-end'}`}>
                <div className={isMobile ? '' : 'mr-auto'}>
                    <Title title="Kho từ vựng thông minh" />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Học tập", to: `/${prefixAdmin}/vocabulary/list` },
                            { label: "Kho từ vựng" }
                        ]}
                    />
                </div>
                <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 1.5 : 2} sx={isMobile ? { width: '100%' } : {}}>
                    <LoadingButton
                        onClick={() => navigate(`/${prefixAdmin}/vocabulary/mindmap`)}
                        label="Học theo Mindmap"
                        startIcon={<AutoFixHighIcon />}
                        sx={{
                            bgcolor: "rgba(0, 167, 111, 0.08)",
                            color: "primary.main",
                            "&:hover": { bgcolor: "rgba(0, 167, 111, 0.16)" },
                            whiteSpace: 'nowrap',
                            ...(isMobile && { width: '100%' })
                        }}
                    />
                    <LoadingButton
                        onClick={() => navigate(`/${prefixAdmin}/vocabulary/study`)}
                        label={`Học ngay (${countDue} từ)`}
                        startIcon={<PlayArrowIcon />}
                        disabled={countDue === 0}
                        sx={{
                            bgcolor: "var(--palette-primary-main)",
                            "&:hover": { bgcolor: "var(--palette-primary-dark)" },
                            whiteSpace: 'nowrap',
                            ...(isMobile && { width: '100%' })
                        }}
                    />
                    <LoadingButton
                        onClick={() => navigate(`/${prefixAdmin}/vocabulary/study?limit=30`)}
                        label={`Học 30 từ`}
                        startIcon={<PlayArrowIcon />}
                        disabled={countDue === 0}
                        sx={{
                            bgcolor: "var(--palette-info-main)",
                            "&:hover": { bgcolor: "var(--palette-info-dark)" },
                            whiteSpace: 'nowrap',
                            ...(isMobile && { width: '100%' })
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleMenuClick}
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: "#1C252E",
                            "&:hover": { bgcolor: "#454f5b" },
                            whiteSpace: 'nowrap',
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '8px',
                            height: '36px',
                            px: 2,
                            ...(isMobile && { width: '100%' })
                        }}
                    >
                        Thêm mới
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{ sx: { mt: 1, borderRadius: 2, minWidth: 220, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' } }}
                    >
                        <MenuItem onClick={() => { handleMenuClose(); setSelectedVocab(undefined); setDialogOpen(true); }} sx={{ py: 1.5 }}>
                            <ListItemIcon><AddIcon fontSize="small" sx={{ color: 'text.secondary' }} /></ListItemIcon>
                            <ListItemText primary="Thêm từ vựng" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }} />
                        </MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); setSelectedVocab(undefined); setPhrasalVerbDialogOpen(true); }} sx={{ py: 1.5 }}>
                            <ListItemIcon><AutoFixHighIcon fontSize="small" sx={{ color: 'secondary.main' }} /></ListItemIcon>
                            <ListItemText primary="Thêm Phrasal Verb (Mindmap)" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem', color: 'secondary.main' }} />
                        </MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); setSelectedVocab(undefined); setGroupDialogOpen(true); }} sx={{ py: 1.5 }}>
                            <ListItemIcon><AutoFixHighIcon fontSize="small" sx={{ color: 'primary.main' }} /></ListItemIcon>
                            <ListItemText primary="Thêm nhóm từ (Lexical Set)" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem', color: 'primary.main' }} />
                        </MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); setBulkDialogOpen(true); }} sx={{ py: 1.5 }}>
                            <ListItemIcon><AutoAwesomeIcon fontSize="small" sx={{ color: 'warning.main' }} /></ListItemIcon>
                            <ListItemText primary="Thêm hàng loạt (AI)" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem', color: 'warning.main' }} />
                        </MenuItem>
                    </Menu>
                </Stack>
            </div>

            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: isMobile ? 2 : 3, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap', flex: 1 }}>
                    <TextField
                        size="small"
                        placeholder="Tìm kiếm từ vựng, nghĩa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: 'white' },
                            width: isMobile ? '100%' : 260
                        }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap', ml: 1 }}>
                        <FilterListIcon fontSize="small" /> Lọc theo chủ đề:
                    </Typography>
                    <Autocomplete
                        size="small"
                        options={[{ _id: "all", title: "Tất cả chủ đề" } as any, ...(Array.isArray(topics) ? topics : [])]}
                        getOptionLabel={(option) => option.title}
                        value={(Array.isArray(topics) ? topics : []).find(t => t._id === selectedTopicId) || { _id: "all", title: "Tất cả chủ đề" }}
                        onChange={(_e, newValue) => setSelectedTopicId(newValue?._id || "all")}
                        renderInput={(params) => <TextField {...params} sx={{ width: isMobile ? '100%' : 220 }} />}
                        sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: 'white' },
                            ...(isMobile && { flex: 1, minWidth: 0 })
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Thời gian:</Typography>
                    <Tabs
                        value={selectedDateTab}
                        onChange={(_e, val) => setSelectedDateTab(val)}
                        variant={isMobile ? "scrollable" : "standard"}
                        scrollButtons={isMobile ? "auto" : false}
                        sx={{
                            minHeight: 36,
                            '& .MuiTab-root': {
                                minHeight: 36,
                                py: 0.5,
                                px: 2,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.8125rem'
                            }
                        }}
                    >
                        <Tab label="Tất cả" value="all" />
                        <Tab label="Hôm nay" value="today" />
                        <Tab label="Hôm qua" value="yesterday" />
                    </Tabs>
                </Box>
            </Box>

            {/* Category Tabs */}
            <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={currentTab}
                    onChange={(_e, val) => setCurrentTab(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons={isMobile ? "auto" : false}
                >
                    <Tab label="Tất cả" value="all" sx={{ fontWeight: 700, textTransform: 'none' }} />
                    <Tab label="Từ đơn" value="word" sx={{ fontWeight: 700, textTransform: 'none' }} />
                    <Tab label="Phrasal Verbs" value="phrasal_verb" sx={{ fontWeight: 700, textTransform: 'none' }} />
                    <Tab label="Collocations" value="collocation" sx={{ fontWeight: 700, textTransform: 'none' }} />
                    <Tab label="Giao tiếp" value="phrase" sx={{ fontWeight: 700, textTransform: 'none' }} />
                    <Tab label="Nhóm từ vựng" value="lexical_set" sx={{ fontWeight: 700, textTransform: 'none' }} />
                </Tabs>
            </Box>

            {/* Table or Card View */}
            {!isMobile ? (
                <Card sx={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #919eab1f", boxShadow: "none" }}>
                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table size="medium">
                            <TableHead sx={{ bgcolor: "#F4F6F8" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Ảnh</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Nội dung</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Phiên âm</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Nghĩa</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Cấp độ</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Ngày học tiếp</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={7} align="center"><LinearProgress sx={{ my: 2 }} /></TableCell></TableRow>
                                ) : filteredVocabs.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} align="center"><Typography sx={{ py: 5, color: "text.secondary" }}>Không tìm thấy từ vựng nào.</Typography></TableCell></TableRow>
                                ) : (
                                    paginatedVocabs.map((vocab) => {
                                        const isDue = new Date(vocab.nextReview) <= new Date();
                                        return (
                                            <TableRow key={vocab._id} hover>
                                                <TableCell>
                                                    {vocab.imageUrl ? (
                                                        <Box
                                                            component="img"
                                                            src={vocab.imageUrl}
                                                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setPreviewImgUrl(vocab.imageUrl || null); }}
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: '12px',
                                                                objectFit: 'cover',
                                                                border: '1px solid #919eab1f',
                                                                cursor: 'pointer',
                                                                transition: 'transform 0.2s',
                                                                '&:hover': { transform: 'scale(1.15)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#F4F6F8', border: '1px dashed #919eab4d' }} />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack spacing={0.5}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight={700}
                                                                color="#1C252E"
                                                                sx={{
                                                                    cursor: 'pointer',
                                                                    '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                                                                }}
                                                                onClick={() => {
                                                                    setSelectedVocab(vocab);
                                                                    setDetailOpen(true);
                                                                }}
                                                            >
                                                                {vocab.word}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => speak(vocab.word, (vocab as any).audio)}
                                                                sx={{ color: "primary.main", p: 0.5, bgcolor: 'rgba(0, 167, 111, 0.08)' }}
                                                            >
                                                                <VolumeUpIcon sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Stack>
                                                        {(vocab as any).partOfSpeech && (
                                                            <Typography variant="caption" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                                                                ({(vocab as any).partOfSpeech})
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                                                        {vocab.ipa}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {(vocab as any).category === 'lexical_set' ? '' : vocab.definition}
                                                    </Typography>
                                                    {vocab.synonyms?.length > 0 && (
                                                        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                            {vocab.synonyms.map((s, i) => (
                                                                <Chip key={i} label={s} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(145, 158, 171, 0.12)', fontWeight: 600 }} />
                                                            ))}
                                                        </Box>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`Lv ${vocab.level}`}
                                                        size="small"
                                                        color={vocab.level === 5 ? "success" : "primary"}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color={isDue ? "error.main" : "text.secondary"}>
                                                        {isDue ? "Đến hạn học" : dayjs(vocab.nextReview).format("DD/MM/YYYY")}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={() => {
                                                        setSelectedVocab(vocab);
                                                        if ((vocab as any).category === 'lexical_set') {
                                                            setGroupDialogOpen(true);
                                                        } else if ((vocab as any).category === 'phrasal_verb') {
                                                            setPhrasalVerbDialogOpen(true);
                                                        } else {
                                                            setDialogOpen(true);
                                                        }
                                                    }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(vocab._id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {loading ? (
                        <LinearProgress sx={{ my: 2 }} />
                    ) : filteredVocabs.length === 0 ? (
                        <Typography sx={{ py: 5, color: "text.secondary", textAlign: 'center' }}>Không tìm thấy từ vựng nào.</Typography>
                    ) : (
                        paginatedVocabs.map((vocab) => {
                            const isDue = new Date(vocab.nextReview) <= new Date();
                            return (
                                <Card key={vocab._id} sx={{ p: 2, borderRadius: '16px', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', position: 'relative' }}>
                                    <Stack direction="row" spacing={2}>
                                        {vocab.imageUrl ? (
                                            <Box
                                                component="img"
                                                src={vocab.imageUrl}
                                                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setPreviewImgUrl(vocab.imageUrl || null); }}
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '12px',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'scale(1.08)' }
                                                }}
                                            />
                                        ) : (
                                            <Box sx={{ width: 80, height: 80, borderRadius: '12px', bgcolor: '#F4F6F8', border: '1px dashed #919eab4d' }} />
                                        )}
                                        <Box sx={{ flex: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="subtitle1" fontWeight={700} onClick={() => { setSelectedVocab(vocab); setDetailOpen(true); }}>
                                                        {vocab.word}
                                                    </Typography>
                                                    <IconButton size="small" onClick={() => speak(vocab.word, (vocab as any).audio)} color="primary">
                                                        <VolumeUpIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Stack>
                                                <Box>
                                                    <IconButton size="small" onClick={() => {
                                                        setSelectedVocab(vocab);
                                                        if ((vocab as any).category === 'lexical_set') {
                                                            setGroupDialogOpen(true);
                                                        } else if ((vocab as any).category === 'phrasal_verb') {
                                                            setPhrasalVerbDialogOpen(true);
                                                        } else {
                                                            setDialogOpen(true);
                                                        }
                                                    }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(vocab._id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Stack>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                                                {vocab.ipa} {vocab.ipa && (vocab as any).partOfSpeech ? '|' : ''} {(vocab as any).partOfSpeech}
                                                {(vocab as any).category === 'lexical_set' && (
                                                    <Chip label="Nhóm từ" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', color: 'primary.main', borderColor: 'primary.main' }} />
                                                )}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                                {(vocab as any).category === 'lexical_set' ? '' : vocab.definition}
                                            </Typography>
                                            {vocab.synonyms?.length > 0 && (
                                                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    {vocab.synonyms.map((s, i) => (
                                                        <Chip key={i} label={s} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(145, 158, 171, 0.12)' }} />
                                                    ))}
                                                </Box>
                                            )}
                                            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} alignItems="center">
                                                <Chip label={`Lv ${vocab.level}`} size="small" color={vocab.level === 5 ? "success" : "primary"} variant="outlined" />
                                                <Typography variant="caption" color={isDue ? "error.main" : "text.secondary"} sx={{ fontWeight: 600 }}>
                                                    {isDue ? "Đến hạn học" : `Học lại: ${dayjs(vocab.nextReview).format("DD/MM")}`}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Card>
                            );
                        })
                    )}
                </Stack>
            )}

            {!loading && filteredVocabs.length > 0 && (
                <TablePagination
                    component="div"
                    count={filteredVocabs.length}
                    page={page}
                    onPageChange={(_e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    labelRowsPerPage="Số dòng:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`}
                    sx={{
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                            m: 0,
                        },
                        mt: 2
                    }}
                />
            )}

            <VocabularyDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSuccess={fetchData}
                vocab={selectedVocab}
            />

            <PhrasalVerbDialog
                open={phrasalVerbDialogOpen}
                onClose={() => setPhrasalVerbDialogOpen(false)}
                onSuccess={fetchData}
                vocab={selectedVocab}
            />

            <VocabularyBulkDialog
                open={bulkDialogOpen}
                onClose={() => setBulkDialogOpen(false)}
                onSuccess={fetchData}
            />

            <VocabularyGroupDialog
                open={groupDialogOpen}
                onClose={() => setGroupDialogOpen(false)}
                onSuccess={fetchData}
                vocab={selectedVocab}
            />

            <VocabularyDetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                vocab={selectedVocab}
            />

            {/* Beautiful Image Preview Dialog */}
            <Dialog
                open={Boolean(previewImgUrl)}
                onClose={() => setPreviewImgUrl(null)}
                maxWidth="md"
                PaperProps={{
                    sx: {
                        bgcolor: "transparent",
                        boxShadow: "none",
                        overflow: "hidden"
                    }
                }}
            >
                <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IconButton
                        onClick={() => setPreviewImgUrl(null)}
                        sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            bgcolor: "rgba(0,0,0,0.5)",
                            color: "white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                            zIndex: 10
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                        component="img"
                        src={previewImgUrl || ""}
                        sx={{
                            maxWidth: "100%",
                            maxHeight: "90vh",
                            borderRadius: "16px",
                            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                            objectFit: "contain",
                            bgcolor: "white",
                            p: 0.5
                        }}
                    />
                </Box>
            </Dialog>
        </>
    );
};
