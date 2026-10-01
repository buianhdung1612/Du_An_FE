import { useEffect, useState } from "react";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { LoadingButton } from "../../../shared/components/ui/LoadingButton";
import AddIcon from '@mui/icons-material/Add';
import { getVocabularies, Vocabulary, deleteVocabulary } from "../api/vocabulary.api";
import {
    Box, Card, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Typography, Chip, LinearProgress, Stack,
    useMediaQuery, useTheme, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { PhrasalVerbDialog } from "../components/PhrasalVerbDialog";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const PhrasalVerbListPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVocab, setSelectedVocab] = useState<Vocabulary | undefined>(undefined);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch with phrasal_verb category filter
            // Note: The API doesn't have a category filter param in getVocabularies 
            // but we can filter on frontend or update API if needed.
            // For now, let's fetch all and filter, or use the category tab logic if possible.
            const res = await getVocabularies();
            if (res.code === 200) {
                const list = res.data.filter((v: any) => v.category === "phrasal_verb");
                setVocabs(list);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
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
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <>
            <div className={`mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex ${isMobile ? 'flex-col' : 'items-start justify-end'}`}>
                <div className={isMobile ? '' : 'mr-auto'}>
                    <Title title="Quản lý Phrasal Verb" />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Anh Văn", to: `/${prefixAdmin}/vocabulary/list` },
                            { label: "Phrasal Verb" }
                        ]}
                    />
                </div>
                <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 1.5 : 2} sx={isMobile ? { width: '100%' } : {}}>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/${prefixAdmin}/vocabulary/mindmap`)}
                        startIcon={<AutoFixHighIcon />}
                        sx={{
                            bgcolor: "rgba(0, 167, 111, 0.08)",
                            color: "primary.main",
                            "&:hover": { bgcolor: "rgba(0, 167, 111, 0.16)" },
                            px: 3, borderRadius: '12px', fontWeight: 700
                        }}
                    >
                        Xem Mindmap
                    </Button>
                    <LoadingButton
                        onClick={() => { setSelectedVocab(undefined); setDialogOpen(true); }}
                        label="Thêm Phrasal Verb"
                        startIcon={<AddIcon />}
                        sx={{ px: 3, borderRadius: '12px' }}
                    />
                </Stack>
            </div>

            <Card sx={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #919eab1f", boxShadow: "none" }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: "#F4F6F8" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Phrasal Verb</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Động từ gốc</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Nghĩa & Từ đồng nghĩa</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Cấp độ</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center"><LinearProgress sx={{ my: 2 }} /></TableCell></TableRow>
                            ) : vocabs.length === 0 ? (
                                <TableRow><TableCell colSpan={5} align="center"><Typography sx={{ py: 5, color: "text.secondary" }}>Chưa có Phrasal Verb nào.</Typography></TableCell></TableRow>
                            ) : (
                                vocabs.map((vocab) => (
                                    <TableRow key={vocab._id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="body1" fontWeight={700}>{vocab.word}</Typography>
                                                <IconButton size="small" onClick={() => speak(vocab.word)} sx={{ color: "primary.main" }}>
                                                    <VolumeUpIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={(vocab as any).rootWord || "-"} size="small" sx={{ fontWeight: 700, bgcolor: 'primary.lighter', color: 'primary.darker' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>{vocab.definition}</Typography>
                                            <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {vocab.synonyms?.map((s, i) => (
                                                    <Chip key={i} label={s} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={`Lv ${vocab.level}`} size="small" color="primary" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => { setSelectedVocab(vocab); setDialogOpen(true); }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(vocab._id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <PhrasalVerbDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSuccess={fetchData}
                vocab={selectedVocab}
            />
        </>
    );
};
