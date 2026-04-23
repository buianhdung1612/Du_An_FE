import { Box, Stack, TextField, ThemeProvider, useTheme } from "@mui/material"
import { LoadingButton } from "../../../shared/components/ui/LoadingButton";
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb"
import { Title } from "../../../shared/components/ui/Title"
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap"
import { useState, type Dispatch, type SetStateAction } from "react";
import { CollapsibleCard } from "../../../shared/components/ui/CollapsibleCard";
import { useCreateBlogCategory, useNestedBlogCategories } from "./hooks/useBlogCategory";
import { generateSlug } from "../api/blog-category.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { createCategorySchema, CreateCategoryFormValues } from "../../../shared/schemas/blog-category.schema";
import { getBlogCategoryTheme } from "./configs/theme";
import { prefixAdmin } from "../../../shared/constants/routes";
import { FormUploadSingleFile } from "../../../shared/components/upload/FormUploadSingleFile";
import { toast } from "react-toastify";
import { CategoryTreeSelect } from "../../../shared/components/ui/CategoryTreeSelect";
import { SwitchButton } from "../../../shared/components/ui/SwitchButton";

export const BlogCategoryCreatePage = () => {
    const [expandedDetail, setExpandedDetail] = useState(true);
    const toggle = (setter: Dispatch<SetStateAction<boolean>>) =>
        () => setter(prev => !prev);

    const outerTheme = useTheme();
    const localTheme = getBlogCategoryTheme(outerTheme);

    const {
        control,
        handleSubmit,
        reset
    } = useForm<CreateCategoryFormValues>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            name: "",
            description: "",
            parent: "",
            status: "active",
            avatar: "",
        },
    });

    // Lấy danh mục dạng cây
    const {
        data: nestedCategories = [],
    } = useNestedBlogCategories();


    // Tạo
    const { mutate: create, isPending } = useCreateBlogCategory();

    const onSubmit = (data: CreateCategoryFormValues) => {
        const payload = {
            ...data,
            slug: generateSlug(data.name)
        };
        create(payload, {
            onSuccess: (response) => {
                if (response.success) {
                    toast.success(response.message);
                    reset({
                        name: "",
                        description: "",
                        parent: "",
                        status: "active",
                        avatar: "",
                    });
                } else {
                    toast.error(response.message);
                }

            },
            onError: () => {
                toast.error("Tạo danh mục thất bại");
            }
        });
    };

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title="Tạo mới danh mục bài viết" />
                    <Breadcrumb
                        items={[
                            { label: "Dashboard", to: "/" },
                            { label: "Danh mục bài viết", to: `/${prefixAdmin}/blog-category/list` },
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
                            title="Chi tiết"
                            subheader="Tiêu đề, mô tả, hình ảnh..."
                            expanded={expandedDetail}
                            onToggle={toggle(setExpandedDetail)}
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
                                        name="name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Tên danh mục"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                    <CategoryTreeSelect
                                        control={control}
                                        categories={nestedCategories}
                                        showRootOption
                                        name="parent"
                                        label="Danh mục cha"
                                    />

                                </Box>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Tiptap
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                <FormUploadSingleFile
                                    name="avatar"
                                    control={control}
                                />
                            </Stack>
                        </CollapsibleCard>
                        <Box gap="calc(3 * var(--spacing))" sx={{ display: "flex", alignItems: "center" }}>
                            <SwitchButton
                                control={control}
                                name="status"
                                checkedValue="active"
                                uncheckedValue="inactive"
                            />
                            <LoadingButton
                                type="submit"
                                loading={isPending}
                                label="Tạo danh mục"
                                loadingLabel="Đang tạo..."
                            />
                        </Box>
                    </Stack>
                </form>
            </ThemeProvider>
        </>
    );
};





