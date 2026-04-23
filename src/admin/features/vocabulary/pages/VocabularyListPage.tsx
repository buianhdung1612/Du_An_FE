import { useEffect, useState } from "react";
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
    Tabs, Tab, Autocomplete, TextField, useMediaQuery, useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { VocabularyDialog } from "../components/VocabularyDialog";
import { VocabularyBulkDialog } from "../components/VocabularyBulkDialog";
import { VocabularyDetailModal } from "../components/VocabularyDetailModal";
import { getVocabularyTopics, VocabularyTopic } from "../api/vocabulary-topic.api";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FilterListIcon from '@mui/icons-material/FilterList';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
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
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [topics, setTopics] = useState<VocabularyTopic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
    const [selectedVocab, setSelectedVocab] = useState<Vocabulary | undefined>(undefined);
    const [detailOpen, setDetailOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState("all");
    const [selectedDateTab, setSelectedDateTab] = useState("all");

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

    const countDue = vocabs.filter(v => new Date(v.nextReview) <= new Date()).length;

    const filteredVocabs = currentTab === "all"
        ? vocabs
        : vocabs.filter(v => (v as any).category === currentTab);

    const getCategoryLabel = (cat: string) => {
        const labels: any = {
            "word": "Từ đơn",
            "phrasal_verb": "Cụm động từ",
            "collocation": "Collocation",
            "phrase": "Giao tiếp"
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
                        onClick={() => navigate(`/${prefixAdmin}/vocabulary/study`)}
                        label={`Học ngay (${countDue} từ đến hạn)`}
                        startIcon={<PlayArrowIcon />}
                        disabled={countDue === 0}
                        sx={{
                            bgcolor: "var(--palette-primary-main)",
                            "&:hover": { bgcolor: "var(--palette-primary-dark)" },
                            ...(isMobile && { width: '100%' })
                        }}
                    />
                    <LoadingButton
                        onClick={() => setBulkDialogOpen(true)}
                        label="Thêm hàng loạt (AI)"
                        variant="outlined"
                        startIcon={<AutoAwesomeIcon />}
                        sx={{
                            borderColor: "#1C252E",
                            color: "#1C252E",
                            "&:hover": { borderColor: "#454f5b", bgcolor: "rgba(28, 37, 46, 0.04)" },
                            ...(isMobile && { width: '100%' })
                        }}
                    />
                    <LoadingButton
                        onClick={() => {
                            setSelectedVocab(undefined);
                            setDialogOpen(true);
                        }}
                        label="Thêm từ mới"
                        startIcon={<AddIcon />}
                        sx={isMobile ? { width: '100%' } : {}}
                    />
                </Stack>
            </div>

            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: isMobile ? 2 : 3, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
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
                                    filteredVocabs.map((vocab) => {
                                        const isDue = new Date(vocab.nextReview) <= new Date();
                                        return (
                                            <TableRow key={vocab._id} hover>
                                                <TableCell>
                                                    {vocab.imageUrl ? (
                                                        <Box
                                                            component="img"
                                                            src={vocab.imageUrl}
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: '12px',
                                                                objectFit: 'cover',
                                                                border: '1px solid #919eab1f'
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
                                                        {vocab.definition}
                                                    </Typography>
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
                                                        setDialogOpen(true);
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
                        filteredVocabs.map((vocab) => {
                            const isDue = new Date(vocab.nextReview) <= new Date();
                            return (
                                <Card key={vocab._id} sx={{ p: 2, borderRadius: '16px', boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', position: 'relative' }}>
                                    <Stack direction="row" spacing={2}>
                                        <Box
                                            component="img"
                                            src={vocab.imageUrl || "https://api-prod-minimal-v700.pages.dev/assets/images/cover/cover-1.webp"}
                                            sx={{ width: 80, height: 80, borderRadius: '12px', objectFit: 'cover' }}
                                        />
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
                                                    <IconButton size="small" onClick={() => { setSelectedVocab(vocab); setDialogOpen(true); }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(vocab._id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Stack>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                                                {vocab.ipa} | {(vocab as any).partOfSpeech}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                                {vocab.definition}
                                            </Typography>
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

            <VocabularyDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSuccess={fetchData}
                vocab={selectedVocab}
            />

            <VocabularyBulkDialog
                open={bulkDialogOpen}
                onClose={() => setBulkDialogOpen(false)}
                onSuccess={fetchData}
            />

            <VocabularyDetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                vocab={selectedVocab}
            />
        </>
    );
};
