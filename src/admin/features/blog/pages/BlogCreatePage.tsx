import { Box, Stack, TextField, ThemeProvider, useTheme, MenuItem, Select, FormControl, InputLabel, FormHelperText, createTheme } from "@mui/material"
import { LoadingButton } from "../../../shared/components/ui/LoadingButton";

import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb"
import { Title } from "../../../shared/components/ui/Title"
import { useState, type Dispatch, type SetStateAction } from "react"
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap"
import { CollapsibleCard } from "../../../shared/components/ui/CollapsibleCard"
import { useCreateBlog } from "./hooks/useBlog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { createBlogSchema, CreateBlogFormValues } from "../../../shared/schemas/blog.schema"
import { FormUploadSingleFile } from "../../../shared/components/upload/FormUploadSingleFile"
import { toast } from "react-toastify"
import { prefixAdmin } from "../../../shared/constants/routes"
import { generateSlug } from "../api/blog.api";

import { useNestedBlogCategories } from "../../blog-category/pages/hooks/useBlogCategory";
import { CategoryTreeSelect } from "../../../shared/components/ui/CategoryTreeSelect";

export const BlogCreatePage = () => {
    
    const [expandedDetail, setExpandedDetail] = useState(true);
    const [expandedExtra, setExpandedExtra] = useState(true);
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

    const { data: blogCategories = [] } = useNestedBlogCategories();
    const { mutate: create, isPending } = useCreateBlog();

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<CreateBlogFormValues>({
        resolver: zodResolver(createBlogSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            content: "",
            avatar: "",
            category: [],
            status: "draft",
        },
    });

    const onSubmit = (data: CreateBlogFormValues) => {
        // Map string IDs to what API expects.
        // BE expects "category" as a JSON string of array of strings, e.g. "[\"id1\"]" 
        // OR simply an array of strings if using non-form-data JSON body.
        // Given existing patterns, we likely need to send it compatible with what controller expects.
        // Controller: req.body.category = JSON.parse(req.body.category); -> implies it receives a stringified JSON.

        const payload = {
            ...data,
            slug: generateSlug(data.name),
            category: JSON.stringify(data.category)
        };

        create(payload, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message || "Tạo bài viết thành công");
                    reset();
                } else {
                    toast.error(response.message);
                }
            },
            onError: () => {
                toast.error("Tạo bài viết thất bại");
            }
        });
    };

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Tạo mới bài viết"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Danh sách bài viết", to: `/${prefixAdmin}/blog/list` },
                            { label: "Tạo mới" }
                        ]}
                    />
                </div>
            </div>
            <ThemeProvider theme={localTheme}>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                <Controller
                                    name="content"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Box>
                                            <Tiptap
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                            />
                                            {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                                        </Box>
                                    )}
                                />
                                <FormUploadSingleFile
                                    name="avatar"
                                    control={control}
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




