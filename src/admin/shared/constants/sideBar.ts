import { prefixAdmin } from "./routes";
import DataExplorationIcon from "@mui/icons-material/DataExploration";
import ExtensionIcon from "@mui/icons-material/Extension";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import TranslateIcon from "@mui/icons-material/Translate";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PaidIcon from '@mui/icons-material/Paid';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export const menuOverviewData = [
    {
        id: "system",
        Icon: SettingsIcon,
        label: "Hệ thống",
        path: `/${prefixAdmin}/dashboard/system`,
        permission: "dashboard_view"
    },
    {
        id: "analytics",
        Icon: DataExplorationIcon,
        label: "Phân tích",
        tKey: "admin.sidebar.analytics",
        path: `/${prefixAdmin}/dashboard/analytics`,
        permission: "dashboard_view"
    },
    {
        id: "calendar",
        Icon: CalendarMonthIcon,
        label: "Lịch tuần",
        path: `/${prefixAdmin}/calendar`,
        permission: "all"
    },
    {
        id: "productivity",
        Icon: ExtensionIcon,
        label: "Hiệu suất",
        path: `/${prefixAdmin}/productivity`,
        permission: "all"
    },
    {
        id: "daily-summary",
        Icon: NoteAltIcon,
        label: "Tổng kết ngày",
        path: `/${prefixAdmin}/daily-summary`,
        permission: "all"
    },
    // lifestyle removed
    {
        id: "finance",
        Icon: PaidIcon,
        label: "Quản lý tài chính",
        permission: "all",
        children: [
            { id: "dashboard", label: "Tổng quan", path: `/${prefixAdmin}/finance` },
            { id: "profile", label: "Hồ sơ tài chính", path: `/${prefixAdmin}/finance/profile` },
            { id: "budget", label: "Lập kế hoạch", path: `/${prefixAdmin}/finance/budget` },
            { id: "expenses", label: "Chi tiêu", path: `/${prefixAdmin}/finance/expenses` },
            { id: "savings", label: "Mục tiêu tiết kiệm", path: `/${prefixAdmin}/finance/savings` },
            { id: "reports", label: "Báo cáo chi tiết", path: `/${prefixAdmin}/finance/reports` },
        ]
    },
    {
        id: "workout",
        Icon: SelfImprovementIcon,
        label: "Tập luyện (Workout)",
        permission: "all",
        children: [
            { id: "logs", label: "Thống kê tập luyện", path: `/${prefixAdmin}/workout/logs` },
            { id: "exercises", label: "Thư viện bài tập", path: `/${prefixAdmin}/workout/exercises` },
            { id: "muscle-groups", label: "Quản lý nhóm cơ", path: `/${prefixAdmin}/workout/muscle-groups` },
        ]
    },
    {
        id: "nutrition",
        Icon: RestaurantIcon,
        label: "Dinh dưỡng",
        path: `/${prefixAdmin}/nutrition`,
        permission: "all"
    },
];


