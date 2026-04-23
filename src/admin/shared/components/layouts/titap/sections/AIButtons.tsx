import { memo, useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { 
    IconButton, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText, 
    Tooltip,
    CircularProgress,
    Box
} from "@mui/material";
import { Sparkles, Languages, Wand2, Type, FileSearch, Code2 } from "lucide-react";
import { useAIAssistant } from "../hooks/useAIAssistant";
import { AIActionType } from "@admin/features/ai/api/ai.api";

interface AIButtonsProps {
    editor: Editor | null;
}

export const AIButtons = memo(({ editor }: AIButtonsProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isLoading, handleAIAction } = useAIAssistant(editor);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const runAction = useCallback(async (action: AIActionType) => {
        handleClose();
        await handleAIAction(action);
    }, [handleAIAction]);

    if (!editor) return null;

    const open = Boolean(anchorEl);

    return (
        <Box className="flex items-center">
            <Tooltip title="Trợ lý AI (Groq Llama 3)">
                <IconButton
                    onClick={handleClick}
                    sx={{
                        color: isLoading ? "#919EAB" : "#00A76F",
                        backgroundColor: open ? "#00A76F14" : "transparent",
                        "&:hover": {
                            backgroundColor: "#00A76F14",
                        },
                        width: '32px',
                        height: '32px',
                        transition: 'all 0.2s',
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <CircularProgress size={16} color="inherit" />
                    ) : (
                        <Sparkles size={18} />
                    )}
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            minWidth: 220,
                            borderRadius: '12px',
                            boxShadow: '0 8px 16px 0 rgba(145 158 171 / 16%)',
                        }
                    }
                }}
            >
                <MenuItem onClick={() => runAction('improve')} sx={{ py: 1.5 }}>
                    <ListItemIcon><Wand2 size={18} /></ListItemIcon>
                    <ListItemText primary="Cải thiện văn bản" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>

                <MenuItem onClick={() => runAction('grammar')} sx={{ py: 1.5 }}>
                    <ListItemIcon><Type size={18} /></ListItemIcon>
                    <ListItemText primary="Sửa lỗi chính tả & ngữ pháp" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>

                <MenuItem onClick={() => runAction('continue')} sx={{ py: 1.5 }}>
                    <ListItemIcon><Sparkles size={18} /></ListItemIcon>
                    <ListItemText primary="Viết tiếp nội dung" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>

                <MenuItem onClick={() => runAction('translate')} sx={{ py: 1.5 }}>
                    <ListItemIcon><Languages size={18} /></ListItemIcon>
                    <ListItemText primary="Dịch sang tiếng Anh" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>

                <MenuItem onClick={() => runAction('explain_code')} sx={{ py: 1.5 }}>
                    <ListItemIcon><Code2 size={18} /></ListItemIcon>
                    <ListItemText primary="Giải thích Code" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>

                <MenuItem onClick={() => runAction('summarize')} sx={{ py: 1.5 }}>
                    <ListItemIcon><FileSearch size={18} /></ListItemIcon>
                    <ListItemText primary="Tóm tắt nội dung" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </MenuItem>
            </Menu>
        </Box>
    );
});

AIButtons.displayName = "AIButtons";
