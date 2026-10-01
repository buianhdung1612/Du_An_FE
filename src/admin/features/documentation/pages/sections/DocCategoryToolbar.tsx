import { Toolbar, Box } from "@mui/material";
import { Search } from "@shared/components/ui/Search";
import { toolbarStyles } from "../configs/styles.config";

interface DocCategoryToolbarProps {
    search: string;
    onSearchChange: (val: string) => void;
}

export const DocCategoryToolbar = ({ search, onSearchChange }: DocCategoryToolbarProps) => {
    return (
        <Toolbar style={toolbarStyles.root}>
            <Box sx={{ flex: 1 }}>
                <Search 
                    maxWidth="100%" 
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Tìm kiếm danh mục..."
                />
            </Box>
        </Toolbar>
    );
};
