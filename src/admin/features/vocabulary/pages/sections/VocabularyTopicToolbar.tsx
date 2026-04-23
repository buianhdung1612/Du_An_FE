import { Toolbar } from "@mui/material";
import { Search } from "@shared/components/ui/Search";
import { toolbarStyles } from "../configs/styles.config";

interface VocabularyTopicToolbarProps {
    search: string;
    onSearchChange: (val: string) => void;
}

export const VocabularyTopicToolbar = ({ search, onSearchChange }: VocabularyTopicToolbarProps) => {
    return (
        <Toolbar style={toolbarStyles.root}>
            <div className='flex gap-[calc(2*var(--spacing))] w-full'>
                <div className="flex flex-1 items-center gap-[calc(2*var(--spacing))]">
                    <div className="flex-1">
                        <Search 
                            maxWidth="100%" 
                            placeholder="Tìm kiếm chủ đề..."
                            value={search}
                            onChange={onSearchChange}
                        />
                    </div>
                </div>
            </div>
        </Toolbar>
    );
};
