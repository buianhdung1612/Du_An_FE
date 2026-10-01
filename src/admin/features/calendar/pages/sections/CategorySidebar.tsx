import { useState } from 'react';
import {
    Box,
    Stack,
    Typography,
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useCalendarCategories, useDeleteCalendarCategory } from '../hooks/useCalendar';
import { toast } from 'react-toastify';
import { confirmDelete } from '@shared/utils/swal';

interface CategorySidebarProps {
    selectedCategories: string[];
    onCategoryToggle: (id: string) => void;
}



export const CategorySidebar = ({ selectedCategories, onCategoryToggle }: CategorySidebarProps) => {
    const { data: res } = useCalendarCategories();
    const categories = (res as any)?.data || [];

    const [openMenu, setOpenMenu] = useState(true);
    const deleteMutation = useDeleteCalendarCategory();

    const handleDelete = (id: string) => {
        confirmDelete("Xóa chủ đề này?", () => {
            deleteMutation.mutate(id, {
                onSuccess: () => toast.success('Đã xóa')
            });
        });
    };

    return (
        <Box sx={{ width: 280, p: 2, borderRight: '1px dashed rgba(145, 158, 171, 0.2)', height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Lịch của tôi</Typography>
                <IconButton size="small" onClick={() => setOpenMenu(!openMenu)}>
                    <Icon icon={openMenu ? "solar:alt-arrow-down-bold" : "solar:alt-arrow-right-bold"} />
                </IconButton>
            </Stack>

            <Collapse in={openMenu}>
                <List disablePadding>
                    {categories.map((cat: any) => (
                        <ListItem
                            key={cat._id}
                            disableGutters
                            sx={{
                                py: 0.5,
                                '&:hover .delete-btn': { opacity: 1 }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <Checkbox
                                    size="small"
                                    checked={selectedCategories.includes(cat._id)}
                                    onChange={() => onCategoryToggle(cat._id)}
                                    sx={{
                                        color: cat.color,
                                        '&.Mui-checked': { color: cat.color }
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={cat.name}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: 'text.primary' }}
                            />
                            <IconButton
                                className="delete-btn"
                                size="small"
                                color="error"
                                sx={{ opacity: 0, transition: '0.2s' }}
                                onClick={() => handleDelete(cat._id)}
                            >
                                <Icon icon="solar:trash-bin-trash-bold" width={16} />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </Collapse>

        </Box>
    );
};