export const menuManagementData = [
    {
        id: "products",
        label: "Sản phẩm",
        tKey: "admin.sidebar.products",
        Icon: ExtensionIcon,
        permission: "product_view",
        children: [
            { id: "list", label: "Danh sách", tKey: "admin.sidebar.list", path: `/${prefixAdmin}/product/list`, permission: "product_view" },
            { id: "category", label: "Danh mục", tKey: "admin.sidebar.category", path: `/${prefixAdmin}/product-category/list`, permission: "product_category_view" },
            { id: "expired", label: "Sản phẩm hết hạn", path: `/${prefixAdmin}/product/expired`, permission: "product_view" },
        ]
    },
    {
        id: "documentation",
        label: "Tài liệu (Docs)",
        tKey: "admin.sidebar.docs",
        Icon: AutoStoriesIcon,
        permission: "all",
        children: [
            { id: "list", label: "Danh sách bài viết", path: `/${prefixAdmin}/docs/article/list` },
            { id: "category", label: "Danh mục tài liệu", path: `/${prefixAdmin}/docs/category/list` },
        ]
    },
    // 🇬🇧 MODULE ANH VĂN
    {
        id: "english-module",
        label: "Anh Văn",
        Icon: TranslateIcon,
        permission: "all",
        children: [
            { id: "vocab-list", label: "Học từ vựng", path: `/${prefixAdmin}/vocabulary/list` },
            { id: "phrasal-verb", label: "Phrasal Verb (Mindmap)", path: `/${prefixAdmin}/vocabulary/phrasal-verb` },
            { id: "vocab-topic", label: "Chủ đề từ vựng", path: `/${prefixAdmin}/vocabulary/topic` },
            { id: "vocab-statistics", label: "Thống kê học tập", path: `/${prefixAdmin}/vocabulary/statistics` },
            { id: "writing-skills", label: "Writing skills", path: `/${prefixAdmin}/vocabulary/writing-skills` },
            { id: "english-blogs", label: "Bài viết Anh Văn", path: `/${prefixAdmin}/english/blog/list` },
            { id: "english-blog-categories", label: "Danh mục bài viết", path: `/${prefixAdmin}/english/blog-category/list` },
            { id: "english-mindmaps", label: "Sơ đồ Anh Văn", path: `/${prefixAdmin}/english/mind-maps` },
        ]
    },
    // 💻 MODULE LẬP TRÌNH
    {
        id: "programming-module",
        label: "Lập Trình",
        Icon: ExtensionIcon,
        permission: "all",
        children: [
            { id: "prog-blogs", label: "Bài viết Lập Trình", path: `/${prefixAdmin}/programming/blog/list` },
            { id: "prog-blog-categories", label: "Danh mục bài viết", path: `/${prefixAdmin}/programming/blog-category/list` },
            { id: "prog-mindmaps", label: "Sơ đồ Lập Trình", path: `/${prefixAdmin}/programming/mind-maps` },
        ]
    },

    /*
    {
        id: "roles",
        label: "Nhóm quyền",
        tKey: "admin.sidebar.roles",
        Icon: SecurityIcon,
        permission: "role_view",
        children: [
            { id: "list", label: "Danh sách", tKey: "admin.sidebar.role_list", path: `/${prefixAdmin}/role/list`, permission: "role_view" },
            { id: "create", label: "Tạo mới", tKey: "admin.sidebar.role_create", path: `/${prefixAdmin}/role/create`, permission: "role_create" },
        ]
    },
    {
        id: "accounts",
        label: "Tài khoản quản trị",
        tKey: "admin.sidebar.accounts",
        Icon: PeopleIcon,
        permission: "account_admin_view",
        hideIfStaff: true,
        children: [
            { id: "list", label: "Danh sách", tKey: "admin.sidebar.account_list", path: `/${prefixAdmin}/account-admin/list`, permission: "account_admin_view" },
            { id: "create", label: "Tạo mới", tKey: "admin.sidebar.account_create", path: `/${prefixAdmin}/account-admin/create`, permission: "account_admin_create" },
        ]
    },
    {
        id: "users",
        label: "Khách hàng",
        tKey: "admin.sidebar.users",
        Icon: PeopleIcon,
        permission: "account_user_view",
        hideIfStaff: true,
        children: [
            { id: "list", label: "Danh sách", tKey: "admin.sidebar.user_list", path: `/${prefixAdmin}/account-user/list`, permission: "account_user_view" },
            { id: "create", label: "Tạo mới", tKey: "admin.sidebar.user_create", path: `/${prefixAdmin}/account-user/create`, permission: "account_user_create" },
        ]
    },
    */
    {
        id: "settings",
        label: "Cài đặt",
        tKey: "admin.sidebar.settings",
        Icon: SettingsIcon,
        path: `/${prefixAdmin}/dashboard/settings`,
        permission: "settings_view",
        children: [
            { id: "settings-general", label: "Cài đặt chung", path: `/${prefixAdmin}/dashboard/settings/general` },
            { id: "settings-shipping", label: "Vận chuyển", path: `/${prefixAdmin}/dashboard/settings/shipping` },
            { id: "settings-payment", label: "Thanh toán", path: `/${prefixAdmin}/dashboard/settings/payment` },
            { id: "settings-social", label: "Mạng xã hội", path: `/${prefixAdmin}/dashboard/settings/social` },
            { id: "settings-app-password", label: "Mật khẩu ứng dụng", path: `/${prefixAdmin}/dashboard/settings/app-password` },

        ]
    },
    {
        id: "books",
        label: "Thư viện Sách",
        Icon: AutoStoriesIcon,
        permission: "all",
        children: [
            { id: "list", label: "Danh sách", path: `/${prefixAdmin}/books` },
            { id: "category", label: "Danh mục", path: `/${prefixAdmin}/books/categories` },
        ]
    },
    {
        id: "notes",
        label: "Ghi chú",
        Icon: NoteAltIcon,
        path: `/${prefixAdmin}/notes`,
        permission: "all"
    }
];
