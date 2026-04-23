import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { useNavigate } from "react-router-dom";
import { BlogCategoryList } from "./sections/BlogCategoryList";

export const BlogCategoryListPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Danh sách"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Danh mục bài viết", to: `/${prefixAdmin}/blog-category/list` },
                            { label: "Danh sách" }
                        ]}
                    />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                        onClick={() => navigate(`/${prefixAdmin}/blog-category/create`)}
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
                        {"Tạo danh mục bài viết"}
                    </Button>
                </div>
            </div>
            <BlogCategoryList />
        </>
    )
}
