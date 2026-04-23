import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Dữ liệu mẫu (hardcoded data) cho 1 tuần hoàn hảo
const MOCK_BOOKINGS = [
    {
        _id: '1',
        serviceId: { _id: 's1', name: 'Học lập trình' },
        userId: { fullName: 'Admin' },
        start: '2026-02-04T08:00:00',
        end: '2026-02-04T11:00:00',
        bookingStatus: 'confirmed',
        notes: 'Học ReactJS & TypeScript'
    },
    {
        _id: '2',
        serviceId: { _id: 's2', name: 'Tập Gym' },
        userId: { fullName: 'Admin' },
        start: '2026-02-04T17:00:00',
        end: '2026-02-04T18:30:00',
        bookingStatus: 'completed',
        notes: 'Chạy bộ & Push up'
    },
    {
        _id: '3',
        serviceId: { _id: 's3', name: 'Đọc sách' },
        userId: { fullName: 'Admin' },
        start: '2026-02-05T21:00:00',
        end: '2026-02-05T22:30:00',
        bookingStatus: 'pending',
        notes: 'Đọc sách "The 12 Week Year"'
    }
];

export const useBookings = (params?: any) => {
    return useQuery({
        queryKey: ['bookings', params],
        queryFn: async () => ({ data: { recordList: MOCK_BOOKINGS } }),
        select: (res: any) => res.data || [],
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => data,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};
