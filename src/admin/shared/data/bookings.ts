export const mockBookings = [
    {
        _id: "BK1",
        code: "BK000001",
        userId: {
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@gmail.com",
            phone: "0123456789",
            avatar: "https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-1.webp"
        },
        serviceId: { name: "Spa & Grooming" },
        start: new Date().toISOString(),
        total: 500000,
        bookingStatus: "pending",
        petIds: ["P1"],
        petStaffMap: [
            {
                petId: { _id: "P1", name: "Lu", type: "dog", breed: "Poodle", weight: 5, avatar: "" },
                staffId: { _id: "S1", fullName: "Nhân viên B" },
                status: "pending"
            }
        ]
    },
    {
        _id: "BK2",
        code: "BK000002",
        userId: {
            fullName: "Trần Thị C",
            email: "trantic@gmail.com",
            phone: "0987654321",
            avatar: "https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/images/mock/avatar/avatar-2.webp"
        },
        serviceId: { name: "Thú y" },
        start: new Date().toISOString(),
        total: 1200000,
        bookingStatus: "in-progress",
        petIds: ["P2"],
        petStaffMap: [
            {
                petId: { _id: "P2", name: "Mimi", type: "cat", breed: "Mèo Anh lông ngắn", weight: 3, avatar: "" },
                staffId: { _id: "admin", fullName: "Admin User" },
                status: "in-progress"
            }
        ]
    }
];

