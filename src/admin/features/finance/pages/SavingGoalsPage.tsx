import {
    Box, Stack, Typography, Button, LinearProgress,
    IconButton, Tab, Tabs, Paper, alpha
} from '@mui/material';
import { Icon } from '@iconify/react';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { useState } from 'react';
import { AddSavingGoalDialog } from './sections/AddSavingGoalDialog';

const SAVING_GOALS = [
    { id: 1, name: 'Quỹ khẩn cấp', target: 'Tháng 12 2024', saved: 6500, total: 10000, percentage: 65, icon: 'solar:shield-warning-bold-duotone', color: '#1976D2', status: 'active' },
    { id: 2, name: 'Mua xe mới', target: 'Tháng 6 2025', saved: 8750, total: 25000, percentage: 35, icon: 'solar:car-bold-duotone', color: '#388E3C', status: 'active' },
    { id: 3, name: 'Du lịch nghỉ dưỡng', target: 'Tháng 8 2024', saved: 3250, total: 5000, percentage: 65, icon: 'solar:plain-bold-duotone', color: '#8E33FF', status: 'active' },
    { id: 4, name: 'Tiền đặt cọc mua nhà', target: 'Tháng 12 2026', saved: 12500, total: 50000, percentage: 25, icon: 'solar:home-bold-duotone', color: '#FFAB00', status: 'active' },
    { id: 5, name: 'Quỹ giáo dục', target: 'Tháng 9 2025', saved: 5000, total: 20000, percentage: 25, icon: 'solar:library-bold-duotone', color: '#FF5630', status: 'active' },
    { id: 6, name: 'Quà kỷ niệm', target: 'Đã hoàn thành', saved: 1000, total: 1000, percentage: 100, icon: 'solar:gift-bold-duotone', color: '#919EAB', status: 'completed' },
];

const SAVING_TIPS = [
    { title: 'Quy tắc 50/30/20', desc: 'Phân bổ 50% thu nhập cho nhu cầu thiết yếu, 30% cho sở thích và 20% cho tiết kiệm và trả nợ.', icon: 'solar:lightbulb-bold-duotone' },
    { title: 'Tự động hóa tiết kiệm', desc: 'Thiết lập chuyển khoản tự động vào tài khoản tiết kiệm vào ngày nhận lương để đảm bảo tiết kiệm nhất quán.', icon: 'solar:settings-bold-duotone' },
    { title: 'Cắt giảm đăng ký không cần thiết', desc: 'Xem lại các gói đăng ký hàng tháng và hủy những dịch vụ bạn hiếm khi sử dụng để tiết kiệm tiền.', icon: 'solar:clapperboard-edit-bold-duotone' },
    { title: 'Đặt mục tiêu cụ thể', desc: 'Xác định rõ ràng mục tiêu tiết kiệm như kỳ nghỉ, quỹ khẩn cấp hoặc xe mới để duy trì động lực.', icon: 'solar:target-bold-duotone' },
    { title: 'Theo dõi chi tiêu', desc: 'Thường xuyên theo dõi thói quen chi tiêu để xác định các lĩnh vực bạn có thể cắt giảm chi phí.', icon: 'solar:bill-list-bold-duotone' },
];

