import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Stack, useTheme, Paper, IconButton, CircularProgress, Autocomplete, TextField, Chip, alpha } from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import MindElixir from 'mind-elixir';
import 'mind-elixir/style';
import { getVocabularies, getPhrasalVerbGroups, Vocabulary } from '../api/vocabulary.api';
import { prefixAdmin } from '@shared/constants/routes';
import { toast } from 'react-toastify';

export const PhrasalVerbMindmapPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const meContainer = useRef<HTMLDivElement>(null);
    const meInstance = useRef<any>(null);
    
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await getPhrasalVerbGroups();
                if (res.code === 200) {
                    setGroups(res.data);
                    if (res.data.length > 0) {
                        setSelectedGroup(res.data[0]._id);
                    }
                }
            } catch (error) {
                toast.error("Không thể tải danh sách động từ");
            } finally {
                setInitializing(false);
            }
        };
        fetchGroups();
    }, []);

    useEffect(() => {
        if (!selectedGroup || !meContainer.current) return;

        // Cleanup previous instance if any
        if (meInstance.current) {
            meContainer.current.innerHTML = '';
        }

        // Initialize Mind Elixir
        meInstance.current = new MindElixir({
            el: meContainer.current,
            direction: MindElixir.SIDE,
            draggable: true,
            contextMenu: false, // Disable for study mode
            toolBar: false,
            nodeMenu: false,
            keypress: true,
            locale: 'en',
        });

        const loadMindmap = async () => {
            setLoading(true);
            try {
                const res = await getVocabularies(undefined, undefined, selectedGroup);
                if (res.code === 200) {
                    const vocabs: Vocabulary[] = res.data;
                    
                    // Transform vocabs into Mind Elixir data structure
                    const mindData = {
                        nodeData: {
                            id: 'root',
                            topic: selectedGroup.toUpperCase(),
                            root: true,
                            children: vocabs.map(v => ({
                                id: v._id,
                                topic: v.word,
                                children: [
                                    {
                                        id: `${v._id}-def`,
                                        topic: `Meaning: ${v.definition}`,
                                        style: { background: '#FCE5DF', color: '#BA0000' }
                                    },
                                    {
                                        id: `${v._id}-ex`,
                                        topic: `Example: ${v.examples?.[0]?.sentences?.[0]?.text || 'N/A'}`,
                                        style: { background: '#E3F2FD', color: '#1976D2' }
                                    },
                                    ...(v.synonyms?.length ? [{
                                        id: `${v._id}-syn`,
                                        topic: `Synonyms: ${v.synonyms.join(', ')}`,
                                        style: { background: '#E8F5E9', color: '#2E7D32' }
                                    }] : [])
                                ]
                            }))
                        }
                    };

                    meInstance.current.init(mindData);
                }
            } catch (error) {
                toast.error("Lỗi khi tải dữ liệu sơ đồ");
            } finally {
                setLoading(false);
            }
        };

        loadMindmap();

    }, [selectedGroup]);

    if (initializing) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton onClick={() => navigate(-1)}>
                            <Icon icon="solar:arrow-left-bold" />
                        </IconButton>
                        <Typography variant="h5" fontWeight={800}>Học Phrasal Verbs qua Mindmap</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" fontWeight={700}>Chọn động từ gốc:</Typography>
                        <Autocomplete
                            size="small"
                            options={groups}
                            getOptionLabel={(option) => `${option._id} (${option.count})`}
                            value={groups.find(g => g._id === selectedGroup) || null}
                            onChange={(_e, newValue) => setSelectedGroup(newValue?._id || null)}
                            renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: 'white' } }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<Icon icon="solar:refresh-bold" />}
                            onClick={() => setSelectedGroup(selectedGroup)}
                            sx={{ borderRadius: '10px', bgcolor: '#1C252E' }}
                        >
                            Làm mới
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Box sx={{ flex: 1, position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
                {loading && (
                    <Box sx={{ position: 'absolute', inset: 0, zIndex: 10, bgcolor: alpha('#fff', 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}
                
                <Box
                    ref={meContainer}
                    sx={{
                        width: '100%',
                        height: '100%',
                        // Premium Custom Styles
                        '& .me-container': {
                            backgroundColor: '#fafafa !important',
                        },
                        '& .node-item': {
                            borderRadius: '16px !important',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06) !important',
                            padding: '12px 20px !important',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
                            border: '2px solid transparent !important',
                            fontWeight: '600 !important',
                            fontSize: '0.95rem !important',
                        },
                        '& .node-item:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1) !important',
                        },
                        '& .node-item.root': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}) !important`,
                            color: '#fff !important',
                            fontSize: '1.5rem !important',
                            fontWeight: '800 !important',
                            padding: '20px 40px !important',
                            borderRadius: '24px !important',
                        },
                        '& .node-item:not(.root)': {
                            backgroundColor: '#fff !important',
                            color: '#1C252E !important',
                        },
                        '& path.mind-elixir-line': {
                            stroke: alpha(theme.palette.primary.main, 0.3) + ' !important',
                            strokeWidth: '3px !important',
                        }
                    }}
                />

                <Box sx={{ position: 'absolute', bottom: 20, right: 20, p: 2, bgcolor: alpha('#fff', 0.8), borderRadius: '12px', backdropFilter: 'blur(4px)', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">
                        Tip: Click vào nhánh để mở rộng thông tin chi tiết.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
