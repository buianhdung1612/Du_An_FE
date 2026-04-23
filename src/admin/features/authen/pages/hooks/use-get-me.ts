import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/auth.api";
import { useAuthStore } from "@core/stores/useAuthStore";

import { useEffect } from "react";

export const useGetMe = () => {
    const { login, logout, token } = useAuthStore();

    const query = useQuery({
        queryKey: ["admin-me"],
        queryFn: getMe,
        enabled: !!token,
        retry: false
    });

    useEffect(() => {
        if (query.data) {
            if (query.data.code === 200 && query.data.data) {
                const { token: newToken, ...userInfo } = query.data.data;
                // Chỉ gọi login nếu dữ liệu thực sự khác biệt để tránh vòng lặp re-render
                if (token !== newToken) {
                    login(userInfo, newToken || token || "");
                }
            } else if (query.data.code === 401) {
                if (token) logout();
            }
        }
    }, [query.data, login, logout, token]);

    useEffect(() => {
        if (query.isError) {
            if (token) logout();
        }
    }, [query.isError, logout, token]);

    return query;
};





