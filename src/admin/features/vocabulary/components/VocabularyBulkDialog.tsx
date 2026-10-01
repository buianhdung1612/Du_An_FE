import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography, IconButton, Stack,
    CircularProgress, LinearProgress, Box, Autocomplete, createFilterOptions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { createVocabBulkAI } from "../api/vocabulary.api";
import { getVocabularyTopics, createVocabularyTopic, VocabularyTopic } from "../api/vocabulary-topic.api";
import { toast } from "react-toastify";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const VocabularyBulkDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
    const filter = createFilterOptions<VocabularyTopic>();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [topics, setTopics] = useState<VocabularyTopic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState("");

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await getVocabularyTopics();
                if (res.code === 200) {
                    const data = res.data?.recordList || res.data || [];
                    setTopics(Array.isArray(data) ? data : []);
                }
            } catch (err) { /* ignore */ }
        };
        fetchTopics();
    }, [open]);

    const handleSubmit = async () => {
        const words = text
            .split("\n")
            .map(w => w.trim())
            .filter(w => w.length > 0);

        if (words.length === 0) {
            toast.warning("Vui lòng nhập danh sách từ vựng");
            return;
        }

        setLoading(true);
        setProgress(0);

        try {
            // Split into batches of 10 to avoid AI timeouts and overloading
            const batchSize = 10;
            const totalBatches = Math.ceil(words.length / batchSize);
            
            for (let i = 0; i < totalBatches; i++) {
                const batch = words.slice(i * batchSize, (i + 1) * batchSize);
                await createVocabBulkAI(batch, selectedTopicId);
                setProgress(Math.round(((i + 1) / totalBatches) * 100));
            }

            toast.success(`Đã thêm thành công ${words.length} từ vựng!`);
            onSuccess();
            onClose();
            setText("");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra trong quá trình xử lý hàng loạt");
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
            <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                    Thêm từ vựng hàng loạt (AI Tự động)
                </Typography>
                {!loading && <IconButton onClick={onClose}><CloseIcon /></IconButton>}
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                        Dán danh sách từ vựng của bạn vào đây (mỗi từ một dòng). AI sẽ tự động chuẩn hóa động từ, lọc từ thừa và phân loại giúp bạn.
                    </Typography>
                    
                    <TextField
                        multiline
                        rows={12}
                        fullWidth
                        placeholder="Ví dụ:&#10;dialed&#10;unbelievable&#10;account for: giải thích...&#10;fall out"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={loading}
                        variant="outlined"
                        sx={{ 
                            "& .MuiOutlinedInput-root": { 
                                borderRadius: "12px",
                                fontFamily: "monospace",
                                bgcolor: "#F8F9FA"
                            } 
                        }}
                    />

                    <Autocomplete
                        options={topics}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') return option;
                            if ((option as any).inputValue) return (option as any).inputValue;
                            return option.title;
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;
                            const isExisting = options.some((option) => inputValue === option.title);
                            if (inputValue !== '' && !isExisting) {
                                filtered.push({
                                    inputValue,
                                    title: `+ Tạo chủ đề mới: "${inputValue}"`,
                                    _id: "new"
                                } as any);
                            }
                            return filtered;
                        }}
                        value={(Array.isArray(topics) ? topics : []).find(t => t._id === selectedTopicId) || null}
                        onChange={async (_e, newValue: any) => {
                            if (newValue && newValue.inputValue) {
                                try {
                                    const res = await createVocabularyTopic({ title: newValue.inputValue });
                                    if (res.code === 200) {
                                        toast.success("Tạo chủ đề thành công");
                                        setTopics([...topics, res.data]);
                                        setSelectedTopicId(res.data._id);
                                    } else {
                                        toast.error("Lỗi: " + res.message);
                                    }
                                } catch {
                                    toast.error("Lỗi khi tạo chủ đề");
                                }
                            } else {
                                setSelectedTopicId(newValue?._id || "");
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Chủ đề (Topic) cho toàn bộ danh sách" size="small" placeholder="Chọn hoặc tạo topic mới để AI gen ví dụ theo ngữ cảnh..." />
                        )}
                        disabled={loading}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />

                    {loading && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" fontWeight={700}>Đang xử lý dữ liệu AI...</Typography>
                                <Typography variant="caption" fontWeight={700}>{progress}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit" disabled={loading}>Hủy</Button>
                <Button 
                    variant="contained" 
                    onClick={handleSubmit} 
                    disabled={loading || !text.trim()}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                    sx={{ 
                        borderRadius: "10px", 
                        px: 4, 
                        bgcolor: '#1C252E', 
                        "&:hover": { bgcolor: '#454f5b' } 
                    }}
                >
                    {loading ? "Đang AI xử lý..." : "Bắt đầu Gen thuật toán AI"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
