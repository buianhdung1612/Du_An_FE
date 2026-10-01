import { Box, Container, Stack, Typography } from '@mui/material';
import { Title } from "@shared/components/ui/Title";
import { StatsOverview } from './sections/StatsOverview';
import { FinancialStatistic } from './sections/FinancialStatistic';
import { DailyLimitCard } from './sections/DailyLimitCard';
import { IncomeExpenseBars } from './sections/IncomeExpenseBars';
import { MonthlyTrendsArea } from './sections/MonthlyTrendsArea';
import { RecentActivity } from './sections/RecentActivity';
import { BudgetPerformance } from './sections/BudgetPerformance';
import { RecentTransactionsTable } from './sections/RecentTransactionsTable';
import { SavingPlans } from './sections/SavingPlans';

export const FinanceDashboard = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 5 }}>
                <Title title="Quản lý tài chính" />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Theo dõi thu nhập, chi tiêu và các mục tiêu tiết kiệm chuyên sâu
                </Typography>
            </Box>

            <Stack spacing={3}>
                {/* 4 thẻ thống kê trên cùng */}
                <StatsOverview />

                <Box sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(4, minmax(0, 1fr))'
                    }
                }}>
                    {/* Cột 1: Thống kê chi tiêu (Tương ứng 1/4) */}
                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 1' } }}>
                        <Stack spacing={3}>
                            <FinancialStatistic />
                            <DailyLimitCard />
                        </Stack>
                    </Box>

                    {/* Cột 2: Thu nhập vs Chi tiêu & Xu hướng (Tương ứng 2/4) */}
                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                        <Stack spacing={3}>
                            <IncomeExpenseBars />
                            <MonthlyTrendsArea />
                        </Stack>
                    </Box>

                    {/* Cột 3: Hoạt động gần đây (Tương ứng 1/4) */}
                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 1' } }}>
                        <RecentActivity />
                    </Box>
                </Box>

                {/* Hàng 2: Chi tiết & Thống kê nâng cao */}
                <Box sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(4, minmax(0, 1fr))'
                    }
                }}>
                    {/* Cột 1: Budget Performance (1/4) */}
                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 1' } }}>
                        <BudgetPerformance />
                    </Box>

                    {/* Cột 2: Bảng giao dịch chi tiết (2/4) */}
                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                        <RecentTransactionsTable />
                    </Box>

                    {/* Cột 3: Kế hoạch tiết kiệm (1/4) */}
                    <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 1' } }}>
                        <SavingPlans />
                    </Box>
                </Box>
            </Stack>
        </Container>
    );
};
