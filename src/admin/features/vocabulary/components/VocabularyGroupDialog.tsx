import React, { useState, useEffect } from "react";
import {
    Box, Stack, TextField, useTheme, Button, IconButton,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    Tooltip, Autocomplete, useMediaQuery, InputBase, CircularProgress, createFilterOptions
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createVocabulary, editVocabulary, Vocabulary } from "../api/vocabulary.api";
import { getVocabularyTopics, createVocabularyTopic, VocabularyTopic } from "../api/vocabulary-topic.api";
import { toast } from "react-toastify";
import { uploadImagesToCloudinary } from "../../../shared/api/uploadCloudinary.api";
import { vocabularySchema, VocabularyFormData } from "../configs/vocabulary.schema";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    vocab?: Vocabulary;
    defaultTopicId?: string;
}

export const VocabularyGroupDialog: React.FC<Props> = ({ open, onClose, onSuccess, vocab, defaultTopicId }) => {
    const filter = createFilterOptions<VocabularyTopic>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<VocabularyTopic[]>([]);
    const [magicText, setMagicText] = useState("");
    const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<VocabularyFormData>({
        resolver: zodResolver(vocabularySchema) as any,
        defaultValues: {
            word: "",
            topicId: defaultTopicId || "",
            definition: "Nhóm từ vựng (Lexical Set)",
            category: "lexical_set",
            imageUrl: "",
            groupedWords: []
        }
    });

    const { fields: groupedWords, append, remove } = useFieldArray({
        control,
        name: "groupedWords"
    });

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
    }, []);

    useEffect(() => {
        if (open) {
            setMagicText("");
            if (vocab) {
                reset({
                    word: vocab.word,
                    topicId: (vocab as any).topicId?._id || (vocab as any).topicId || "",
                    definition: vocab.definition || "Nhóm từ vựng (Lexical Set)",
                    category: "lexical_set",
                    imageUrl: vocab.imageUrl || "",
                    groupedWords: (vocab as any).groupedWords || []
                } as any);
            } else {
                reset({
                    word: "",
                    topicId: defaultTopicId || "",
                    definition: "Nhóm từ vựng (Lexical Set)",
                    category: "lexical_set",
                    imageUrl: "",
                    groupedWords: [{ word: "", ipa: "", definition: "", note: "", imageUrl: "" }]
                });
            }
        }
    }, [vocab, open, defaultTopicId, reset]);

    const handleMagicPaste = () => {
        if (!magicText.trim()) return;
        const lines = magicText.split('\n');
        const newItems: any[] = [];
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) return;

            let word = "";
            let ipa = "";
            let definition = "";
            let note = "";

            // Phân tích cú pháp: "Word: Definition (Note)" hoac "Word: Definition"
            const colonIndex = trimmed.indexOf(':');
            if (colonIndex !== -1) {
                word = trimmed.substring(0, colonIndex).trim();
                const remainder = trimmed.substring(colonIndex + 1).trim();
                
                const openParen = remainder.indexOf('(');
                const closeParen = remainder.lastIndexOf(')');
                
                if (openParen !== -1 && closeParen !== -1 && closeParen > openParen) {
                    definition = remainder.substring(0, openParen).trim();
                    note = remainder.substring(openParen + 1, closeParen).trim();
                    // Remove trailing dot if exists inside or outside note
                    if (note.endsWith('.')) note = note.slice(0, -1);
                } else {
                    definition = remainder;
                    if (definition.endsWith('.')) definition = definition.slice(0, -1);
                }
            } else {
                word = trimmed;
            }

            const ipaMatch = word.match(/\/(.*?)\//);
            if (ipaMatch) {
                ipa = `/${ipaMatch[1]}/`;
                word = word.replace(ipaMatch[0], '').trim();
            }

            if (word) {
                newItems.push({ word, ipa, definition, note, imageUrl: "" });
            }
        });

        if (newItems.length > 0) {
            newItems.forEach(item => append(item));
            setMagicText("");
            toast.success(`Đã trích xuất ${newItems.length} từ vựng! Xóa dòng trống nếu cần.`);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setLoading(true);
            try {
                const urls = await uploadImagesToCloudinary([e.target.files[0]]);
                if (urls.length > 0) {
                    control._defaultValues.imageUrl = urls[0];
                    reset({ ...control._formValues, imageUrl: urls[0] });
                    toast.success("Đã tải ảnh lên thành công");
                }
            } catch {
                toast.error("Lỗi khi tải ảnh");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGroupWordImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setLoading(true);
            try {
                const urls = await uploadImagesToCloudinary([e.target.files[0]]);
                if (urls.length > 0) {
                    setValue(`groupedWords.${idx}.imageUrl`, urls[0]);
                    toast.success("Đã thêm ảnh cho từ vựng");
                }
            } catch {
                toast.error("Lỗi khi tải ảnh");
            } finally {
                setLoading(false);
            }
        }
    };

    const onFormSubmit = async (data: any) => {
        if (!data.groupedWords || data.groupedWords.length === 0) {
            toast.warning("Vui lòng thêm ít nhất 1 từ vựng vào bảng");
            return;
        }

        setLoading(true);
        try {
            // Loại bỏ các dòng trống
            data.groupedWords = data.groupedWords.filter((gw: any) => gw.word.trim() !== "");
            data.category = "lexical_set";
            
            // Xóa rác
            data.audio = undefined;
            data.ipa = undefined;
            data.partOfSpeech = undefined;

            const res = vocab
                ? await editVocabulary(vocab._id, data)
                : await createVocabulary(data);

            if (res.code === 200) {
                toast.success(vocab ? "Đã cập nhật nhóm từ vựng" : "Đã tạo nhóm từ vựng");
                onSuccess();
                onClose();
            } else {
                toast.error(res.message || "Có lỗi xảy ra");
            }
        } catch {
            toast.error("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile} PaperProps={{ sx: { borderRadius: isMobile ? 0 : "16px" } }}>
            <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                    {vocab ? "Chỉnh sửa Nhóm từ vựng" : "Tạo Nhóm từ vựng (Lexical Set)"}
                </Typography>
                <IconButton onClick={onClose} sx={{ width: 48, height: 48 }}><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3} component="form">
                    {/* Main Info */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                        <Controller
                            name="imageUrl"
                            control={control}
                            render={({ field }) => (
                                <Box sx={{ width: 64, height: 64, flexShrink: 0 }}>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: 64, height: 64, borderRadius: '12px', border: '1px dashed #919eab',
                                        bgcolor: '#f4f6f8', position: 'relative', overflow: 'hidden'
                                    }}>
                                        {field.value ? (
                                            <>
                                                <img
                                                     src={field.value}
                                                     alt="Preview"
                                                     onClick={(e) => { e.stopPropagation(); e.preventDefault(); setPreviewImgUrl(field.value || null); }}
                                                     style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                 />
                                                <IconButton size="small" onClick={() => field.onChange("")} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255, 255, 255, 0.9)', p: 0.25 }}>
                                                    <CloseIcon sx={{ fontSize: 12, color: 'error.main' }} />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <Button component="label" fullWidth sx={{ height: '100%', display: 'flex', flexDirection: 'column', textTransform: 'none', color: 'text.secondary', fontSize: '0.6rem', p: 0 }}>
                                                <CloudUploadIcon sx={{ fontSize: 18, mb: 0.5 }} />
                                                Tải ảnh
                                                <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                                            </Button>
                                        )}
                                        {loading && !field.value && <CircularProgress size={16} sx={{ position: 'absolute' }} />}
                                    </Box>
                                </Box>
                            )}
                        />

                        <TextField
                            {...register("word")}
                            error={!!errors.word}
                            helperText={errors.word?.message}
                            sx={{ flex: 1.5, "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' } }}
                            label="Tên Nhóm (VD: Các loại cửa)"
                        />

                        <Controller
                            name="topicId"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    fullWidth
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
                                    isOptionEqualToValue={(option, value) => (typeof value === 'string' ? option._id === value : option._id === (value as any)._id)}
                                    value={topics.find(t => t._id === (typeof field.value === 'string' ? field.value : (field.value as any)?._id)) || null}
                                    onChange={async (_e, newValue: any) => {
                                        if (newValue && newValue.inputValue) {
                                            try {
                                                const res = await createVocabularyTopic({ title: newValue.inputValue });
                                                if (res.code === 200) {
                                                    toast.success("Tạo chủ đề thành công");
                                                    setTopics([...topics, res.data]);
                                                    field.onChange(res.data._id);
                                                } else {
                                                    toast.error("Lỗi: " + res.message);
                                                }
                                            } catch {
                                                toast.error("Lỗi khi tạo chủ đề");
                                            }
                                        } else {
                                            field.onChange(newValue?._id || "");
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params} 
                                            label="Chủ đề (Topic) *" 
                                            placeholder="Chọn hoặc nhập tên chủ đề mới..." 
                                            error={!!errors.topicId}
                                            helperText={errors.topicId?.message}
                                        />
                                    )}
                                    sx={{ flex: 1.2, "& .MuiOutlinedInput-root": { borderRadius: "12px", height: '56px' } }}
                                />
                            )}
                        />
                    </Box>

                    {/* Magic Paste Area */}
                    <Box sx={{ p: 2, bgcolor: 'rgba(0, 167, 111, 0.08)', borderRadius: 2, border: '1px dashed rgba(0, 167, 111, 0.3)' }}>
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main" mb={1}>
                            Dán tự động (Magic Paste)
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                            Dán danh sách văn bản theo định dạng: <br/>
                            <code>Từ vựng: Nghĩa tiếng Việt (Ghi chú)</code>
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                            <TextField
                                multiline
                                minRows={2}
                                maxRows={5}
                                fullWidth
                                placeholder="Front door: Cửa chính (thường đẹp nhất, hướng ra đường).&#10;Back door: Cửa sau (thường dẫn ra sân sau hoặc bếp)..."
                                value={magicText}
                                onChange={(e) => setMagicText(e.target.value)}
                                sx={{ bgcolor: 'white', borderRadius: 1 }}
                            />
                            <Tooltip title="Tự động trích xuất thành Bảng">
                                <Button 
                                    variant="contained" 
                                    onClick={handleMagicPaste}
                                    sx={{ height: 56, minWidth: 100, bgcolor: 'primary.main', "&:hover": { bgcolor: 'primary.dark' } }}
                                >
                                    <AutoFixHighIcon sx={{ mr: 0.5 }} /> Xử lý
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Table Area */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">Danh sách từ vựng</Typography>
                            <Button size="small" startIcon={<AddIcon />} onClick={() => append({ word: "", definition: "", note: "" })} sx={{ fontWeight: 700, textTransform: 'none' }}>
                                Thêm dòng mới
                            </Button>
                        </Box>
                        
                        {/* Table Header */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', gap: 1, px: 2, py: 1, bgcolor: '#f4f6f8', borderRadius: 1, mb: 1 }}>
                                <Box sx={{ width: 40 }}></Box>
                                <Typography variant="caption" fontWeight={700} sx={{ flex: 1 }}>TỪ VỰNG</Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ flex: 0.8 }}>PHIÊN ÂM</Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ flex: 1.5 }}>ĐỊNH NGHĨA</Typography>
                                <Typography variant="caption" fontWeight={700} sx={{ flex: 1.5 }}>GHI CHÚ</Typography>
                                <Box sx={{ width: 32 }}></Box>
                            </Box>
                        )}

                        <Stack spacing={1}>
                            {groupedWords.map((item, idx) => {
                                const watchImageUrl = watch(`groupedWords.${idx}.imageUrl`);
                                return (
                                <Box key={item.id} sx={{ display: 'flex', gap: 1, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row', p: isMobile ? 1.5 : 0, border: isMobile ? '1px solid #eee' : 'none', borderRadius: 1 }}>
                                    <Box sx={{ width: 40, height: 40, flexShrink: 0, position: 'relative', borderRadius: 1, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', bgcolor: '#f9f9f9', alignSelf: isMobile ? 'flex-start' : 'auto' }}>
                                        {watchImageUrl ? (
                                            <>
                                                <img
                                                     src={watchImageUrl}
                                                     alt="img"
                                                     onClick={(e) => { e.stopPropagation(); e.preventDefault(); setPreviewImgUrl(watchImageUrl); }}
                                                     style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                 />
                                                <IconButton size="small" onClick={() => setValue(`groupedWords.${idx}.imageUrl`, "")} sx={{ position: 'absolute', bgcolor: 'rgba(255,255,255,0.7)', p: 0.2, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>
                                                    <CloseIcon sx={{ fontSize: 12, color: 'error.main' }} />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <IconButton component="label" size="small" sx={{ width: '100%', height: '100%', borderRadius: 0 }}>
                                                <CloudUploadIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <input type="file" hidden accept="image/*" onChange={(e) => handleGroupWordImageUpload(idx, e)} />
                                            </IconButton>
                                        )}
                                        {loading && !watchImageUrl && <CircularProgress size={12} sx={{ position: 'absolute' }} />}
                                    </Box>
                                    <InputBase 
                                        {...register(`groupedWords.${idx}.word`)} 
                                        sx={{ flex: 1, fontSize: '0.9rem', border: '1px solid #eee', px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'white' }} 
                                        placeholder="Từ vựng" 
                                    />
                                    <InputBase 
                                        {...register(`groupedWords.${idx}.ipa`)} 
                                        sx={{ flex: 0.8, fontSize: '0.9rem', border: '1px solid #eee', px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'white' }} 
                                        placeholder="Phiên âm" 
                                    />
                                    <InputBase 
                                        {...register(`groupedWords.${idx}.definition`)} 
                                        sx={{ flex: 1.5, fontSize: '0.9rem', border: '1px solid #eee', px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'white' }} 
                                        placeholder="Định nghĩa" 
                                    />
                                    <InputBase 
                                        {...register(`groupedWords.${idx}.note`)} 
                                        sx={{ flex: 1.5, fontSize: '0.9rem', border: '1px solid #eee', px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'white' }} 
                                        placeholder="Ghi chú (Tuỳ chọn)" 
                                    />
                                    <IconButton size="small" color="error" onClick={() => remove(idx)} sx={{ alignSelf: isMobile ? 'flex-end' : 'center' }}>
                                        <DeleteIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Box>
                                );
                            })}
                        </Stack>
                    </Box>

                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit">Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit(onFormSubmit)}
                    disabled={loading}
                    sx={{ borderRadius: "10px", px: 4, bgcolor: '#1C252E', "&:hover": { bgcolor: '#454f5b' } }}
                >
                    {loading ? "Đang lưu..." : (vocab ? "Cập nhật Nhóm" : "Lưu Nhóm từ")}
                </Button>
            </DialogActions>

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
        </Dialog>
    );
};
