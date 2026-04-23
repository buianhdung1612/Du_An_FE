import React from "react";
import { 
    Dialog, DialogTitle, DialogContent, IconButton, Typography, 
    Box, Stack, Chip, Divider, Grid 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Vocabulary } from "../api/vocabulary.api";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LayersIcon from '@mui/icons-material/Layers';
import LinkIcon from '@mui/icons-material/Link';

interface Props {
    open: boolean;
    onClose: () => void;
    vocab?: Vocabulary;
}

export const VocabularyDetailModal: React.FC<Props> = ({ open, onClose, vocab }) => {
    if (!vocab) return null;

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: '20px' } }}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesomeIcon /> Chi tiết từ vựng
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: (theme) => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0 }}>
                {/* Header Section with Image */}
                <Box sx={{ position: 'relative', bgcolor: '#f4f6f8' }}>
                    {vocab.imageUrl && (
                        <Box sx={{ width: '100%', height: 200, overflow: 'hidden' }}>
                            <img src={vocab.imageUrl} alt={vocab.word} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                    )}
                    <Box sx={{ p: 3, pt: vocab.imageUrl ? 2 : 3 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="h4" fontWeight={900} color="#1C252E">
                                {vocab.word}
                            </Typography>
                            <IconButton 
                                onClick={() => speak(vocab.word, vocab.audio)}
                                sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                size="small"
                            >
                                <VolumeUpIcon fontSize="small" />
                            </IconButton>
                            <Chip 
                                label={(vocab as any).partOfSpeech || "n/a"} 
                                size="small" 
                                color="primary" 
                                variant="soft"
                                sx={{ fontStyle: 'italic', fontWeight: 600 }} 
                            />
                        </Stack>
                        <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ fontStyle: 'italic' }}>
                            {vocab.ipa}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                    {/* Definition */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', mb: 1 }}>
                            Định nghĩa & Nghĩa
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#1C252E', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            {vocab.definition}
                        </Typography>
                    </Box>

                    {/* Word Family & Related Words Side by Side */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(0, 167, 111, 0.05)', borderRadius: '16px', height: '100%' }}>
                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontWeight: 700, color: 'primary.main' }}>
                                    <LayersIcon fontSize="small" /> Gia đình từ
                                </Typography>
                                <Stack spacing={1}>
                                    {vocab.wordFamily && vocab.wordFamily.length > 0 ? (
                                        vocab.wordFamily.map((wf: any, idx) => (
                                            <Box key={idx}>
                                                <Typography variant="body2" fontWeight={700}>{wf.word} <Typography component="span" variant="caption" color="text.secondary">({wf.partOfSpeech})</Typography></Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">{wf.ipa}</Typography>
                                                <Typography variant="caption" display="block" sx={{ fontStyle: 'italic' }}>{wf.definition}</Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="text.disabled">Không có dữ liệu</Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: '16px', height: '100%' }}>
                                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontWeight: 700, color: '#2196F3' }}>
                                    <LinkIcon fontSize="small" /> Từ liên quan
                                </Typography>
                                <Stack spacing={1}>
                                    {(vocab as any).relatedWords && (vocab as any).relatedWords.length > 0 ? (
                                        (vocab as any).relatedWords.map((rw: any, idx: number) => (
                                            <Box key={idx}>
                                                <Typography variant="body2" fontWeight={700}>{rw.word} <Typography component="span" variant="caption" color="text.secondary">({rw.partOfSpeech})</Typography></Typography>
                                                <Typography variant="caption" color="text.secondary" display="block">{rw.ipa}</Typography>
                                                <Typography variant="caption" display="block" sx={{ fontStyle: 'italic' }}>{rw.definition}</Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="text.disabled">Không có dữ liệu</Typography>
                                    )}
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Examples */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight={800} sx={{ textTransform: 'uppercase', mb: 1.5 }}>
                            Cấu trúc & Ví dụ sử dụng
                        </Typography>
                        <Stack spacing={2}>
                            {vocab.examples.map((structure, idx) => (
                                <Box key={idx}>
                                    {structure.title && (
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            • {structure.title}
                                        </Typography>
                                    )}
                                    <Stack spacing={1} sx={{ pl: structure.title ? 1.5 : 0 }}>
                                        {structure.sentences.map((sent, sIdx) => (
                                            <Box key={sIdx} sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: '12px', borderLeft: '2px solid' + (structure.title ? ' #00A76F33' : ' #1C252E') }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1C252E' }}>
                                                    {sent.text}
                                                </Typography>
                                                {sent.translation && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                        {sent.translation}
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* AI Notes */}
                    {vocab.note && (
                        <Box sx={{ mt: 4, p: 2.5, bgcolor: '#FFF9C4', borderRadius: '16px', border: '1px solid #FFE082' }}>
                            <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 700, color: '#F57C00' }}>
                                <AutoAwesomeIcon fontSize="small" /> Ghi chú từ AI Assistant
                            </Typography>
                            <Box 
                                className="tiptap-content"
                                sx={{ 
                                    '& p': { mb: 1, lineHeight: 1.6 },
                                    '& b': { color: '#E65100' },
                                    '& ul': { pl: 2, mb: 1 }
                                }}
                                dangerouslySetInnerHTML={{ __html: vocab.note }} 
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};
