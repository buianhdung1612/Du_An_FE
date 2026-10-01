import { Stack, Box, Divider, IconButton, Tooltip, Paper } from "@mui/material"
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import { memo, useEffect, useState, useCallback, useRef } from "react";
import { ImageInsertButton } from "./sections/ImageInsertButton";
import { LinkButtons } from "./sections/LinkButtons";
import { Heading } from "./sections/Heading";
import { AlignmentButtons } from "./sections/AlignmentButtons"
import { FormatButtons } from "./sections/FormatButtons"
import { UtilityButtons } from "./sections/UtilityButtons"
import { editorContainerStyles, tiptapContentStyles, editorHeadingStyles } from "./TiptapStyles"
import { getExtensions } from "./TiptapExtensions";
import { FullscreenControl } from "./sections/FullscreenControl";
import { AIButtons } from "./sections/AIButtons";
import { TableButtons } from "./sections/TableButtons";
import { ColorButtons } from "./sections/ColorButtons";
import {
    Wand2, Type, Sparkles, Bold, Italic, Link as LinkIcon, Link2Off, Eraser,
    Heading1, Heading2, List, ListOrdered, Quote
} from "lucide-react";
import { useAIAssistant } from "./hooks/useAIAssistant";

const VerticalDivider = memo(() => (
    <Divider sx={{
        borderWidth: "0px thin 0px 0px",
        borderColor: "#919eab33",
        height: "16px"
    }} />
));
VerticalDivider.displayName = 'VerticalDivider';

interface TiptapProps {
    value?: string;
    onChange?: (content: string) => void;
}

