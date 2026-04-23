import { Toolbar } from "@mui/material";
import { useMemo, type Dispatch, type SetStateAction } from "react";

import { IGridSettings } from "../configs/types";
import { SelectMulti } from "@shared/components/ui/SelectMulti";
import { Search } from "@shared/components/ui/Search";
import { Columns } from "@shared/components/ui/Columns";
import { Filter } from "@shared/components/ui/Filter";
import { ExportButton } from "@shared/components/ui/ExportButton";
import { SettingsList } from "@shared/components/ui/SettingsList";
import { toolbarStyles } from "../configs/styles.config";

interface ToolbarProps {
    settings: IGridSettings;
    onSettingsChange: Dispatch<SetStateAction<IGridSettings>>;
    filters: {
        status?: string[];
        stock?: string[];
        search?: string;
    };
    onStatusChange: (status: string[]) => void;
    onStockChange: (stock: string[]) => void;
    onSearchChange: (search: string) => void;
}

export const ProductToolbar = ({
    settings,
    onSettingsChange,
    filters,
    onStatusChange,
    onStockChange,
    onSearchChange,
}: ToolbarProps) => {

    const statusOptions = useMemo(() => [
        { value: 'active', label: "Hoạt động" },
        { value: 'inactive', label: "Tạm dừng" },
        { value: 'draft', label: "Bản nháp" }
    ], []);


    const stockOptions = useMemo(() => [
        { value: 'instock', label: "Còn hàng" },
        { value: 'lowstock', label: "Sắp hết hàng" },
        { value: 'outofstock', label: "Hết hàng" }
    ], []);


    return (
        <Toolbar style={toolbarStyles.root}>
            <div className='flex gap-[calc(2*var(--spacing))] items-stretch'>
                <SelectMulti
                    label={"Trạng thái"}
                    options={statusOptions}
                    value={filters.status || []}
                    onChange={onStatusChange}
                />
                <SelectMulti
                    label={"Tình trạng kho"}
                    options={stockOptions}
                    value={filters.stock || []}
                    onChange={onStockChange}
                />
                <Search
                    value={filters.search || ''}
                    onChange={onSearchChange}
                />
            </div>
            <div>
                <Columns />
                <Filter />
                <ExportButton />
                <SettingsList
                    settings={settings}
                    onSettingsChange={onSettingsChange}
                />
            </div>
        </Toolbar>
    );
};





