import { memo, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { HardBreakIcon, ClearFormatIcon } from "@assets/icons";
import { ButtonTiptap } from "./ButtonTiptap";
import { Highlighter, CheckSquare, Youtube } from "lucide-react";

interface UtilityButtonsProps {
    editor: Editor | null;
    state: {
        canHardBreak: boolean;
        canClearMarks: boolean;
    };
}

export const UtilityButtons = memo(
    ({ editor, state }: UtilityButtonsProps) => {
        
        const handleHardBreak = useCallback(() => {
            editor?.chain().focus().setHardBreak().run();
        }, [editor]);

        const handleClearMarks = useCallback(() => {
            editor
                ?.chain()
                .focus()
                .unsetAllMarks()
                .clearNodes()
                .run();
        }, [editor]);

        const handleToggleHighlight = useCallback(() => {
            editor?.chain().focus().toggleHighlight().run();
        }, [editor]);

        const handleToggleTaskList = useCallback(() => {
            editor?.chain().focus().toggleTaskList().run();
        }, [editor]);

        const handleInsertYoutube = useCallback(() => {
            const url = window.prompt('Nhập link YouTube URL');
            if (url) {
                editor?.chain().focus().setYoutubeVideo({ src: url }).run();
            }
        }, [editor]);

        if (!editor) return null;

        return (
            <div className="flex items-center gap-1">
                <ButtonTiptap
                    title={"Danh sách công việc"}
                    onClick={handleToggleTaskList}
                    active={editor.isActive('taskList')}
                >
                    <CheckSquare size={18} />
                </ButtonTiptap>

                <ButtonTiptap
                    title={"Tô sáng"}
                    onClick={handleToggleHighlight}
                    active={editor.isActive('highlight')}
                >
                    <Highlighter size={18} />
                </ButtonTiptap>

                <ButtonTiptap
                    title={"Chèn Video YouTube"}
                    onClick={handleInsertYoutube}
                >
                    <Youtube size={18} />
                </ButtonTiptap>

                <ButtonTiptap
                    title={"Xuống dòng cứng (Shift + Enter)"}
                    onClick={handleHardBreak}
                    disabled={!state.canHardBreak}
                >
                    <HardBreakIcon />
                </ButtonTiptap>

                <ButtonTiptap
                    title={"Xoá định dạng"}
                    onClick={handleClearMarks}
                    disabled={!state.canClearMarks}
                >
                    <ClearFormatIcon />
                </ButtonTiptap>
            </div>
        );
    }
);

UtilityButtons.displayName = "UtilityButtons";
