import { useState, useEffect } from "react";
import { 
    Box, Stack, Avatar, Typography, IconButton, CircularProgress, 
    Table, TableBody, TableCell, TableContainer, TableRow, TableHead,
    Chip, Menu, MenuItem, ListItemIcon, Divider
} from "@mui/material";
import { Icon } from "@iconify/react";
import { getVocabularies, Vocabulary, deleteVocabulary } from "../../api/vocabulary.api";
import { toast } from "react-toastify";
import { confirmDelete } from "@shared/utils/swal";
import { PREMIUM_MENU_STYLE } from "@shared/constants/menu-styles";

interface VocabularySubListProps {
    topicId: string;
    onEditVocab: (vocab: Vocabulary) => void;
}

export const VocabularySubList = ({ topicId, onEditVocab }: VocabularySubListProps) => {
    const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

    const fetchVocabs = async () => {
        setLoading(true);
        try {
            const res = await getVocabularies(topicId);
            if (res.code === 200) {
                setVocabs(Array.isArray(res.data) ? res.data : []);
            }
        } catch (err) {
            console.error("Failed to fetch vocabs for topic:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVocabs();
    }, [topicId]);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
    };

    const handleCloseMenu = (id: string) => {
        setAnchorEl({ ...anchorEl, [id]: null });
    };

    const handleDelete = (id: string) => {
        confirmDelete("Bạn có chắc chắn muốn xóa từ vựng này?", async () => {
            try {
                const res = await deleteVocabulary(id);
                if (res.code === 200) {
                    toast.success("Xóa từ vựng thành công");
                    fetchVocabs();
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Xóa thất bại");
            }
        });
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (vocabs.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Chưa có từ vựng nào trong chủ đề này</Typography>
            </Box>
        );
    }

    return (
        <TableContainer sx={{ p: 2, bgcolor: 'var(--palette-background-neutral)' }}>
            <Table size="small" sx={{ bgcolor: 'white', borderRadius: 1, overflow: 'hidden' }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f4f6f8' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Từ vựng</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>IPA</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Định nghĩa</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Loại từ</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }} align="right">Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vocabs.map((vocab) => (
                        <TableRow key={vocab._id} hover>
                            <TableCell>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Avatar src={vocab.imageUrl} variant="rounded" sx={{ width: 32, height: 32, borderRadius: '8px' }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{vocab.word}</Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>{vocab.ipa}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {vocab.definition}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip label={vocab.partOfSpeech || 'n/a'} size="small" variant="soft" color="primary" sx={{ height: 20, fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }} />
                            </TableCell>
                            <TableCell align="right">
                                <IconButton color="inherit" onClick={(e) => handleOpenMenu(e, vocab._id)}>
                                    <Icon icon="eva:more-vertical-fill" width={20} />
                                </IconButton>

                                <Menu
                                    anchorEl={anchorEl[vocab._id]}
                                    open={Boolean(anchorEl[vocab._id])}
                                    onClose={() => handleCloseMenu(vocab._id)}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    slotProps={{ 
                                        paper: { 
                                            sx: { ...PREMIUM_MENU_STYLE, width: 140 }
                                        } 
                                    }}
                                >
                                    <MenuItem 
                                        onClick={() => { handleCloseMenu(vocab._id); onEditVocab(vocab); }}
                                        sx={{ borderRadius: '8px', mb: 0.5 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: '32px !important' }}>
                                            <Icon icon="solar:pen-bold" width={20} style={{ color: '#1C252E' }} />
                                        </ListItemIcon>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1C252E' }}>Chỉnh sửa</Typography>
                                    </MenuItem>
                                    <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                                    <MenuItem 
                                        onClick={() => { handleCloseMenu(vocab._id); handleDelete(vocab._id); }} 
                                        sx={{ borderRadius: '8px', color: 'error.main' }}
                                    >
                                        <ListItemIcon sx={{ minWidth: '32px !important', color: 'inherit' }}>
                                            <Icon icon="solar:trash-bin-trash-bold" width={20} />
                                        </ListItemIcon>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>Xóa</Typography>
                                    </MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
