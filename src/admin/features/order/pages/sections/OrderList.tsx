import { useState, SyntheticEvent, useMemo } from "react";
import {
    Box,
    Card,
    Tabs,
    Tab,
    styled,
    CircularProgress,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Checkbox,
    TablePagination,
    Collapse,
    Stack,
    Avatar,
    Chip,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import React from 'react';
import { useOrders, useUpdateOrderStatus } from "../hooks/useOrderManagement";
import { toast } from "react-toastify";
import { Search } from "@shared/components/ui/Search";

import { useNavigate } from "react-router-dom";
import { prefixAdmin } from "@shared/constants/routes";

import { PREMIUM_MENU_STYLE } from "@shared/constants/menu-styles";

const TabBadge = styled('span')(() => ({
    height: "24px",
    minWidth: "24px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: '8px',
    padding: '0px 6px',
    borderRadius: "var(--shape-borderRadius-sm)",
    fontSize: '0.75rem',
    fontWeight: 700,
    transition: 'all 0.2s',
}));

export const OrderList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const navigate = useNavigate();
    const [tabStatus, setTabStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState<string[]>([]);
    const [openRows, setOpenRows] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
    };

    const handleCloseMenu = (id: string) => {
        setAnchorEl({ ...anchorEl, [id]: null });
    };

    const params = useMemo(() => ({
        page: page + 1,
        limit: rowsPerPage,
        keyword: searchQuery,
        status: tabStatus === 'all' ? undefined : tabStatus,
    }), [page, rowsPerPage, searchQuery, tabStatus]);

    const { data: ordersRes, isLoading } = useOrders(params);
    const rows = ordersRes?.data?.recordList || [];
    const pagination = ordersRes?.data?.pagination || { totalRecords: 0 };

    const { mutate: updateStatus } = useUpdateOrderStatus();

    const handleStatusUpdate = (id: string, status: string) => {
        updateStatus({ id, status }, {
            onSuccess: () => toast.success("Cập nhật thành công")
        });
    };

    const handleViewDetail = (id: string) => {
        navigate(`/${prefixAdmin}/order/detail/${id}`);
    };

    const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
        setTabStatus(newValue);
        setPage(0);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n: any) => n._id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelectRow = (id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else if (selectedIndex === 0) {
            newSelected = selected.slice(1);
        } else if (selectedIndex === selected.length - 1) {
            newSelected = selected.slice(0, -1);
        } else if (selectedIndex > 0) {
            newSelected = [
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex + 1),
            ];
        }
        setSelected(newSelected);
    };

    const toggleRow = (id: string) => {
        setOpenRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const statusCounts = ordersRes?.data?.statusCounts || {
        all: 0,
        pending: 0,
        confirmed: 0,
        shipping: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
        returned: 0,
        request_cancel: 0,
    };

    const renderStatusChip = (statusKey: string) => {
        const statusMap: any = {
            pending: { label: "Chờ xác nhận", color: "var(--palette-warning-dark)", bg: "var(--palette-warning-lighter)" },
            confirmed: { label: "Đã xác nhận", color: "var(--palette-info-dark)", bg: "var(--palette-info-lighter)" },
            shipping: { label: "Đang giao", color: "var(--palette-primary-dark)", bg: "var(--palette-primary-lighter)" },
            shipped: { label: "Đã giao (Chờ nhận)", color: "var(--palette-success-dark)", bg: "var(--palette-success-lighter)" },
            completed: { label: "Hoàn thành", color: "var(--palette-success-dark)", bg: "var(--palette-success-lighter)" },
            cancelled: { label: "Đã hủy", color: "var(--palette-error-dark)", bg: "var(--palette-error-lighter)" },
            returned: { label: "Trả hàng", color: "var(--palette-error-dark)", bg: "var(--palette-error-lighter)" },
            request_cancel: { label: "Yêu cầu hủy", color: "var(--palette-error-dark)", bg: "var(--palette-error-lighter)" }
        };
        const status = statusMap[statusKey] || { label: statusKey, color: 'var(--palette-text-disabled)', bg: "var(--palette-background-neutral)" };
        return (
            <Chip
                label={status.label}
                size="small"
                sx={{
                    borderRadius: "var(--shape-borderRadius-sm)",
                    fontWeight: 700,
                    fontSize: '0.6875rem',
                    color: status.color,
                    bgcolor: status.bg,
                    height: '24px'
                }}
            />
        );
    };

    return (
        <Card sx={{
            borderRadius: 'var(--shape-borderRadius-lg)',
            bgcolor: isMobile ? 'transparent' : 'var(--palette-background-paper)',
            boxShadow: isMobile ? 'none' : "var(--customShadows-card)",
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Tabs
                value={tabStatus}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons={isMobile}
                allowScrollButtonsMobile
                sx={{
                    px: isMobile ? 1 : '20px',
                    minHeight: "48px",
                    bgcolor: 'var(--palette-background-paper)',
                    borderBottom: `1px solid var(--palette-background-neutral)`,
                    '& .MuiTabs-flexContainer': { gap: isMobile ? 1 : "calc(5 * var(--spacing))" },
                    '& .MuiTabs-indicator': { backgroundColor: 'var(--palette-text-primary)', height: 2 },
                }}
            >
                {[
                    { value: 'all', label: "Tất cả", color: 'var(--palette-common-white)', bg: 'var(--palette-grey-800)', activeColor: 'var(--palette-common-white)', activeBg: 'var(--palette-grey-800)' },
                    { value: 'pending', label: "Chờ xác nhận", color: 'var(--palette-warning-dark)', bg: 'var(--palette-warning-lighter)', activeColor: 'var(--palette-warning-contrastText)', activeBg: 'var(--palette-warning-main)' },
                    { value: 'confirmed', label: "Đã xác nhận", color: 'var(--palette-info-dark)', bg: 'var(--palette-info-lighter)', activeColor: 'var(--palette-info-contrastText)', activeBg: 'var(--palette-info-main)' },
                    { value: 'shipping', label: "Đang giao", color: 'var(--palette-primary-dark)', bg: 'var(--palette-primary-lighter)', activeColor: 'var(--palette-primary-contrastText)', activeBg: 'var(--palette-primary-main)' },
                    { value: 'shipped', label: "Đã giao (Chờ nhận)", color: 'var(--palette-success-dark)', bg: 'var(--palette-success-lighter)', activeColor: 'var(--palette-success-contrastText)', activeBg: 'var(--palette-success-main)' },
                    { value: 'completed', label: "Hoàn thành", color: 'var(--palette-success-dark)', bg: 'var(--palette-success-lighter)', activeColor: 'var(--palette-success-contrastText)', activeBg: 'var(--palette-success-main)' },
                    { value: 'cancelled', label: "Đã hủy", color: 'var(--palette-error-dark)', bg: 'var(--palette-error-lighter)', activeColor: 'var(--palette-error-contrastText)', activeBg: 'var(--palette-error-main)' },
                    { value: 'returned', label: "Trả hàng", color: 'var(--palette-error-dark)', bg: 'var(--palette-error-lighter)', activeColor: 'var(--palette-error-contrastText)', activeBg: 'var(--palette-error-main)' },
                    { value: 'request_cancel', label: "Yêu cầu hủy", color: 'var(--palette-error-dark)', bg: 'var(--palette-error-lighter)', activeColor: 'var(--palette-error-contrastText)', activeBg: 'var(--palette-error-main)' },
                ].map((tab) => (
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        disableRipple
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{
                                    fontSize: '0.8125rem',
                                    fontWeight: tabStatus === tab.value ? 700 : 500,
                                    color: tabStatus === tab.value ? 'var(--palette-text-primary)' : 'inherit'
                                }}>
                                    {tab.label}
                                </Typography>
                                <TabBadge
                                    sx={{
                                        bgcolor: tabStatus === tab.value ? tab.activeBg : tab.bg,
                                        color: tabStatus === tab.value ? tab.activeColor : tab.color,
                                    }}
                                >
                                    {statusCounts[tab.value as keyof typeof statusCounts]}
                                </TabBadge>
                            </Box>
                        }
                        sx={{
                            minWidth: 0,
                            padding: '0 4px',
                            minHeight: '48px',
                            textTransform: 'none',
                        }}
                    />
                ))}
            </Tabs>

            <Box sx={{ p: isMobile ? 2 : '20px', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'var(--palette-background-paper)', borderBottom: `1px dashed var(--palette-background-neutral)` }}>
                <Search
                    placeholder="Tìm theo mã đơn..."
                    value={searchQuery}
                    onChange={(val) => { setSearchQuery(val); setPage(0); }}
                    maxWidth={isMobile ? "100%" : "25rem"}
                />
            </Box>

            {!isMobile ? (
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Table sx={{ minWidth: 960 }}>
                        <TableHead sx={{ bgcolor: 'var(--palette-background-neutral)' }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < rows.length}
                                        checked={rows.length > 0 && selected.length === rows.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Mã đơn</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Khách hàng</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Sản phẩm</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Tổng tiền</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                <TableCell align="right" sx={{ width: 80 }} />
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 10 }}><CircularProgress size={32} /></TableCell></TableRow>
                            ) : rows.length === 0 ? (
                                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 10 }}><Typography sx={{ color: 'var(--palette-text-secondary)' }}>Chưa có dữ liệu</Typography></TableCell></TableRow>
                            ) : (
                                rows.map((row: any) => {
                                    const isItemSelected = selected.indexOf(row._id) !== -1;
                                    const isOpen = openRows.includes(row._id);
                                    return (
                                        <React.Fragment key={row._id}>
                                            <TableRow hover selected={isItemSelected}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={isItemSelected} onClick={() => handleSelectRow(row._id)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography onClick={() => handleViewDetail(row._id)} sx={{ fontWeight: 600, color: 'var(--palette-text-primary)', textDecoration: 'underline', cursor: 'pointer' }}>
                                                        #{row.code || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar src={row.userId?.avatar} sx={{ width: 40, height: 40, borderRadius: 'var(--shape-borderRadius-sm)' }} />
                                                        <Stack>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.fullName || row.userId?.fullName || 'Khách vãng lai'}</Typography>
                                                            <Typography sx={{ color: 'var(--palette-text-secondary)', fontSize: '0.75rem' }}>{row.phone || row.userId?.phone || "N/A"}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{row.items?.[0]?.name || "Đơn hàng"}{row.items?.length > 1 && ` + ${row.items.length - 1} món`}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{dayjs(row.createdAt).format("DD MMM YYYY")}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{dayjs(row.createdAt).format("h:mm a")}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.total || 0)}</Typography>
                                                </TableCell>
                                                <TableCell align="right">{renderStatusChip(row.orderStatus)}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => toggleRow(row._id)}><Icon icon={isOpen ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} width={20} /></IconButton>
                                                    <IconButton onClick={(e) => handleOpenMenu(e, row._id)}><Icon icon="eva:more-vertical-fill" width={20} /></IconButton>
                                                    <Menu anchorEl={anchorEl[row._id]} open={!!anchorEl[row._id]} onClose={() => handleCloseMenu(row._id)} slotProps={{ paper: { sx: { ...PREMIUM_MENU_STYLE, width: 160 } } }}>
                                                        <MenuItem onClick={() => { handleCloseMenu(row._id); handleViewDetail(row._id); }}><Icon icon="solar:eye-bold" width={18} style={{ marginRight: 8 }} /> Chi tiết</MenuItem>
                                                        {row.orderStatus === 'pending' && <MenuItem onClick={() => { handleCloseMenu(row._id); handleStatusUpdate(row._id, 'confirmed'); }} sx={{ color: 'success.main' }}><Icon icon="eva:checkmark-circle-2-fill" width={18} style={{ marginRight: 8 }} /> Xác nhận</MenuItem>}
                                                        <Divider sx={{ borderStyle: 'dashed' }} />
                                                        <MenuItem onClick={() => handleCloseMenu(row._id)} sx={{ color: 'error.main' }}><Icon icon="solar:trash-bin-trash-bold" width={18} style={{ marginRight: 8 }} /> Xóa</MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={8} sx={{ p: 0, bgcolor: 'var(--palette-background-neutral)' }}>
                                                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                        <Box sx={{ bgcolor: 'var(--palette-background-paper)', m: 2, borderRadius: 1, overflow: 'hidden' }}>
                                                            {row.items?.map((item: any, idx: number) => (
                                                                <Stack key={idx} direction="row" alignItems="center" spacing={2} sx={{ p: 2, borderBottom: '1px dashed var(--palette-divider)' }}>
                                                                    <Avatar src={item.image} variant="rounded" sx={{ width: 48, height: 48 }} />
                                                                    <Box sx={{ flexGrow: 1 }}>
                                                                        <Typography variant="subtitle2">{item.name}</Typography>
                                                                        <Typography variant="caption" color="text.secondary">x{item.quantity} • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Typography>
                                                                    </Box>
                                                                </Stack>
                                                            ))}
                                                        </Box>
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
            ) : (
                <Stack spacing={2} sx={{ p: 2 }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>
                    ) : rows.length === 0 ? (
                        <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 5 }}>Chưa có dữ liệu</Typography>
                    ) : (
                        rows.map((row: any) => {
                            const isOpen = openRows.includes(row._id);
                            return (
                                <Card key={row._id} sx={{ p: 2, borderRadius: '16px', boxShadow: 'var(--customShadows-card)', position: 'relative' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                        <Typography onClick={() => handleViewDetail(row._id)} variant="subtitle1" fontWeight={700} color="primary.main" sx={{ textDecoration: 'underline' }}>
                                            #{row.code}
                                        </Typography>
                                        {renderStatusChip(row.orderStatus)}
                                    </Stack>

                                    <Stack spacing={1.5}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Khách hàng</Typography>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                                                <Avatar src={row.userId?.avatar} sx={{ width: 32, height: 32 }} />
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>{row.fullName || row.userId?.fullName || 'Khách vãng lai'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{row.phone || row.userId?.phone || "N/A"}</Typography>
                                                </Box>
                                            </Stack>
                                        </Box>

                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Thông tin đơn hàng</Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {row.items?.[0]?.name} {row.items?.length > 1 && ` (+${row.items.length - 1} món)`}
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">{dayjs(row.createdAt).format("DD/MM/YYYY HH:mm")}</Typography>
                                                <Typography variant="subtitle2" color="error.main">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.total)}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={1} sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed var(--palette-divider)' }} justifyContent="flex-end">
                                        <IconButton size="small" onClick={() => toggleRow(row._id)}>
                                            <Icon icon={isOpen ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} width={20} />
                                        </IconButton>
                                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, row._id)}>
                                            <Icon icon="eva:more-vertical-fill" width={20} />
                                        </IconButton>
                                    </Stack>

                                    <Collapse in={isOpen}>
                                        <Box sx={{ mt: 2, p: 1.5, bgcolor: 'var(--palette-background-neutral)', borderRadius: 1 }}>
                                            {row.items?.map((item: any, idx: number) => (
                                                <Stack key={idx} direction="row" spacing={1.5} sx={{ py: 1, '&:not(:last-child)': { borderBottom: '1px dashed var(--palette-divider)' } }}>
                                                    <Avatar src={item.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="caption" fontWeight={600} display="block">{item.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">x{item.quantity} • {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</Typography>
                                                    </Box>
                                                </Stack>
                                            ))}
                                        </Box>
                                    </Collapse>

                                    <Menu anchorEl={anchorEl[row._id]} open={!!anchorEl[row._id]} onClose={() => handleCloseMenu(row._id)} slotProps={{ paper: { sx: { ...PREMIUM_MENU_STYLE, width: 160 } } }}>
                                        <MenuItem onClick={() => { handleCloseMenu(row._id); handleViewDetail(row._id); }}><Icon icon="solar:eye-bold" width={18} style={{ marginRight: 8 }} /> Chi tiết</MenuItem>
                                        {row.orderStatus === 'pending' && <MenuItem onClick={() => { handleCloseMenu(row._id); handleStatusUpdate(row._id, 'confirmed'); }} sx={{ color: 'success.main' }}><Icon icon="eva:checkmark-circle-2-fill" width={18} style={{ marginRight: 8 }} /> Xác nhận</MenuItem>}
                                        <Divider sx={{ borderStyle: 'dashed' }} />
                                        <MenuItem onClick={() => handleCloseMenu(row._id)} sx={{ color: 'error.main' }}><Icon icon="solar:trash-bin-trash-bold" width={18} style={{ marginRight: 8 }} /> Xóa</MenuItem>
                                    </Menu>
                                </Card>
                            )
                        })
                    )}
                </Stack>
            )}

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={pagination.totalRecords || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ borderTop: isMobile ? 'none' : '1px solid var(--palette-divider)' }}
            />
        </Card >
    );
};
