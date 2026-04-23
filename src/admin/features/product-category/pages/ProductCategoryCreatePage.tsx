import { Box, Stack, TextField, ThemeProvider, useTheme } from "@mui/material"
import { Breadcrumb } from "../../../shared/components/ui/Breadcrumb"
import { Title } from "../../../shared/components/ui/Title"
import { Tiptap } from "../../../shared/components/layouts/titap/Tiptap"
import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { CollapsibleCard } from "../../../shared/components/ui/CollapsibleCard";
import { useCreateProductCategory, useNestedProductCategories } from "./hooks/useProductCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { SwitchButton } from "../../../shared/components/ui/SwitchButton";
import { getProductCategoryTheme } from "./configs/theme";
import { prefixAdmin } from "../../../shared/constants/routes";
import { FormUploadSingleFile } from "../../../shared/components/upload/FormUploadSingleFile";
import { toast } from "react-toastify";
import { LoadingButton } from "../../../shared/components/ui/LoadingButton";
import { CategoryTreeSelect } from "../../../shared/components/ui/CategoryTreeSelect";

import { z } from "zod";

export const ProductCategoryCreatePage = () => {


    const createCategorySchema = useMemo(() => z.object({
        name: z
            .string()
            .min(1, "Tên danh mục không được để trống")
            .max(100),
        description: z.string().optional(),
        parent: z.string().optional(),
        status: z.enum(["active", "inactive"]).default("active"),
        avatar: z.string().min(1, "Vui lòng chọn hình ảnh"),
    }), []);


    const [expandedDetail, setExpandedDetail] = useState(true);
    const toggle = (setter: Dispatch<SetStateAction<boolean>>) =>
        () => setter(prev => !prev);

    const outerTheme = useTheme();
    const localTheme = getProductCategoryTheme(outerTheme);

    const {
        control,
        handleSubmit,
        reset
    } = useForm<any>({
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
    } = useNestedProductCategories();

    // Tạo
    const { mutate: create, isPending } = useCreateProductCategory();

    const onSubmit = (data: any) => {
        create(data, {
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
                toast.error("Tạo mới thất bại");
            }
        });
    };

    return (
        <>
            <div className="mb-[calc(5*var(--spacing))] gap-[calc(2*var(--spacing))] flex flex-col md:flex-row md:items-start md:justify-end">
                <div className="mr-auto">
                    <Title title={"Tạo mới danh mục sản phẩm"} />
                    <Breadcrumb
                        items={[
                            { label: "Bảng điều khiển", to: "/" },
                            { label: "Danh mục sản phẩm", to: `/${prefixAdmin}/product-category/list` },
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
                            subheader={"Tiêu đề, mô tả, hình ảnh..."}
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
                                                label={"Tên danh mục"}
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
                                label={"Tạo mới danh mục sản phẩm"}
                                loadingLabel={"Đang tải..."}
                                sx={{ minHeight: "3rem", minWidth: "4rem" }}
                            />
                        </Box>
                    </Stack>
                </form>
            </ThemeProvider>

        </>
    )
}




