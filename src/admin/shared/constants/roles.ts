export const PERMISSIONS_GROUPED = [
    {
        module: "Tổng quan",
        permissions: [
            { id: "dashboard_view", name: "Xem bảng điều khiển" },
        ]
    },
    {
        module: "Quản lý Bài viết",
        permissions: [
            { id: "blog_view", name: "Xem danh sách bài viết" },
            { id: "blog_create", name: "Tạo bài viết mới" },
            { id: "blog_edit", name: "Chỉnh sửa bài viết" },
            { id: "blog_delete", name: "Xóa bài viết" },
            { id: "blog_category_view", name: "Xem danh mục bài viết" },
            { id: "blog_category_create", name: "Tạo danh mục bài viết" },
            { id: "blog_category_edit", name: "Sửa danh mục bài viết" },
            { id: "blog_category_delete", name: "Xóa danh mục bài viết" },
        ]
    },
    {
        module: "Quản lý Sản phẩm",
        permissions: [
            { id: "product_view", name: "Xem danh sách sản phẩm" },
            { id: "product_create", name: "Tạo mới sản phẩm" },
            { id: "product_edit", name: "Chỉnh sửa sản phẩm" },
            { id: "product_delete", name: "Xóa sản phẩm" },
            { id: "product_category_view", name: "Xem danh mục sản phẩm" },
            { id: "product_category_create", name: "Tạo danh mục sản phẩm" },
            { id: "product_category_edit", name: "Sửa danh mục sản phẩm" },
            { id: "product_category_delete", name: "Xóa danh mục sản phẩm" },
            { id: "product_attribute_view", name: "Xem thuộc tính sản phẩm" },
            { id: "product_attribute_create", name: "Tạo thuộc tính sản phẩm" },
            { id: "product_attribute_edit", name: "Sửa thuộc tính sản phẩm" },
            { id: "product_attribute_delete", name: "Xóa thuộc tính sản phẩm" },
        ]
    },
    {
        module: "Quản lý Đơn hàng",
        permissions: [
            { id: "order_view", name: "Xem danh sách đơn hàng" },
            { id: "order_edit", name: "Cập nhật đơn hàng" },
            { id: "order_delete", name: "Xóa đơn hàng" },
        ]
    },
    {
        module: "Quản lý Khách hàng",
        permissions: [
            { id: "account_user_view", name: "Xem thông tin khách hàng" },
            { id: "account_user_create", name: "Tạo tài khoản khách hàng" },
            { id: "account_user_edit", name: "Sửa thông tin khách hàng" },
            { id: "account_user_delete", name: "Xóa khách hàng" },
            { id: "breed_view", name: "Quản lý giống thú cưng" },
            { id: "breed_create", name: "Tạo giống thú cưng" },
            { id: "breed_edit", name: "Sửa giống thú cưng" },
            { id: "breed_delete", name: "Xóa giống thú cưng" },
        ]
    },
    {
        module: "Nhóm quyền & Quản trị",
        permissions: [
            { id: "role_view", name: "Xem danh sách nhóm quyền" },
            { id: "role_create", name: "Tạo nhóm quyền mới" },
            { id: "role_edit", name: "Cập nhật phân quyền" },
            { id: "role_delete", name: "Xóa nhóm quyền" },
            { id: "role_permissions", name: "Truy cập Phân quyền nâng cao" },
            { id: "account_admin_view", name: "Xem tài khoản quản trị" },
            { id: "account_admin_create", name: "Tạo tài khoản quản trị" },
            { id: "account_admin_edit", name: "Sửa tài khoản quản trị" },
            { id: "account_admin_delete", name: "Xóa tài khoản quản trị" },
        ]
    },
    {
        module: "Hệ thống & Calendar",
        permissions: [
            { id: "calendar_view", name: "Xem giao diện Calendar" },
            { id: "settings_view", name: "Xem cài đặt hệ thống" },
            { id: "settings_edit", name: "Tùy chỉnh hệ thống" },
            { id: "file_manager", name: "Quản lý thư viện ảnh/file" },
        ]
    }
];

export const PERMISSIONS = PERMISSIONS_GROUPED.flatMap(group => group.permissions);

export const SKILLS = [
    { id: "grooming", name: "Cắt tỉa lông" },
    { id: "bathing", name: "Tắm & Vệ sinh" },
    { id: "spa", name: "Spa thư giãn" },
];
