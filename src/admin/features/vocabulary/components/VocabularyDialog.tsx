import React, { useState, useEffect, useCallback } from "react";
import {
    Box, MenuItem,
    Stack, TextField, useTheme, Button, IconButton,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
    Tooltip, Divider, InputAdornment, Chip, Autocomplete, Collapse,
    InputBase, useMediaQuery, createFilterOptions
} from "@mui/material";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createVocabulary, editVocabulary, generateVocabAI, generateNoteAI, Vocabulary } from "../api/vocabulary.api";
import { getVocabularyTopics, createVocabularyTopic, VocabularyTopic } from "../api/vocabulary-topic.api";
import { toast } from "react-toastify";
import { uploadImagesToCloudinary } from "../../../shared/api/uploadCloudinary.api";
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap";
import { vocabularySchema, VocabularyFormData } from "../configs/vocabulary.schema";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    vocab?: Vocabulary;
    defaultTopicId?: string;
}

export const VocabularyDialog: React.FC<Props> = ({ open, onClose, onSuccess, vocab, defaultTopicId }) => {
    const filter = createFilterOptions<VocabularyTopic>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [ipaGenerating, setIpaGenerating] = useState(false);
    const [noteGenerating, setNoteGenerating] = useState(false);
    const [notePrompt, setNotePrompt] = useState("");
    const [topics, setTopics] = useState<VocabularyTopic[]>([]);
    const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors }
    } = useForm<VocabularyFormData>({
        resolver: zodResolver(vocabularySchema) as any,
        defaultValues: {
            word: "",
            rootWord: "",
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
        }
    });

    const { fields: exampleFields, append: appendExample, remove: removeExample } = useFieldArray({
        control,
        name: "examples"
    });

    const { fields: wordFamilyFields, append: appendWordFamily, remove: removeWordFamily } = useFieldArray({
        control,
        name: "wordFamily"
    });

    const { fields: relatedWordsFields, append: appendRelatedWord, remove: removeRelatedWord } = useFieldArray({
        control,
        name: "relatedWords"
    });

    // Helper to migrate legacy example structures
    const migrateExamples = useCallback((exs: any[]) => {
        if (!exs || !Array.isArray(exs) || exs.length === 0) return [{ title: "", sentences: [{ text: "", translation: "" }] }];
        if (exs[0].sentences) return exs;
        return exs.map(ex => ({
            title: ex.title || ex.word || "",
            sentences: [{ text: ex.sentence || ex.text || "", translation: ex.translation || "" }]
        }));
    }, []);

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
            if (vocab) {
                reset({
                    word: vocab.word,
                    rootWord: (vocab as any).rootWord || "",
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
                        examples: migrateExamples((wf as any).examples),
                        synonyms: (wf as any).synonyms || [],
                        shouldStudy: (wf as any).shouldStudy || false,
                        _expanded: false // UI only state
                    })) : [],
                    relatedWords: Array.isArray((vocab as any).relatedWords) ? (vocab as any).relatedWords.map((rw: any) => ({
                        ...rw,
                        examples: migrateExamples(rw.examples),
                        synonyms: rw.synonyms || [],
                        shouldStudy: rw.shouldStudy || false,
                        _expanded: false // UI only state
                    })) : [],
                    synonyms: (vocab as any).synonyms || [],
                    note: vocab.note || ""
                } as any);
            } else {
                reset({
                    word: "",
                    rootWord: "",
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
        }
    }, [vocab, open, defaultTopicId, reset, migrateExamples]);

    const handleAI = async () => {
        const word = getValues("word");
        const category = getValues("category");
        const topicId = getValues("topicId");
        if (!word) {
            toast.warning("Vui lòng nhập từ vựng trước");
            return;
        }
        setAiGenerating(true);
        try {
            const res = await generateVocabAI(word, category, topicId);
            if (res.code === 200) {
                const data = res.data;
                if (data.ipa) setValue("ipa", data.ipa);
                if (data.audio) setValue("audio", data.audio);
                if (data.partOfSpeech) setValue("partOfSpeech", data.partOfSpeech);
                if (data.definition) setValue("definition", data.definition);
                if (data.examples) setValue("examples", data.examples.slice(0, 1));
                if (data.imageUrl) setValue("imageUrl", data.imageUrl);
                if (data.wordFamily) setValue("wordFamily", data.wordFamily.map((wf: any) => ({ ...wf, _expanded: false })));
                if (data.relatedWords) setValue("relatedWords", data.relatedWords.map((rw: any) => ({ ...rw, _expanded: false })));
                if (data.synonyms) setValue("synonyms", data.synonyms);

                toast.success("AI đã hoàn thành!");
            }
        } catch {
            toast.error("AI đang bận, vui lòng thử lại sau");
        } finally {
            setAiGenerating(false);
        }
    };

    const handleIpaAI = async () => {
        const word = getValues("word");
        if (!word) {
            toast.warning("Vui lòng nhập từ vựng trước");
            return;
        }
        setIpaGenerating(true);
        try {
            const res = await generateVocabAI(word, getValues("category"), getValues("topicId"), true);
            if (res.code === 200 && res.data) {
                if (res.data.ipa) {
                    setValue("ipa", res.data.ipa);
                    toast.success("Đã lấy phiên âm thành công!");
                } else {
                    toast.warning("Không tìm thấy phiên âm");
                }
                if (res.data.audio) {
                    setValue("audio", res.data.audio);
                }
            } else {
                toast.error("Không lấy được phiên âm");
            }
        } catch {
            toast.error("AI đang bận, vui lòng thử lại sau");
        } finally {
            setIpaGenerating(false);
        }
    };

    const handleNoteAI = async () => {
        const word = getValues("word");
        if (!word || !notePrompt) {
            toast.warning("Vui lòng nhập từ và yêu cầu giải thích");
            return;
        }
        setNoteGenerating(true);
        try {
            const res = await generateNoteAI(word, notePrompt);
            if (res.code === 200) {
                setValue("note", res.data);
                toast.success("AI đã tạo ghi chú!");
            }
        } catch {
            toast.error("Lỗi AI khi tạo ghi chú");
        } finally {
            setNoteGenerating(false);
        }
    };

    const onFormSubmit = async (data: any) => {
        setLoading(true);
        try {
            const res = vocab
                ? await editVocabulary(vocab._id, data)
                : await createVocabulary(data);

            if (res.code === 200) {
                toast.success(vocab ? "Đã cập nhật" : "Đã thêm từ mới");
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setLoading(true);
            try {
                const urls = await uploadImagesToCloudinary([e.target.files[0]]);
                if (urls.length > 0) {
                    setValue("imageUrl", urls[0]);
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
                <Stack spacing={3} component="form">
                    {/* Main Row */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                        <Controller
                            name="imageUrl"
                            control={control}
                            render={({ field }) => (
                                <Box sx={{ width: 80, height: 80, flexShrink: 0 }}>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: 80, height: 80, borderRadius: '12px', border: '1px dashed #919eab',
                                        bgcolor: '#f4f6f8', position: 'relative', overflow: 'hidden'
                                    }}>
                                        {field.value ? (
                                            <>
                                                <img
                                                    src={field.value}
                                                    alt="Preview"
                                                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setPreviewImgUrl(field.value); }}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                />
                                                <IconButton size="small" onClick={() => field.onChange("")} sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255, 255, 255, 0.9)', p: 0.5 }}>
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
                            )}
                        />

                        <TextField
                            {...register("word")}
                            error={!!errors.word}
                            helperText={errors.word?.message}
                            sx={{ flex: 1.5, "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' } }}
                            label="Từ vựng"
                            InputLabelProps={{ shrink: true }}
                        />

                        {watch("category") === "phrasal_verb" && (
                            <TextField
                                {...register("rootWord")}
                                sx={{ flex: 1, "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' } }}
                                label="Động từ gốc"
                                placeholder="Ví dụ: Put, Go, Get..."
                                InputLabelProps={{ shrink: true }}
                            />
                        )}

                        {watch("category") !== "phrasal_verb" && (
                            <>
                                <TextField
                                    {...register("ipa")}
                                    sx={{ flex: 1.2, "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' } }}
                                    label="Phiên âm (IPA)"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" sx={{ gap: 0.5 }}>
                                                <Tooltip title="Lấy phiên âm bằng AI">
                                                    <span>
                                                        <IconButton
                                                            onClick={handleIpaAI}
                                                            disabled={ipaGenerating}
                                                            size="small"
                                                        >
                                                            {ipaGenerating ? (
                                                                <CircularProgress size={16} color="inherit" />
                                                            ) : (
                                                                <AutoAwesomeIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                                                            )}
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <IconButton
                                                    onClick={() => speak(getValues("word"), getValues("audio"))}
                                                    size="small"
                                                >
                                                    <VolumeUpIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <TextField
                                    select
                                    {...register("partOfSpeech")}
                                    sx={{ flex: 0.8, "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' } }}
                                    label="Loại"
                                    defaultValue=""
                                >
                                    <MenuItem value=""><em>Loại</em></MenuItem>
                                    <MenuItem value="n">n</MenuItem>
                                    <MenuItem value="v">v</MenuItem>
                                    <MenuItem value="adj">adj</MenuItem>
                                    <MenuItem value="adv">adv</MenuItem>
                                    <MenuItem value="phrase">phr</MenuItem>
                                </TextField>
                            </>
                        )}
                    </Box>

                    {/* Topic, Definition, Category */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                        {watch("category") !== "phrasal_verb" && (
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
                        )}

                        <TextField
                            {...register("definition")}
                            error={!!errors.definition}
                            helperText={errors.definition?.message}
                            fullWidth
                            sx={{ flex: 2, "& .MuiOutlinedInput-root": { height: '56px', borderRadius: "12px" } }}
                            label="Nghĩa tiếng Việt"
                            placeholder="Nhập nghĩa của từ..."
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            select
                            {...register("category")}
                            sx={{ flex: 1, "& .MuiOutlinedInput-root": { height: '56px', borderRadius: '12px' } }}
                            label="Danh mục"
                            defaultValue="word"
                        >
                            <MenuItem value="word">Từ đơn</MenuItem>
                            <MenuItem value="phrasal_verb">Phrasal Verb</MenuItem>
                            <MenuItem value="collocation">Collocation</MenuItem>
                            <MenuItem value="phrase">Giao tiếp</MenuItem>
                        </TextField>
                    </Box>

                    {/* Synonyms */}
                    <Controller
                        name="synonyms"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                multiple
                                freeSolo
                                open={false}
                                options={[]}
                                value={field.value || []}
                                onChange={(_, newValue) => field.onChange(newValue)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip label={option} {...getTagProps({ index })} size="medium" sx={{ borderRadius: '8px', bgcolor: 'rgba(145, 158, 171, 0.16)', fontWeight: 600 }} />
                                    ))
                                }
                                renderInput={(params) => <TextField {...params} label="Từ đồng nghĩa" placeholder="Nhập từ và nhấn Enter" />}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: '56px', padding: '8px 12px' } }}
                            />
                        )}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary">Cấu trúc & Ví dụ sử dụng</Typography>
                        <Button size="small" startIcon={<AddIcon />} onClick={() => appendExample({ title: "", sentences: [{ text: "", translation: "" }] })} sx={{ fontWeight: 700, textTransform: 'none' }}>
                            Thêm cấu trúc
                        </Button>
                    </Box>

                    {exampleFields.map((structure, sIdx) => (
                        <Box key={structure.id} sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2, border: '1px solid #eee' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
                                <TextField
                                    {...register(`examples.${sIdx}.title`)}
                                    fullWidth size="small" variant="standard" placeholder="Cấu trúc/Cách dùng"
                                    sx={{ "& .MuiInputBase-input": { fontWeight: 700, color: 'primary.main', fontSize: '0.95rem' } }}
                                />
                                {exampleFields.length > 1 && (
                                    <IconButton size="small" color="error" onClick={() => removeExample(sIdx)}>
                                        <DeleteIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                )}
                            </Box>

                            <Stack spacing={1} sx={{ pl: 2, borderLeft: '2px dotted #ccc' }}>
                                <ExampleSentences control={control} register={register} sIdx={sIdx} isMobile={isMobile} />
                            </Stack>
                        </Box>
                    ))}



                    {watch("category") !== "phrasal_verb" && (
                        <>
                            <Divider><Typography variant="caption" color="text.secondary">Mở rộng & Ghi chú</Typography></Divider>

                            {/* Word Family */}
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">Gia đình từ (Word Family):</Typography>
                                    <Button size="small" startIcon={<AddIcon />} onClick={() => appendWordFamily({ word: "", ipa: "", partOfSpeech: "", definition: "", examples: [{ title: "", sentences: [{ text: "", translation: "" }] }], shouldStudy: true, _expanded: true } as any)} sx={{ fontWeight: 600, textTransform: 'none' }}>Thêm gia đình từ</Button>
                                </Box>
                                <Stack spacing={1.5}>
                                    {wordFamilyFields.map((wf, idx) => (
                                        <WordFamilyItem key={wf.id} control={control} register={register} idx={idx} remove={removeWordFamily} setValue={setValue} />
                                    ))}
                                </Stack>
                            </Box>

                            {/* Related Words */}
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">Từ liên quan (Related Words):</Typography>
                                    <Button size="small" startIcon={<AddIcon />} onClick={() => appendRelatedWord({ word: "", ipa: "", partOfSpeech: "", definition: "", examples: [{ title: "", sentences: [{ text: "", translation: "" }] }], shouldStudy: true, _expanded: true } as any)} sx={{ fontWeight: 600, textTransform: 'none' }}>Thêm từ liên quan</Button>
                                </Box>
                                <Stack spacing={1.5}>
                                    {relatedWordsFields.map((rw, idx) => (
                                        <RelatedWordItem key={rw.id} control={control} register={register} idx={idx} remove={removeRelatedWord} setValue={setValue} />
                                    ))}
                                </Stack>
                            </Box>
                        </>
                    )}

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>Trợ lý AI Ghi chú (AI Explainer):</Typography>
                        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} mb={2}>
                            <TextField fullWidth size="small" placeholder="Ví dụ: Sự khác nhau giữa attractiveness và attraction..." value={notePrompt} onChange={(e) => setNotePrompt(e.target.value)} />
                            <Button variant="contained" startIcon={noteGenerating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />} onClick={handleNoteAI} disabled={noteGenerating || !notePrompt} sx={{ bgcolor: '#1C252E', whiteSpace: 'nowrap' }}>Hỏi AI</Button>
                        </Stack>
                        <Controller
                            name="note"
                            control={control}
                            render={({ field }) => <Tiptap value={field.value || ""} onChange={field.onChange} />}
                        />
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
                    {loading ? "Đang lưu..." : (vocab ? "Cập nhật" : "Lưu từ vựng")}
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

// --- Sub-components for Form Sections ---

const ExampleSentences = ({ control, register, sIdx, isMobile }: any) => {
    const { fields, append, remove } = useFieldArray({ control, name: `examples.${sIdx}.sentences` });
    return (
        <>
            {fields.map((sentence: any, stIdx: number) => (
                <Box key={sentence.id} sx={{ display: 'flex', gap: 1, alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                    <Box sx={{ flex: 1, minHeight: '48px', borderRadius: '8px', border: '1px solid rgba(145, 158, 171, 0.2)', display: 'flex', alignItems: 'center', px: 1.5, bgcolor: 'white', py: isMobile ? 1 : 0 }}>
                        <InputBase {...register(`examples.${sIdx}.sentences.${stIdx}.text`)} sx={{ flex: 1, fontSize: '0.9rem' }} placeholder="Câu tiếng Anh" />
                        <Typography sx={{ mx: 0.5, color: 'text.disabled' }}>-</Typography>
                        <InputBase {...register(`examples.${sIdx}.sentences.${stIdx}.translation`)} sx={{ flex: 1, fontSize: '0.9rem' }} placeholder="Dịch nghĩa" />
                    </Box>
                    {fields.length > 1 && (
                        <IconButton size="small" color="error" onClick={() => remove(stIdx)}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                    )}
                </Box>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={() => append({ text: "", translation: "" })} sx={{ width: 'fit-content', fontSize: '0.7rem', color: 'primary.main', textTransform: 'none' }}>
                Thêm ví dụ cho cấu trúc này
            </Button>
        </>
    );
};

const WordFamilyItem = ({ control, register, idx, remove, setValue }: any) => {
    const expanded = useWatch({ control, name: `wordFamily.${idx}._expanded` as any });
    const { fields: examples, append: appendEx, remove: removeEx } = useFieldArray({ control, name: `wordFamily.${idx}.examples` as any });

    return (
        <Box sx={{ p: 2, bgcolor: '#f4f6f8', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField {...register(`wordFamily.${idx}.word`)} label="Từ" size="small" sx={{ flex: 1, minWidth: 120, bgcolor: 'white' }} />
                <TextField select {...register(`wordFamily.${idx}.partOfSpeech`)} size="small" label="Loại" sx={{ width: 80, bgcolor: 'white' }} defaultValue="n">
                    <MenuItem value="n">n</MenuItem><MenuItem value="v">v</MenuItem><MenuItem value="adj">adj</MenuItem><MenuItem value="adv">adv</MenuItem><MenuItem value="phrase">phr</MenuItem>
                </TextField>
                <TextField {...register(`wordFamily.${idx}.ipa`)} label="IPA" size="small" sx={{ flex: 1, minWidth: 100, bgcolor: 'white' }} />
                <TextField {...register(`wordFamily.${idx}.definition`)} label="Nghĩa" size="small" sx={{ flex: 2, minWidth: 200, bgcolor: 'white' }} />
                <IconButton size="small" color="error" onClick={() => remove(idx)}><DeleteIcon fontSize="small" /></IconButton>
            </Box>

            <Button
                size="small"
                startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setValue(`wordFamily.${idx}._expanded` as any, !expanded)}
                sx={{ mt: 1, textTransform: 'none' }}
            >
                {expanded ? "Thu gọn" : "Ví dụ & Ghi chú"}
            </Button>

            <Collapse in={!!expanded}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ddd' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="primary.main">Cấu trúc & Ví dụ</Typography>
                        <Button size="small" startIcon={<AddIcon />} onClick={() => appendEx({ title: "", sentences: [{ text: "", translation: "" }] })} sx={{ fontSize: '0.65rem' }}>Thêm cấu trúc</Button>
                    </Box>

                    {examples.map((ex: any, sIdx: number) => (
                        <Box key={ex.id} sx={{ mb: 2, p: 1.5, border: '1px solid #f0f0f0', borderRadius: 1.5, bgcolor: 'white' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                <TextField {...register(`wordFamily.${idx}.examples.${sIdx}.title`)} fullWidth size="small" variant="standard" placeholder="Cấu trúc" sx={{ "& .MuiInputBase-input": { fontWeight: 700, fontSize: '0.8rem' } }} />
                                <IconButton size="small" color="error" onClick={() => removeEx(sIdx)}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                            </Box>
                            <NestedSentences control={control} register={register} parentPath={`wordFamily.${idx}.examples.${sIdx}`} />
                        </Box>
                    ))}

                    <Box sx={{ mt: 2 }}>
                        <Controller
                            name={`wordFamily.${idx}.synonyms` as any}
                            control={control}
                            render={({ field }) => (
                                <Autocomplete multiple freeSolo size="small" options={[]} value={field.value || []} onChange={(_, nv) => field.onChange(nv)}
                                    renderTags={(v, p) => v.map((o, i) => <Chip variant="outlined" label={o} size="small" {...p({ index: i })} sx={{ borderRadius: '6px' }} />)}
                                    renderInput={(p) => <TextField {...p} label="Từ đồng nghĩa" sx={{ bgcolor: 'white' }} />} />
                            )}
                        />
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

const RelatedWordItem = ({ control, register, idx, remove, setValue }: any) => {
    const expanded = useWatch({ control, name: `relatedWords.${idx}._expanded` as any });
    const { fields: examples, append: appendEx, remove: removeEx } = useFieldArray({ control, name: `relatedWords.${idx}.examples` as any });

    return (
        <Box sx={{ p: 2, bgcolor: '#f4f6f8', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField {...register(`relatedWords.${idx}.word`)} label="Từ" size="small" sx={{ flex: 1, minWidth: 120, bgcolor: 'white' }} />
                <TextField select {...register(`relatedWords.${idx}.partOfSpeech`)} size="small" label="Loại" sx={{ width: 80, bgcolor: 'white' }} defaultValue="n">
                    <MenuItem value="n">n</MenuItem><MenuItem value="v">v</MenuItem><MenuItem value="adj">adj</MenuItem><MenuItem value="adv">adv</MenuItem><MenuItem value="phrase">phr</MenuItem>
                </TextField>
                <TextField {...register(`relatedWords.${idx}.ipa`)} label="IPA" size="small" sx={{ flex: 1, minWidth: 100, bgcolor: 'white' }} />
                <TextField {...register(`relatedWords.${idx}.definition`)} label="Nghĩa" size="small" sx={{ flex: 2, minWidth: 200, bgcolor: 'white' }} />
                <IconButton size="small" color="error" onClick={() => remove(idx)}><DeleteIcon fontSize="small" /></IconButton>
            </Box>

            <Button
                size="small"
                startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setValue(`relatedWords.${idx}._expanded` as any, !expanded)}
                sx={{ mt: 1, textTransform: 'none' }}
            >
                {expanded ? "Thu gọn" : "Ví dụ & Ghi chú"}
            </Button>

            <Collapse in={!!expanded}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ddd' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, mt: 1 }}>
                        <Typography variant="caption" fontWeight={800} color="primary.main">Cấu trúc & Ví dụ</Typography>
                        <Button size="small" startIcon={<AddIcon />} onClick={() => appendEx({ title: "", sentences: [{ text: "", translation: "" }] })} sx={{ fontSize: '0.65rem' }}>Thêm cấu trúc</Button>
                    </Box>
                    {examples.map((ex: any, sIdx: number) => (
                        <Box key={ex.id} sx={{ mb: 2, p: 1.5, border: '1px solid #f0f0f0', borderRadius: 1.5, bgcolor: 'white' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                <TextField {...register(`relatedWords.${idx}.examples.${sIdx}.title`)} fullWidth size="small" variant="standard" placeholder="Cấu trúc" sx={{ "& .MuiInputBase-input": { fontWeight: 700, fontSize: '0.8rem' } }} />
                                <IconButton size="small" color="error" onClick={() => removeEx(sIdx)}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                            </Box>
                            <NestedSentences control={control} register={register} parentPath={`relatedWords.${idx}.examples.${sIdx}`} />
                        </Box>
                    ))}

                    <Box sx={{ mt: 2 }}>
                        <Controller
                            name={`relatedWords.${idx}.synonyms` as any}
                            control={control}
                            render={({ field }) => (
                                <Autocomplete multiple freeSolo size="small" options={[]} value={field.value || []} onChange={(_, nv) => field.onChange(nv)}
                                    renderTags={(v, p) => v.map((o, i) => <Chip variant="outlined" label={o} size="small" {...p({ index: i })} sx={{ borderRadius: '6px' }} />)}
                                    renderInput={(p) => <TextField {...p} label="Từ đồng nghĩa" sx={{ bgcolor: 'white' }} />} />
                            )}
                        />
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

const NestedSentences = ({ control, register, parentPath }: any) => {
    const { fields, append, remove } = useFieldArray({ control, name: `${parentPath}.sentences` });
    return (
        <Stack spacing={1} sx={{ pl: 1, borderLeft: '1px dotted #ccc' }}>
            {fields.map((sentence: any, stIdx: number) => (
                <Box key={sentence.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: 1, px: 1, height: 36 }}>
                        <InputBase {...register(`${parentPath}.sentences.${stIdx}.text`)} sx={{ flex: 1, fontSize: '0.8rem' }} placeholder="English" />
                        <InputBase {...register(`${parentPath}.sentences.${stIdx}.translation`)} sx={{ flex: 1, fontSize: '0.8rem' }} placeholder="Việt" />
                    </Box>
                    {fields.length > 1 && <IconButton size="small" color="error" onClick={() => remove(stIdx)}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>}
                </Box>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={() => append({ text: "", translation: "" })} sx={{ width: 'fit-content', fontSize: '0.6rem', p: 0 }}>Thêm ví dụ</Button>
        </Stack>
    );
};
