import { Box, Stack, TextField, ThemeProvider, useTheme, MenuItem, Select, FormControl, InputLabel, FormHelperText, createTheme, Button } from "@mui/material"
import { LoadingButton } from "../../../shared/components/ui/LoadingButton";

import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb"
import { Title } from "../../../shared/components/ui/Title"
import { useState, useEffect, type Dispatch, type SetStateAction } from "react"
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap"
import { CollapsibleCard } from "../../../shared/components/ui/CollapsibleCard"
import { useCreateBlog } from "./hooks/useBlog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { createBlogSchema, CreateBlogFormValues } from "../../../shared/schemas/blog.schema"
import { UploadFiles } from "../../../shared/components/ui/UploadFiles"
import { MarkdownEditor } from "../../../shared/components/ui/MarkdownEditor"
import { toast } from "react-toastify"
import { prefixAdmin } from "../../../shared/constants/routes"
import { generateSlug, generateKeyPoints } from "../api/blog.api";
import { useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Typography, IconButton } from "@mui/material";

import { useNestedBlogCategories } from "../../blog-category/pages/hooks/useBlogCategory";
import { CategoryTreeSelect } from "../../../shared/components/ui/CategoryTreeSelect";

export const BlogCreatePage = () => {
    const { module } = useParams();
    const activeModule = module || "programming";
    
    const [expandedDetail, setExpandedDetail] = useState(true);
    const [expandedExtra, setExpandedExtra] = useState(true);
    const [isMarkdownMode, setIsMarkdownMode] = useState(false);
    const [files, setFiles] = useState<any[]>([]);
    const [resetKey, setResetKey] = useState(0);
    const toggle = (setter: Dispatch<SetStateAction<boolean>>) =>
        () => setter(prev => !prev);

    const outerTheme = useTheme();

    const localTheme = createTheme(outerTheme, {
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none !important",
                        backdropFilter: "none !important",
                        backgroundColor: "var(--palette-background-paper) !important",
                        boxShadow: "var(--customShadows-card)",
                        borderRadius: "var(--shape-borderRadius-lg)",
                        color: "var(--palette-text-primary)",
                    },
                }
            },
            MuiAutocomplete: {
                styleOverrides: {
                    listbox: {
                        padding: 0,
                    },
                    option: {
                        fontSize: '0.875rem',
                        padding: '6px',
                        marginBottom: '4px',
                        borderRadius: "var(--shape-borderRadius-sm)",
                    },
                },
            },
        }
    });

    const { data: blogCategories = [] } = useNestedBlogCategories({ module: activeModule });
    const { mutate: create, isPending } = useCreateBlog();

    const [newKeyPoint, setNewKeyPoint] = useState("");
    const [isGeneratingPoints, setIsGeneratingPoints] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
    } = useForm<CreateBlogFormValues>({
        resolver: zodResolver(createBlogSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            content: "",
            images: [],
            category: [],
            status: "draft",
            keyPoints: [],
        },
    });

    const keyPoints = watch("keyPoints") || [];

    const handleAddKeyPoint = () => {
        if (!newKeyPoint.trim()) return;
        if (keyPoints.length >= 5) {
            toast.warning("Chỉ nên có tối đa 5 ý chính để tóm tắt tốt nhất!");
            return;
        }
        setValue("keyPoints", [...keyPoints, newKeyPoint.trim()]);
        setNewKeyPoint("");
    };

    const handleRemoveKeyPoint = (index: number) => {
        setValue("keyPoints", keyPoints.filter((_: any, i: number) => i !== index));
    };

    const handleAIGenerateKeyPoints = async () => {
        const currentContent = watch("content");
        const currentDescription = watch("description");
        if (!currentContent && !currentDescription) {
            toast.warning("Vui lòng nhập mô tả hoặc nội dung bài viết trước để AI phân tích!");
            return;
        }

        try {
            setIsGeneratingPoints(true);
            const res = await generateKeyPoints({
                content: currentContent,
                description: currentDescription
            });
            if (res.success && res.keyPoints) {
                setValue("keyPoints", res.keyPoints);
                toast.success("AI đã tóm tắt xong các ý chính!");
            } else {
                toast.error(res.message || "Không thể trích xuất ý chính bằng AI");
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra khi kết nối với AI");
        } finally {
            setIsGeneratingPoints(false);
        }
    };

    useEffect(() => {
        setValue("images", files);
    }, [files, setValue]);

    const onSubmit = (data: CreateBlogFormValues) => {
        const payload = {
            ...data,
            slug: generateSlug(data.name),
            category: JSON.stringify(data.category),
            images: JSON.stringify(data.images.map((f: any) => f.name || f)),
            keyPoints: JSON.stringify(data.keyPoints || []),
            module: activeModule
        };

        create(payload, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message || "Tạo bài viết thành công");
                    reset();
                    setFiles([]);
                    setResetKey(prev => prev + 1);
                } else {
                    toast.error(response.message);
                }
            },
            onError: () => {
                toast.error("Tạo bài viết thất bại");
            }
        });
    };

    const onError = (errors: any) => {
        console.error("Form validation errors:", errors);
        toast.error("Vui lòng kiểm tra lại các trường bắt buộc");
    };

    const displayTitle = activeModule === "english" ? "Tạo mới bài viết Anh Văn" : "Tạo mới bài viết Lập Trình";
    const listTitle = activeModule === "english" ? "Bài viết Anh Văn" : "Bài viết Lập Trình";

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={displayTitle} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: listTitle, to: `/${prefixAdmin}/${activeModule}/blog/list` },
                            { label: "Tạo mới" }
                        ]}
                    />
                </div>
            </div>
            <ThemeProvider theme={localTheme}>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <Stack sx={{
                        margin: { xs: "0px", md: "0px calc(15 * var(--spacing))" },
                        gap: "calc(5 * var(--spacing))"
                    }}>
                        <CollapsibleCard
                            title={"Chi tiết"}
                            subheader={"Mô tả"}
                            expanded={expandedDetail}
                            onToggle={toggle(setExpandedDetail)}
                        >
                            <Stack p="calc(3 * var(--spacing))" gap="calc(3 * var(--spacing))">
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label={"Tiêu đề bài viết"}
                                            fullWidth
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                         <TextField
                                             {...field}
                                             label={"Mô tả ngắn"}
                                             multiline
                                             rows={4}
                                             fullWidth
                                             error={!!fieldState.error}
                                             helperText={fieldState.error?.message}
                                             sx={{}}
                                         />
                                    )}
                                />

                                <Box sx={{ mt: 1, mb: 1, p: 2, borderRadius: '12px', border: '1px dashed var(--palette-divider)', bgcolor: 'rgba(145, 158, 171, 0.04)' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <LightbulbIcon color="warning" />
                                            <div className="text-[0.875rem] font-semibold text-[var(--palette-text-primary)]">
                                                Ý chính cốt lõi (Tóm tắt nhanh)
                                            </div>
                                        </Stack>
                                        <LoadingButton
                                            size="small"
                                            variant="outlined"
                                            color="inherit"
                                            loading={isGeneratingPoints}
                                            startIcon={<AutoAwesomeIcon sx={{ width: 16, height: 16 }} />}
                                            onClick={handleAIGenerateKeyPoints}
                                            sx={{ borderRadius: '8px', textTransform: 'none', color: 'var(--palette-text-primary)', borderColor: 'var(--palette-divider)' }}
                                        >
                                            AI Tóm tắt ý chính
                                        </LoadingButton>
                                    </Stack>

                                    <Stack spacing={1} sx={{ mb: 2 }}>
                                        {keyPoints.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', px: 1 }}>
                                                Chưa có ý chính nào. Bấm nút AI Tóm tắt hoặc tự nhập thêm bên dưới.
                                            </Typography>
                                        ) : (
                                            keyPoints.map((point: string, index: number) => (
                                                <Stack 
                                                    key={index} 
                                                    direction="row" 
                                                    alignItems="center" 
                                                    justifyContent="space-between" 
                                                    sx={{ 
                                                        p: 1, 
                                                        px: 2, 
                                                        borderRadius: '8px', 
                                                        bgcolor: 'var(--palette-background-paper)',
                                                        border: '1px solid var(--palette-divider)' 
                                                    }}
                                                >
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Box sx={{ 
                                                            width: 20, 
                                                            height: 20, 
                                                            borderRadius: '50%', 
                                                            bgcolor: 'rgba(0, 167, 111, 0.08)', 
                                                            color: 'var(--palette-success-main)', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700 
                                                        }}>
                                                            {index + 1}
                                                        </Box>
                                                        <Typography variant="body2" color="text.primary">
                                                            {point}
                                                        </Typography>
                                                    </Stack>
                                                    <IconButton size="small" onClick={() => handleRemoveKeyPoint(index)} color="error">
                                                        <DeleteIcon sx={{ width: 18, height: 18 }} />
                                                    </IconButton>
                                                </Stack>
                                            ))
                                        )}
                                    </Stack>

                                    <Stack direction="row" spacing={1}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Nhập ý chính tiếp theo..."
                                            value={newKeyPoint}
                                            onChange={(e) => setNewKeyPoint(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddKeyPoint();
                                                }
                                            }}
                                        />
                                        <Button 
                                            variant="contained" 
                                            color="inherit"
                                            onClick={handleAddKeyPoint}
                                            sx={{ 
                                                minWidth: '80px', 
                                                textTransform: 'none',
                                                bgcolor: 'var(--palette-text-primary)',
                                                color: 'var(--palette-common-white)',
                                                '&:hover': {
                                                    bgcolor: 'var(--palette-grey-800)'
                                                }
                                            }}
                                            startIcon={<AddIcon />}
                                        >
                                            Thêm
                                        </Button>
                                    </Stack>
                                </Box>
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <div className="text-[0.875rem] font-semibold text-[var(--palette-text-primary)]">Nội dung bài viết</div>
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    onClick={() => setIsMarkdownMode(!isMarkdownMode)}
                                                    sx={{ borderRadius: '8px', textTransform: 'none', color: 'var(--palette-text-primary)', borderColor: 'var(--palette-divider)' }}
                                                >
                                                    {isMarkdownMode ? "Chuyển sang soạn thảo Rich Text" : "Chuyển sang soạn thảo Markdown"}
                                                </Button>
                                            </Box>
                                            {isMarkdownMode ? (
                                                <MarkdownEditor value={field.value ?? ""} onChange={field.onChange} />
                                            ) : (
                                                <Tiptap value={field.value ?? ""} onChange={field.onChange} />
                                            )}
                                            {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                                        </Box>
                                    )}
                                />
                                <UploadFiles
                                    key={resetKey}
                                    files={files}
                                    onFilesChange={(newFiles) => setFiles(newFiles)}
                                />
                            </Stack>
                        </CollapsibleCard>
                        <CollapsibleCard
                            title={"Thuộc tính"}
                            subheader={"Mô tả"}
                            expanded={expandedExtra}
                            onToggle={toggle(setExpandedExtra)}
                        >
                            <Stack p="calc(3 * var(--spacing))" gap="calc(3 * var(--spacing))">
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                                        gap: "calc(3 * var(--spacing)) calc(2 * var(--spacing))",
                                    }}
                                >
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <InputLabel id="status-select-label">{"Trạng thái"}</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId="status-select-label"
                                                    label={"Trạng thái"}
                                                >
                                                    <MenuItem value="draft">{"Bản nháp"}</MenuItem>
                                                    <MenuItem value="published">{"Xuất bản"}</MenuItem>
                                                    <MenuItem value="archived">{"Đã lưu trữ"}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                    <CategoryTreeSelect
                                        multiple
                                        name="category"
                                        control={control}
                                        categories={blogCategories}
                                        placeholder="Chọn danh mục bài viết"
                                        label="Danh mục"
                                    />
                                </Box>
                            </Stack>
                        </CollapsibleCard>
                        <Box gap="calc(3 * var(--spacing))" sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                            <LoadingButton
                                type="submit"
                                loading={isPending}
                                label={"Tạo mới bài viết"}
                                loadingLabel={"Đang xử lý..."}
                            />
                        </Box>
                    </Stack>
                </form>
            </ThemeProvider>

        </>
    )
}




