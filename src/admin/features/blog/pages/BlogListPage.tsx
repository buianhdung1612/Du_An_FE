import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { Search } from "../../../shared/components/ui/Search";
import { SortButton } from "../../../shared/components/ui/SortButton";
import { TabList } from "../../../shared/components/ui/TabList";
import { BlogList } from "./sections/BlogList";
import { useBlogs } from "./hooks/useBlog";
import { useState } from "react";

export const BlogListPage = () => {
    const navigate = useNavigate();
    const { module } = useParams();
    const activeModule = module || "programming";

    const [sortBy, setSortBy] = useState("latest");
    const [tabStatus, setTabStatus] = useState(0); // 0: All, 1: Published, 2: Draft, 3: Archived
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filters = {
        page,
        limit: 10,
        keyword: search,
        status: tabStatus === 1 ? 'published' : (tabStatus === 2 ? 'draft' : (tabStatus === 3 ? 'archived' : undefined)),
        sort: sortBy,
        module: activeModule
    };

    const { data, isLoading } = useBlogs(filters);
    const blogs = data?.recordList || [];
    const pagination = data?.pagination || { totalRecords: 0 };

    const counts = {
        all: pagination.totalRecords || 0,
        published: blogs.filter((b: any) => b.status === 'published').length,
        draft: blogs.filter((b: any) => b.status === 'draft').length,
        archived: blogs.filter((b: any) => b.status === 'archived').length,
    };

    const displayTitle = activeModule === "english" ? "Bài viết Anh Văn" : "Bài viết Lập Trình";

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={displayTitle} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: displayTitle, to: `/${prefixAdmin}/${activeModule}/blog/list` },
                            { label: "Danh sách" }
                        ]}
                    />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                        onClick={() => navigate(`/${prefixAdmin}/${activeModule}/blog/create`)}
                        sx={{
                            background: 'var(--palette-text-primary)',
                            minHeight: "2.25rem",
                            minWidth: "4rem",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            padding: "6px 12px",
                            borderRadius: "var(--shape-borderRadius)",
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": {
                                background: "var(--palette-grey-700)",
                                boxShadow: "var(--customShadows-z8)"
                             }
                        }}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        {"Tạo mới bài viết"}
                    </Button>
                </div>
            </div>

            <Box sx={{ mb: "40px", display: 'flex', justifyContent: "space-between" }}>
                <Search
                    value={search}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                />
                <SortButton
                    value={sortBy}
                    onChange={(val) => { setSortBy(val); setPage(1); }}
                />
            </Box>

            <TabList
                value={tabStatus}
                onChange={(_, newVal) => { setTabStatus(newVal); setPage(1); }}
                counts={counts}
            />

            <BlogList
                blogs={blogs}
                isLoading={isLoading}
                page={page}
                onPageChange={setPage}
                pagination={pagination}
            />
        </>
    )
}
