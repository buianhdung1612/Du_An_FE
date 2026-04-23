/* eslint-disable react-refresh/only-export-components */
import { Box, ListItemText, Button } from "@mui/material";
import { GridActionsCell, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import { DeleteIcon, EditIcon } from "@assets/icons/index";
import { COLORS } from "../configs/constants";
import { 
    useDeleteVocabularyTopic, 
    useForceDeleteVocabularyTopic, 
    useRestoreVocabularyTopic 
} from "../hooks/useVocabularyTopic";
import { useNavigate } from "react-router-dom";
import { prefixAdmin } from "@shared/constants/routes";
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { confirmDelete } from "@shared/utils/swal";
import RestoreIcon from '@mui/icons-material/Restore';
import { Icon } from '@iconify/react';

dayjs.locale('vi');
interface RenderCreatedAtCellProps {
    value: Date | null | any;
}

export const RenderTitleCell = (params: GridRenderCellParams) => {
    const { title } = params.row;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                py: "calc(2 * var(--spacing))",
                gap: "calc(2 * var(--spacing))",
                width: "100%",
            }}>

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
                        {title}
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
    const status = params.row.status || 'active';

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

export const getRenderActionsCell = (isTrash: boolean, onEdit: (row: any) => void, onAddVocab: (row: any) => void) => (params: GridRenderCellParams) => {
    const navigate = useNavigate();
    const { mutate: deleteTopic } = useDeleteVocabularyTopic();
    const { mutate: forceDeleteTopic } = useForceDeleteVocabularyTopic();
    const { mutate: restoreTopic } = useRestoreVocabularyTopic();
    const _id = params.row._id;

    const handleDelete = () => {
        const message = isTrash ? "Bạn có chắc chắn muốn xóa vĩnh viễn chủ đề này?" : "Bạn có chắc chắn muốn xóa chủ đề này?";
        const action = isTrash ? forceDeleteTopic : deleteTopic;

        confirmDelete(message, () => {
            action(_id, {
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Xóa chủ đề thành công");
                    } else {
                        toast.error(res.message);
                    }
                }
            });
        });
    };

    const handleRestore = () => {
        restoreTopic(_id, {
            onSuccess: (res: any) => {
                if (res.success) {
                    toast.success("Khôi phục chủ đề thành công");
                } else {
                    toast.error(res.message);
                }
            }
        });
    };

    return (
        <GridActionsCell {...params}>
             {!isTrash && (
                <>
                    <GridActionsCellItem
                        icon={<Icon icon="solar:add-circle-bold" style={{ fontSize: '1.25rem', color: '#212B36' }} />}
                        label="Thêm từ vựng"
                        onClick={() => onAddVocab(params.row)}
                    />
                    <GridActionsCellItem
                        icon={<Icon icon="solar:play-circle-bold" style={{ fontSize: '1.25rem', color: '#00A76F' }} />}
                        label="Học"
                        onClick={() => navigate(`/${prefixAdmin}/vocabulary/study?topicId=${_id}`)}
                    />
                </>
            )}
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
