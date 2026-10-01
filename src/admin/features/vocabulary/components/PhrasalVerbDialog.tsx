import React, { useState, useEffect } from "react";
import { z } from "zod";
import {
    Box, Stack, TextField, Button, IconButton,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
    Divider, useMediaQuery, useTheme
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import { createVocabulary, editVocabulary, Vocabulary } from "../api/vocabulary.api";
import { vocabularySchema, VocabularyFormData } from "../configs/vocabulary.schema";
import { toast } from "react-toastify";
import { Autocomplete, Chip } from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    vocab?: Vocabulary;
}

const phrasalVerbSchema = vocabularySchema.extend({
    topicId: z.string().optional().or(z.literal("")),
});

export const PhrasalVerbDialog: React.FC<Props> = ({ open, onClose, onSuccess, vocab }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<VocabularyFormData>({
        resolver: zodResolver(phrasalVerbSchema) as any,
        defaultValues: {
            word: "",
            rootWord: "",
            category: "phrasal_verb",
            definition: "",
            examples: [{ title: "", sentences: [{ text: "", translation: "" }] }],
            topicId: "", // Backend handles default
            synonyms: [],
            note: ""
        }
    });

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.log("Validation Errors:", errors);
            toast.error("Vui lòng kiểm tra lại thông tin");
        }
    }, [errors]);

    const { fields: exampleFields, append: appendExample, remove: removeExample } = useFieldArray({
        control,
        name: "examples"
    });

    useEffect(() => {
        if (open) {
            if (vocab) {
                reset({
                    word: vocab.word,
                    rootWord: (vocab as any).rootWord || "",
                    category: "phrasal_verb",
                    definition: vocab.definition,
                    examples: vocab.examples,
                    synonyms: (vocab as any).synonyms || [],
                    note: vocab.note || ""
                } as any);
            } else {
                reset({
                    word: "",
                    rootWord: "",
                    category: "phrasal_verb",
                    definition: "",
                    examples: [{ title: "", sentences: [{ text: "", translation: "" }] }],
                    topicId: "",
                    synonyms: [],
                    note: ""
                });
            }
        }
    }, [vocab, open, reset]);

    const onFormSubmit = async (data: any) => {
        // Automatically extract rootWord from the first word of the phrasal verb
        if (data.word) {
            const firstWord = data.word.trim().split(/\s+/)[0];
            data.rootWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase(); // Capitalize
        }
        
        console.log("Saving Phrasal Verb Data:", data);
        
        setLoading(true);
        try {
            const res = vocab
                ? await editVocabulary(vocab._id, data)
                : await createVocabulary(data);

            if (res.code === 200) {
                toast.success(vocab ? "Đã cập nhật" : "Đã thêm Phrasal Verb");
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
            <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={700}>
                    {vocab ? "Chỉnh sửa Phrasal Verb" : "Thêm Phrasal Verb mới"}
                </Typography>
                <IconButton onClick={onClose} sx={{ width: 48, height: 48 }}><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                <Stack spacing={3} component="form">
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                        <TextField
                            {...register("word")}
                            label="Cụm động từ"
                            placeholder="Ví dụ: Put off..."
                            error={!!errors.word}
                            helperText={errors.word?.message}
                            fullWidth
                            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                        />

                        <TextField
                            {...register("definition")}
                            label="Nghĩa cốt lõi"
                            placeholder="Nhập nghĩa..."
                            error={!!errors.definition}
                            helperText={errors.definition?.message}
                            fullWidth
                            sx={{ flex: 1.5, "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                        />
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
                                onChange={(_, newValue) => {
                                    field.onChange(newValue);
                                    console.log("Current Synonyms State:", newValue);
                                }}
                                onBlur={field.onBlur}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip 
                                            label={option} 
                                            {...getTagProps({ index })} 
                                            size="medium" 
                                            sx={{ 
                                                borderRadius: '8px', 
                                                bgcolor: 'rgba(145, 158, 171, 0.16)', 
                                                fontWeight: 600,
                                                '& .MuiChip-label': { px: 1.5 }
                                            }} 
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Từ đồng nghĩa" 
                                        placeholder="Nhập từ và nhấn Enter"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                )}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", minHeight: '56px' } }}
                            />
                        )}
                    />

                    <Divider><Typography variant="caption" fontWeight={700}>Ví dụ sử dụng</Typography></Divider>

                    <SimpleExamples control={control} register={register} />
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
                    {loading ? "Đang lưu..." : (vocab ? "Cập nhật" : "Lưu Phrasal Verb")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const SimpleExamples = ({ control, register }: any) => {
    // We map the backend structure [{title, sentences: [{text, translation}]}] 
    // to a flat list of sentences in the first structure for simplicity.
    const { fields, append, remove } = useFieldArray({ control, name: `examples.0.sentences` as any });
    
    return (
        <Stack spacing={1.5}>
            {fields.map((sentence: any, idx: number) => (
                <Box key={sentence.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField 
                        {...register(`examples.0.sentences.${idx}.text`)} 
                        placeholder="Câu ví dụ tiếng Anh..." 
                        size="small" 
                        fullWidth 
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: '10px' } }}
                    />
                    {fields.length > 1 && (
                        <IconButton size="small" color="error" onClick={() => remove(idx)}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    )}
                </Box>
            ))}
            <Button 
                size="small" 
                startIcon={<AddIcon />} 
                onClick={() => append({ text: "", translation: "" })} 
                sx={{ width: 'fit-content', fontWeight: 700, textTransform: 'none' }}
            >
                Thêm ví dụ
            </Button>
        </Stack>
    );
};
