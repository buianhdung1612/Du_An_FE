import { useEffect, useState } from 'react';
import { Box, Typography, Stack, useTheme, Tooltip, alpha } from '@mui/material';
import { Icon } from '@iconify/react';
import DashboardCard from "@shared/components/dashboard/DashboardCard";
import { getFinancialSummary } from '../../api/finance.api';

interface StatProps {
    title: string;
    value: string;
    icon: string;
    color: string;
    trend?: { value: string; isUp: boolean };
}

const StatCard = ({ title, value, icon, color, trend }: StatProps) => {
    return (
        <DashboardCard sx={{
            display: 'flex',
            alignItems: 'center',
            p: 3,
            minHeight: 120,
            height: '100%'
        }}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>{title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>

                {trend && (
                    <Tooltip title="So với tháng trước" arrow placement="top">
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{
                            mt: 1,
                            color: trend.isUp ? 'success.main' : 'error.main',
                            width: 'fit-content',
                            cursor: 'help'
                        }}>
                            <Icon icon={trend.isUp ? "solar:double-alt-arrow-up-bold-duotone" : "solar:double-alt-arrow-down-bold-duotone"} width={20} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {trend.isUp ? '+' : ''}{trend.value}
                            </Typography>
                        </Stack>
                    </Tooltip>
                )}
            </Box>

            <Box sx={{
                p: 2, borderRadius: '12px',
                bgcolor: alpha(color, 0.16),
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon icon={icon} width={32} />
            </Box>
        </DashboardCard>
    );
};

export const StatsOverview = () => {
    const theme = useTheme();
    const [summary, setSummary] = useState({ income: 0, expense: 0, savings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const now = new Date();
                const res = await getFinancialSummary({ month: now.getMonth() + 1, year: now.getFullYear() });
                if (res.data?.code === 200) {
                    setSummary({
                        income: res.data.data.income,
                        expense: res.data.data.expense,
                        savings: res.data.data.savings
                    });
                }
            } catch (error) {
                console.error("Failed to fetch financial summary", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) return null;

    return (
        <Box sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
                xs: 'repeat(1, minmax(0, 1fr))',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))'
            }
        }}>
            {[
                { title: "Tổng thu nhập", value: `${(summary.income / 1000).toLocaleString('vi-VN')}k`, icon: "solar:wad-of-money-bold-duotone", color: theme.palette.success.main },
                { title: "Tổng chi tiêu", value: `${(summary.expense / 1000).toLocaleString('vi-VN')}k`, icon: "solar:card-send-bold-duotone", color: theme.palette.error.main },
                { title: "Tiết kiệm", value: `${(summary.savings / 1000).toLocaleString('vi-VN')}k`, icon: "solar:safe-square-bold-duotone", color: theme.palette.info.main },
                { title: "Đầu tư", value: "0k", icon: "solar:chart-square-bold-duotone", color: theme.palette.warning.main }
            ].map((stat, idx) => (
                <StatCard key={idx} {...stat} />
            ))}
        </Box>
    );
};
