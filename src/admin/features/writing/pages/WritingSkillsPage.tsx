import React, { useState, useEffect } from "react";
import {
    Box, Card, CardContent, Grid, Stack, Typography, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, IconButton, Tooltip, Chip, CircularProgress,
    useTheme, useMediaQuery, Zoom, Divider, Paper
} from "@mui/material";
import {
    Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon,
    AutoAwesome as AutoAwesomeIcon, HistoryEdu as HistoryEduIcon,
    MenuBook as MenuBookIcon, Assessment as AssessmentIcon
} from "@mui/icons-material";
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap";
import {
    getWritings, createWriting, editWriting, deleteWriting,
    generateWritingFeedback, WritingItem
} from "../api/writing.api";
import { toast } from "react-toastify";

export const WritingSkillsPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [writings, setWritings] = useState<WritingItem[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<WritingItem | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form fields
    const [title, setTitle] = useState("");
    const [prompt, setPrompt] = useState("");
    const [promptVi, setPromptVi] = useState("");
    const [myWriting, setMyWriting] = useState("");
    const [sampleWriting, setSampleWriting] = useState("");
    const [feedback, setFeedback] = useState("");
    
    // AI state
    const [aiGenerating, setAiGenerating] = useState(false);

    const fetchWritings = async () => {
        setLoading(true);
        try {
            const res = await getWritings();
            if (res.code === 200) {
                setWritings(res.data);
            }
        } catch {
            toast.error("Không thể tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWritings();
    }, []);

    const handleOpenCreate = () => {
        setSelectedItem(null);
        setIsEditing(true);
        setTitle("");
        setPrompt("");
        setPromptVi("");
        setMyWriting("");
        setSampleWriting("");
        setFeedback("");
        setOpenDialog(true);
    };

    const handleOpenDetail = (item: WritingItem) => {
        setSelectedItem(item);
        setIsEditing(false);
        setTitle(item.title);
        setPrompt(item.prompt);
        setPromptVi(item.promptVi || "");
        setMyWriting(item.myWriting || "");
        setSampleWriting(item.sampleWriting || "");
        setFeedback(item.feedback || "");
        setOpenDialog(true);
    };

    const handleOpenEdit = (item: WritingItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedItem(item);
        setIsEditing(true);
        setTitle(item.title);
        setPrompt(item.prompt);
        setPromptVi(item.promptVi || "");
        setMyWriting(item.myWriting || "");
        setSampleWriting(item.sampleWriting || "");
        setFeedback(item.feedback || "");
        setOpenDialog(true);
    };

    const handleDelete = async (item: WritingItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
        try {
            const res = await deleteWriting(item._id!);
            if (res.code === 200) {
                toast.success("Đã xóa bài viết thành công!");
                fetchWritings();
            }
        } catch {
            toast.error("Lỗi khi xóa bài viết");
        }
    };

    const handleSave = async () => {
        if (!prompt.trim()) {
            toast.warning("Vui lòng nhập đề bài");
            return;
        }

        const autoTitle = prompt.split("\n")[0].trim().slice(0, 80) + (prompt.length > 80 ? "..." : "");

        const payload: WritingItem = {
            title: autoTitle,
            prompt,
            promptVi,
            myWriting,
            sampleWriting,
            feedback
        };

        try {
            let res;
            if (selectedItem) {
                res = await editWriting(selectedItem._id!, payload);
            } else {
                res = await createWriting(payload);
            }

            if (res.code === 200) {
                toast.success(selectedItem ? "Đã cập nhật bài viết!" : "Đã tạo bài viết mới!");
                setOpenDialog(false);
                fetchWritings();
            }
        } catch {
            toast.error("Có lỗi xảy ra khi lưu");
        }
    };

    const handleAIFeedback = async () => {
        if (!prompt.trim() || !myWriting.trim()) {
            toast.warning("Vui lòng nhập đề bài và bài viết của bạn trước khi nhờ AI chấm điểm!");
            return;
        }

        setAiGenerating(true);
        try {
            const res = await generateWritingFeedback(prompt, myWriting);
            if (res.code === 200) {
                setFeedback(res.data);
                toast.success("AI đã phân tích bài viết thành công!");
            }
        } catch {
            toast.error("AI bận, vui lòng thử lại sau");
        } finally {
            setAiGenerating(false);
        }
    };

    return (
        <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#F8F9FA" }}>
            {/* Header section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} color="#1C252E" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <HistoryEduIcon sx={{ fontSize: 36, color: "primary.main" }} />
                        Luyện Kỹ Năng Viết (Writing Skills)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Rèn luyện các chủ đề viết tiếng Anh chuẩn IELTS, TOEFL và nhận góp ý chấm điểm thông minh từ trợ lý AI.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    sx={{
                        bgcolor: "#1C252E",
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 700,
                        px: 3,
                        py: 1.5,
                        boxShadow: "0 8px 16px rgba(28, 37, 46, 0.15)",
                        "&:hover": { bgcolor: "#454f5b" }
                    }}
                >
                    Tạo đề bài mới
                </Button>
            </Stack>

            {/* List area */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
                    <CircularProgress color="inherit" />
                </Box>
            ) : writings.length === 0 ? (
                <Paper
                    sx={{
                        p: 6,
                        textAlign: "center",
                        borderRadius: "24px",
                        border: "1px dashed rgba(145, 158, 171, 0.2)",
                        bgcolor: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(8px)"
                    }}
                >
                    <HistoryEduIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h5" fontWeight={700} color="text.secondary">Chưa có bài viết nào</Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mt: 1, mb: 3 }}>
                        Hãy bắt đầu hành trình cải thiện kỹ năng viết của bạn bằng việc tạo đề bài đầu tiên!
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenCreate} sx={{ borderRadius: "10px", fontWeight: 700 }}>
                        Tạo đề bài đầu tiên
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {writings.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <Zoom in={true}>
                                <Card
                                    onClick={() => handleOpenDetail(item)}
                                    sx={{
                                        borderRadius: "20px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                                        border: "1px solid rgba(145, 158, 171, 0.1)",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease-in-out",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        "&:hover": {
                                            transform: "translateY(-6px)",
                                            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
                                            borderColor: "primary.main"
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                            <Chip
                                                label={item.feedback ? "Đã có góp ý AI" : "Chờ viết bài"}
                                                color={item.feedback ? "success" : "default"}
                                                size="small"
                                                sx={{
                                                    borderRadius: "8px",
                                                    fontWeight: 700,
                                                    fontSize: "0.75rem",
                                                    bgcolor: item.feedback ? "rgba(34, 197, 94, 0.1)" : "rgba(145, 158, 171, 0.1)",
                                                    color: item.feedback ? "success.main" : "text.secondary"
                                                }}
                                            />

                                            <Stack direction="row" spacing={0.5}>
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton size="small" onClick={(e) => handleOpenEdit(item, e)} sx={{ color: "text.secondary" }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa vĩnh viễn">
                                                    <IconButton size="small" color="error" onClick={(e) => handleDelete(item, e)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </Stack>

                                        <Typography variant="h6" fontWeight={750} color="#1C252E" sx={{ mb: 1, lineClamp: 2, display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>
                                            {item.title}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineClamp: 3, display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, flexGrow: 1 }}>
                                            {item.prompt}
                                        </Typography>

                                        {item.promptVi && (
                                            <Typography variant="caption" color="text.disabled" italic sx={{ lineClamp: 1, display: "-webkit-box", overflow: "hidden", WebkitBoxOrient: "vertical", WebkitLineClamp: 1 }}>
                                                💡 {item.promptVi}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Zoom>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Split layout Detail/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="lg"
                fullWidth
                scroll="paper"
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : "24px",
                        bgcolor: "#FAFDFB"
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        m: 0, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center",
                        borderBottom: "1px solid rgba(145, 158, 171, 0.15)", bgcolor: "white"
                    }}
                >
                    <Typography variant="h5" fontWeight={800} color="#1C252E" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HistoryEduIcon color="primary" />
                        {isEditing ? (selectedItem ? "Chỉnh sửa bài viết" : "Tạo đề bài mới") : "Chi tiết bài luyện viết"}
                    </Typography>
                    <IconButton onClick={() => setOpenDialog(false)}><CloseIcon /></IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 4, bgcolor: "#F9FAFB" }}>
                    <Grid container spacing={4}>
                        {/* Left column: Topic, Translate, My Writing, Sample Essay */}
                        <Grid item xs={12} md={7}>
                            <Stack spacing={3}>
                                {/* Basic Info Card */}
                                <Card sx={{ borderRadius: "16px", p: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}>
                                    <Typography variant="subtitle2" fontWeight={800} color="primary" sx={{ mb: 2 }}>📝 THÔNG TIN ĐỀ BÀI</Typography>
                                    
                                    {isEditing ? (
                                        <Stack spacing={2.5}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="Đề bài"
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="Nhập đề bài tiếng Anh..."
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                            />
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label="Nội dung tiếng Việt"
                                                value={promptVi}
                                                onChange={(e) => setPromptVi(e.target.value)}
                                                placeholder="Nhập bản dịch hoặc gợi ý bằng tiếng Việt..."
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                            />
                                        </Stack>
                                    ) : (
                                        <Stack spacing={1.5}>
                                            <Typography variant="h6" fontWeight={750} color="#1C252E">Đề bài</Typography>
                                            <Box sx={{ bgcolor: "#F4F6F8", p: 2.5, borderRadius: "12px", borderLeft: "4px solid", borderColor: "primary.main" }}>
                                                <Typography variant="body1" fontWeight={550} color="#212B36" sx={{ whiteSpace: "pre-line" }}>
                                                    {prompt}
                                                </Typography>
                                            </Box>
                                            {promptVi && (
                                                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", gap: 0.5, fontStyle: "italic" }}>
                                                    💡 <strong>Nội dung tiếng Việt:</strong> {promptVi}
                                                </Typography>
                                            )}
                                        </Stack>
                                    )}
                                </Card>

                                {/* My Essay Card */}
                                <Card sx={{ borderRadius: "16px", p: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={800} color="primary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <HistoryEduIcon fontSize="small" /> BÀI VIẾT CỦA TÔI
                                        </Typography>
                                        
                                        {!isEditing && (
                                            <Chip
                                                label={`${myWriting.trim().split(/\s+/).filter(Boolean).length} từ`}
                                                variant="outlined"
                                                size="small"
                                                sx={{ borderRadius: "8px", fontWeight: 700 }}
                                            />
                                        )}
                                    </Stack>

                                    {isEditing ? (
                                        <Tiptap value={myWriting} onChange={setMyWriting} />
                                    ) : myWriting ? (
                                        <Box sx={{ border: "1px solid #EAEAEA", borderRadius: "12px", p: 2.5, bgcolor: "white", minHeight: "150px" }} dangerouslySetInnerHTML={{ __html: myWriting }} />
                                    ) : (
                                        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic", py: 2 }}>
                                            Bạn chưa viết bài cho chủ đề này. Hãy click Sửa để viết bài.
                                        </Typography>
                                    )}
                                </Card>

                                {/* Sample Essay Card */}
                                <Card sx={{ borderRadius: "16px", p: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}>
                                    <Typography variant="subtitle2" fontWeight={800} color="success.main" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <MenuBookIcon fontSize="small" /> BÀI MẪU THAM KHẢO (SAMPLE WRITING)
                                    </Typography>

                                    {isEditing ? (
                                        <Tiptap value={sampleWriting} onChange={setSampleWriting} />
                                    ) : sampleWriting ? (
                                        <Box sx={{ border: "1px solid #EAEAEA", borderRadius: "12px", p: 2.5, bgcolor: "#F4FAF6", minHeight: "100px" }} dangerouslySetInnerHTML={{ __html: sampleWriting }} />
                                    ) : (
                                        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: "italic", py: 2 }}>
                                            Chưa có bài mẫu cho chủ đề này.
                                        </Typography>
                                    )}
                                </Card>
                            </Stack>
                        </Grid>

                        {/* Right column: AI Feedback / Góp ý */}
                        <Grid item xs={12} md={5}>
                            <Card
                                sx={{
                                    borderRadius: "16px",
                                    p: 3,
                                    height: "100%",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                                    border: "1.5px dashed rgba(34, 197, 94, 0.25)",
                                    bgcolor: "rgba(244, 250, 246, 0.4)",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={800} color="success.dark" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <AssessmentIcon fontSize="small" /> GÓP Ý & SỬA LỖI TỪ AI (FEEDBACK)
                                    </Typography>

                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        disabled={aiGenerating || !myWriting.trim()}
                                        onClick={handleAIFeedback}
                                        startIcon={aiGenerating ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeIcon />}
                                        sx={{
                                            borderRadius: "10px",
                                            textTransform: "none",
                                            fontWeight: 700,
                                            boxShadow: "none"
                                        }}
                                    >
                                        Chấm bài AI
                                    </Button>
                                </Stack>

                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                    {aiGenerating ? (
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "300px", gap: 2 }}>
                                            <CircularProgress color="success" />
                                            <Typography variant="body2" color="success.main" fontWeight={600} className="animate-pulse">
                                                AI đang đọc đề và phân tích bài viết của bạn...
                                            </Typography>
                                        </Box>
                                    ) : isEditing ? (
                                        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                                Bạn có thể chỉnh sửa phản hồi của AI bên dưới hoặc để AI tự động tạo lại:
                                            </Typography>
                                            <Tiptap value={feedback} onChange={setFeedback} />
                                        </Box>
                                    ) : feedback ? (
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                borderRadius: "12px",
                                                border: "1px solid rgba(145, 158, 171, 0.15)",
                                                bgcolor: "white",
                                                height: "100%",
                                                maxHeight: "600px",
                                                overflowY: "auto",
                                                "& h3": { fontSize: "1.1rem", fontWeight: 750, color: "primary.main", mt: 2, mb: 1 },
                                                "& p, & li": { fontSize: "0.9rem", color: "#333", lineHeight: 1.6 }
                                            }}
                                            dangerouslySetInnerHTML={{ __html: feedback }}
                                        />
                                    ) : (
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "300px", textAlign: "center", p: 3 }}>
                                            <AutoAwesomeIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                                            <Typography variant="body1" fontWeight={700} color="text.secondary">Chưa có đánh giá AI</Typography>
                                            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                                                Hãy viết bài luận của bạn ở khung bên trái và click **"Chấm bài AI"** để nhận phân tích ngữ pháp, lỗi sai và thang điểm chi tiết!
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: "1px solid rgba(145, 158, 171, 0.15)", bgcolor: "white" }}>
                    {isEditing ? (
                        <>
                            <Button onClick={() => setOpenDialog(false)} color="inherit" sx={{ fontWeight: 700 }}>Hủy</Button>
                            <Button
                                variant="contained"
                                onClick={handleSave}
                                sx={{
                                    bgcolor: "#1C252E",
                                    borderRadius: "10px",
                                    px: 4,
                                    fontWeight: 700,
                                    "&:hover": { bgcolor: "#454f5b" }
                                }}
                            >
                                Lưu bài viết
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outlined" onClick={() => setIsEditing(true)} startIcon={<EditIcon />} sx={{ borderRadius: "10px", fontWeight: 700 }}>
                                Chỉnh sửa bài này
                            </Button>
                            <Button variant="contained" onClick={() => setOpenDialog(false)} sx={{ bgcolor: "#1C252E", borderRadius: "10px", px: 4, fontWeight: 700, "&:hover": { bgcolor: "#454f5b" } }}>
                                Đóng
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default WritingSkillsPage;
