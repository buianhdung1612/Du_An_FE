import { useState, useEffect } from "react";
import { Box, Stack, Card, Typography, Grid, Button, CircularProgress } from "@mui/material";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { getVocabularyStatistics } from "../api/vocabulary.api";
import { Link } from "react-router-dom";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export const VocabularyStatisticsPage = () => {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getVocabularyStatistics();
                if (res.code === 200) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Error fetching vocab stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    const { total = 0, dueCount = 0, levelBreakdown = [], categoryBreakdown = [] } = stats || {};

    // Donut chart logic: calculate percentages
    const validLevels = levelBreakdown.filter((l: any) => l.count > 0);
    const totalLevelCount = validLevels.reduce((sum: number, l: any) => sum + l.count, 0);

    // Dynamic colors for level indicators
    const colors = [
        "#919EAB", // Level 0 (Grey)
        "#3366FF", // Level 1 (Blue)
        "#04297A", // Level 2 (Dark Blue)
        "#FFC107", // Level 3 (Orange)
        "#FF4842", // Level 4 (Red)
        "#00A76F"  // Level 5 (Green)
    ];

    // Donut segment calculations
    let accumulatedPercent = 0;
    const donutSegments = validLevels.map((l: any) => {
        const percent = totalLevelCount > 0 ? (l.count / totalLevelCount) * 100 : 0;
        const startPercent = accumulatedPercent;
        accumulatedPercent += percent;
        return {
            ...l,
            percent,
            startPercent,
            color: colors[l.level] || "#ccc"
        };
    });

    return (
        <Box sx={{ pb: 5 }}>
            {/* Header section */}
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                    <Title title={"Thống kê Học tập"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Kho từ vựng", to: `/${prefixAdmin}/vocabulary/list` },
                            { label: "Thống kê" }
                        ]}
                    />
                </div>
                <Button
                    component={Link}
                    to={`/${prefixAdmin}/vocabulary/study`}
                    sx={{
                        background: 'var(--palette-text-primary)',
                        minHeight: "2.5rem",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        textTransform: "none",
                        boxShadow: "none",
                        color: "white",
                        "&:hover": {
                            background: "var(--palette-grey-800)",
                            boxShadow: "var(--customShadows-z8)"
                        }
                    }}
                    variant="contained"
                    startIcon={<SchoolIcon />}
                >
                    Học từ vựng ngay
                </Button>
            </div>

            <Grid container spacing={3}>
                {/* Stats cards row */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                        p: 3, 
                        borderRadius: '20px', 
                        border: '1px solid var(--palette-divider)',
                        boxShadow: 'var(--customShadows-z1)',
                        background: 'linear-gradient(135deg, rgba(0, 167, 111, 0.04) 0%, rgba(0, 167, 111, 0.01) 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ 
                            position: 'absolute', right: -20, bottom: -20, opacity: 0.08, transform: 'scale(2)',
                            color: 'var(--palette-success-main, #00A76F)'
                        }}>
                            <SchoolIcon sx={{ fontSize: 100 }} />
                        </Box>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                                TỔNG TỪ VỰNG ĐÃ HỌC
                            </Typography>
                            <Typography variant="h2" color="var(--palette-success-main, #00A76F)" fontWeight={800}>
                                {total}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Số lượng từ đã thêm vào kho và đang tham gia chu trình SRS của bạn.
                            </Typography>
                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                        p: 3, 
                        borderRadius: '20px', 
                        border: '1px solid var(--palette-divider)',
                        boxShadow: 'var(--customShadows-z1)',
                        background: dueCount > 0 
                            ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.06) 0%, rgba(255, 193, 7, 0.02) 100%)'
                            : 'linear-gradient(135deg, rgba(145, 158, 171, 0.04) 0%, rgba(145, 158, 171, 0.01) 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ 
                            position: 'absolute', right: -20, bottom: -20, opacity: 0.08, transform: 'scale(2)',
                            color: dueCount > 0 ? '#FFC107' : '#919EAB'
                        }}>
                            <HourglassEmptyIcon sx={{ fontSize: 100 }} />
                        </Box>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                                TỪ VỰNG ĐẾN HẠN ÔN TẬP
                            </Typography>
                            <Typography variant="h2" color={dueCount > 0 ? '#FF9800' : 'text.primary'} fontWeight={800}>
                                {dueCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {dueCount > 0 
                                    ? `Bạn có ${dueCount} từ cần ôn tập hôm nay để duy trì trí nhớ dài hạn.` 
                                    : "Tuyệt vời! Không có từ nào cần ôn tập hôm nay."
                                }
                            </Typography>
                        </Stack>
                    </Card>
                </Grid>

                {/* Donut and Bar charts row */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 4, borderRadius: '24px', border: '1px solid var(--palette-divider)', height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 4 }}>
                            Cấp độ từ vựng (Hệ thống SRS)
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center" justifyContent="center">
                            {/* Animated SVG Donut Chart */}
                            <Box sx={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
                                {totalLevelCount === 0 ? (
                                    <Box sx={{ 
                                        width: '100%', height: '100%', borderRadius: '50%', border: '10px solid rgba(145, 158, 171, 0.08)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', fontSize: '0.875rem'
                                    }}>
                                        Trống
                                    </Box>
                                ) : (
                                    <svg width="100%" height="100%" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(145, 158, 171, 0.04)" strokeWidth="4" />
                                        {donutSegments.map((seg: any, idx: number) => {
                                            const dashArray = `${seg.percent} ${100 - seg.percent}`;
                                            const strokeDashoffset = 100 - seg.startPercent + 25; // 25 is rotation offset
                                            return (
                                                <circle 
                                                    key={idx}
                                                    cx="21" 
                                                    cy="21" 
                                                    r="15.915" 
                                                    fill="transparent" 
                                                    stroke={seg.color} 
                                                    strokeWidth="4.2" 
                                                    strokeDasharray={dashArray} 
                                                    strokeDashoffset={strokeDashoffset}
                                                    style={{ 
                                                        transition: 'stroke-width 0.2s ease',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                            );
                                        })}
                                    </svg>
                                )}
                                <Box sx={{ 
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h4" fontWeight={800}>{total}</Typography>
                                    <Typography variant="caption" color="text.secondary">Từ đã học</Typography>
                                </Box>
                            </Box>

                            {/* Legend labels */}
                            <Stack spacing={1.5} sx={{ width: '100%' }}>
                                {levelBreakdown.map((l: any) => {
                                    const percent = total > 0 ? Math.round((l.count / total) * 100) : 0;
                                    return (
                                        <Stack key={l.level} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: colors[l.level] }} />
                                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                                    {l.label}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                                    {l.count} từ
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled" sx={{ minWidth: 35, textAlign: 'right' }}>
                                                    {percent}%
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 4, borderRadius: '24px', border: '1px solid var(--palette-divider)', height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 4 }}>
                            Cơ cấu Phân loại Từ vựng
                        </Typography>

                        <Stack spacing={3}>
                            {categoryBreakdown.map((cat: any) => {
                                const percent = total > 0 ? Math.round((cat.count / total) * 100) : 0;
                                return (
                                    <Stack key={cat.category} spacing={1}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" fontWeight={700} color="text.primary">
                                                {cat.label}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600} color="text.secondary">
                                                {cat.count} từ ({percent}%)
                                            </Typography>
                                        </Stack>
                                        {/* Premium Animated Bar */}
                                        <Box sx={{ 
                                            width: '100%', 
                                            height: 10, 
                                            bgcolor: 'rgba(145, 158, 171, 0.08)', 
                                            borderRadius: '5px',
                                            overflow: 'hidden'
                                        }}>
                                            <Box sx={{ 
                                                width: `${percent}%`, 
                                                height: '100%', 
                                                borderRadius: '5px',
                                                background: 'linear-gradient(90deg, var(--palette-primary-main, #3366FF) 0%, #1890FF 100%)',
                                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }} />
                                        </Box>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </Card>
                </Grid>

                {/* AI Study Strategy / Level stats interpretation */}
                <Grid item xs={12}>
                    <Card sx={{ 
                        p: 3, 
                        borderRadius: '20px', 
                        border: '1px solid var(--palette-divider)',
                        background: 'linear-gradient(135deg, rgba(51, 102, 255, 0.03) 0%, rgba(51, 102, 255, 0.01) 100%)'
                    }}>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Box sx={{ 
                                p: 1.5, 
                                borderRadius: '12px', 
                                bgcolor: 'rgba(51, 102, 255, 0.08)',
                                color: 'var(--palette-primary-main, #3366FF)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <AutoAwesomeIcon />
                            </Box>
                            <Stack spacing={1}>
                                <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                                    Đánh giá & Chiến lược học tập từ AI
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                    {total === 0 ? (
                                        "Bạn chưa bắt đầu học từ nào. Hãy truy cập trang kho từ vựng, tạo thêm một số từ vựng mới hoặc dùng AI tạo hàng loạt để bắt đầu lộ trình học tập của mình nhé!"
                                    ) : dueCount > 0 ? (
                                        `Hệ thống ghi nhận bạn đang có ${dueCount} từ vựng đã đến lịch ôn tập SRS. Việc để dồn từ vựng quá hạn sẽ làm gián đoạn chu trình lặp lại ngắt quãng, giảm tỉ lệ ghi nhớ dài hạn từ 90% xuống dưới 60%. Hãy dành 10-15 phút ôn tập ngay hôm nay nhé!`
                                    ) : (
                                        "Tuyệt vời! Bạn đã hoàn thành tất cả các từ cần ôn hôm nay. Trí nhớ của bạn đang được duy trì ở trạng thái tối ưu nhất. Hãy tiếp tục học thêm từ mới hoặc đọc thêm các bài viết Anh Văn để tích lũy thêm vốn từ phong phú!"
                                    )}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
