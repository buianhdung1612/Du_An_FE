import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@core/stores/useAuthStore";
import { prefixAdmin } from "../../constants/routes";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export const AuthGuard = ({ children }: Props) => {
    const { token } = useAuthStore();
    const location = useLocation();

    if (!token) {
        return <Navigate to={`/${prefixAdmin}/auth/login`} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
