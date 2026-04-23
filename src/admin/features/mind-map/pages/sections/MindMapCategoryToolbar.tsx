import { Toolbar } from "@mui/material";
import { SelectMulti } from "@shared/components/ui/SelectMulti";
import { Search } from "@shared/components/ui/Search";
import { STATUS_OPTIONS } from "../configs/constants";
import { toolbarStyles } from "../configs/styles.config";
import { ExportImport } from "@shared/components/ui/ExportImport";

interface MindMapCategoryToolbarProps {
    search: string;
    onSearchChange: (val: string) => void;
    status: string[];
    onStatusChange: (val: string[]) => void;
}

export const MindMapCategoryToolbar = ({ search, onSearchChange, status, onStatusChange }: MindMapCategoryToolbarProps) => {
    return (
        <Toolbar style={toolbarStyles.root}>
            <div className='flex gap-[calc(2*var(--spacing))] w-full'>
                <SelectMulti 
                    label="Trạng thái" 
                    options={STATUS_OPTIONS} 
                    value={status}
                    onChange={onStatusChange}
                />
                <div className="flex flex-1 items-center gap-[calc(2*var(--spacing))]">
                    <div className="flex-1">
                        <Search 
                            maxWidth="100%" 
                            placeholder="Tìm kiếm danh mục..."
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>
                    <ExportImport />
                </div>
            </div>
        </Toolbar>
    );
};
