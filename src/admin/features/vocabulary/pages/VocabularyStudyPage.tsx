import { useEffect, useState } from "react";
import {
    Box, Stack, Typography, Button, IconButton, Paper,
    Container, CircularProgress, LinearProgress, Card, Chip, Autocomplete, TextField, useMediaQuery, useTheme,
    Divider, alpha, Dialog
} from "@mui/material";
import { prefixAdmin } from "../../../shared/constants/routes";
import { getVocabularies, Vocabulary, reviewVocab } from "../api/vocabulary.api";
import { getVocabularyTopics, VocabularyTopic } from "../api/vocabulary-topic.api";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import { FormControlLabel, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const VocabularyStudyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const queryParams = new URLSearchParams(location.search);
    const initialTopicId = queryParams.get('topicId') || 'all';
    const limitParam = queryParams.get('limit');

    const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
    const [topics, setTopics] = useState<VocabularyTopic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0); // 0: Recognition, 1: Recall, 2: Context
    const [clusterIndex, setClusterIndex] = useState(0);
    const [isDeepStudy, setIsDeepStudy] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const changeWord = (newIndex: number, newClusterIndex: number, newStep: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setClusterIndex(newClusterIndex);
            setCurrentStep(newStep);
            setIsTransitioning(false);
        }, 350); // 350ms delay to let the card flip back past 90 degrees so the new definition isn't revealed
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const topicParam = selectedTopicId === "all" ? undefined : selectedTopicId;
            const res = await getVocabularies(topicParam);
            if (res.code === 200) {
                const now = new Date();
                let dueVocabs = res.data.filter((v: Vocabulary) => new Date(v.nextReview) <= now);
                if (limitParam && !isNaN(Number(limitParam))) {
                    // Sort by createdAt descending (newest first)
                    dueVocabs.sort((a: Vocabulary, b: Vocabulary) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    dueVocabs = dueVocabs.slice(0, Number(limitParam));
                }
                setVocabs(dueVocabs);
                setIsFinished(dueVocabs.length === 0);
            }

            const topicsRes = await getVocabularyTopics();
            if (topicsRes.code === 200) {
                const data = topicsRes.data?.recordList || topicsRes.data || [];
                setTopics(Array.isArray(data) ? data : []);
            }
        } catch {
            toast.error("Không thể tải bài học");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedTopicId]);

    const speak = (text: string, audioUrl?: string) => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(() => {
                // Fallback nếu link audio lỗi
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            });
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleReview = async (quality: number) => {
        if (isTransitioning) return;
        try {
            await reviewVocab(mainVocab._id, quality);
            if (currentIndex < vocabs.length - 1) {
                changeWord(currentIndex + 1, 0, 0);
            } else {
                setIsFinished(true);
            }
        } catch {
            toast.error("Lỗi cập nhật tiến độ");
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    if (isFinished) {
        return (
            <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                <Card sx={{ p: 5, borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                    <Typography variant="h4" fontWeight={800} gutterBottom>Tuyệt vời! 🎉</Typography>
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        Bạn đã hoàn thành các từ đến hạn {selectedTopicId !== "all" ? "cho chủ đề này" : "cho hôm nay"}.
                    </Typography>

                    <Box sx={{ mb: 4, p: 2, bgcolor: '#f4f6f8', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>CHỌN CHỦ ĐỀ KHÁC ĐỂ ÔN TẬP:</Typography>
                        <Autocomplete
                            options={[{ _id: "all", title: "Tất cả chủ đề" } as any, ...(Array.isArray(topics) ? topics : [])]}
                            getOptionLabel={(option) => option.title}
                            value={(Array.isArray(topics) ? topics : []).find(t => t._id === selectedTopicId) || { _id: "all", title: "Tất cả chủ đề" }}
                            onChange={(_e, newValue) => setSelectedTopicId(newValue?._id || "all")}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ bgcolor: 'white', borderRadius: 1 }}
                        />
                    </Box>

                    <Stack spacing={2}>
                        <Button variant="contained" fullWidth size="large" onClick={() => navigate(`/${prefixAdmin}/vocabulary/list`)} sx={{ bgcolor: '#1C252E', borderRadius: '12px' }}>
                            Quay lại kho từ vựng
                        </Button>
                        <Button variant="outlined" fullWidth size="large" onClick={() => { setIsFinished(false); setCurrentIndex(0); fetchData(); }} sx={{ borderRadius: '12px' }}>
                            <ReplayIcon sx={{ mr: 1 }} /> Học lại (Refresh)
                        </Button>
                    </Stack>
                </Card>
            </Container>
        );
    }

    const mainVocab = vocabs[currentIndex];
    const clusterVocabs = mainVocab ? (isDeepStudy ? [
        mainVocab,
        ...(mainVocab.wordFamily || []).filter((wf: any) => wf.shouldStudy),
        ...((mainVocab as any).relatedWords || []).filter((rw: any) => rw.shouldStudy)
    ] : [mainVocab]) : [];

    const current = clusterVocabs[clusterIndex];
    const isWordFamily = mainVocab?.wordFamily?.some((wf: any) => wf.word === current?.word);
    const isRelated = (mainVocab as any)?.relatedWords?.some((rw: any) => rw.word === current?.word);
    const wordTypePrefix = clusterIndex === 0 ? "" :
        (isWordFamily ? "[Gia đình từ] " :
            (isRelated ? "[Từ liên quan] " : ""));

    const isLexicalSet = current?.category === 'lexical_set';

    const progress = ((currentIndex) / vocabs.length) * 100;
    const hasExampleContext = current?.examples && current.examples.length > 0 && current.examples[0].sentences?.length > 0 && current.examples[0].sentences[0].translation;
    const totalSteps = (!isDeepStudy || isLexicalSet) ? 1 : (hasExampleContext ? 3 : 2);

    const isLastInCluster = clusterIndex === clusterVocabs.length - 1;

    const handleNextStep = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (isTransitioning) return;

        // If card is already flipped, move to next word in cluster or show next main card
        if (isFlipped) {
            if (!isLastInCluster) {
                changeWord(currentIndex, clusterIndex + 1, 0);
            } else {
                // Final result already shown, this would usually be handled by assessment buttons
                // but we can just do nothing or close the card
                setIsFlipped(false);
            }
            return;
        }

        if (currentStep < totalSteps - 1) {
            // Next step for current word
            setCurrentStep(prev => prev + 1);
            setIsFlipped(false);
        } else {
            // Finished steps for this word, show the back side (definition)
            setIsFlipped(true);
        }
    };

    const handlePrevStep = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (isTransitioning) return;
        if (isFlipped) {
            setIsFlipped(false);
            return;
        }

        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else if (clusterIndex > 0) {
            setClusterIndex(prev => prev - 1);
            // Go to the last step of the previous word
            // Calculate total steps of previous word
            const prevWord = clusterVocabs[clusterIndex - 1];
            const hasCtx = prevWord?.examples && prevWord.examples.length > 0 && prevWord.examples[0].sentences?.length > 0 && prevWord.examples[0].sentences[0].translation;
            const prevSteps = !isDeepStudy ? 1 : (hasCtx ? 3 : 2);
            setCurrentStep(prevSteps - 1);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: isMobile ? 2 : 4, px: isMobile ? 1.5 : 3 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isDeepStudy}
                            onChange={(e) => {
                                setIsDeepStudy(e.target.checked);
                                setCurrentStep(0);
                                setIsFlipped(false);
                            }}
                            color="primary"
                        />
                    }
                    label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Chế độ Học sâu</Typography>}
                />
            </Box>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
                <Box sx={{ flex: 1 }}>
                    <Autocomplete
                        fullWidth
                        size="small"
                        options={[{ _id: "all", title: "Tất cả chủ đề" } as any, ...(Array.isArray(topics) ? topics : [])]}
                        getOptionLabel={(option) => option.title}
                        value={(Array.isArray(topics) ? topics : []).find(t => t._id === selectedTopicId) || { _id: "all", title: "Tất cả chủ đề" }}
                        onChange={(_e, newValue) => {
                            setSelectedTopicId(newValue?._id || "all");
                            setCurrentIndex(0);
                            setClusterIndex(0);
                            setCurrentStep(0);
                            setIsFlipped(false);
                            setIsFinished(false);
                        }}
                        renderInput={(params) => <TextField {...params} variant="standard" placeholder="Đổi chủ đề..." InputProps={{ ...params.InputProps, disableUnderline: true }} />}
                        sx={{ px: 1, bgcolor: '#F4F6F8', borderRadius: 1 }}
                    />
                </Box>
                <Typography variant="caption" fontWeight={700}>{currentIndex + 1} / {vocabs.length}</Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 4, bgcolor: '#919eab29' }} />
            </Box>

            {/* Flashcard with Flip Animation */}
            <Box sx={{
                perspective: '1000px',
                height: isMobile ? '380px' : '460px',
                cursor: 'pointer',
                mb: isMobile ? 2 : 4
            }} onClick={() => {
                if (isFlipped) {
                    if (!isLastInCluster) {
                        handleNextStep();
                    }
                    // If isLastInCluster, clicking again could toggle flip or do nothing
                    // Let's toggle flip if it's the last one so they can re-read
                    else {
                        setIsFlipped(false);
                    }
                } else {
                    handleNextStep();
                }
            }}>

                {/* Cluster Progress Bars (Small dots per word) */}
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1 }}>
                    {clusterVocabs.map((_, i) => (
                        <Box key={i} sx={{
                            width: 24, height: 4, borderRadius: 2,
                            bgcolor: i < clusterIndex ? 'primary.main' : i === clusterIndex ? 'primary.light' : 'divider'
                        }} />
                    ))}
                </Stack>
                {totalSteps > 1 && (
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                        {[...Array(totalSteps)].map((_, i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: 12, height: 4, borderRadius: 10,
                                    bgcolor: i === currentStep ? 'primary.main' : 'divider',
                                    transition: 'all 0.3s'
                                }}
                            />
                        ))}
                    </Stack>
                )}

                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.6s',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>
                    {/* Front side */}
                    <Paper sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '24px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                        border: '1px solid #919eab1f',
                        textAlign: 'center',
                        p: 3
                    }}>
                        {currentStep === 0 && (
                            <>
                                {totalSteps > 1 && !isLexicalSet && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>
                                        {wordTypePrefix}Bước 1: Nhận diện
                                    </Typography>
                                )}
                                {isLexicalSet && (
                                    <Typography variant="caption" color="primary.main" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>
                                        Nhóm từ vựng (Lexical Set)
                                    </Typography>
                                )}
                                <Typography variant={current.word.length > 15 ? "h4" : "h2"} fontWeight={800} sx={{ color: '#1C252E' }}>
                                    {current.word}
                                </Typography>
                                {!isLexicalSet && (
                                    <IconButton
                                        onClick={(e) => { e.stopPropagation(); speak(current.word, current.audio); }}
                                        sx={{ mt: 2, bgcolor: 'rgba(0, 167, 111, 0.08)', color: 'primary.main' }}
                                    >
                                        <VolumeUpIcon />
                                    </IconButton>
                                )}
                            </>
                        )}

                        {currentStep === 1 && (
                            <>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>
                                    {wordTypePrefix}Bước 2: Phản xạ gợi nhớ
                                </Typography>
                                <Stack spacing={0.5} alignItems="center">
                                    <Typography variant="h3" fontWeight={800} sx={{ color: 'primary.main' }}>
                                        {current.definition}
                                    </Typography>
                                    {current.ipa && (
                                        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                            {current.ipa}
                                        </Typography>
                                    )}
                                </Stack>
                                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                    Bạn có nhớ từ tiếng Anh này là gì không?
                                </Typography>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>
                                    {wordTypePrefix}Bước 3: Thực hành tình huống
                                </Typography>
                                <Typography variant="h5" fontWeight={700} sx={{ color: '#1C252E', fontStyle: 'italic', lineHeight: 1.5 }}>
                                    "{current.examples[0].sentences[0].translation}"
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
                                    Hãy thử nói hoặc viết lại câu này bằng tiếng Anh.
                                </Typography>
                            </>
                        )}

                        <Typography variant="caption" sx={{ mt: 'auto', color: 'text.disabled' }}>
                            Chạm để lật thẻ
                        </Typography>
                    </Paper>

                    {/* Back side */}
                    <Paper sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 0,
                        borderRadius: '24px',
                        transform: 'rotateY(180deg)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                        border: '1px solid #919eab1f',
                        bgcolor: '#F4F6F8',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            p: 4, height: '100%', overflowY: 'auto',
                            '&::-webkit-scrollbar': { width: 5 },
                            '&::-webkit-scrollbar-thumb': { bgcolor: '#919eab', borderRadius: 10 }
                        }}>
                            {/* Step Result Summary */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                {isLexicalSet ? (
                                    <Box sx={{ textAlign: 'left' }}>
                                        <Typography variant="h5" fontWeight={800} color="primary.main" gutterBottom>
                                            {current.word}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                            {current.definition}
                                        </Typography>
                                        <Stack spacing={1.5}>
                                            {Array.isArray((current as any).groupedWords) && (current as any).groupedWords.map((item: any, i: number) => (
                                                <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 1.5, bgcolor: 'white', borderRadius: 1.5, border: '1px solid #eee' }}>
                                                    {item.imageUrl && (
                                                        <Box
                                                            component="img"
                                                            src={item.imageUrl}
                                                            onClick={(e) => { e.stopPropagation(); setPreviewImgUrl(item.imageUrl); }}
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: 1,
                                                                objectFit: 'cover',
                                                                flexShrink: 0,
                                                                cursor: 'pointer',
                                                                transition: 'transform 0.2s',
                                                                '&:hover': { transform: 'scale(1.1)' }
                                                            }}
                                                        />
                                                    )}
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', flex: 1, alignItems: 'baseline' }}>
                                                        <Typography variant="body1" fontWeight={700} sx={{ color: '#1C252E', width: isMobile ? '100%' : '35%', mb: isMobile ? 0.5 : 0 }}>
                                                            {item.word}
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => { e.stopPropagation(); speak(item.word); }}
                                                                sx={{ ml: 0.5, p: 0.25, color: 'text.secondary' }}
                                                            >
                                                                <VolumeUpIcon sx={{ fontSize: 16 }} />
                                                            </IconButton>
                                                            {item.ipa && (
                                                                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 500 }}>
                                                                    {item.ipa}
                                                                </Typography>
                                                            )}
                                                        </Typography>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" fontWeight={600} color="primary.main">{item.definition}</Typography>
                                                            {item.note && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{item.note}</Typography>}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                ) : (
                                    <>
                                        {currentStep === 0 && (
                                            <>
                                                <Typography variant="h3" fontWeight={800} color="primary.main" gutterBottom>
                                                    {current.definition}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, mb: 2 }}>
                                                    {current.ipa}
                                                </Typography>
                                            </>
                                        )}

                                        {currentStep === 1 && (
                                            <>
                                                <Typography variant="h2" fontWeight={800} color="primary.main">
                                                    {current.word}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1 }}>
                                                    {current.ipa}
                                                </Typography>
                                                <IconButton
                                                    onClick={(e) => { e.stopPropagation(); speak(current.word, current.audio); }}
                                                    sx={{ mt: 2, bgcolor: 'primary.lighter', color: 'primary.main' }}
                                                >
                                                    <VolumeUpIcon />
                                                </IconButton>
                                            </>
                                        )}

                                        {currentStep === 2 && (
                                            <>
                                                <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ mb: 2, px: 2 }}>
                                                    {current.examples[0].sentences[0].text}
                                                </Typography>
                                                <IconButton
                                                    onClick={(e) => { e.stopPropagation(); speak(current.examples[0].sentences[0].text); }}
                                                    sx={{ mt: 1, bgcolor: 'primary.lighter', color: 'primary.main' }}
                                                >
                                                    <VolumeUpIcon />
                                                </IconButton>
                                            </>
                                        )}
                                    </>)}
                            </Box>

                            {/* Detailed Info (Always showing on back) */}
                            {!isLexicalSet && (
                                <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
                                    {/* Example Sentences */}
                                    <Box>
                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>Ví dụ học tập:</Typography>
                                        {current.examples.map((structure: any, i: number) => (
                                            <Box key={i} sx={{ mb: 2 }}>
                                                {structure.title && <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>• {structure.title}</Typography>}
                                                {structure.sentences.map((sent: any, sIdx: number) => (
                                                    <Box key={sIdx} sx={{ mb: 1, ml: structure.title ? 1 : 0 }}>
                                                        <Typography variant="body2" fontWeight={600} sx={{ color: '#1C252E' }}>- {sent.text}</Typography>
                                                        {sent.translation && <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, display: 'block' }}>{sent.translation}</Typography>}
                                                    </Box>
                                                ))}
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Synonyms */}
                                    {Array.isArray((current as any).synonyms) && (current as any).synonyms.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Đồng nghĩa:</Typography>
                                            {(current as any).synonyms.map((s: string, idx: number) => (
                                                <Chip key={idx} label={s} size="small" variant="outlined" sx={{ height: '20px', fontSize: '0.65rem' }} />
                                            ))}
                                        </Box>
                                    )}

                                    {/* Word Family */}
                                    {current.wordFamily && current.wordFamily.length > 0 && (
                                        <Box sx={{ p: 2, bgcolor: 'rgba(0, 167, 111, 0.08)', borderRadius: '16px', border: '1px solid rgba(0, 167, 111, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, display: 'block', mb: 1.5 }}>Gia đình từ (Word Family):</Typography>
                                            <Stack spacing={1.5}>
                                                {current.wordFamily.map((wf, i) => (
                                                    <Box key={i}>
                                                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'baseline', flexWrap: 'wrap' }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark' }}>{wf.word}</Typography>
                                                            {wf.ipa && <Typography variant="caption" color="text.secondary">[{wf.ipa}]</Typography>}
                                                            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>({wf.partOfSpeech})</Typography>
                                                        </Box>
                                                        {wf.definition && <Typography variant="caption" display="block" color="text.primary">{wf.definition}</Typography>}
                                                        {Array.isArray(wf.synonyms) && wf.synonyms.length > 0 && (
                                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Syn: {wf.synonyms.join(', ')}</Typography>
                                                        )}
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Related Words */}
                                    {Array.isArray((current as any).relatedWords) && (current as any).relatedWords.length > 0 && (
                                        <Box sx={{ p: 2, bgcolor: 'rgba(32, 101, 209, 0.08)', borderRadius: '16px', border: '1px solid rgba(32, 101, 209, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 700, display: 'block', mb: 1.5 }}>Từ liên quan (Related Words):</Typography>
                                            <Stack spacing={1.5}>
                                                {(current as any).relatedWords.map((rw: any, i: number) => (
                                                    <Box key={i}>
                                                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'baseline', flexWrap: 'wrap' }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'info.dark' }}>{rw.word}</Typography>
                                                            {rw.ipa && <Typography variant="caption" color="text.secondary">[{rw.ipa}]</Typography>}
                                                            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>({rw.partOfSpeech})</Typography>
                                                        </Box>
                                                        {rw.definition && <Typography variant="caption" display="block" color="text.primary">{rw.definition}</Typography>}
                                                        {Array.isArray(rw.synonyms) && rw.synonyms.length > 0 && (
                                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Syn: {rw.synonyms.join(', ')}</Typography>
                                                        )}
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}


                                    {/* Note / Explanation */}
                                    {current.note && (
                                        <Box sx={{ p: 2, bgcolor: 'rgba(255, 171, 0, 0.08)', borderRadius: '16px', border: '1px solid rgba(255, 171, 0, 0.2)' }}>
                                            <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 700, display: 'block', mb: 1 }}>Ghi chú học tập:</Typography>
                                            <Box
                                                className="tiptap-content"
                                                dangerouslySetInnerHTML={{ __html: current.note }}
                                                sx={{
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.6,
                                                    '& p': { mb: 1 },
                                                    '& ul, & ol': { pl: 2, mb: 1 },
                                                    '& strong': { color: 'warning.dark' }
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* Mnemonic Image */}
                                    {current.imageUrl && (
                                        <Box
                                            onClick={(e) => { e.stopPropagation(); setPreviewImgUrl(current.imageUrl); }}
                                            sx={{
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                border: '1px solid #919eab29',
                                                cursor: 'pointer',
                                                '&:hover img': { transform: 'scale(1.03)' }
                                            }}
                                        >
                                            <img
                                                src={current.imageUrl}
                                                alt="Memory illustration"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    display: 'block',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Stack>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNextStep}
                                    sx={{
                                        borderRadius: '12px',
                                        bgcolor: '#1C252E',
                                        px: 4, py: 1.5,
                                    }}
                                >
                                    {currentStep < totalSteps - 1 ? "Tiếp tục bước tiếp theo" :
                                        (!isLastInCluster ? "Học từ tiếp theo trong nhóm" : "Xong! Hãy đánh giá mức độ thuộc")}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Control & Assessment Buttons */}
            <Stack spacing={2}>
                <Stack direction="row" spacing={1.5}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handlePrevStep}
                        disabled={clusterIndex === 0 && currentStep === 0 && !isFlipped}
                        sx={{ py: 2, borderRadius: '12px', fontWeight: 700, borderColor: '#1C252E', color: '#1C252E' }}
                    >
                        Quay lại
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleNextStep}
                        sx={{ py: 2, borderRadius: '12px', fontWeight: 700, bgcolor: '#1C252E' }}
                    >
                        {currentStep === totalSteps - 1 && isLastInCluster && !isFlipped ? "Hiện kết quả" : "Tiếp theo"}
                    </Button>
                </Stack>

                <Divider sx={{ my: 1, borderStyle: 'dashed' }}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>ĐÁNH GIÁ MỨC ĐỘ THUỘC</Typography>
                </Divider>

                <Stack direction="row" spacing={1.5}>
                    <Button sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, flex: 1, bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }} variant="text" onClick={() => handleReview(0)}>
                        Mới/Lại
                    </Button>
                    <Button sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, flex: 1, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }} variant="text" onClick={() => handleReview(3)}>
                        Khó
                    </Button>
                    <Button sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, flex: 1, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }} variant="text" onClick={() => handleReview(4)}>
                        Tốt
                    </Button>
                    <Button sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, flex: 1, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }} variant="text" onClick={() => handleReview(5)}>
                        Dễ
                    </Button>
                </Stack>
            </Stack>

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
        </Container>
    );
};