export const Tiptap = memo(({ value = '', onChange }: TiptapProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const emitChange = useCallback((html: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            onChange?.(html);
        }, 300);
    }, [onChange]);

    const editor = useEditor({
        extensions: getExtensions("Nhấn '/' để chèn nhanh, hoặc bắt đầu viết..."),
        content: value,
        immediatelyRender: true,
        shouldRerenderOnTransaction: false,
        onUpdate: ({ editor }) => {
            emitChange(editor.getHTML());
        },
    });

    const formatState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            underline: editor.isActive("underline"),
            strike: editor.isActive("strike"),
        }),
    });

    const alignState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            left: editor.isActive({ textAlign: "left" }),
            center: editor.isActive({ textAlign: "center" }),
            right: editor.isActive({ textAlign: "right" }),
            justify: editor.isActive({ textAlign: "justify" }),
        }),
    });

    const linkActive = useEditorState({
        editor,
        selector: ({ editor }) => editor.isActive("link"),
    });

    const utilityState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            canHardBreak: editor.can().setHardBreak(),
            canClearMarks:
                editor.can().unsetAllMarks() ||
                editor.can().clearNodes(),
        }),
    });

    const toggleFullscreen = useCallback(() => setIsFullscreen(!isFullscreen), [isFullscreen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen]);

    // Prevent cycle: value -> useEffect -> setContent -> onUpdate -> onChange -> value
    useEffect(() => {
        if (!editor) return;

        const currentHtml = editor.getHTML();
        if (value !== currentHtml) {
            // Only update if the editor is NOT focused OR the content is significantly different 
            // from what the editor currently has (to allow external resets/AI fills)
            if (!editor.isFocused || Math.abs(value.length - currentHtml.length) > 10) {
                const { from, to } = editor.state.selection;
                editor.commands.setContent(value || "", { emitUpdate: false });

                // Try to restore cursor position if it was focused
                if (editor.isFocused) {
                    try {
                        editor.commands.setTextSelection({ from, to });
                    } catch (e) {
                        // Ignore
                    }
                }
            }
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <Stack gap="12px" sx={{ backgroundColor: isFullscreen ? "#1c252e7a" : "#fff" }}>
            {isFullscreen && (
                <Box
                    onClick={toggleFullscreen}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(28, 37, 46, 0.48)',
                        zIndex: 9998,
                        backdropFilter: 'blur(4px)',
                    }}
                />
            )}
            <Box
                sx={{
                    ...editorContainerStyles,
                    ...(isFullscreen && {
                        position: 'fixed',
                        top: "16px",
                        left: "16px",
                        width: 'calc(100vw - 32px)',
                        height: 'calc(100vh - 32px)',
                        maxHeight: 'none',
                        zIndex: 9999,
                        bgcolor: '#fff',
                        borderRadius: '8px',
                    }),
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <Stack sx={editorHeadingStyles}>
                    <Heading editor={editor} />
                    <VerticalDivider />
                    <FormatButtons
                        editor={editor}
                        state={{
                            isBold: formatState.bold,
                            isItalic: formatState.italic,
                            isUnderline: formatState.underline,
                            isStrike: formatState.strike,
                        }}
                    />
                    <VerticalDivider />
                    <ColorButtons editor={editor} />
                    <VerticalDivider />
                    <AlignmentButtons
                        editor={editor}
                        state={{
                            isLeft: alignState.left,
                            isCenter: alignState.center,
                            isRight: alignState.right,
                            isJustify: alignState.justify,
                        }}
                    />
                    <VerticalDivider />
                    <div className="flex items-center gap-1">
                        <LinkButtons editor={editor} active={linkActive} />
                        <ImageInsertButton editor={editor} />
                        <TableButtons editor={editor} />
                    </div>
                    <VerticalDivider />
                    <UtilityButtons
                        editor={editor}
                        state={utilityState}
                    />
                    <VerticalDivider />
                    <AIButtons editor={editor} />
                    <VerticalDivider />
                    <FullscreenControl isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
                </Stack>

                <Box sx={tiptapContentStyles}>
                    {/* BUBBLE MENU */}
                    <BubbleMenu editor={editor}>
                        <Paper elevation={8} sx={{ display: 'flex', gap: 0.5, p: 0.5, borderRadius: '12px', border: '1px solid var(--palette-divider)' }}>
                            <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
                                <Bold size={16} />
                            </IconButton>
                            <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
                                <Italic size={16} />
                            </IconButton>
                            <ColorButtons editor={editor} />
                            <IconButton 
                                size="small" 
                                onClick={() => {
                                    const url = window.prompt('URL', editor.getAttributes('link').href || '');
                                    if (url !== null) {
                                        if (url === '') {
                                            editor.chain().focus().extendMarkRange('link').unsetLink().run();
                                        } else {
                                            editor.chain().focus().setLink({ href: url }).run();
                                        }
                                    }
                                }} 
                                color={editor.isActive('link') ? 'primary' : 'default'}
                            >
                                <LinkIcon size={16} />
                            </IconButton>
                            {editor.isActive('link') && (
                                <IconButton 
                                    size="small" 
                                    onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
                                    color="error"
                                >
                                    <Link2Off size={16} />
                                </IconButton>
                            )}
                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                            <IconButton 
                                size="small" 
                                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                                title="Xóa định dạng"
                            >
                                <Eraser size={16} />
                            </IconButton>
                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                            <AIBubbleContent editor={editor} />
                        </Paper>
                    </BubbleMenu>

                    {/* FLOATING MENU */}
                    <FloatingMenu editor={editor}>
                        <Paper elevation={8} sx={{ display: 'flex', gap: 1, p: 0.75, borderRadius: '16px', border: '1px solid var(--palette-divider)' }}>
                            <Tooltip title="Tiêu đề 1">
                                <IconButton size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                                    <Heading1 size={18} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Tiêu đề 2">
                                <IconButton size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                                    <Heading2 size={18} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Danh sách">
                                <IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                                    <List size={18} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Danh sách số">
                                <IconButton size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                                    <ListOrdered size={18} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Trích dẫn">
                                <IconButton size="small" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                                    <Quote size={18} />
                                </IconButton>
                            </Tooltip>
                        </Paper>
                    </FloatingMenu>

                    <EditorContent
                        style={{ height: "100%", outline: 'none' }}
                        spellCheck="false"
                        autoCapitalize="off"
                        autoComplete="off"
                        editor={editor}
                    />
                </Box>
            </Box>
        </Stack >
    );
});

const AIBubbleContent = ({ editor }: { editor: any }) => {
    const { handleAIAction } = useAIAssistant(editor);

    return (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Cải thiện văn bản (AI)">
                <IconButton size="small" onClick={() => handleAIAction('improve')} sx={{ color: '#00A76F' }}>
                    <Wand2 size={16} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Sửa lỗi ngữ pháp (AI)">
                <IconButton size="small" onClick={() => handleAIAction('grammar')} sx={{ color: '#00A76F' }}>
                    <Type size={16} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Viết tiếp (AI)">
                <IconButton size="small" onClick={() => handleAIAction('continue')} sx={{ color: '#00A76F' }}>
                    <Sparkles size={16} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};
