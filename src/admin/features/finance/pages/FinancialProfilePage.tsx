import { Box, Card, Typography, Container } from '@mui/material';
import { Title } from "@shared/components/ui/Title";

const financialData = Array.from({ length: 20 }).map((_, i) => {
    const earned = 150000000 + (i * 50000000);
    const spent = 80000000 + (i * 20000000);
    return {
        id: i,
        year: 2026 + i,
        age: 25 + i,
        earned,
        spent,
        saved: earned - spent,
        majorExpense: i === 0 ? "Mua máy tính, điện thoại" : i === 2 ? "Mua xe máy" : i === 4 ? "Đám cưới" : i === 6 ? "Sinh con" : i === 9 ? "Mua nhà trả góp" : i === 12 ? "Mua ô tô" : i === 15 ? "Đầu tư bất động sản" : "Chi tiêu sinh hoạt, du lịch"
    };
});

export const FinancialProfilePage = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 5 }}>
                <Title title="Hồ sơ tài chính 20 năm" />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Kế hoạch thu nhập, chi tiêu và tiết kiệm dự kiến trong 20 năm tới
                </Typography>
            </Box>

            <Card sx={{ borderRadius: "var(--shape-borderRadius-lg)", boxShadow: "var(--customShadows-card)", overflow: 'hidden' }}>
                <Box sx={{ overflowX: 'auto' }}>
                    <Box sx={{ minWidth: 800 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1.5fr', p: 2, bgcolor: 'var(--palette-background-neutral)', fontWeight: 600 }}>
                            <Box>Tuổi</Box>
                            <Box textAlign="right">Số tiền kiếm được</Box>
                            <Box textAlign="right">Số tiền đã tiêu</Box>
                            <Box textAlign="right">Số tiền tiết kiệm</Box>
                            <Box textAlign="right">Khoản chi tiêu lớn</Box>
                        </Box>
                        {financialData.map((data: any) => (
                            <Box
                                key={data.id}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '80px 1fr 1fr 1fr 1.5fr',
                                    p: 2,
                                    borderBottom: '1px dashed var(--palette-background-neutral)',
                                    '&:hover': { bgcolor: 'var(--palette-action-hover)' },
                                    alignItems: 'center'
                                }}
                            >
                                <Typography variant="body2">{data.age}</Typography>
                                <Typography variant="subtitle2" textAlign="right" sx={{ color: 'var(--palette-success-main)' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.earned)}
                                </Typography>
                                <Typography variant="subtitle2" textAlign="right" sx={{ color: 'var(--palette-error-main)' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.spent)}
                                </Typography>
                                <Typography variant="subtitle2" textAlign="right" sx={{ color: 'var(--palette-info-main)', fontWeight: 700 }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.saved)}
                                </Typography>
                                <Typography variant="body2" textAlign="right" sx={{ color: 'var(--palette-text-secondary)' }}>
                                    {data.majorExpense}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Card>
        </Container>
    );
};
