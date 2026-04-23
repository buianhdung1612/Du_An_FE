import React, { useState, useEffect } from "react";
import {
    Box, createTheme, FormControl, InputLabel, MenuItem, OutlinedInput,
    Select, Stack, TextField, ThemeProvider, useTheme, Button, IconButton,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
    Tooltip, Divider, InputAdornment, Chip, Autocomplete, Collapse, Grid, Switch, FormControlLabel,
    InputBase, useMediaQuery
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AddIcon from '@mui/icons-material/Add';
import { createVocabulary, editVocabulary, generateVocabAI, generateNoteAI, Vocabulary } from "../api/vocabulary.api";
import { getVocabularyTopics, VocabularyTopic } from "../api/vocabulary-topic.api";
import { toast } from "react-toastify";
import { uploadImagesToCloudinary } from "../../../shared/api/uploadCloudinary.api";
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    vocab?: Vocabulary;
    defaultTopicId?: string;
}

export const VocabularyDialog: React.FC<Props> = ({ open, onClose, onSuccess, vocab, defaultTopicId }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [noteGenerating, setNoteGenerating] = useState(false);
    const [notePrompt, setNotePrompt] = useState("");
    const [topics, setTopics] = useState<VocabularyTopic[]>([]);
    const [formData, setFormData] = useState({
        word: "",
        topicId: "",
        partOfSpeech: "",
        category: "word",
        ipa: "",
        audio: "",
        definition: "",
        examples: [{ title: "", sentences: [{ text: "", translation: "" }] }],
        imageUrl: "",
        wordFamily: [] as {
            word: string; ipa: string; partOfSpeech: string; definition: string;
            note?: string; examples?: { title: string, sentences: { text: string; translation: string }[] }[];
            synonyms?: string[];
            shouldStudy?: boolean;
        }[],
        relatedWords: [] as {
            word: string; ipa: string; partOfSpeech: string; definition: string;
            note?: string; examples?: { title: string, sentences: { text: string; translation: string }[] }[];
            synonyms?: string[];
            shouldStudy?: boolean;
        }[],
        synonyms: [] as string[],
        note: ""
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

        const migrateExamples = (exs: any[]) => {
            if (!exs || !Array.isArray(exs) || exs.length === 0) return [{ title: "", sentences: [{ text: "", translation: "" }] }];
            if (exs[0].sentences) return exs;
            return exs.map(ex => ({
                title: ex.title || ex.word || "",
                sentences: [{ text: ex.sentence || ex.text || "", translation: ex.translation || "" }]
            }));
        };

        if (vocab) {
            setFormData({
                word: vocab.word,
                topicId: (vocab as any).topicId?._id || (vocab as any).topicId || "",
                partOfSpeech: (vocab as any).partOfSpeech || "",
                category: (vocab as any).category || "word",
                ipa: vocab.ipa,
                audio: vocab.audio || "",
                definition: vocab.definition,
                examples: migrateExamples(vocab.examples),
                imageUrl: vocab.imageUrl || "",
                wordFamily: Array.isArray(vocab.wordFamily) ? vocab.wordFamily.map(wf => ({
                    ...wf,
                    note: (wf as any).note || "",
                    examples: migrateExamples((wf as any).examples),
                    synonyms: (wf as any).synonyms || [],
                    shouldStudy: (wf as any).shouldStudy || false
                })) : [],
                relatedWords: Array.isArray((vocab as any).relatedWords) ? (vocab as any).relatedWords.map((rw: any) => ({
                    ...rw,
                    note: rw.note || "",
                    examples: migrateExamples(rw.examples),
                    synonyms: rw.synonyms || [],
                    shouldStudy: rw.shouldStudy || false
                })) : [],
                synonyms: (vocab as any).synonyms || [],
                note: vocab.note || ""
            });
        } else {
            setFormData({
                word: "",
                topicId: defaultTopicId || "",
                partOfSpeech: "",
                category: "word",
                ipa: "",
                audio: "",
                definition: "",
                examples: [{ title: "", sentences: [{ text: "", translation: "" }] }],
                imageUrl: "",
                wordFamily: [],
                relatedWords: [],
                synonyms: [],
                note: ""
            });
        }
    }, [vocab, open, defaultTopicId]);

    const handleAI = async () => {
        if (!formData.word) {
            toast.warning("Vui lòng nhập từ vựng trước");
            return;
        }
        setAiGenerating(true);
        try {
            const res = await generateVocabAI(formData.word, formData.category, formData.topicId);
            if (res.code === 200) {
                setFormData(prev => ({
                    ...prev,
                    ipa: res.data.ipa || prev.ipa,
                    audio: res.data.audio || prev.audio,
                    partOfSpeech: res.data.partOfSpeech || prev.partOfSpeech,
                    definition: res.data.definition || prev.definition,
                    examples: res.data.examples ? res.data.examples.slice(0, 1) : prev.examples,
                    mnemonic: res.data.mnemonic || prev.mnemonic,
                    imageUrl: res.data.imageUrl || prev.imageUrl,
                    wordFamily: res.data.wordFamily || prev.wordFamily,
                    relatedWords: res.data.relatedWords || prev.relatedWords,
                    synonyms: res.data.synonyms || prev.synonyms
                }));
                toast.success("AI đã hoàn thành!");
            }
        } catch {
            toast.error("AI đang bận, vui lòng thử lại sau");
        } finally {
            setAiGenerating(false);
        }
    };

    const handleNoteAI = async () => {
        if (!formData.word || !notePrompt) {
            toast.warning("Vui lòng nhập từ và yêu cầu giải thích");
            return;
        }
        setNoteGenerating(true);
        try {
            const res = await generateNoteAI(formData.word, notePrompt);
            if (res.code === 200) {
                setFormData(prev => ({ ...prev, note: res.data }));
                toast.success("AI đã tạo ghi chú!");
            }
        } catch {
            toast.error("Lỗi AI khi tạo ghi chú");
        } finally {
            setNoteGenerating(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.word || !formData.definition) {
            toast.warning("Vui lòng nhập từ và nghĩa");
            return;
        }
        setLoading(true);
        try {
            const res = vocab
                ? await editVocabulary(vocab._id, formData)
                : await createVocabulary(formData);

            if (res.code === 200) {
                toast.success(vocab ? "Đã cập nhật" : "Đã thêm từ mới");
                onSuccess();
                onClose();
            }
        } catch {
            toast.error("Có lỗi xảy ra");
        } finally {
            setLoading(false);
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

    const addStructure = (type: 'example' | 'wf' | 'rw', idx?: number) => {
        const item = { title: "", sentences: [{ text: "", translation: "" }] };
        if (type === 'example') {
            setFormData({ ...formData, examples: [...formData.examples, item] });
        } else if (type === 'wf' && idx !== undefined) {
            const newList = [...formData.wordFamily];
            newList[idx].examples = [...(newList[idx].examples || []), item];
            setFormData({ ...formData, wordFamily: newList });
        } else if (type === 'rw' && idx !== undefined) {
            const newList = [...formData.relatedWords];
            newList[idx].examples = [...(newList[idx].examples || []), item];
            setFormData({ ...formData, relatedWords: newList });
        }
    };

    const removeStructure = (type: 'example' | 'wf' | 'rw', structureIdx: number, idx?: number) => {
        if (type === 'example') {
            if (formData.examples.length <= 1) return;
            setFormData({ ...formData, examples: formData.examples.filter((_, i) => i !== structureIdx) });
        } else if (type === 'wf' && idx !== undefined) {
            const newList = [...formData.wordFamily];
            newList[idx].examples = newList[idx].examples?.filter((_, i) => i !== structureIdx);
            setFormData({ ...formData, wordFamily: newList });
        } else if (type === 'rw' && idx !== undefined) {
            const newList = [...formData.relatedWords];
            newList[idx].examples = newList[idx].examples?.filter((_, i) => i !== structureIdx);
            setFormData({ ...formData, relatedWords: newList });
        }
    };

    const addSentence = (type: 'example' | 'wf' | 'rw', structureIdx: number, idx?: number) => {
        const item = { text: "", translation: "" };
        if (type === 'example') {
            const newExs = [...formData.examples];
            newExs[structureIdx].sentences = [...newExs[structureIdx].sentences, item];
            setFormData({ ...formData, examples: newExs });
        } else if (type === 'wf' && idx !== undefined) {
            const newList = [...formData.wordFamily];
            newList[idx].examples![structureIdx].sentences = [...newList[idx].examples![structureIdx].sentences, item];
            setFormData({ ...formData, wordFamily: newList });
        } else if (type === 'rw' && idx !== undefined) {
            const newList = [...formData.relatedWords];
            newList[idx].examples![structureIdx].sentences = [...newList[idx].examples![structureIdx].sentences, item];
            setFormData({ ...formData, relatedWords: newList });
        }
    };

    const removeSentence = (type: 'example' | 'wf' | 'rw', structureIdx: number, sentenceIdx: number, idx?: number) => {
        if (type === 'example') {
            const newExs = [...formData.examples];
            if (newExs[structureIdx].sentences.length <= 1) return;
            newExs[structureIdx].sentences = newExs[structureIdx].sentences.filter((_, i) => i !== sentenceIdx);
            setFormData({ ...formData, examples: newExs });
        } else if (type === 'wf' && idx !== undefined) {
            const newList = [...formData.wordFamily];
            if (newList[idx].examples![structureIdx].sentences.length <= 1) return;
            newList[idx].examples![structureIdx].sentences = newList[idx].examples![structureIdx].sentences.filter((_, i) => i !== sentenceIdx);
            setFormData({ ...formData, wordFamily: newList });
        } else if (type === 'rw' && idx !== undefined) {
            const newList = [...formData.relatedWords];
            if (newList[idx].examples![structureIdx].sentences.length <= 1) return;
            newList[idx].examples![structureIdx].sentences = newList[idx].examples![structureIdx].sentences.filter((_, i) => i !== sentenceIdx);
            setFormData({ ...formData, relatedWords: newList });
        }
    };

    const addWordFamily = () => {
        setFormData({
            ...formData,
            wordFamily: [...formData.wordFamily, {
                word: "", ipa: "", partOfSpeech: "", definition: "", note: "",
                examples: [{ title: "", sentences: [{ text: "", translation: "" }] }],
                shouldStudy: true
            }]
        });
    };

    const removeWordFamily = (idx: number) => {
        const newWF = formData.wordFamily.filter((_, i) => i !== idx);
        setFormData({ ...formData, wordFamily: newWF });
    };

    const updateWordFamily = (idx: number, field: string, value: string) => {
        const newWF = [...formData.wordFamily];
        (newWF[idx] as any)[field] = value;
        setFormData({ ...formData, wordFamily: newWF });
    };

    const addRelatedWord = () => {
        setFormData({
            ...formData,
            relatedWords: [...formData.relatedWords, {
                word: "", ipa: "", partOfSpeech: "", definition: "", note: "",
                examples: [{ title: "", sentences: [{ text: "", translation: "" }] }],
                shouldStudy: true
            }]
        });
    };

    const removeRelatedWord = (idx: number) => {
        const newRW = formData.relatedWords.filter((_, i) => i !== idx);
        setFormData({ ...formData, relatedWords: newRW });
    };

    const updateRelatedWord = (idx: number, field: string, value: string) => {
        const newRW = [...formData.relatedWords];
        (newRW[idx] as any)[field] = value;
        setFormData({ ...formData, relatedWords: newRW });
    };


    const [translatingIdx, setTranslatingIdx] = useState<string | null>(null);

    const handleTranslate = async (structureIdx: number, sentenceIdx: number, type: 'example' | 'wf' | 'rw', idx?: number) => {
        let textToTranslate = "";
        const id = `${type}-${idx ?? ''}-${structureIdx}-${sentenceIdx}`;

        if (type === 'example') {
            textToTranslate = formData.examples[structureIdx].sentences[sentenceIdx].text;
        } else if (type === 'wf' && idx !== undefined) {
            textToTranslate = formData.wordFamily[idx].examples![structureIdx].sentences[sentenceIdx].text;
        } else if (type === 'rw' && idx !== undefined) {
            textToTranslate = formData.relatedWords[idx].examples![structureIdx].sentences[sentenceIdx].text;
        }

        if (!textToTranslate) {
            toast.warning("Vui lòng nhập câu tiếng Anh trước");
            return;
        }

        setTranslatingIdx(id);
        try {
            const res = await translateAI(textToTranslate);
            if (res.code === 200) {
                const translation = res.data;
                if (type === 'example') {
                    const newExs = [...formData.examples];
                    newExs[structureIdx].sentences[sentenceIdx].translation = translation;
                    setFormData({ ...formData, examples: newExs });
                } else if (type === 'wf' && idx !== undefined) {
                    const newWF = [...formData.wordFamily];
                    newWF[idx].examples![structureIdx].sentences[sentenceIdx].translation = translation;
                    setFormData({ ...formData, wordFamily: newWF });
                } else if (type === 'rw' && idx !== undefined) {
                    const newRW = [...formData.relatedWords];
                    newRW[idx].examples![structureIdx].sentences[sentenceIdx].translation = translation;
                    setFormData({ ...formData, relatedWords: newRW });
                }
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Lỗi khi dịch";
            const detail = error.response?.data?.details || "";
            toast.error(`${msg}${detail ? `: ${detail}` : ''}`);
        } finally {
            setTranslatingIdx(null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setLoading(true);
            try {
                const urls = await uploadImagesToCloudinary([e.target.files[0]]);
                if (urls.length > 0) {
                    setFormData({ ...formData, imageUrl: urls[0] });
                    toast.success("Đã tải ảnh lên thành công");
                }
            } catch {
                toast.error("Lỗi khi tải ảnh");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile} PaperProps={{ sx: { borderRadius: isMobile ? 0 : "16px" } }}>
            <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                    {vocab ? "Chỉnh sửa từ vựng" : "Thêm từ vựng mới"}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Tooltip title="AI tự động điền thông tin thông minh">
                        <Button
                            variant="outlined"
                            onClick={handleAI}
                            disabled={aiGenerating}
                            startIcon={aiGenerating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon sx={{ color: 'warning.main' }} />}
                            sx={{ borderRadius: '12px', height: '48px', textTransform: 'none', fontWeight: 600, px: 2 }}
                        >
                            AI Smart Fill
                        </Button>
                    </Tooltip>
                    <IconButton onClick={onClose} sx={{ width: 48, height: 48 }}><CloseIcon /></IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                    {/* Hàng 1: Hình ảnh + Từ vựng + Phiên âm + Từ loại */}
                    {/* Mobile: stack dọc, Desktop: nằm ngang */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                        {/* Hình ảnh */}
                        <Box sx={{ width: 80, height: 80, flexShrink: 0 }}>
                            <Box sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 80, height: 80, borderRadius: '12px', border: '1px dashed #919eab',
                                bgcolor: '#f4f6f8', position: 'relative', overflow: 'hidden'
                            }}>
                                {formData.imageUrl ? (
                                    <>
                                        <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <IconButton size="small" onClick={() => setFormData({ ...formData, imageUrl: "" })} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255, 255, 255, 0.9)', p: 0.5, '&:hover': { bgcolor: '#fff' } }}>
                                            <CloseIcon sx={{ fontSize: 14, color: 'error.main' }} />
                                        </IconButton>
                                    </>
                                ) : (
                                    <Button component="label" fullWidth sx={{ height: '100%', display: 'flex', flexDirection: 'column', textTransform: 'none', color: 'text.secondary', fontSize: '0.65rem', p: 0 }}>
                                        <CloudUploadIcon sx={{ fontSize: 20, mb: 0.5 }} />
                                        Tải ảnh
                                        <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                                    </Button>
                                )}
                                {loading && <CircularProgress size={20} sx={{ position: 'absolute' }} />}
                            </Box>
                        </Box>

                        <TextField
                            sx={{
                                flex: 1.5,
                                "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' },
                                "& .MuiInputBase-input": { fontSize: '1rem' }
                            }}
                            label="Từ vựng"
                            value={formData.word}
                            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                        />

                        <TextField
                            sx={{
                                flex: 1.2,
                                "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' },
                                "& .MuiInputBase-input": { fontSize: '1rem' }
                            }}
                            label="Phiên âm (IPA)"
                            value={formData.ipa}
                            onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => speak(formData.word, formData.audio)}
                                            disabled={!formData.word}
                                        >
                                            <VolumeUpIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            select sx={{
                                flex: 0.8,
                                "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' },
                                "& .MuiSelect-select": { fontSize: '1rem' }
                            }}
                            label="Loại"
                            value={formData.partOfSpeech}
                            onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                        >
                            <MenuItem value="" sx={{ fontSize: '1rem' }}><em>Loại</em></MenuItem>
                            <MenuItem value="n" sx={{ fontSize: '1rem' }}>n</MenuItem>
                            <MenuItem value="v" sx={{ fontSize: '1rem' }}>v</MenuItem>
                            <MenuItem value="adj" sx={{ fontSize: '1rem' }}>adj</MenuItem>
                            <MenuItem value="adv" sx={{ fontSize: '1rem' }}>adv</MenuItem>
                            <MenuItem value="phrase" sx={{ fontSize: '1rem' }}>phr</MenuItem>
                        </TextField>
                    </Box>

                    {/* Hàng 2: Chủ đề + Nghĩa + Danh mục */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                        <Box sx={{ flex: 1.2 }}>
                            <Autocomplete
                                fullWidth
                                options={topics}
                                getOptionLabel={(option) => option.title}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                value={(Array.isArray(topics) ? topics : []).find(t => t._id === formData.topicId) || null}
                                onChange={(_e, newValue) => setFormData({ ...formData, topicId: newValue?._id || "" })}
                                renderInput={(params) => (
                                    <TextField {...params} label="Chủ đề (Topic)" placeholder="Chọn chủ đề..." sx={{ "& .MuiInputBase-input": { fontSize: '1rem' } }} />
                                )}
                                sx={{
                                    "& .MuiOutlinedInput-root": { borderRadius: "12px", height: '56px' }
                                }}
                            />
                        </Box>

                        <TextField
                            fullWidth sx={{
                                flex: 2,
                                "& .MuiOutlinedInput-root": { height: '56px', borderRadius: "12px" },
                                "& .MuiInputBase-input": { fontSize: '1rem' }
                            }}
                            label="Nghĩa tiếng Việt"
                            placeholder="Nhập nghĩa của từ..."
                            value={formData.definition}
                            onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                        />

                        <TextField
                            select sx={{
                                flex: 1,
                                "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' },
                                "& .MuiSelect-select": { fontSize: '1rem' }
                            }}
                            label="Danh mục"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <MenuItem value="word" sx={{ fontSize: '1rem' }}>Từ đơn</MenuItem>
                            <MenuItem value="phrasal_verb" sx={{ fontSize: '1rem' }}>Phrasal Verb</MenuItem>
                            <MenuItem value="collocation" sx={{ fontSize: '1rem' }}>Collocation</MenuItem>
                            <MenuItem value="phrase" sx={{ fontSize: '1rem' }}>Giao tiếp</MenuItem>
                        </TextField>
                    </Box>

                    {/* Hàng 3: Từ đồng nghĩa */}
                    <Autocomplete
                        multiple
                        freeSolo
                        open={false}
                        options={[]}
                        forcePopupIcon={false}
                        value={formData.synonyms}
                        onChange={(_, newValue) => setFormData({ ...formData, synonyms: newValue })}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    label={option}
                                    {...getTagProps({ index })}
                                    size="medium"
                                    sx={{ borderRadius: '8px', bgcolor: 'rgba(145, 158, 171, 0.16)', fontWeight: 600 }}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Từ đồng nghĩa"
                                placeholder="Nhập từ và nhấn Enter"
                                sx={{ "& .MuiInputBase-input": { fontSize: '1rem' } }}
                            />
                        )}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                minHeight: '56px',
                                padding: '8px 12px'
                            }
                        }}
                    />

                    <Divider><Typography variant="caption" color="text.secondary">Cấu trúc & Ví dụ sử dụng</Typography></Divider>

                    {formData.examples.map((structure, sIdx) => (
                        <Box key={sIdx} sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #eee' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
                                <TextField
                                    fullWidth size="small" variant="standard" placeholder="Cấu trúc/Cách dùng (ví dụ: tie st to st)"
                                    value={structure.title}
                                    onChange={(e) => {
                                        const newExs = [...formData.examples];
                                        newExs[sIdx].title = e.target.value;
                                        setFormData({ ...formData, examples: newExs });
                                    }}
                                    sx={{ "& .MuiInputBase-input": { fontWeight: 700, color: 'primary.main', fontSize: '0.95rem' } }}
                                />
                                {formData.examples.length > 1 && (
                                    <IconButton size="small" color="error" onClick={() => removeStructure('example', sIdx)}>
                                        <DeleteIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                )}
                            </Box>

                            <Stack spacing={1} sx={{ pl: 2, borderLeft: '2px dotted #ccc' }}>
                                {structure.sentences.map((sentence, stIdx) => (
                                    <Box key={stIdx} sx={{ display: 'flex', gap: 1, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                                        <Box
                                            sx={{
                                                flex: 1, minHeight: '48px', borderRadius: '8px', border: '1px solid rgba(145, 158, 171, 0.2)',
                                                display: 'flex', alignItems: 'center', px: 1.5, bgcolor: 'white',
                                                flexDirection: isMobile ? 'column' : 'row',
                                                py: isMobile ? 1 : 0
                                            }}
                                        >
                                            <InputBase
                                                sx={{ flex: 1, fontSize: '0.9rem' }}
                                                placeholder="Câu tiếng Anh"
                                                value={sentence.text}
                                                onChange={(e) => {
                                                    const newExs = [...formData.examples];
                                                    newExs[sIdx].sentences[stIdx].text = e.target.value;
                                                    setFormData({ ...formData, examples: newExs });
                                                }}
                                            />
                                            <Tooltip title="Tự động dịch sang tiếng Việt">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleTranslate(sIdx, stIdx, 'example')}
                                                    disabled={translatingIdx === `example--${sIdx}-${stIdx}`}
                                                    sx={{ color: 'warning.main', mx: 0.5 }}
                                                >
                                                    {translatingIdx === `example--${sIdx}-${stIdx}` ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                                                </IconButton>
                                            </Tooltip>
                                            <Typography sx={{ mx: 0.5, color: 'text.disabled' }}>-</Typography>
                                            <InputBase
                                                sx={{ flex: 1, fontSize: '0.9rem' }}
                                                placeholder="Dịch nghĩa"
                                                value={sentence.translation}
                                                onChange={(e) => {
                                                    const newExs = [...formData.examples];
                                                    newExs[sIdx].sentences[stIdx].translation = e.target.value;
                                                    setFormData({ ...formData, examples: newExs });
                                                }}
                                            />
                                        </Box>
                                        {structure.sentences.length > 1 && (
                                            <IconButton size="small" color="error" onClick={() => removeSentence('example', sIdx, stIdx)}>
                                                <CloseIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                                <Button size="small" startIcon={<AddIcon />} onClick={() => addSentence('example', sIdx)} sx={{ width: 'fit-content', fontSize: '0.7rem', color: 'primary.main', textTransform: 'none' }}>
                                    Thêm ví dụ cho cấu trúc này
                                </Button>
                            </Stack>
                        </Box>
                    ))}

                    <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addStructure('example')}
                        sx={{ width: 'fit-content', fontWeight: 700, textTransform: 'none' }}
                    >
                        Thêm cấu trúc/cách dùng
                    </Button>

                    <Divider><Typography variant="caption" color="text.secondary">Mở rộng & Ghi chú</Typography></Divider>

                    <Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>Gia đình từ (Word Family):</Typography>
                        <Stack spacing={1.5}>
                            {formData.wordFamily.map((wf, idx) => (
                                <Box key={idx} sx={{ p: 2, bgcolor: '#f4f6f8', borderRadius: 2, border: '1px solid transparent' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={3.5} md={3}>
                                            <TextField fullWidth label="Từ" size="small" value={wf.word} onChange={(e) => updateWordFamily(idx, 'word', e.target.value)} sx={{ bgcolor: 'white' }} />
                                        </Grid>
                                        <Grid item xs={6} sm={2.5} md={1.5}>
                                            <TextField select fullWidth size="small" label="Loại" value={wf.partOfSpeech} onChange={(e) => updateWordFamily(idx, 'partOfSpeech', e.target.value)} sx={{ bgcolor: 'white' }}>
                                                <MenuItem value="n">n</MenuItem><MenuItem value="v">v</MenuItem><MenuItem value="adj">adj</MenuItem><MenuItem value="adv">adv</MenuItem><MenuItem value="phrase">phr</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={6} sm={2} md={2}>
                                            <TextField fullWidth label="IPA" size="small" value={wf.ipa} onChange={(e) => updateWordFamily(idx, 'ipa', e.target.value)} sx={{ bgcolor: 'white' }} />
                                        </Grid>
                                        <Grid item xs={10} sm={3} md={4.5}>
                                            <TextField fullWidth label="Nghĩa" size="small" value={wf.definition} onChange={(e) => updateWordFamily(idx, 'definition', e.target.value)} sx={{ bgcolor: 'white' }} />
                                        </Grid>
                                        <Grid item xs={2} sm={1} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <IconButton size="small" color="error" onClick={() => removeWordFamily(idx)}><DeleteIcon fontSize="small" /></IconButton>
                                        </Grid>
                                    </Grid>

                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1.5 }}>
                                        <Button
                                            size="small"
                                            startIcon={(wf as any)._expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            onClick={() => {
                                                const newList = [...formData.wordFamily];
                                                (newList[idx] as any)._expanded = !(newList[idx] as any)._expanded;
                                                setFormData({ ...formData, wordFamily: newList });
                                            }}
                                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                                        >
                                            {(wf as any)._expanded ? "Thu gọn" : "Ví dụ & Ghi chú"}
                                        </Button>
                                    </Stack>

                                    <Collapse in={(wf as any)._expanded}>
                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ddd' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Cấu trúc & Ví dụ:</Typography>
                                                <Button size="small" startIcon={<AddIcon />} onClick={() => addStructure('wf', idx)} sx={{ fontSize: '0.65rem', p: 0 }}>Thêm cấu trúc</Button>
                                            </Box>

                                            {(wf.examples || []).map((structure, sIdx) => (
                                                <Box key={sIdx} sx={{ mb: 2, p: 1.5, border: '1px solid #f0f0f0', borderRadius: 1.5, bgcolor: 'white' }}>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                                        <TextField
                                                            fullWidth size="small" variant="standard" placeholder="Cấu trúc (ví dụ: tie st to st)"
                                                            value={structure.title}
                                                            onChange={(e) => {
                                                                const newList = [...formData.wordFamily];
                                                                newList[idx].examples![sIdx].title = e.target.value;
                                                                setFormData({ ...formData, wordFamily: newList });
                                                            }}
                                                            sx={{ "& .MuiInputBase-input": { fontWeight: 700, color: 'primary.main', fontSize: '0.8rem' } }}
                                                        />
                                                        <IconButton size="small" color="error" onClick={() => removeStructure('wf', sIdx, idx)}>
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Box>

                                                    <Stack spacing={1} sx={{ pl: 1, borderLeft: '1px dotted #ccc' }}>
                                                        {structure.sentences.map((sentence, stIdx) => (
                                                            <Box key={stIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: 1, px: 1, height: 36 }}>
                                                                    <InputBase
                                                                        sx={{ flex: 1, fontSize: '0.8rem' }} placeholder="English" value={sentence.text}
                                                                        onChange={(e) => {
                                                                            const newList = [...formData.wordFamily];
                                                                            newList[idx].examples![sIdx].sentences[stIdx].text = e.target.value;
                                                                            setFormData({ ...formData, wordFamily: newList });
                                                                        }}
                                                                    />
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleTranslate(sIdx, stIdx, 'wf', idx)}
                                                                        disabled={translatingIdx === `wf-${idx}-${sIdx}-${stIdx}`}
                                                                        sx={{ color: 'warning.main', p: 0.2 }}
                                                                    >
                                                                        {translatingIdx === `wf-${idx}-${sIdx}-${stIdx}` ? <CircularProgress size={12} /> : <AutoAwesomeIcon sx={{ fontSize: 14 }} />}
                                                                    </IconButton>
                                                                    <Typography sx={{ mx: 0.5, color: '#ccc', fontSize: '0.8rem' }}>-</Typography>
                                                                    <InputBase
                                                                        sx={{ flex: 1, fontSize: '0.8rem' }} placeholder="Việt" value={sentence.translation}
                                                                        onChange={(e) => {
                                                                            const newList = [...formData.wordFamily];
                                                                            newList[idx].examples![sIdx].sentences[stIdx].translation = e.target.value;
                                                                            setFormData({ ...formData, wordFamily: newList });
                                                                        }}
                                                                    />
                                                                </Box>
                                                                {structure.sentences.length > 1 && (
                                                                    <IconButton size="small" color="error" onClick={() => removeSentence('wf', sIdx, stIdx, idx)}>
                                                                        <CloseIcon sx={{ fontSize: 14 }} />
                                                                    </IconButton>
                                                                )}
                                                            </Box>
                                                        ))}
                                                        <Button size="small" startIcon={<AddIcon />} onClick={() => addSentence('wf', sIdx, idx)} sx={{ width: 'fit-content', fontSize: '0.6rem', p: 0 }}>Thêm ví dụ</Button>
                                                    </Stack>
                                                </Box>
                                            ))}

                                            <Typography variant="caption" sx={{ fontWeight: 700, mt: 1, mb: 1, display: 'block', color: 'text.secondary' }}>Ghi chú chi tiết cho từ này:</Typography>
                                            <Box sx={{ border: '1px solid #eee', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                                                <Tiptap
                                                    value={wf.note || ""}
                                                    onChange={(html) => updateWordFamily(idx, 'note', html)}
                                                />
                                            </Box>

                                            <Autocomplete
                                                multiple freeSolo size="small" options={[]} sx={{ mb: 2, bgcolor: 'white' }}
                                                value={wf.synonyms || []}
                                                onChange={(_, newValue) => {
                                                    const newList = [...formData.wordFamily];
                                                    newList[idx].synonyms = newValue;
                                                    setFormData({ ...formData, wordFamily: newList });
                                                }}
                                                renderTags={(value, getTagProps) => value.map((option, index) => (<Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />))}
                                                renderInput={(params) => (<TextField {...params} label="Từ đồng nghĩa" placeholder="Nhập từ và nhấn Enter" />)}
                                            />
                                        </Box>
                                    </Collapse>
                                </Box>
                            ))}
                            <Button size="small" startIcon={<AddIcon />} onClick={addWordFamily} sx={{ fontWeight: 600, width: 'fit-content' }}>Thêm gia đình từ</Button>
                        </Stack>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>Từ liên quan (Related Words):</Typography>
                        <Stack spacing={1.5}>
                            {formData.relatedWords.map((rw, idx) => (
                                <Box key={idx} sx={{ p: 2, bgcolor: '#f4f6f8', borderRadius: 2, border: '1px solid transparent' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={3.5} md={3}>
                                            <TextField fullWidth label="Từ" size="small" value={rw.word} onChange={(e) => updateRelatedWord(idx, 'word', e.target.value)} sx={{ bgcolor: 'white' }} />
                                        </Grid>
                                        <Grid item xs={6} sm={2.5} md={1.5}>
                                            <TextField select fullWidth size="small" label="Loại" value={rw.partOfSpeech} onChange={(e) => updateRelatedWord(idx, 'partOfSpeech', e.target.value)} sx={{ bgcolor: 'white' }}>
                                                <MenuItem value="n">n</MenuItem><MenuItem value="v">v</MenuItem><MenuItem value="adj">adj</MenuItem><MenuItem value="adv">adv</MenuItem><MenuItem value="phrase">phr</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={6} sm={2} md={2}>
                                            <TextField fullWidth label="IPA" size="small" value={rw.ipa} onChange={(e) => updateRelatedWord(idx, 'ipa', e.target.value)} sx={{ bgcolor: 'white' }} />
                                        </Grid>
                                        <Grid item xs={10} sm={3} md={4.5}>
                                            <TextField fullWidth label="Nghĩa" size="small" value={rw.definition} onChange={(e) => updateRelatedWord(idx, 'definition', e.target.value)} sx={{ bgcolor: 'white' }} />
                                        </Grid>
                                        <Grid item xs={2} sm={1} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <IconButton size="small" color="error" onClick={() => removeRelatedWord(idx)}><DeleteIcon fontSize="small" /></IconButton>
                                        </Grid>
                                    </Grid>

                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1.5 }}>
                                        <Button
                                            size="small"
                                            startIcon={(rw as any)._expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            onClick={() => {
                                                const newList = [...formData.relatedWords];
                                                (newList[idx] as any)._expanded = !(newList[idx] as any)._expanded;
                                                setFormData({ ...formData, relatedWords: newList });
                                            }}
                                            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                                        >
                                            {(rw as any)._expanded ? "Thu gọn" : "Ví dụ & Ghi chú"}
                                        </Button>
                                    </Stack>

                                    <Collapse in={(rw as any)._expanded}>
                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ddd' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Cấu trúc & Ví dụ:</Typography>
                                                <Button size="small" startIcon={<AddIcon />} onClick={() => addStructure('rw', idx)} sx={{ fontSize: '0.65rem', p: 0 }}>Thêm cấu trúc</Button>
                                            </Box>

                                            {(rw.examples || []).map((structure, sIdx) => (
                                                <Box key={sIdx} sx={{ mb: 2, p: 1.5, border: '1px solid #f0f0f0', borderRadius: 1.5, bgcolor: 'white' }}>
                                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                                        <TextField
                                                            fullWidth size="small" variant="standard" placeholder="Cấu trúc (ví dụ: tie st to st)"
                                                            value={structure.title}
                                                            onChange={(e) => {
                                                                const newList = [...formData.relatedWords];
                                                                newList[idx].examples![sIdx].title = e.target.value;
                                                                setFormData({ ...formData, relatedWords: newList });
                                                            }}
                                                            sx={{ "& .MuiInputBase-input": { fontWeight: 700, color: 'primary.main', fontSize: '0.8rem' } }}
                                                        />
                                                        <IconButton size="small" color="error" onClick={() => removeStructure('rw', sIdx, idx)}>
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Box>

                                                    <Stack spacing={1} sx={{ pl: 1, borderLeft: '1px dotted #ccc' }}>
                                                        {structure.sentences.map((sentence, stIdx) => (
                                                            <Box key={stIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: 1, px: 1, height: 36 }}>
                                                                    <InputBase
                                                                        sx={{ flex: 1, fontSize: '0.8rem' }} placeholder="English" value={sentence.text}
                                                                        onChange={(e) => {
                                                                            const newList = [...formData.relatedWords];
                                                                            newList[idx].examples![sIdx].sentences[stIdx].text = e.target.value;
                                                                            setFormData({ ...formData, relatedWords: newList });
                                                                        }}
                                                                    />
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleTranslate(sIdx, stIdx, 'rw', idx)}
                                                                        disabled={translatingIdx === `rw-${idx}-${sIdx}-${stIdx}`}
                                                                        sx={{ color: 'warning.main', p: 0.2 }}
                                                                    >
                                                                        {translatingIdx === `rw-${idx}-${sIdx}-${stIdx}` ? <CircularProgress size={12} /> : <AutoAwesomeIcon sx={{ fontSize: 14 }} />}
                                                                    </IconButton>
                                                                    <Typography sx={{ mx: 0.5, color: '#ccc', fontSize: '0.8rem' }}>-</Typography>
                                                                    <InputBase
                                                                        sx={{ flex: 1, fontSize: '0.8rem' }} placeholder="Việt" value={sentence.translation}
                                                                        onChange={(e) => {
                                                                            const newList = [...formData.relatedWords];
                                                                            newList[idx].examples![sIdx].sentences[stIdx].translation = e.target.value;
                                                                            setFormData({ ...formData, relatedWords: newList });
                                                                        }}
                                                                    />
                                                                </Box>
                                                                {structure.sentences.length > 1 && (
                                                                    <IconButton size="small" color="error" onClick={() => removeSentence('rw', sIdx, stIdx, idx)}>
                                                                        <CloseIcon sx={{ fontSize: 14 }} />
                                                                    </IconButton>
                                                                )}
                                                            </Box>
                                                        ))}
                                                        <Button size="small" startIcon={<AddIcon />} onClick={() => addSentence('rw', sIdx, idx)} sx={{ width: 'fit-content', fontSize: '0.6rem', p: 0 }}>Thêm ví dụ</Button>
                                                    </Stack>
                                                </Box>
                                            ))}

                                            <Typography variant="caption" sx={{ fontWeight: 700, mt: 1, mb: 1, display: 'block', color: 'text.secondary' }}>Ghi chú chi tiết cho từ này:</Typography>
                                            <Box sx={{ border: '1px solid #eee', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                                                <Tiptap
                                                    value={rw.note || ""}
                                                    onChange={(html) => updateRelatedWord(idx, 'note', html)}
                                                />
                                            </Box>

                                            <Autocomplete
                                                multiple freeSolo size="small" options={[]} sx={{ mb: 2, bgcolor: 'white' }}
                                                value={rw.synonyms || []}
                                                onChange={(_, newValue) => {
                                                    const newList = [...formData.relatedWords];
                                                    newList[idx].synonyms = newValue;
                                                    setFormData({ ...formData, relatedWords: newList });
                                                }}
                                                renderTags={(value, getTagProps) => value.map((option, index) => (<Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />))}
                                                renderInput={(params) => (<TextField {...params} label="Từ đồng nghĩa" placeholder="Nhập từ và nhấn Enter" />)}
                                            />
                                        </Box>
                                    </Collapse>
                                </Box>
                            ))}
                            <Button size="small" startIcon={<AddIcon />} onClick={addRelatedWord} sx={{ fontWeight: 600, width: 'fit-content' }}>Thêm từ liên quan</Button>
                        </Stack>
                    </Box>



                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>Trợ lý AI Ghi chú (AI Explainer):</Typography>
                        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} mb={2}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Ví dụ: Sự khác nhau giữa attractiveness và attraction..."
                                value={notePrompt}
                                onChange={(e) => setNotePrompt(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                startIcon={noteGenerating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                                onClick={handleNoteAI}
                                disabled={noteGenerating || !notePrompt}
                                sx={{ bgcolor: '#1C252E', whiteSpace: 'nowrap' }}
                            >
                                Hỏi AI
                            </Button>
                        </Stack>
                        <Tiptap
                            value={formData.note}
                            onChange={(html) => setFormData({ ...formData, note: html })}
                        />
                    </Box>

                    {/* Image UI is already handled up in the Topic row */}
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit">Hủy</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ borderRadius: "10px", px: 4, bgcolor: '#1C252E', "&:hover": { bgcolor: '#454f5b' } }}
                >
                    {loading ? "Đang lưu..." : (vocab ? "Cập nhật" : "Lưu từ vựng")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
