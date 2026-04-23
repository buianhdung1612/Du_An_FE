import { useState, useEffect } from "react";
import { 
    Box, Stack, TextField, Button, CircularProgress, 
    Card, InputAdornment
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { getNoteDetail, createNote, updateNote } from "../api/note.api";
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap";
import { toast } from "react-toastify";

export const NoteEditorPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        title: "",
        topic: "",
        content: ""
    });
    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchDetail = async () => {
                try {
                    const res = await getNoteDetail(id!);
                    if (res.success) {
                        setForm({
                            title: res.data.title,
                            topic: res.data.topic || "",
                            content: res.data.content || ""
                        });
                    }
                } catch (error) {
                    toast.error("Không thể tải thông tin ghi chú");
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        }
    }, [id, isEdit]);

    const handleSave = async () => {
        if (!form.title.trim()) {
            toast.warning("Vui lòng nhập tiêu đề");
            return;
        }

        setSubmitting(true);
        try {
            if (isEdit) {
                const res = await updateNote(id!, form);
                if (res.success) {
                    toast.success("Cập nhật thành công");
                    navigate(`/${prefixAdmin}/notes`);
                }
            } else {
                const res = await createNote(form);
                if (res.success) {
                    toast.success("Tạo ghi chú thành công");
                    navigate(`/${prefixAdmin}/notes`);
                }
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 5 }}>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={isEdit ? "Chỉnh sửa ghi chú" : "Tạo ghi chú mới"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Ghi chú", to: `/${prefixAdmin}/notes` },
                            { label: isEdit ? "Chỉnh sửa" : "Tạo mới" }
                        ]}
                    />
                </div>
                <Button
                    onClick={() => navigate(`/${prefixAdmin}/notes`)}
                    variant="outlined"
                    sx={{ borderRadius: "12px", mr: 2 }}
                >
                    Hủy bỏ
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={submitting}
                    sx={{
                        background: 'var(--palette-text-primary)',
                        fontWeight: 700,
                        borderRadius: "12px",
                        px: 4,
                        "&:hover": { background: "var(--palette-grey-700)" }
                    }}
                >
                    {submitting ? "Đang lưu..." : "Lưu ghi chú"}
                </Button>
            </div>

            <Stack spacing={3}>
                <Card sx={{ p: 3, borderRadius: '20px' }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Tiêu đề ghi chú"
                            placeholder="Nhập tiêu đề ghi chú của bạn..."
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: '12px' } }}
                        />
                        <TextField
                            fullWidth
                            label="Chủ đề / Nhãn"
                            placeholder="Ví dụ: DSA, Tiếng Anh, Dự án..."
                            value={form.topic}
                            onChange={(e) => setForm({ ...form, topic: e.target.value })}
                            variant="outlined"
                            InputProps={{ 
                                sx: { borderRadius: '12px' },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Icon icon="solar:tag-bold" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Stack>
                </Card>

                <Box>
                    <Tiptap 
                        value={form.content} 
                        onChange={(content) => setForm({ ...form, content })} 
                    />
                </Box>
            </Stack>
        </Box>
    );
};
