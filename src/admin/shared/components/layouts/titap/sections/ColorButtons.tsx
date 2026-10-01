import { memo, useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { ButtonTiptap } from "./ButtonTiptap";
import { Palette, Baseline, X } from "lucide-react";
import { Box, Popover, Stack, Tooltip, IconButton, Typography, Grid } from "@mui/material";

interface ColorButtonsProps {
    editor: Editor | null;
}

const PRESET_COLORS = [
    { label: "Mặc định", color: "inherit", value: "" },
    { label: "Đen", color: "#000000", value: "#000000" },
    { label: "Xám", color: "#637381", value: "#637381" },
    { label: "Đỏ", color: "#FF4842", value: "#FF4842" },
    { label: "Xanh dương", color: "#2065D1", value: "#2065D1" },
    { label: "Xanh lá", color: "#54D62C", value: "#54D62C" },
    { label: "Vàng", color: "#FFC107", value: "#FFC107" },
    { label: "Tím", color: "#7635dc", value: "#7635dc" },
    { label: "Cam", color: "#fda92d", value: "#fda92d" },
];

export const ColorButtons = memo(({ editor }: ColorButtonsProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSetColor = useCallback((color: string) => {
        if (!editor) return;
        if (color === "") {
            editor.chain().focus().unsetColor().run();
        } else {
            editor.chain().focus().setColor(color).run();
        }
        handleClose();
    }, [editor, handleClose]);

    if (!editor) return null;

    const currentColor = editor.getAttributes("textStyle").color;

    return (
        <>
            <ButtonTiptap
                title={"Màu sắc chữ"}
                onClick={handleOpen}
                active={!!currentColor}
            >
                <Baseline size={18} color={currentColor || "inherit"} />
            </ButtonTiptap>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                    paper: {
                        sx: {
                            p: "12px",
                            width: 200,
                            borderRadius: '12px',
                            boxShadow: "0 8px 16px 0 rgba(145, 158, 171, 0.24)",
                        }
                    }
                }}
            >
                <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600, color: 'text.secondary' }}>
                    Màu sắc
                </Typography>
                
                <Grid container spacing={1}>
                    {PRESET_COLORS.map((item) => (
                        <Grid size={4} key={item.label} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title={item.label}>
                                <IconButton
                                    size="small"
                                    onClick={() => handleSetColor(item.value)}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: item.color === "inherit" ? "transparent" : item.color,
                                        border: "1px solid",
                                        borderColor: currentColor === item.value ? "primary.main" : "divider",
                                        "&:hover": {
                                            bgcolor: item.color === "inherit" ? "action.hover" : item.color,
                                            opacity: 0.8,
                                        },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {item.color === "inherit" && <X size={14} />}
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            </Popover>
        </>
    );
});

ColorButtons.displayName = "ColorButtons";
