import { useState, useEffect } from "react";
import { 
    Box, Stack, Typography, Grid, Card, IconButton, 
    Button, TextField, InputAdornment, Chip, CircularProgress,
    Tooltip
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { getNotes, INote, deleteNote } from "../api/note.api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { confirmDelete } from "../../../shared/utils/swal";

export const NoteListPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<INote[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getNotes({ keyword: search });
            if (res.success) {
                setNotes(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [search]);

    const handleDelete = (id: string) => {
        confirmDelete("Bạn có chắc chắn muốn xóa ghi chú này?", async () => {
            try {
                const res = await deleteNote(id);
                if (res.success) {
                    toast.success("Xóa thành công");
                    fetchData();
                } else {
                    toast.error(res.message);
                }
            } catch (error) {
                toast.error("Xóa thất bại");
            }
        });
    };

    return (
        <Box sx={{ pb: 5 }}>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Ghi chú của tôi"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Ghi chú" }
                        ]}
                    />
                </div>
                <Button
                    onClick={() => navigate(`/${prefixAdmin}/notes/create`)}
                    variant="contained"
                    startIcon={<Icon icon="solar:add-circle-bold" />}
                    sx={{
                        background: 'var(--palette-text-primary)',
                        fontWeight: 700,
                        borderRadius: "12px",
                        textTransform: "none",
                        px: 3,
                        "&:hover": { background: "var(--palette-grey-700)" }
                    }}
                >
                    Tạo ghi chú mới
                </Button>
            </div>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm ghi chú theo tiêu đề hoặc chủ đề..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon icon="solar:magnifer-bold" style={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: '16px', bgcolor: 'white' }
                    }}
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            ) : notes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.neutral', borderRadius: '24px' }}>
                    <Icon icon="solar:notes-bold-duotone" style={{ fontSize: 64, color: 'text.disabled', marginBottom: 16 }} />
                    <Typography color="text.secondary">Chưa có ghi chú nào được tìm thấy</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {notes.map((note) => (
                        <Grid item xs={12} sm={6} md={4} key={note._id}>
                            <Card sx={{ 
                                p: 3, 
                                borderRadius: '20px', 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 'var(--customShadows-z12)'
                                }
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Chip 
                                        label={note.topic || "Chung"} 
                                        size="small" 
                                        color="primary" 
                                        variant="soft"
                                        sx={{ fontWeight: 700, borderRadius: '8px' }}
                                    />
                                    <Box>
                                        <IconButton size="small" onClick={() => navigate(`/${prefixAdmin}/notes/edit/${note._id}`)}>
                                            <Icon icon="solar:pen-bold" style={{ color: 'var(--palette-text-primary)' }} />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(note._id)}>
                                            <Icon icon="solar:trash-bin-trash-bold" />
                                        </IconButton>
                                    </Box>
                                </Stack>

                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
                                    {note.title}
                                </Typography>

                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ 
                                        flexGrow: 1, 
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        minHeight: '63px'
                                    }}
                                >
                                    {/* Strip HTML tags for preview */}
                                    {note.content.replace(/<[^>]*>?/gm, '') || "Không có nội dung..."}
                                </Typography>

                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed var(--palette-divider)' }}>
                                    <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Icon icon="solar:clock-circle-bold" />
                                        {dayjs(note.updatedAt).format("DD/MM/YYYY HH:mm")}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
