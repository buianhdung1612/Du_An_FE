import { COLORS } from './constants';
import { SxProps, Theme } from '@mui/material';

// Toolbar
export const toolbarStyles = {
    root: {
        padding: '16px',
        paddingRight: "8px",
        gap: "calc(2 * var(--spacing))",
        display: 'flex',
        justifyContent: 'space-between',
        minHeight: 'auto',
    } as const,
};

// DataGrid Card
export const dataGridCardStyles = {
    background: COLORS.background,
    color: COLORS.primary,
    borderRadius: 'var(--shape-borderRadius-lg)',
    height: '640px',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: COLORS.shadow,
};

export const dataGridContainerStyles = {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden' as const,
};

export const dataGridStyles: SxProps<Theme> = {
    color: COLORS.primary,

    // HEADER
    '& .MuiDataGrid-columnHeaders': {
        borderRadius: "0", 
        position: 'relative',
        background: COLORS.backgroundLight,
        '& .MuiDataGrid-columnHeader': {
            color: COLORS.secondary,
            fontSize: "0.875rem",
            border: "none",
            borderBottom: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.backgroundLight
        },

        '& .MuiDataGrid-columnHeader--withRightBorder': {
            borderRight: `1px solid ${COLORS.border}`
        },
    },

    // Footer
    '& .MuiDataGrid-footerContainer': {
        borderTop: "1px dashed",
        borderColor: COLORS.border,
        minHeight: "auto",
        fontSize: "0.875rem",
        color: "inherit",
    },

    '& .MuiDataGrid-withBorderColor': {
        borderColor: COLORS.border
    },

    // CELL
    '& .MuiDataGrid-cell': {
        color: 'inherit',
        fontSize: "0.875rem",
        display: 'flex',
        alignItems: 'center',
        borderRightStyle: "dashed",
        borderColor: COLORS.border,
    },

    // TOOLBAR
    '& .MuiDataGrid-toolbarContainer': {
        color: 'inherit',
        background: COLORS.background,
        borderBottom: `none`,
    },

    '&.MuiDataGrid-root': {
        '--DataGrid-t-color-border-base': COLORS.border,
        overflow: 'auto',
    },

    borderWidth: "0"
};
