export const mockEcommerceStats = {
    summary: {
        totalRevenue: 154780000,
        totalOrders: 145,
        totalBookings: 85,
        totalProducts: 45,
        totalUsers: 1240,
        monthlyRevenue: 45000000,
        revenueMonthPercent: 12.5,
        shopRevenue: 28000000,
        serviceRevenue: 17000000,
        allTimeRevenue: {
            total: 154780000,
            shop: 95000000,
            service: 59780000,
        },
        recentRevenueSources: [
            { id: 1, type: 'Cửa hàng', amount: 1250000, date: new Date().toISOString() },
            { id: 2, type: 'Dịch vụ', amount: 850000, date: new Date().toISOString() },
            { id: 3, type: 'Cửa hàng', amount: 450000, date: new Date().toISOString() },
            { id: 4, type: 'Dịch vụ', amount: 1200000, date: new Date().toISOString() }
        ]
    },
    yearlyRevenueChart: [20, 35, 45, 30, 55, 65, 50, 75, 80, 70, 90, 110].map(v => v * 1000000),
    topCategories: [
        { label: 'Thức ăn', total: 45000000 },
        { label: 'Phụ kiện', total: 25000000 },
        { label: 'Dịch vụ', total: 15000000 }
    ],
    topCustomers: [
        { _id: '1', fullName: 'Nguyễn Văn A', avatar: '', totalOrders: 12, totalSpent: 15400000 },
        { _id: '2', fullName: 'Trần Thị B', avatar: '', totalOrders: 10, totalSpent: 12800000 },
        { _id: '3', fullName: 'Lê Văn C', avatar: '', totalOrders: 8, totalSpent: 9600000 },
        { _id: '4', fullName: 'Phạm Minh D', avatar: '', totalOrders: 7, totalSpent: 7500000 },
        { _id: '5', fullName: 'Hoàng Anh E', avatar: '', totalOrders: 5, totalSpent: 5200000 }
    ]
};

export const mockAnalyticsStats = {
    weeklySales: {
        total: 1250000,
        percent: 8.5,
        data: [1000, 1200, 900, 1500, 1100, 1300, 1250],
        allTime: {
            total: 154780000
        },
        recentRevenueSources: [
            { id: 1, type: 'Cửa hàng', amount: 125000, date: new Date().toISOString() },
            { id: 2, type: 'Dịch vụ', amount: 85000, date: new Date().toISOString() }
        ]
    },
    newUsers: {
        total: 48,
        percent: 15.2,
        data: [5, 8, 4, 12, 6, 10, 3]
    },
    purchaseOrders: {
        total: 156,
        percent: -2.4,
        data: [15, 22, 18, 25, 20, 28, 28]
    },
    pets: {
        total: 842,
        percent: 5.8,
        data: [120, 135, 142, 156, 178, 190, 21]
    },
    orderDistribution: [
        { label: 'Hoàn thành', value: 45 },
        { label: 'Đang xử lý', value: 3.2 },
        { label: 'Chờ xác nhận', value: 2.1 },
        { label: 'Đã hủy', value: 1.5 }
    ],
    websiteVisits: [1200, 1500, 1800, 2400, 2100, 2800, 3200, 3500, 3800, 4200, 4500, 4800]
};

export const mockSystemStats = {
    systemStats: {
        users: { total: 1240, percent: 12.5, trend: [10, 25, 15, 45, 35, 55, 40] },
        admins: { total: 12, percent: 0, trend: [12, 12, 12, 12, 12, 12, 12] },
        pets: { total: 842, percent: 5.8, trend: [120, 135, 142, 156, 178, 190, 21] }
    },
    petDistribution: [
        { label: 'Chó', count: 450 },
        { label: 'Mèo', count: 320 },
        { label: 'Chim', count: 45 },
        { label: 'Khác', count: 27 }
    ],
    serviceUsage: [
        { name: 'Tắm rửa', count: 156 },
        { name: 'Cắt tỉa', count: 84 },
        { name: 'Lưu trú', count: 42 }
    ],
    newProducts: [
        { _id: '1', name: 'Hạt Royal Canin 1kg', priceNew: 250000, status: 'active' },
        { _id: '2', name: 'Đồ chơi xương gặm', priceNew: 45000, status: 'active' },
        { _id: '3', name: 'Sữa tắm SOS', priceNew: 120000, status: 'active' }
    ],
    topSellingProducts: [
        { _id: '1', name: 'Hạt Royal Canin 1kg', image: '', totalQuantity: 156, totalRevenue: 39000000 },
        { _id: '2', name: 'Paté Whiskas', image: '', totalQuantity: 320, totalRevenue: 12800000 },
        { _id: '3', name: 'Cát vệ sinh Nhật Bản', image: '', totalQuantity: 85, totalRevenue: 8500000 }
    ],
    topCustomers: [
        { _id: '1', fullName: 'Nguyễn Văn A', avatar: '', totalSpent: 15400000 },
        { _id: '2', fullName: 'Trần Thị B', avatar: '', totalSpent: 12800000 },
        { _id: '3', fullName: 'Lê Văn C', avatar: '', totalSpent: 9600000 }
    ],
    cpu: 18,
    memory: 32,
    storage: 55,
    status: 'online',
    uptime: '25d 14h 23m'
};

