import { Toolbar, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Search } from "@shared/components/ui/Search";
import { toolbarStyles } from "../configs/styles.config";

interface DocArticleToolbarProps {
    search: string;
    onSearchChange: (val: string) => void;
    categories: any[];
    selectedCategory: string;
    onCategoryChange: (val: string) => void;
}

export const DocArticleToolbar = ({ 
    search, onSearchChange, categories, selectedCategory, onCategoryChange 
}: DocArticleToolbarProps) => {
    return (
        <Toolbar style={toolbarStyles.root}>
            <Box sx={{ display: 'flex', gap: 2, width: '100%', alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Lọc theo danh mục</InputLabel>
                    <Select 
                        value={selectedCategory} 
                        label="Lọc theo danh mục" 
                        onChange={(e) => onCategoryChange(e.target.value)}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Box sx={{ flex: 1 }}>
                    <Search 
                        maxWidth="100%" 
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Tìm kiếm bài viết..."
                    />
                </Box>
            </Box>
        </Toolbar>
    );
};
