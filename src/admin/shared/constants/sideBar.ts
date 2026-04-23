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
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

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
        id: "blogs",
        label: "Bài viết",
        tKey: "admin.sidebar.blogs",
        Icon: ArticleIcon,
        permission: "blog_view",
        children: [
            { id: "list", label: "Danh sách bài viết", tKey: "admin.sidebar.blog_list", path: `/${prefixAdmin}/blog/list`, permission: "blog_view" },
            { id: "category", label: "Danh mục bài viết", tKey: "admin.sidebar.blog_category", path: `/${prefixAdmin}/blog-category/list`, permission: "blog_category_view" },
        ]
    },

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
        id: "vocabulary",
        label: "Từ vựng",
        Icon: TranslateIcon,
        permission: "all",
        children: [
            { id: "vocab-list", label: "Kho từ vựng", path: `/${prefixAdmin}/vocabulary/list` },
            { id: "vocab-topic", label: "Chủ đề từ vựng", path: `/${prefixAdmin}/vocabulary/topic` },
        ]
    },
    {
        id: "mind-maps",
        label: "Sơ đồ tư duy",
        Icon: AccountTreeIcon,
        permission: "all",
        children: [
            { id: "list", label: "Danh sách", path: `/${prefixAdmin}/mind-maps` },
            { id: "category", label: "Danh mục", path: `/${prefixAdmin}/mind-maps/categories` },
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
