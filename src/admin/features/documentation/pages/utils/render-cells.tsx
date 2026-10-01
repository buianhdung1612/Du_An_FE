import { Avatar, Box, Link, ListItemText, IconButton } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { COLORS } from "../configs/constants";
import { useNavigate } from "react-router-dom";
import { prefixAdmin } from "@shared/constants/routes";
import { Icon } from "@iconify/react";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

export const RenderTitleCell = (params: GridRenderCellParams) => {
    const { name, title, avatar, _id } = params.row;
    const displayName = name || title;
    const navigate = useNavigate();

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
                alt={displayName}
                src={avatar || ""}
                variant="rounded"
                sx={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--shape-borderRadius-md)",
                    backgroundColor: 'var(--palette-background-neutral)'
                }}
            >
                {displayName ? displayName.charAt(0) : "D"}
            </Avatar>

            <ListItemText
                primary={
                    <Typography
                        sx={{
                            color: COLORS.primary,
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                        }}
                    >
                        {displayName}
                    </Typography>
                }
                sx={{ m: 0 }}
            />
        </Box>
    );
}

export const RenderCreatedAtCell = (params: GridRenderCellParams) => {
    const value = params.value;
    if (!value) return null;
    const dateObj = dayjs(value);
    if (!dateObj.isValid()) return null;

    const formattedDate = dateObj.format('DD MMM, YYYY');
    const formattedTime = dateObj.format('hh:mm A');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: "4px" }}>
            <span style={{ fontSize: "0.875rem", color: COLORS.primary, textTransform: 'capitalize' }}>
                {formattedDate}
            </span>
            <Box component='span' sx={{ fontSize: "0.75rem", color: COLORS.secondary, textTransform: 'lowercase' }}>
                {formattedTime}
            </Box>
        </Box >
    );
}

import { Typography } from "@mui/material";

export const RenderStatusCell = (params: GridRenderCellParams) => {
    const status = params.row.status || 'published';

    let label = "Xuất bản";
    let bg = "var(--palette-success-lighter)";
    let text = "var(--palette-success-dark)";

    if (status === 'published') {
        label = "Xuất bản";
        bg = "var(--palette-success-lighter)";
        text = "var(--palette-success-dark)";
    } else {
        label = "Bản nháp";
        bg = "var(--palette-grey-200)";
        text = "var(--palette-grey-600)";
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

export const RenderActionsCell = (onEdit: (row: any) => void, onDelete: (id: string) => void) => (params: GridRenderCellParams) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <IconButton onClick={() => onEdit(params.row)} color="inherit" size="small">
                <Icon icon="solar:pen-bold" width={20} />
            </IconButton>
            <IconButton onClick={() => onDelete(params.row._id)} color="error" size="small">
                <Icon icon="solar:trash-bin-trash-bold" width={20} />
            </IconButton>
        </Box>
    );
}
