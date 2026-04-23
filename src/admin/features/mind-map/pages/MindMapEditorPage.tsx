import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Stack, useTheme, TextField, Paper, IconButton, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import { useParams, useNavigate } from 'react-router-dom';
import MindElixir from 'mind-elixir';
import 'mind-elixir/style';
import { createMindMap, updateMindMap, getMindMapById } from '../api/mind-map.api';
import { getCategoryMindMaps, CategoryMindMap } from '../api/category-mindmap.api';
import { toast } from 'react-toastify';
import { prefixAdmin } from '@shared/constants/routes';
import { NoteEditorDialog } from '../components/NoteEditorDialog';
import { MenuItem } from '@mui/material';

export const MindMapEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const meContainer = useRef<HTMLDivElement>(null);
    const meInstance = useRef<any>(null);
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<CategoryMindMap[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    
    // States for Note Editor
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [currentNoteContent, setCurrentNoteContent] = useState('');
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

    useEffect(() => {
        if (!meContainer.current) return;

        // Initialize Mind Elixir
        meInstance.current = new MindElixir({
            el: meContainer.current,
            direction: MindElixir.SIDE,
            draggable: true,
            contextMenu: true,
            toolBar: true,
            nodeMenu: true,
            keypress: true,
            locale: 'en', // mind-elixir version 5 default
        });

        const fetchData = async () => {
            // Fetch categories
            const catRes = await getCategoryMindMaps();
            if (catRes.code === 200) setCategories(catRes.data);

            if (id) {
                const res = await getMindMapById(id);
                if (res.code === 200 && res.data) {
                    setTitle(res.data.title);
                    setCategoryId(res.data.categoryId?._id || res.data.categoryId || '');
                    meInstance.current.init(res.data.data);
                }
            } else {
                setTitle('Sơ đồ mới');
                const data = MindElixir.new('Chủ đề chính');
                meInstance.current.init(data);
            }
        };

        fetchData();
        
        // ... (rest of the useEffect handlers)

        const handleAction = (target: HTMLElement) => {
            const nodeEl = target.closest('.node-item');
            if (nodeEl) {
                const id = nodeEl.getAttribute('data-id');
                if (id) {
                    const node = meInstance.current.findEle(id);
                    if (node) {
                        setEditingNodeId(id);
                        setCurrentNoteContent(node.nodeObj.memo || '');
                        setNoteDialogOpen(true);
                    }
                }
            }
        };

        const handleContainerClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Kiểm tra click vào node hoặc text chứa 📝
            const nodeEl = target.closest('.node-item') || target.closest('me-tpc');
            if (nodeEl && target.textContent?.includes('📝')) {
                const id = nodeEl.getAttribute('data-id') || nodeEl.getAttribute('data-nodeid');
                if (id) {
                    const node = meInstance.current.findEle(id);
                    if (node) {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingNodeId(id);
                        setCurrentNoteContent(node.nodeObj.memo || '');
                        setNoteDialogOpen(true);
                    }
                }
            }
        };

        const handleKeyDownCapture = (e: KeyboardEvent) => {
            // Nhấn Space để mở ghi chú (ưu tiên cao nhất)
            if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                const el = meInstance.current.currentNode;
                if (el) {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = el.nodeObj.id;
                    setEditingNodeId(id);
                    setCurrentNoteContent(el.nodeObj.memo || '');
                    setNoteDialogOpen(true);
                }
            }
        };

        // Sử dụng { capture: true } để chặn trước khi mind-elixir xử lý
        meContainer.current?.addEventListener('click', handleContainerClick, true);
        window.addEventListener('keydown', handleKeyDownCapture, true);

        return () => {
            meContainer.current?.removeEventListener('click', handleContainerClick, true);
            window.removeEventListener('keydown', handleKeyDownCapture, true);
        };
    }, [id]);

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error('Vui lòng nhập tiêu đề');
            return;
        }

        setIsSaving(true);
        try {
            const mapData = meInstance.current.getData();
            const payload = {
                title,
                categoryId: categoryId || undefined,
                data: mapData,
            };

            let res;
            if (id) {
                res = await updateMindMap(id, payload);
            } else {
                res = await createMindMap(payload);
            }

            if (res.code === 200) {
                toast.success('Đã lưu sơ đồ tư duy!');
                if (!id) navigate(`/${prefixAdmin}/mind-maps/edit/${res.data._id}`);
            } else {
                toast.error(res.message || 'Lỗi khi lưu');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi kết nối máy chủ');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <IconButton onClick={() => navigate(`/${prefixAdmin}/mind-maps`)}>
                        <Icon icon="solar:arrow-left-bold" />
                    </IconButton>
                    <TextField 
                        variant="standard" 
                        placeholder="Tiêu đề sơ đồ..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ 
                            flex: 1,
                            '& .MuiInput-root': { fontSize: '1.5rem', fontWeight: 700 }
                        }}
                    />

                    <TextField 
                        select
                        size="small"
                        label="Danh mục"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">Trống</MenuItem>
                        {categories.map(cat => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                    </TextField>

                    <Stack direction="row" spacing={1} sx={{ bgcolor: 'action.hover', p: 1, borderRadius: '12px' }}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', px: 1, fontWeight: 700, color: 'text.secondary' }}>
                            INSERT
                        </Typography>
                        <Tooltip title="Thêm Ghi chú">
                            <IconButton size="small" onClick={() => {
                                const el = meInstance.current.currentNode;
                                if (!el) return toast.info('Vui lòng chọn một nhánh');
                                setEditingNodeId(el.nodeObj.id);
                                setCurrentNoteContent(el.nodeObj.memo || '');
                                setNoteDialogOpen(true);
                            }}>
                                <Icon icon="solar:notes-bold-duotone" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Thêm Liên kết">
                            <IconButton size="small" onClick={() => {
                                const node = meInstance.current.currentNode;
                                if (!node) return toast.info('Vui lòng chọn một nhánh');
                                const url = prompt('Nhập địa chỉ URL:', node.nodeObj.hyperlink || 'https://');
                                if (url) {
                                    meInstance.current.updateNodeHyperlink(node, url);
                                }
                            }}>
                                <Icon icon="solar:link-bold-duotone" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Thêm Nhãn (Tags)">
                            <IconButton size="small" onClick={() => {
                                const node = meInstance.current.currentNode;
                                if (!node) return toast.info('Vui lòng chọn một nhánh');
                                const tags = prompt('Nhập các nhãn (phân cách bằng dấu phẩy):', node.nodeObj.tags?.join(',') || '');
                                if (tags !== null) {
                                    meInstance.current.updateNodeTags(node, tags.split(',').filter(t => t.trim()));
                                }
                            }}>
                                <Icon icon="solar:tag-bold-duotone" />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ bgcolor: 'action.hover', p: 1, borderRadius: '12px' }}>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', px: 1, fontWeight: 700, color: 'text.secondary' }}>
                            LAYOUT
                        </Typography>
                        <Button 
                            variant="text" 
                            size="small"
                            onClick={() => {
                                meInstance.current.direction = MindElixir.SIDE;
                                meInstance.current.init(meInstance.current.getData());
                            }}
                            startIcon={<Icon icon="solar:Streight-direction-bold" />}
                        >
                            Hai bên
                        </Button>
                        <Button 
                            variant="text" 
                            size="small"
                            onClick={() => {
                                meInstance.current.direction = MindElixir.RIGHT;
                                meInstance.current.init(meInstance.current.getData());
                            }}
                            startIcon={<Icon icon="solar:login-2-bold" />}
                        >
                            Bên phải
                        </Button>
                    </Stack>

                    <Button 
                        variant="contained" 
                        startIcon={<Icon icon="solar:diskette-bold" />}
                        onClick={handleSave}
                        disabled={isSaving}
                        sx={{ borderRadius: '10px' }}
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu sơ đồ'}
                    </Button>
                </Stack>
            </Paper>

            <Box 
                ref={meContainer} 
                sx={{ 
                    flex: 1, 
                    width: '100%', 
                    bgcolor: '#f8f9fa',
                    // Tùy chỉnh CSS để sơ đồ đẹp hơn (Premium Look)
                    '& .me-container': {
                        backgroundColor: '#f8f9fa !important',
                    },
                    '& .node-item': {
                        borderRadius: '12px !important',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05) !important',
                        padding: '8px 16px !important',
                        transition: 'all 0.2s ease !important',
                        border: '2px solid transparent !important',
                        userSelect: 'none !important',
                    },
                    '& .node-item:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1) !important',
                    },
                    '& .node-item.active': {
                        border: `2px solid ${theme.palette.primary.main} !important`,
                    },
                    '& .node-item.root': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}) !important`,
                        color: '#fff !important',
                        fontWeight: '800 !important',
                        fontSize: '1.2rem !important',
                        borderRadius: '16px !important',
                    },
                    '& path.mind-elixir-line': {
                        stroke: '#cfd8dc !important',
                        strokeWidth: '2px !important',
                    }
                }} 
            />
            
            <Box sx={{ p: 1, bgcolor: 'action.hover', borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" color="text.secondary">
                    Phím tắt: <b>Tab</b>: Thêm nhánh con | <b>Enter</b>: Thêm nhánh cùng cấp | <b>Delete</b>: Xóa nhánh
                </Typography>
            </Box>

            <NoteEditorDialog 
                open={noteDialogOpen}
                onClose={() => {
                    setNoteDialogOpen(false);
                    setEditingNodeId(null);
                }}
                initialContent={currentNoteContent}
                onSave={(newContent) => {
                    if (editingNodeId) {
                        const el = meInstance.current.findEle(editingNodeId);
                        if (el) {
                            let topic = el.nodeObj.topic;
                            const hasIcon = topic.includes('📝');
                            
                            if (newContent && newContent !== '<p></p>' && !hasIcon) {
                                topic = topic + ' 📝';
                            } else if ((!newContent || newContent === '<p></p>') && hasIcon) {
                                topic = topic.replace(' 📝', '');
                            }

                            // Cập nhật node mà không refresh toàn bộ để tránh nhảy giao diện
                            meInstance.current.reshapeNode(el, { 
                                memo: newContent,
                                topic: topic
                            });
                        }
                    }
                }}
            />
        </Box>
    );
};
