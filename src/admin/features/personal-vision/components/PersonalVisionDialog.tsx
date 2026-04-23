import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Stack,
    Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap";
import {
    getPersonalVisions,
    createPersonalVision,
    editPersonalVision,
    deletePersonalVision,
} from "../api/personal-vision.api";
import { toast } from "react-toastify";

import { tiptapContentStyles } from "../../../shared/components/layouts/titap/TiptapStyles";

interface Vision {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

export const PersonalVisionDialog: React.FC<Props> = ({ open, onClose }) => {
    const [visions, setVisions] = useState<Vision[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newVision, setNewVision] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(false);

    const fetchVisions = async () => {
        try {
            const res = await getPersonalVisions();
            if (res.code === 200) {
                setVisions(res.data);
            }
        } catch (error) {
            console.error("Error fetching visions:", error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchVisions();
        }
    }, [open]);

    const handleCreate = async () => {
        if (!newVision.title || !newVision.content) {
            toast.warning("Vui lòng nhập đầy đủ tiêu đề và nội dung");
            return;
        }

        setLoading(true);
        try {
            let res;
            if (editingId) {
                res = await editPersonalVision(editingId, newVision);
            } else {
                res = await createPersonalVision(newVision);
            }

            if (res.code === 200) {
                toast.success(editingId ? "Cập nhật thành công" : "Thêm tầm nhìn thành công");
                setNewVision({ title: "", content: "" });
                setIsAdding(false);
                setEditingId(null);
                fetchVisions();
            } else {
                toast.error(res.message || "Có lỗi xảy ra");
            }
        } catch {
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tầm nhìn này không?")) {
            try {
                const res = await deletePersonalVision(id);
                if (res.code === 200) {
                    toast.success("Xóa thành công");
                    fetchVisions();
                }
            } catch {
                toast.error("Xóa thất bại");
            }
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: "16px", p: 1 },
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700} component="span">
                    Tầm Nhìn Cá Nhân
                </Typography>
                <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ minHeight: "400px" }}>
                {!isAdding ? (
                    <Stack spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsAdding(true)}
                            sx={{
                                alignSelf: "flex-end",
                                borderRadius: "8px",
                                textTransform: "none",
                                bgcolor: "#1C252E",
                                "&:hover": { bgcolor: "#454f5b" },
                            }}
                        >
                            Thêm mới
                        </Button>

                        {visions.length === 0 ? (
                            <Box sx={{ py: 10, textAlign: "center" }}>
                                <Typography color="text.secondary">Bạn chưa có tầm nhìn nào. Hãy tạo mới!</Typography>
                            </Box>
                        ) : (
                            visions.map((vision) => (
                                <Paper
                                    key={vision._id}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        border: "1px solid #919eab33",
                                        borderRadius: "12px",
                                        position: "relative",
                                        "&:hover": { bgcolor: "#f4f6f8" },
                                    }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={600} color="#1C252E">
                                            {vision.title}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => {
                                                    setEditingId(vision._id);
                                                    setNewVision({ title: vision.title, content: vision.content });
                                                    setIsAdding(true);
                                                }}
                                                sx={{ p: 0.5, mr: 1 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(vision._id)}
                                                sx={{ p: 0.5 }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Box
                                        className="tiptap-content-preview"
                                        sx={[
                                            tiptapContentStyles,
                                            {
                                                backgroundColor: "transparent",
                                                "& .tiptap.ProseMirror": {
                                                    padding: "0 !important",
                                                    fontSize: "14px",
                                                    // Đảm bảo các style con không bị ghi đè mất
                                                    "& p": { my: "8px !important" },
                                                    "& h1, & h2, & h3, & h4, & h5, & h6": { 
                                                        mt: "24px !important", 
                                                        mb: "8px !important",
                                                        fontSize: "1.1rem !important" // Thu nhỏ heading cho preview
                                                    }
                                                },
                                                color: "text.secondary",
                                            }
                                        ]}
                                    >
                                        <div 
                                            className="tiptap ProseMirror" 
                                            dangerouslySetInnerHTML={{ __html: vision.content }} 
                                        />
                                    </Box>
                                    <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: "block" }}>
                                        {new Date(vision.createdAt).toLocaleDateString("vi-VN")}
                                    </Typography>
                                </Paper>
                            ))
                        )}
                    </Stack>
                ) : (
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Tiêu đề"
                            variant="outlined"
                            value={newVision.title}
                            onChange={(e) => setNewVision({ ...newVision, title: e.target.value })}
                            sx={{
                                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                            }}
                        />
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: "text.secondary" }}>
                                Nội dung tầm nhìn
                            </Typography>
                            <Tiptap
                                value={newVision.content}
                                onChange={(content) => setNewVision({ ...newVision, content })}
                            />
                        </Box>
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                {isAdding ? (
                    <>
                        <Button
                            onClick={() => {
                                setIsAdding(false);
                                setEditingId(null);
                                setNewVision({ title: "", content: "" });
                            }}
                            disabled={loading}
                            sx={{ borderRadius: "8px", textTransform: "none", color: "text.secondary" }}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCreate}
                            disabled={loading}
                            sx={{
                                borderRadius: "8px",
                                textTransform: "none",
                                bgcolor: "#1C252E",
                                "&:hover": { bgcolor: "#454f5b" },
                            }}
                        >
                            {loading ? "Đang lưu..." : (editingId ? "Cập nhật" : "Lưu tầm nhìn")}
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={onClose}
                        sx={{ borderRadius: "8px", textTransform: "none", color: "text.secondary" }}
                    >
                        Đóng
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
