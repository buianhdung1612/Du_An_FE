import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { PermissionGuard } from "../components/auth/PermissionGuard";

// Lazy-loaded components
const ProductListPage = lazy(() => import("../../features/product/pages/ProductListPage").then(m => ({ default: m.ProductListPage })));
const ProductCreatePage = lazy(() => import("../../features/product/pages/ProductCreatePage").then(m => ({ default: m.ProductCreatePage })));
const ProductEditPage = lazy(() => import("../../features/product/pages/ProductEditPage").then(m => ({ default: m.ProductEditPage })));
const ExpiredProductListPage = lazy(() => import("../../features/product/pages/ExpiredProductListPage").then(m => ({ default: m.ExpiredProductListPage })));

const ProductCategoryListPage = lazy(() => import("../../features/product-category/pages/ProductCategoryListPage").then(m => ({ default: m.ProductCategoryListPage })));
const ProductCategoryCreatePage = lazy(() => import("../../features/product-category/pages/ProductCategoryCreatePage").then(m => ({ default: m.ProductCategoryCreatePage })));
const ProductCategoryEditPage = lazy(() => import("../../features/product-category/pages/ProductCategoryEditPage").then(m => ({ default: m.ProductCategoryEditPage })));


const BlogListPage = lazy(() => import("../../features/blog/pages/BlogListPage").then(m => ({ default: m.BlogListPage })));
const BlogCategoryListPage = lazy(() => import("../../features/blog-category/pages/BlogCategoryListPage").then(m => ({ default: m.BlogCategoryListPage })));
const BlogCategoryCreatePage = lazy(() => import("../../features/blog-category/pages/BlogCategoryCreatePage").then(m => ({ default: m.BlogCategoryCreatePage })));
const BlogCreatePage = lazy(() => import("../../features/blog/pages/BlogCreatePage").then(m => ({ default: m.BlogCreatePage })));
const BlogDetailPage = lazy(() => import("../../features/blog/pages/BlogDetailPage").then(m => ({ default: m.BlogDetailPage })));
const BlogEditPage = lazy(() => import("../../features/blog/pages/BlogEditPage").then(m => ({ default: m.BlogEditPage })));

