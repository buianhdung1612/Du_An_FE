import React, { useEffect, useState } from 'react';
import { 
    Button, Card, Box
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { prefixAdmin } from "../../../shared/constants/routes";
import { useNavigate } from "react-router-dom";
import * as docApi from '../api/doc.api';
import { toast } from 'react-toastify';
import { DocArticleToolbar } from './sections/DocArticleToolbar';
import { dataGridCardStyles, dataGridContainerStyles, dataGridStyles } from './configs/styles.config';
import { RenderTitleCell, RenderStatusCell, RenderActionsCell, RenderCreatedAtCell } from './utils/render-cells';
import { SortAscendingIcon, SortDescendingIcon, UnsortedIcon } from '../../../assets/icons';
import { DATA_GRID_LOCALE_VN } from './configs/localeText.config';

export const DocArticleListPage = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catRes, artRes] = await Promise.all([
                docApi.getCategories(),
                docApi.getArticles(selectedCategory ? { docCategoryId: selectedCategory } : {})
            ]);
            if (catRes.success) setCategories(catRes.data);
            if (artRes.success) setArticles(artRes.data);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategory]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                await docApi.deleteArticle(id);
                toast.success("Xóa thành công");
                fetchData();
            } catch (error) {
                toast.error("Lỗi khi xóa");
            }
        }
    };

    const handleEdit = (row: any) => {
        navigate(`/${prefixAdmin}/docs/article/edit/${row._id}`);
    };

    const filteredArticles = articles.filter(art => 
        art.title.toLowerCase().includes(search.toLowerCase())
    );

    const columns: GridColDef[] = [
        { 
            field: 'title', 
            headerName: 'Tiêu đề', 
            flex: 2,
            minWidth: 300,
            renderCell: RenderTitleCell
        },
        { 
            field: 'order', 
            headerName: 'Thứ tự', 
            width: 100,
            align: 'center',
            headerAlign: 'center'
        },
        { 
            field: 'createdAt', 
            headerName: 'Thời gian tạo', 
            width: 160,
            renderCell: RenderCreatedAtCell
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 150,
            renderCell: RenderStatusCell
        },
        {
            field: 'actions',
            headerName: '',
            width: 80,
            sortable: false,
            align: 'right',
            renderCell: RenderActionsCell(handleEdit, handleDelete)
        }
    ];

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Danh sách bài viết tài liệu"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Tài liệu", to: `/${prefixAdmin}/docs/article/list` },
                            { label: "Bài viết" }
                        ]}
                    />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                        onClick={() => navigate(`/${prefixAdmin}/docs/article/create`)}
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
                        {"Viết bài mới"}
                    </Button>
                </div>
            </div>

            <Card sx={dataGridCardStyles}>
                <DocArticleToolbar 
                    search={search} 
                    onSearchChange={setSearch} 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
                <Box sx={dataGridContainerStyles}>
                    <DataGrid
                        rows={filteredArticles}
                        getRowId={(row) => row._id}
                        columns={columns}
                        loading={loading}
                        density="comfortable"
                        checkboxSelection
                        disableRowSelectionOnClick
                        getRowHeight={() => 'auto'}
                        slots={{
                            columnSortedAscendingIcon: SortAscendingIcon,
                            columnSortedDescendingIcon: SortDescendingIcon,
                            columnUnsortedIcon: UnsortedIcon,
                            noRowsOverlay: () => (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    <span className='text-[1.125rem]'>Không có dữ liệu để hiển thị</span>
                                </Box>
                            )
                        }}
                        localeText={DATA_GRID_LOCALE_VN}
                        sx={dataGridStyles}
                    />
                </Box>
            </Card>
        </>
    );
};
