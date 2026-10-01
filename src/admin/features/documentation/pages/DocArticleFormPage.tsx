import React, { useEffect, useState } from 'react';
import { Box, Stack, TextField, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb";
import { Title } from "../../../shared/components/ui/Title";
import { MarkdownEditor } from "../../../shared/components/ui/MarkdownEditor";
import { CollapsibleCard } from "../../../shared/components/ui/CollapsibleCard";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { prefixAdmin } from "../../../shared/constants/routes";
import * as docApi from '../api/doc.api';

export const DocArticleFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        docCategoryId: '',
        content: '',
        order: 0,
        status: 'published'
    });

    useEffect(() => {
        const fetchData = async () => {
            const catRes = await docApi.getCategories();
            if (catRes.success) setCategories(catRes.data);

            if (isEdit) {
                const artRes = await docApi.getArticleById(id);
                if (artRes.success) {
                    setFormData({
                        title: artRes.data.title,
                        docCategoryId: artRes.data.docCategoryId,
                        content: artRes.data.content || '',
                        order: artRes.data.order || 0,
                        status: artRes.data.status || 'published'
                    });
                }
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await docApi.updateArticle(id, formData);
                toast.success("Cập nhật bài viết thành công");
            } else {
                await docApi.createArticle(formData);
                toast.success("Tạo bài viết thành công");
            }
            navigate(`/${prefixAdmin}/docs/article/list`);
        } catch (error) {
            toast.error("Lỗi khi lưu bài viết");
        }
    };

    return (
        <div className="p-4">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <Title title={isEdit ? "Chỉnh sửa bài viết" : "Viết bài tài liệu mới"} />
                    <Breadcrumb items={[
                        { label: "Bảng điều khiển", to: "/admin" },
                        { label: "Bài viết tài liệu", to: `/${prefixAdmin}/docs/article/list` },
                        { label: isEdit ? "Chỉnh sửa" : "Tạo mới" }
                    ]} />
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Stack gap={3}>
                    <CollapsibleCard title="Thông tin cơ bản" expanded onToggle={() => {}}>
                        <Stack p={3} gap={3}>
                            <TextField fullWidth label="Tiêu đề bài viết" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <FormControl fullWidth required>
                                    <InputLabel>Danh mục tài liệu</InputLabel>
                                    <Select value={formData.docCategoryId} label="Danh mục tài liệu" onChange={(e) => setFormData({ ...formData, docCategoryId: e.target.value })}>
                                        {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <TextField fullWidth type="number" label="Thứ tự hiển thị" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
                            </Box>

                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select value={formData.status} label="Trạng thái" onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                    <MenuItem value="published">Xuất bản</MenuItem>
                                    <MenuItem value="draft">Bản nháp</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </CollapsibleCard>

                    <CollapsibleCard title="Nội dung" expanded onToggle={() => {}}>
                        <Box p={3}>
                            <MarkdownEditor value={formData.content} onChange={(val) => setFormData({ ...formData, content: val })} />
                        </Box>
                    </CollapsibleCard>

                    <Box display="flex" justifyContent="flex-end">
                        <Button 
                            type="submit" 
                            variant="contained" 
                            size="large" 
                            sx={{ 
                                background: 'var(--palette-text-primary)',
                                color: 'var(--palette-background-paper)',
                                padding: '10px 32px',
                                fontWeight: 700,
                                '&:hover': { background: 'var(--palette-grey-700)' }
                            }}
                        >
                            {isEdit ? "Cập nhật bài viết" : "Tạo bài viết"}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </div>
    );
};