const LoginPage = lazy(() => import("../../features/authen/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("../../features/dashboard/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const SystemPage = lazy(() => import("../../features/dashboard/pages/SystemPage").then(m => ({ default: m.SystemPage })));
const EcommercePage = lazy(() => import("../../features/dashboard/pages/EcommercePage")); // Default export
const AnalyticsPage = lazy(() => import("../../features/dashboard/pages/AnalyticsPage")); // Default export
const BlogCategoryEditPage = lazy(() => import("../../features/blog-category/pages/BlogCategoryEditPage").then(m => ({ default: m.BlogCategoryEditPage })));





const RoleListPage = lazy(() => import("../../features/role/pages/RoleListPage").then(m => ({ default: m.RoleListPage })));
const RoleCreatePage = lazy(() => import("../../features/role/pages/RoleCreatePage").then(m => ({ default: m.RoleCreatePage })));
const RoleEditPage = lazy(() => import("../../features/role/pages/RoleEditPage").then(m => ({ default: m.RoleEditPage })));

const AccountAdminListPage = lazy(() => import("../../features/account-admin/pages/AccountAdminListPage").then(m => ({ default: m.AccountAdminListPage })));
const AccountAdminCreatePage = lazy(() => import("../../features/account-admin/pages/AccountAdminCreatePage").then(m => ({ default: m.AccountAdminCreatePage })));
const AccountAdminEditPage = lazy(() => import("../../features/account-admin/pages/AccountAdminEditPage").then(m => ({ default: m.AccountAdminEditPage })));
const AccountAdminDetailPage = lazy(() => import("../../features/account-admin/pages/AccountAdminDetailPage").then(m => ({ default: m.AccountAdminDetailPage })));
const ProfilePage = lazy(() => import("../../features/account-admin/pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const ChangePasswordAdminPage = lazy(() => import("../../features/account-admin/pages/ChangePasswordPage").then(m => ({ default: m.ChangePasswordPage })));

const AccountUserListPage = lazy(() => import("../../features/account-user/pages/AccountUserListPage").then(m => ({ default: m.AccountUserListPage })));
const AccountUserCreatePage = lazy(() => import("../../features/account-user/pages/AccountUserCreatePage").then(m => ({ default: m.AccountUserCreatePage })));
const AccountUserEditPage = lazy(() => import("../../features/account-user/pages/AccountUserEditPage").then(m => ({ default: m.AccountUserEditPage })));
const AccountUserDetailPage = lazy(() => import("../../features/account-user/pages/AccountUserDetailPage").then(m => ({ default: m.AccountUserDetailPage })));
const ChangePasswordUserPage = lazy(() => import("../../features/account-user/pages/ChangePasswordPage").then(m => ({ default: m.ChangePasswordPage })));


const CalendarPage = lazy(() => import("../../features/calendar/pages/CalendarPage").then(m => ({ default: m.CalendarPage })));
const SettingsPage = lazy(() => import("../../features/settings/pages/SettingsPage").then(m => ({ default: m.SettingsPage })));
const BreedListPage = lazy(() => import("../../features/settings/pages/BreedListPage").then(m => ({ default: m.BreedListPage })));

const GeneralStatisticsPage = lazy(() => import("../../features/dashboard/pages/statistics/GeneralStatisticsPage").then(m => ({ default: m.GeneralStatisticsPage })));
const OrderStatisticsPage = lazy(() => import("../../features/dashboard/pages/statistics/OrderStatisticsPage").then(m => ({ default: m.OrderStatisticsPage })));
const ServiceStatisticsPage = lazy(() => import("../../features/dashboard/pages/statistics/ServiceStatisticsPage").then(m => ({ default: m.ServiceStatisticsPage })));
const StaffStatisticsPage = lazy(() => import("../../features/dashboard/pages/statistics/StaffStatisticsPage").then(m => ({ default: m.StaffStatisticsPage })));


const OrderListPage = lazy(() => import("../../features/order/pages/OrderListPage").then(m => ({ default: m.OrderListPage })));
const OrderDetailPage = lazy(() => import("../../features/order/pages/OrderDetailPage").then(m => ({ default: m.OrderDetailPage })));


const NotificationListPage = lazy(() => import("../../features/notification/pages/NotificationListPage").then(m => ({ default: m.NotificationListPage })));
const VocabularyListPage = lazy(() => import("../../features/vocabulary/pages/VocabularyListPage").then(m => ({ default: m.VocabularyListPage })));
const VocabularyStudyPage = lazy(() => import("../../features/vocabulary/pages/VocabularyStudyPage").then(m => ({ default: m.VocabularyStudyPage })));
const VocabularyTopicListPage = lazy(() => import("../../features/vocabulary/pages/VocabularyTopicListPage").then(m => ({ default: m.VocabularyTopicListPage })));
const PhrasalVerbMindmapPage = lazy(() => import("../../features/vocabulary/pages/PhrasalVerbMindmapPage").then(m => ({ default: m.PhrasalVerbMindmapPage })));
const PhrasalVerbListPage = lazy(() => import("../../features/vocabulary/pages/PhrasalVerbListPage").then(m => ({ default: m.PhrasalVerbListPage })));
const VocabularyStatisticsPage = lazy(() => import("../../features/vocabulary/pages/VocabularyStatisticsPage").then(m => ({ default: m.VocabularyStatisticsPage })));
const WritingSkillsPage = lazy(() => import("../../features/writing/pages/WritingSkillsPage").then(m => ({ default: m.WritingSkillsPage })));
const ProductivityPage = lazy(() => import("../../features/productivity/pages/ProductivityPage").then(m => ({ default: m.ProductivityPage })));
const ProductivityCreatePage = lazy(() => import("../../features/productivity/pages/ProductivityCreatePage").then(m => ({ default: m.ProductivityCreatePage })));
const ProductivityEditPage = lazy(() => import("../../features/productivity/pages/ProductivityEditPage").then(m => ({ default: m.ProductivityEditPage })));

const MindMapListPage = lazy(() => import("../../features/mind-map/pages/MindMapListPage").then(m => ({ default: m.MindMapListPage })));
const MindMapEditorPage = lazy(() => import("../../features/mind-map/pages/MindMapEditorPage").then(m => ({ default: m.MindMapEditorPage })));
const MindMapCategoryPage = lazy(() => import("../../features/mind-map/pages/MindMapCategoryPage").then(m => ({ default: m.MindMapCategoryPage })));

const DailySummaryPage = lazy(() => import("../../features/daily-summary/pages/DailySummaryPage").then(m => ({ default: m.DailySummaryPage })));

const BookListPage = lazy(() => import("../../features/book/pages/BookListPage").then(m => ({ default: m.BookListPage })));
const BookDetailPage = lazy(() => import("../../features/book/pages/BookDetailPage").then(m => ({ default: m.BookDetailPage })));
const BookFormPage = lazy(() => import("../../features/book/pages/BookFormPage").then(m => ({ default: m.BookFormPage })));
const BookCategoryPage = lazy(() => import("../../features/book/pages/BookCategoryPage").then(m => ({ default: m.BookCategoryPage })));
const NoteListPage = lazy(() => import("../../features/note/pages/NoteListPage").then(m => ({ default: m.NoteListPage })));
const NoteEditorPage = lazy(() => import("../../features/note/pages/NoteEditorPage").then(m => ({ default: m.NoteEditorPage })));
const LifestylePage = lazy(() => import("../../features/lifestyle/pages/LifestylePage").then(m => ({ default: m.LifestylePage })));
const FinanceDashboard = lazy(() => import("../../features/finance/pages/FinanceDashboard").then(m => ({ default: m.FinanceDashboard })));
const BudgetPlanningPage = lazy(() => import("../../features/finance/pages/BudgetPlanningPage").then(m => ({ default: m.BudgetPlanningPage })));



const ExpensesPage = lazy(() => import("../../features/finance/pages/ExpensesPage").then(m => ({ default: m.ExpensesPage })));
const SavingGoalsPage = lazy(() => import("../../features/finance/pages/SavingGoalsPage").then(m => ({ default: m.SavingGoalsPage })));
const FinancialReportsPage = lazy(() => import("../../features/finance/pages/FinancialReportsPage").then(m => ({ default: m.FinancialReportsPage })));
const FinancialProfilePage = lazy(() => import("../../features/finance/pages/FinancialProfilePage").then(m => ({ default: m.FinancialProfilePage })));
const NutritionPlannerPage = lazy(() => import("../../features/nutrition/pages/NutritionPlannerPage").then(m => ({ default: m.NutritionPlannerPage })));

const DocCategoryPage = lazy(() => import("../../features/documentation/pages/DocCategoryPage").then(m => ({ default: m.DocCategoryPage })));
const DocArticleListPage = lazy(() => import("../../features/documentation/pages/DocArticleListPage").then(m => ({ default: m.DocArticleListPage })));
const DocArticleFormPage = lazy(() => import("../../features/documentation/pages/DocArticleFormPage").then(m => ({ default: m.DocArticleFormPage })));

const MuscleGroupPage = lazy(() => import("../../features/workout/pages/MuscleGroupPage").then(m => ({ default: m.MuscleGroupPage })));
const ExercisePage = lazy(() => import("../../features/workout/pages/ExercisePage").then(m => ({ default: m.ExercisePage })));
const WorkoutLogPage = lazy(() => import("../../features/workout/pages/WorkoutLogPage").then(m => ({ default: m.WorkoutLogPage })));

export const AdminRoutes = [
    { index: true, element: <Navigate to="/admin/dashboard" replace /> },
    { path: "dashboard", element: <PermissionGuard permission="dashboard_view"><DashboardPage /></PermissionGuard> },

    { path: "notifications", element: <NotificationListPage /> },
    { path: "dashboard/system", element: <PermissionGuard permission="dashboard_view"><SystemPage /></PermissionGuard> },
    { path: "dashboard/ecommerce", element: <PermissionGuard permission="dashboard_view"><EcommercePage /></PermissionGuard> },
    { path: "dashboard/analytics", element: <PermissionGuard permission="dashboard_view"><AnalyticsPage /></PermissionGuard> },
    { path: "dashboard/statistics/general", element: <PermissionGuard permission="dashboard_view"><GeneralStatisticsPage /></PermissionGuard> },
    { path: "dashboard/statistics/orders", element: <PermissionGuard permission="dashboard_view"><OrderStatisticsPage /></PermissionGuard> },
    { path: "dashboard/statistics/services", element: <PermissionGuard permission="dashboard_view"><ServiceStatisticsPage /></PermissionGuard> },
    { path: "dashboard/statistics/staff", element: <PermissionGuard permission="dashboard_view"><StaffStatisticsPage /></PermissionGuard> },
    { path: "product/list", element: <PermissionGuard permission="product_view"><ProductListPage /></PermissionGuard> },
    { path: "product/create", element: <PermissionGuard permission="product_create"><ProductCreatePage /></PermissionGuard> },
    { path: "product/edit/:id", element: <PermissionGuard permission="product_edit"><ProductEditPage /></PermissionGuard> },
    { path: "product/expired", element: <PermissionGuard permission="product_view"><ExpiredProductListPage /></PermissionGuard> },
    { path: "product-category/list", element: <PermissionGuard permission="product_category_view"><ProductCategoryListPage /></PermissionGuard> },
    { path: "product-category/create", element: <PermissionGuard permission="product_category_create"><ProductCategoryCreatePage /></PermissionGuard> },
    { path: "product-category/edit/:id", element: <PermissionGuard permission="product_category_edit"><ProductCategoryEditPage /></PermissionGuard> },
    { path: "product-category/detail/:id", element: <PermissionGuard permission="product_category_view"><ProductCategoryEditPage /></PermissionGuard> },


    { path: "blog/list", element: <PermissionGuard permission="blog_view"><BlogListPage /></PermissionGuard> },
    { path: "blog/create", element: <PermissionGuard permission="blog_create"><BlogCreatePage /></PermissionGuard> },
    { path: "blog/edit/:id", element: <PermissionGuard permission="blog_edit"><BlogEditPage /></PermissionGuard> },
    { path: "blog/detail/:id", element: <PermissionGuard permission="blog_view"><BlogDetailPage /></PermissionGuard> },
    { path: "blog-category/list", element: <PermissionGuard permission="blog_category_view"><BlogCategoryListPage /></PermissionGuard> },
    { path: "blog-category/create", element: <PermissionGuard permission="blog_category_create"><BlogCategoryCreatePage /></PermissionGuard> },
    { path: "blog-category/edit/:id", element: <PermissionGuard permission="blog_category_edit"><BlogCategoryEditPage /></PermissionGuard> },
    { path: "blog-category/detail/:id", element: <PermissionGuard permission="blog_category_view"><BlogCategoryEditPage /></PermissionGuard> },

    // Module-based Routes (English / Programming)
    { path: ":module/blog/list", element: <PermissionGuard permission="blog_view"><BlogListPage /></PermissionGuard> },
    { path: ":module/blog/create", element: <PermissionGuard permission="blog_create"><BlogCreatePage /></PermissionGuard> },
    { path: ":module/blog/edit/:id", element: <PermissionGuard permission="blog_edit"><BlogEditPage /></PermissionGuard> },
    { path: ":module/blog/detail/:id", element: <PermissionGuard permission="blog_view"><BlogDetailPage /></PermissionGuard> },
    { path: ":module/blog-category/list", element: <PermissionGuard permission="blog_category_view"><BlogCategoryListPage /></PermissionGuard> },
    { path: ":module/blog-category/create", element: <PermissionGuard permission="blog_category_create"><BlogCategoryCreatePage /></PermissionGuard> },
    { path: ":module/blog-category/edit/:id", element: <PermissionGuard permission="blog_category_edit"><BlogCategoryEditPage /></PermissionGuard> },
    { path: ":module/blog-category/detail/:id", element: <PermissionGuard permission="blog_category_view"><BlogCategoryEditPage /></PermissionGuard> },
    { path: ":module/mind-maps", element: <MindMapListPage /> },
    { path: ":module/mind-maps/create", element: <MindMapEditorPage /> },
    { path: ":module/mind-maps/edit/:id", element: <MindMapEditorPage /> },
    { path: ":module/mind-maps/categories", element: <MindMapCategoryPage /> },


    { path: "role/list", element: <PermissionGuard permission="role_view"><RoleListPage /></PermissionGuard> },
    { path: "role/create", element: <PermissionGuard permission="role_create"><RoleCreatePage /></PermissionGuard> },
    { path: "role/edit/:id", element: <PermissionGuard permission="role_edit"><RoleEditPage /></PermissionGuard> },
    { path: "account-admin/list", element: <PermissionGuard permission="account_admin_view"><AccountAdminListPage /></PermissionGuard> },
    { path: "account-admin/create", element: <PermissionGuard permission="account_admin_create"><AccountAdminCreatePage /></PermissionGuard> },
    { path: "account-admin/edit/:id", element: <PermissionGuard permission="account_admin_edit"><AccountAdminEditPage /></PermissionGuard> },
    { path: "account-admin/detail/:id", element: <PermissionGuard permission="account_admin_view"><AccountAdminDetailPage /></PermissionGuard> },
    { path: "profile", element: <ProfilePage /> },
    { path: "account-admin/change-password/:id", element: <PermissionGuard permission="account_admin_edit"><ChangePasswordAdminPage /></PermissionGuard> },
    { path: "account-user/list", element: <PermissionGuard permission="account_user_view"><AccountUserListPage /></PermissionGuard> },
    { path: "account-user/create", element: <PermissionGuard permission="account_user_create"><AccountUserCreatePage /></PermissionGuard> },
    { path: "account-user/edit/:id", element: <PermissionGuard permission="account_user_edit"><AccountUserEditPage /></PermissionGuard> },
    { path: "account-user/detail/:id", element: <PermissionGuard permission="account_user_view"><AccountUserDetailPage /></PermissionGuard> },
    { path: "account-user/change-password/:id", element: <PermissionGuard permission="account_user_edit"><ChangePasswordUserPage /></PermissionGuard> },

    { path: "order/list", element: <PermissionGuard permission="product_view"><OrderListPage /></PermissionGuard> },
    { path: "order/detail/:id", element: <PermissionGuard permission="product_view"><OrderDetailPage /></PermissionGuard> },
    { path: "calendar", element: <CalendarPage /> },
    { path: "dashboard/settings/*", element: <PermissionGuard permission="settings_view"><SettingsPage /></PermissionGuard> },
    { path: "settings/breed/list", element: <PermissionGuard permission="breed_view"><BreedListPage /></PermissionGuard> },
    { path: "vocabulary/list", element: <VocabularyListPage /> },
    { path: "vocabulary/phrasal-verb", element: <PhrasalVerbListPage /> },
    { path: "vocabulary/study", element: <VocabularyStudyPage /> },
    { path: "vocabulary/mindmap", element: <PhrasalVerbMindmapPage /> },
    { path: "vocabulary/topic", element: <VocabularyTopicListPage /> },
    { path: "vocabulary/statistics", element: <VocabularyStatisticsPage /> },
    { path: "vocabulary/writing-skills", element: <WritingSkillsPage /> },
    { path: "productivity", element: <ProductivityPage /> },
    { path: "productivity/create", element: <ProductivityCreatePage /> },
    { path: "productivity/edit", element: <ProductivityEditPage /> },
    { path: "mind-maps", element: <MindMapListPage /> },
    { path: "mind-maps/create", element: <MindMapEditorPage /> },
    { path: "mind-maps/edit/:id", element: <MindMapEditorPage /> },
    { path: "mind-maps/categories", element: <MindMapCategoryPage /> },

    { path: "books", element: <BookListPage /> },
    { path: "books/create", element: <BookFormPage /> },
    { path: "books/edit/:id", element: <BookFormPage /> },
    { path: "books/detail/:id", element: <BookDetailPage /> },
    { path: "books/categories", element: <BookCategoryPage /> },

    { path: "daily-summary", element: <DailySummaryPage /> },
    { path: "notes", element: <NoteListPage /> },
    { path: "notes/create", element: <NoteEditorPage /> },
    { path: "notes/edit/:id", element: <NoteEditorPage /> },
    { path: "lifestyle", element: <LifestylePage /> },
    { path: "finance", element: <FinanceDashboard /> },
    { path: "finance/profile", element: <FinancialProfilePage /> },
    { path: "finance/budget", element: <BudgetPlanningPage /> },
    { path: "finance/expenses", element: <ExpensesPage /> },
    { path: "finance/savings", element: <SavingGoalsPage /> },
    { path: "finance/reports", element: <FinancialReportsPage /> },
    { path: "nutrition", element: <NutritionPlannerPage /> },
    { path: "workout/exercises", element: <ExercisePage /> },
    { path: "workout/muscle-groups", element: <MuscleGroupPage /> },
    { path: "workout/logs", element: <WorkoutLogPage /> },

    { path: "docs/category/list", element: <DocCategoryPage /> },
    { path: "docs/article/list", element: <DocArticleListPage /> },
    { path: "docs/article/create", element: <DocArticleFormPage /> },
    { path: "docs/article/edit/:id", element: <DocArticleFormPage /> },
];

export const AdminAuthRoutes = [
    { path: "auth/login", element: <LoginPage /> },
];
