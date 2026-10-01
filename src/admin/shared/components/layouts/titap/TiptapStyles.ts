import { SxProps, Theme } from "@mui/material";

export const editorContainerStyles: SxProps<Theme> = {
    scrollbarWidth: "thin",
    scrollbarColor: "#919eab66",
    minHeight: "240px",
    maxHeight: "480px",
    display: "flex",
    flexDirection: "column",
    borderRadius: "8px",
    border: "1px solid #919eab33",
    overflow: "hidden",
};

export const editorHeadingStyles: SxProps<Theme> = {
    alignItems: "center",
    gap: "8px",
    padding: "10px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #919eab33",
    borderTopLeftRadius: "inherit",
    borderTopRightRadius: "inherit",
    flexDirection: "row"
};

export const tiptapContentStyles: SxProps<Theme> = {
    flex: "1 1 auto",
    overflowY: "auto",
    backgroundColor: "#919eab14",
    "& .is-editor-empty:first-of-type::before": {
        content: "attr(data-placeholder)",
        float: "left",
        color: "#919EAB",
        pointerEvents: "none",
        height: 0,
        fontStyle: "italic",
    },
    "& .tiptap.ProseMirror": {
        outline: "none",
        padding: "16px 16px 20px",
        minHeight: "100%",
        fontSize: "1rem",
        "& .ProseMirror-separator": { display: "none !important", opacity: 0 },
        "& img": {
            display: "block",
            width: "100%",
            height: "auto",
            my: "20px",
            borderRadius: "8px",
            transition: "all 0.2s",
        },
        "& img.ProseMirror-selectednode": { outline: "2px solid #00A76F" },
        "& p": { fontSize: "1rem", my: "10px", lineHeight: "1.5" },
        "& h1": { fontSize: "4rem", fontWeight: "800", mt: "20px", mb: "8px", lineHeight: "1.25" },
        "& h2": { fontSize: "3rem", fontWeight: "800", mt: "20px", mb: "8px", lineHeight: "1.33" },
        "& h3": { fontSize: "2rem", fontWeight: "700", mt: "14px", mb: "8px", lineHeight: "1.5" },
        "& h4": { fontSize: "1.5rem", fontWeight: "700", mt: "14px", mb: "8px", lineHeight: "1.5" },
        "& h5": { fontSize: "1.1875rem", fontWeight: "700", mt: "14px", mb: "8px", lineHeight: "1.5" },
        "& h6": { fontSize: "1.125rem", fontWeight: "600", mt: "14px", mb: "8px", lineHeight: "1.56" },
        "& a": { color: "#00A76F", textDecoration: "underline" },
        "& ul": { listStyleType: "disc", paddingLeft: "24px", my: "10px" },
        "& ol": { listStyleType: "decimal", paddingLeft: "24px", my: "10px" },
        "& li": { lineHeight: "1.6", mb: "4px" },
        "& table": {
            borderCollapse: "collapse",
            tableLayout: "fixed",
            width: "100%",
            margin: "12px 0",
            overflow: "hidden",
            "& td, & th": {
                minWidth: "1em",
                border: "1px solid #919eab4d",
                padding: "8px 10px",
                verticalAlign: "top",
                boxSizing: "border-box",
                position: "relative",
            },
            "& th": {
                fontWeight: "bold",
                textAlign: "left",
                backgroundColor: "#919eab14",
            },
            "& .selectedCell:after": {
                background: "rgba(0, 167, 111, 0.08)",
                content: '""',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                pointerEvents: "none",
                position: "absolute",
                zIndex: 2,
            },
            "& .column-resize-handle": {
                backgroundColor: "#00A76F",
                bottom: "-2px",
                position: "absolute",
                right: "-2px",
                pointerEvents: "none",
                top: 0,
                width: "4px",
            }
        },
    }
};
