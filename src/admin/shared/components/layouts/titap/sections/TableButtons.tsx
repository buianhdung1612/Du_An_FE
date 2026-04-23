import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { 
    Table as TableIcon, 
    Columns, 
    Rows, 
    PlusSquare, 
    MinusSquare, 
    Trash2,
    LayoutGrid
} from "lucide-react";

interface TableButtonsProps {
    editor: Editor | null;
}

export const TableButtons = ({ editor }: TableButtonsProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (!editor) return null;

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const runCommand = (command: () => void) => {
        command();
        handleClose();
    };

    const isTableActive = editor.isActive('table');

    return (
        <>
            <Tooltip title="Bảng">
                <IconButton 
                    size="small" 
                    onClick={handleOpen}
                    sx={{ 
                        color: isTableActive ? 'var(--palette-primary-main)' : 'inherit',
                        bgcolor: isTableActive ? 'rgba(0, 167, 111, 0.08)' : 'transparent'
                    }}
                >
                    <TableIcon size={18} />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{ paper: { sx: { width: 220, p: 0.5 } } }}
            >
                <MenuItem onClick={() => runCommand(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}>
                    <ListItemIcon><LayoutGrid size={18} /></ListItemIcon>
                    <ListItemText primary="Chèn bảng (3x3)" />
                </MenuItem>
                
                <Divider sx={{ my: 0.5 }} />

                <MenuItem disabled={!isTableActive} onClick={() => runCommand(() => editor.chain().focus().addColumnBefore().run())}>
                    <ListItemIcon><PlusSquare size={18} /></ListItemIcon>
                    <ListItemText primary="Thêm cột trước" />
                </MenuItem>
                <MenuItem disabled={!isTableActive} onClick={() => runCommand(() => editor.chain().focus().addColumnAfter().run())}>
                    <ListItemIcon><PlusSquare size={18} /></ListItemIcon>
                    <ListItemText primary="Thêm cột sau" />
                </MenuItem>
                <MenuItem disabled={!isTableActive} onClick={() => runCommand(() => editor.chain().focus().deleteColumn().run())}>
                    <ListItemIcon><MinusSquare size={18} /></ListItemIcon>
                    <ListItemText primary="Xóa cột" />
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem disabled={!isTableActive} onClick={() => runCommand(() => editor.chain().focus().addRowBefore().run())}>
                    <ListItemIcon><Rows size={18} /></ListItemIcon>
                    <ListItemText primary="Thêm hàng trước" />
                </MenuItem>
                <MenuItem disabled={!isTableActive} onClick={() => runCommand(() => editor.chain().focus().addRowAfter().run())}>
                    <ListItemIcon><Rows size={18} /></ListItemIcon>
                    <ListItemText primary="Thêm hàng sau" />
                </MenuItem>
                <MenuItem disabled={!isTableActive} onClick={() => runCommand(() => editor.chain().focus().deleteRow().run())}>
                    <ListItemIcon><MinusSquare size={18} /></ListItemIcon>
                    <ListItemText primary="Xóa hàng" />
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem disabled={!isTableActive} onClick={() => runCommand(() => editor.chain().focus().deleteTable().run())}>
                    <ListItemIcon><Trash2 size={18} color="var(--palette-error-main)" /></ListItemIcon>
                    <ListItemText primary="Xóa bảng" sx={{ color: 'var(--palette-error-main)' }} />
                </MenuItem>
            </Menu>
        </>
    );
};