export const SavingGoalsPage = () => {
    const [tabValue, setTabValue] = useState('all');
    const [openAdd, setOpenAdd] = useState(false);

    return (
        <Box sx={{ pb: 5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Mục tiêu tiết kiệm</Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenAdd(true)}
                    sx={{
                        bgcolor: '#1C252E', borderRadius: '12px', px: 3, height: '44px',
                        fontWeight: 700, textTransform: 'none', boxShadow: 'none',
                        '&:hover': { bgcolor: '#454F5B', boxShadow: 'none' }
                    }}
                >
                    Thêm mục tiêu
                </Button>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' }, gap: 4, alignItems: 'start' }}>
                {/* Left Sidebar - Overview (Sticky) */}
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' }, position: { md: 'sticky' }, top: '24px' }}>
                    <Stack spacing={4}>
                        <DashboardCard sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Tổng quan tiết kiệm</Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '8px solid', borderColor: alpha('#00A76F', 0.1) }} />
                                    <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '8px solid', borderColor: '#00A76F', clipPath: 'polygon(0 0, 100% 0, 100% 33%, 0 33%)' }} />
                                    <Stack alignItems="center">
                                        <Icon icon="solar:bank-note-bold-duotone" width={24} color="#00A76F" />
                                        <Typography variant="h5" fontWeight={800}>33%</Typography>
                                        <Typography variant="caption" color="text.secondary">Tiến độ</Typography>
                                    </Stack>
                                </Box>
                            </Box>

                            <Stack spacing={2} sx={{ mb: 4 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Tổng tiết kiệm</Typography>
                                    <Typography variant="body2" fontWeight={700}>$37,000</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Tổng mục tiêu</Typography>
                                    <Typography variant="body2" fontWeight={700}>$111,000</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>Còn lại</Typography>
                                    <Typography variant="body2" fontWeight={700}>$74,000</Typography>
                                </Stack>
                            </Stack>

                            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>Tiết kiệm hàng tháng</Typography>
                            <Stack spacing={1.5}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>Mục tiêu</Typography>
                                    <Typography variant="caption" fontWeight={800}>$1500</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>Đã lưu tháng này</Typography>
                                    <Typography variant="caption" fontWeight={800}>$1200</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>Tiến độ</Typography>
                                    <Typography variant="caption" fontWeight={800}>80%</Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={80}
                                    sx={{ height: 6, borderRadius: 3, bgcolor: alpha('#00A76F', 0.1), '& .MuiLinearProgress-bar': { bgcolor: '#00A76F' } }}
                                />
                            </Stack>

                            <Box sx={{ mt: 4, p: 3, borderRadius: '16px', bgcolor: alpha('#919EAB', 0.08), textAlign: 'center' }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Tỉ lệ tiết kiệm</Typography>
                                <Typography variant="h4" fontWeight={800}>18%</Typography>
                                <Typography variant="caption" color="text.secondary">trên thu nhập tháng</Typography>
                            </Box>
                        </DashboardCard>
                    </Stack>
                </Box>

                {/* Right Content - Goals & Tips */}
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
                    <Stack spacing={4}>
                        {/* Saving Goals List */}
                        <DashboardCard sx={{ p: 0 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={800}>Danh sách mục tiêu</Typography>
                                <Tabs
                                    value={tabValue}
                                    onChange={(_, v) => setTabValue(v)}
                                    sx={{
                                        minHeight: 0,
                                        bgcolor: alpha('#919EAB', 0.08),
                                        borderRadius: '10px', p: 0.5,
                                        '& .MuiTabs-indicator': { display: 'none' },
                                        '& .MuiTab-root': {
                                            minHeight: 0, p: '6px 12px', borderRadius: '8px',
                                            fontSize: '12px', fontWeight: 700, minWidth: 0,
                                            color: 'text.secondary',
                                            '&.Mui-selected': { bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }
                                        }
                                    }}
                                >
                                    <Tab label="Tất cả" value="all" />
                                    <Tab label="Đang chạy" value="active" />
                                    <Tab label="Tạm dừng" value="paused" />
                                    <Tab label="Hoàn thành" value="completed" />
                                </Tabs>
                            </Stack>

                            <Stack spacing={0} sx={{ pb: 3 }}>
                                {SAVING_GOALS.map((goal) => (
                                    <Box key={goal.id} sx={{ px: 3, py: 2.5, borderTop: '1px solid #f4f6f8' }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                            <Stack direction="row" spacing={2}>
                                                <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: alpha(goal.color, 0.12), color: goal.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Icon icon={goal.icon} width={24} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={800}>{goal.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Hạn chót: {goal.target}</Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Button size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, color: 'text.primary', borderColor: 'divider' }}>Nạp tiền</Button>
                                                <IconButton size="small"><Icon icon="solar:menu-dots-bold" /></IconButton>
                                            </Stack>
                                        </Stack>

                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="caption" fontWeight={700}>${goal.saved.toLocaleString()} <Typography component="span" variant="caption" color="text.secondary">trên ${goal.total.toLocaleString()}</Typography></Typography>
                                            <Typography variant="caption" fontWeight={800}>{goal.percentage}%</Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={goal.percentage}
                                            sx={{
                                                height: 8, borderRadius: 4,
                                                bgcolor: alpha(goal.color, 0.08),
                                                '& .MuiLinearProgress-bar': { bgcolor: goal.color }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </DashboardCard>

                        {/* Saving Tips */}
                        <Box>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Mẹo tiết kiệm</Typography>
                            <Stack spacing={2}>
                                {SAVING_TIPS.map((tip, idx) => (
                                    <Paper key={idx} sx={{ p: 2, borderRadius: '16px', border: '1px solid #f4f6f8', boxShadow: 'none' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: alpha('#FFAB00', 0.1), color: '#FFAB00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon icon={tip.icon} width={20} />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle2" fontWeight={800}>{tip.title}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{tip.desc}</Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                            <Button fullWidth sx={{ mt: 3, py: 1.5, borderRadius: '12px', color: 'text.secondary', fontWeight: 800, textTransform: 'none' }}>
                                Xem thêm mẹo <Icon icon="solar:alt-arrow-right-linear" style={{ marginLeft: 8 }} />
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <AddSavingGoalDialog open={openAdd} onClose={() => setOpenAdd(false)} />
        </Box>
    );
};
