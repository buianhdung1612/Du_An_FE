import { ReactNode } from "react";
import { useAuthStore } from "@core/stores/useAuthStore";
import { Navigate } from "react-router-dom";
import { prefixAdmin } from "../../constants/routes";

interface Props {
    permission?: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export const PermissionGuard = ({ permission, children, fallback }: Props) => {
    const user = useAuthStore((state) => state.user);
    const permissions = user?.permissions || [];

    // Nếu không yêu cầu permission cụ thể → cho qua
    if (!permission) return <>{children}</>;

    // Super admin (quyền "all") → cho qua tất cả
    if (permissions.includes("all")) return <>{children}</>;

    // Kiểm tra permission cụ thể
    if (permissions.includes(permission)) return <>{children}</>;

    // Không có quyền → hiển thị fallback hoặc redirect
    if (fallback) return <>{fallback}</>;
    return <Navigate to={`/${prefixAdmin}/dashboard`} replace />;
};
