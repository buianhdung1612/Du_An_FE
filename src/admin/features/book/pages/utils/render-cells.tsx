/* eslint-disable react-refresh/only-export-components */
import { Avatar, Box, Link, ListItemText } from "@mui/material";
import { GridActionsCell, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import { DeleteIcon, EditIcon } from "@assets/icons/index";
import { COLORS } from "../configs/constants";
import { 
    useDeleteBookCategory, 
    useForceDeleteBookCategory, 
    useRestoreBookCategory 
} from "../hooks/useBookCategory";
import { useNavigate } from "react-router-dom";
import { prefixAdmin } from "@shared/constants/routes";
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { confirmDelete } from "@shared/utils/swal";
import RestoreIcon from '@mui/icons-material/Restore';

dayjs.locale('vi');
interface RenderCreatedAtCellProps {
    value: Date | null | any;
}

export const RenderTitleCell = (params: GridRenderCellParams) => {
    const { name, avatar } = params.row;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                py: "calc(2 * var(--spacing))",
                gap: "calc(2 * var(--spacing))",
                width: "100%",
            }}>

            <Avatar
                alt={name}
                src={avatar}
                variant="rounded"
                sx={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "var(--shape-borderRadius-md)",
                    backgroundColor: 'var(--palette-background-neutral)'
                }}
            />

            <ListItemText
                primary={
                    <span
                        className="product-title"
                        style={{
                            color: COLORS.primary,
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                        }}
                    >
                        {name}
                    </span>
                }
                slotProps={{
                    primary: {
                        component: 'span',
                        variant: 'body1',
                        noWrap: true,
                    },
                }}
                sx={{ m: 0 }}
            />
        </Box>
    );
}

export const RenderCreatedAtCell = ({ value }: RenderCreatedAtCellProps) => {
    if (!value) return null;
    const dateObj = dayjs(value);
    if (!dateObj.isValid()) return null;

    const formattedDate = dateObj.format('DD MMM, YYYY');
    const formattedTime = dateObj.format('hh:mm A');

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: "4px"
            }}>

            <span
                style={{
                    fontSize: "0.875rem",
                    color: COLORS.primary,
                    transition: 'color 0.2s',
                    textTransform: 'capitalize'
                }}>
                {formattedDate}
            </span>

            <Box
                className="date-text"
                component='span'
                sx={{
                    fontSize: "0.75rem",
                    color: COLORS.secondary,
                    textTransform: 'lowercase'
                }}
            >
                {formattedTime}
            </Box>
        </Box >
    );
}

export const RenderStatusCell = (params: GridRenderCellParams) => {
    const status = params.row.status;

    let label = "Hoạt động";
    let bg = "var(--palette-info-lighter)";
    let text = "var(--palette-info-dark)";

    if (status === 'active') {
        label = "Hoạt động";
        bg = "var(--palette-info-lighter)";
        text = "var(--palette-info-dark)";
    } else {
        label = "Tạm dừng";
        bg = "var(--palette-error-lighter)";
        text = "var(--palette-error-dark)";
    }

    return (
        <span
            className="inline-flex items-center justify-center leading-1.5 min-w-[1.5rem] h-[1.5rem] text-[0.75rem] px-[6px] font-[700] rounded-[6px]"
            style={{
                backgroundColor: bg,
                color: text,
            }}
        >
            {label}
        </span>
    );
}

export const getRenderActionsCell = (isTrash: boolean, onEdit: (row: any) => void) => (params: GridRenderCellParams) => {
    const { mutate: deleteCategory } = useDeleteBookCategory();
    const { mutate: forceDeleteCategory } = useForceDeleteBookCategory();
    const { mutate: restoreCategory } = useRestoreBookCategory();
    const _id = params.row._id;

    const handleDelete = () => {
        const message = isTrash ? "Bạn có chắc chắn muốn xóa vĩnh viễn danh mục này?" : "Bạn có chắc chắn muốn xóa danh mục này?";
        const action = isTrash ? forceDeleteCategory : deleteCategory;

        confirmDelete(message, () => {
            action(_id, {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Xóa danh mục thành công");
                    } else {
                        toast.error(res.message);
                    }
                }
            });
        });
    };

    const handleRestore = () => {
        restoreCategory(_id, {
            onSuccess: (res: any) => {
                if (res.success) {
                    toast.success("Khôi phục danh mục thành công");
                } else {
                    toast.error(res.message);
                }
            }
        });
    };

    return (
        <GridActionsCell {...params}>
            {!isTrash ? (
                <>
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Chỉnh sửa"
                        showInMenu
                        {...({
                            sx: {
                                '& .MuiTypography-root': {
                                    fontSize: '0.8125rem',
                                    fontWeight: "600"
                                },
                            },
                        } as any)}
                        onClick={() => onEdit(params.row)}
                    />
                </>
            ) : (
                <GridActionsCellItem
                    icon={<RestoreIcon />}
                    label="Khôi phục"
                    showInMenu
                    {...({
                        sx: {
                            '& .MuiTypography-root': {
                                fontSize: '0.8125rem',
                                fontWeight: "600",
                                color: "var(--palette-info-main)"
                            },
                        },
                    } as any)}
                    onClick={handleRestore}
                />
            )}
            <GridActionsCellItem
                icon={<DeleteIcon />}
                label={isTrash ? "Xóa vĩnh viễn" : "Xóa"}
                showInMenu
                {...({
                    sx: {
                        '& .MuiTypography-root': {
                            fontSize: '0.8125rem',
                            fontWeight: "600",
                            color: "var(--palette-error-main)"
                        },
                    },
                } as any)}
                onClick={handleDelete}
            />
        </GridActionsCell>
    );
}
