import { memo } from "react";
import { Editor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikeIcon } from "@assets/icons";
import { ButtonTiptap } from "./ButtonTiptap";
import { Subscript as SubscriptIcon, Superscript as SuperscriptIcon } from "lucide-react";

interface BasicFormattingProps {
    editor: Editor | null;
    state: {
        isBold: boolean;
        isItalic: boolean;
        isUnderline: boolean;
        isStrike: boolean;
        isSubscript?: boolean;
        isSuperscript?: boolean;
    };
}

export const FormatButtons = memo(({ editor, state }: BasicFormattingProps) => {
    
    if (!editor) return null;

    const FORMAT_BUTTONS = [
        {
            key: "bold",
            title: "In đậm (Ctrl + B)",
            icon: <BoldIcon />,
            action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
            active: editor.isActive('bold'),
        },
        {
            key: "italic",
            title: "In nghiêng (Ctrl + I)",
            icon: <ItalicIcon />,
            action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive('italic'),
        },
        {
            key: "underline",
            title: "Gạch chân (Ctrl + U)",
            icon: <UnderlineIcon />,
            action: (editor: Editor) => editor.chain().focus().toggleUnderline().run(),
            active: editor.isActive('underline'),
        },
        {
            key: "strike",
            title: "Gạch ngang",
            icon: <StrikeIcon />,
            action: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
            active: editor.isActive('strike'),
        },
        {
            key: "subscript",
            title: "Chỉ số dưới",
            icon: <SubscriptIcon size={18} />,
            action: (editor: Editor) => editor.chain().focus().toggleSubscript().run(),
            active: editor.isActive('subscript'),
        },
        {
            key: "superscript",
            title: "Chỉ số trên",
            icon: <SuperscriptIcon size={18} />,
            action: (editor: Editor) => editor.chain().focus().toggleSuperscript().run(),
            active: editor.isActive('superscript'),
        },
    ];

    return (
        <div className="flex items-center gap-1">
            {FORMAT_BUTTONS.map(btn => (
                <ButtonTiptap
                    key={btn.key}
                    title={btn.title}
                    active={btn.active}
                    onClick={() => btn.action(editor)}
                >
                    {btn.icon}
                </ButtonTiptap>
            ))}
        </div>
    );
});
