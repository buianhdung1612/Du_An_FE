import React, { useState, useMemo } from 'react';
import {
    Card, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Typography, CircularProgress,
    Stack, Collapse, Menu, MenuItem, Divider, TablePagination,
    ListItemIcon, useMediaQuery, useTheme, Box, Tooltip
} from '@mui/material';
import { Icon } from '@iconify/react';
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { prefixAdmin } from "@shared/constants/routes";
import { confirmDelete } from "@shared/utils/swal";
import {
    useVocabularyTopics,
    useDeleteVocabularyTopic
} from '../hooks/useVocabularyTopic';
import { VocabularySubList } from './VocabularySubList';
import { IVocabularyTopic } from '../configs/types';
import { PREMIUM_MENU_STYLE } from '@shared/constants/menu-styles';

interface VocabularyTopicListProps {
    onEdit: (row: IVocabularyTopic) => void;
    onAddVocab: (row: IVocabularyTopic) => void;
    onEditVocab: (vocab: any) => void;
}



export const VocabularyTopicList = ({ onEdit, onAddVocab, onEditVocab }: VocabularyTopicListProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [openRows, setOpenRows] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

    const { mutate: deleteTopic } = useDeleteVocabularyTopic();

    const params = useMemo(() => ({
        page: page + 1,
        limit: pageSize,
    }), [page, pageSize]);

    const { data: res, isLoading } = useVocabularyTopics(params);
    const topics = res?.data?.recordList || [];
    const pagination = res?.data?.pagination || { totalRecords: 0 };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
    };

    const handleCloseMenu = (id: string) => {
        setAnchorEl({ ...anchorEl, [id]: null });
    };

    const toggleRow = (id: string) => {
        setOpenRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleDelete = (id: string) => {
        confirmDelete("Bạn có chắc chắn muốn xóa chủ đề này?", () => {
            deleteTopic(id, {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Xóa chủ đề thành công");
                    } else {
                        toast.error(res.message);
                    }
                }
            });
        });
    };

    return (
        <Box sx={isMobile ? { bgcolor: 'transparent' } : {}}>
            {!isMobile ? (
                <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: "var(--customShadows-card)" }}>
                    <TableContainer sx={{ position: 'relative' }}>
                        <Table sx={{ minWidth: 960 }}>
                            <TableHead sx={{ bgcolor: 'var(--palette-background-neutral)' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Chủ đề</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Thời gian tạo</TableCell>
                                    <TableCell sx={{ width: 120 }} align="right" />
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                            <CircularProgress size={32} />
                                        </TableCell>
                                    </TableRow>
                                ) : topics.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                            <Typography sx={{ color: 'text.secondary' }}>Chưa có dữ liệu</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    topics.map((row: any) => {
                                        const isOpen = openRows.includes(row._id);
                                        return (
                                            <React.Fragment key={row._id}>
                                                <TableRow hover selected={isOpen}>
                                                    <TableCell>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                            {row.title}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                                        {row.description || "—"}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Stack spacing={0.25}>
                                                            <Typography variant="body2">{dayjs(row.createdAt).format("DD MMM, YYYY")}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{dayjs(row.createdAt).format("hh:mm A")}</Typography>
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                                                            <Tooltip title="Thêm từ vựng">
                                                                <IconButton size="small" color="primary" onClick={() => onAddVocab(row)}>
                                                                    <Icon icon="solar:add-circle-bold" width={22} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <IconButton size="small" onClick={() => toggleRow(row._id)}>
                                                                <Icon icon={isOpen ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} width={20} />
                                                            </IconButton>

                                                            <IconButton color="inherit" onClick={(e) => handleOpenMenu(e, row._id)}>
                                                                <Icon icon="eva:more-vertical-fill" width={20} />
                                                            </IconButton>
                                                        </Stack>

                                                        <Menu
                                                            anchorEl={anchorEl[row._id]}
                                                            open={Boolean(anchorEl[row._id])}
                                                            onClose={() => handleCloseMenu(row._id)}
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                            slotProps={{
                                                                paper: {
                                                                    sx: { ...PREMIUM_MENU_STYLE, width: 160 }
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem
                                                                onClick={() => { handleCloseMenu(row._id); navigate(`/${prefixAdmin}/vocabulary/study?topicId=${row._id}`); }}
                                                                sx={{ borderRadius: '8px', mb: 0.5 }}
                                                            >
                                                                <ListItemIcon sx={{ minWidth: '32px !important' }}>
                                                                    <Icon icon="solar:play-circle-bold" width={20} style={{ color: '#00A76F' }} />
                                                                </ListItemIcon>
                                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#00A76F' }}>Học ngay</Typography>
                                                            </MenuItem>
                                                            <MenuItem
                                                                onClick={() => { handleCloseMenu(row._id); onEdit(row); }}
                                                                sx={{ borderRadius: '8px', mb: 0.5 }}
                                                            >
                                                                <ListItemIcon sx={{ minWidth: '32px !important' }}>
                                                                    <Icon icon="solar:pen-bold" width={20} style={{ color: '#1C252E' }} />
                                                                </ListItemIcon>
                                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1C252E' }}>Chỉnh sửa</Typography>
                                                            </MenuItem>
                                                            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                                                            <MenuItem
                                                                onClick={() => { handleCloseMenu(row._id); handleDelete(row._id); }}
                                                                sx={{ borderRadius: '8px', color: 'error.main' }}
                                                            >
                                                                <ListItemIcon sx={{ minWidth: '32px !important', color: 'inherit' }}>
                                                                    <Icon icon="solar:trash-bin-trash-bold" width={20} />
                                                                </ListItemIcon>
                                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>Xóa</Typography>
                                                            </MenuItem>
                                                        </Menu>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell colSpan={4} sx={{ p: 0, borderBottom: isOpen ? '1px dashed var(--palette-divider)' : 'none' }}>
                                                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                            <VocabularySubList topicId={row._id} onEditVocab={onEditVocab} />
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={pagination.totalRecords || 0}
                        rowsPerPage={pageSize}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
                    />
                </Card>
            ) : (
                <>
                    <Stack spacing={2} sx={{ mb: 2 }}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress size={32} /></Box>
                        ) : topics.length === 0 ? (
                            <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 5 }}>Chưa có dữ liệu</Typography>
                        ) : (
                            topics.map((row: any) => {
                                const isOpen = openRows.includes(row._id);
                                return (
                                    <Card key={row._id} sx={{ p: 2, borderRadius: '16px', boxShadow: "var(--customShadows-card)" }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                                                {row.title}
                                            </Typography>
                                            <Stack direction="row" spacing={0.5}>
                                                <IconButton size="small" color="primary" onClick={() => onAddVocab(row)}>
                                                    <Icon icon="solar:add-circle-bold" width={22} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => toggleRow(row._id)}>
                                                    <Icon icon={isOpen ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} width={20} />
                                                </IconButton>
                                                <IconButton size="small" onClick={(e) => handleOpenMenu(e, row._id)}>
                                                    <Icon icon="eva:more-vertical-fill" width={20} />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" mb={1} sx={{ lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {row.description || "Không có mô tả"}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            Tạo lúc: {dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")}
                                        </Typography>

                                        <Collapse in={isOpen} timeout="auto" unmountOnExit sx={{ mt: 2, borderTop: '1px dashed #919eab33', pt: 2 }}>
                                            <VocabularySubList topicId={row._id} onEditVocab={onEditVocab} />
                                        </Collapse>

                                        <Menu
                                            anchorEl={anchorEl[row._id]}
                                            open={Boolean(anchorEl[row._id])}
                                            onClose={() => handleCloseMenu(row._id)}
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            slotProps={{ paper: { sx: { ...PREMIUM_MENU_STYLE, width: 160 } } }}
                                        >

                                            <MenuItem onClick={() => { handleCloseMenu(row._id); navigate(`/${prefixAdmin}/vocabulary/study?topicId=${row._id}`); }} sx={{ borderRadius: '8px' }}>
                                                <ListItemIcon sx={{ minWidth: '32px !important' }}><Icon icon="solar:play-circle-bold" width={20} color="#00A76F" /></ListItemIcon>
                                                <Typography variant="body2" fontWeight={600} color="#00A76F">Học ngay</Typography>
                                            </MenuItem>
                                            <MenuItem onClick={() => { handleCloseMenu(row._id); onEdit(row); }} sx={{ borderRadius: '8px' }}>
                                                <ListItemIcon sx={{ minWidth: '32px !important' }}><Icon icon="solar:pen-bold" width={20} /></ListItemIcon>
                                                <Typography variant="body2" fontWeight={600}>Chỉnh sửa</Typography>
                                            </MenuItem>
                                            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                                            <MenuItem onClick={() => { handleCloseMenu(row._id); handleDelete(row._id); }} sx={{ borderRadius: '8px', color: 'error.main' }}>
                                                <ListItemIcon sx={{ minWidth: '32px !important', color: 'inherit' }}><Icon icon="solar:trash-bin-trash-bold" width={20} /></ListItemIcon>
                                                <Typography variant="body2" fontWeight={600}>Xóa</Typography>
                                            </MenuItem>
                                        </Menu>
                                    </Card>
                                )
                            })
                        )}
                    </Stack>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={pagination.totalRecords || 0}
                        rowsPerPage={pageSize}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
                        sx={{ borderTop: 'none' }}
                    />
                </>
            )}
        </Box>
    );
};
