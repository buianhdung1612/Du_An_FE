import { useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { toast } from "react-toastify";
import { callGroqAI, AIActionType } from "@admin/features/ai/api/ai.api";

export const useAIAssistant = (editor: Editor | null) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAIAction = useCallback(async (action: AIActionType) => {
        if (!editor || isLoading) return;

        // Ưu tiên lấy văn bản được chọn, nếu không có thì lấy toàn nội dung
        const { from, to, empty } = editor.state.selection;
        const selectedText = empty 
            ? editor.getHTML() 
            : editor.state.doc.textBetween(from, to, " ");
        
        if (!selectedText || selectedText === '<p></p>') {
            toast.warn("Vui lòng nhập lời nhắc hoặc chọn văn bản để AI xử lý!");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("AI đang xử lý...");

        try {
            const result = await callGroqAI(selectedText, action);
            
            if (result) {
                if (!empty) {
                    // Thay thế vùng chọn bằng nội dung AI trả về
                    editor.chain().focus().insertContent(result).run();
                } else {
                    // Nếu không chọn gì, thêm nội dung vào cuối hoặc thay thế toàn bộ (tùy hành động)
                    if (action === 'continue') {
                        editor.chain().focus().insertContent(result).run();
                    } else {
                        editor.chain().focus().setContent(result).run();
                    }
                }
                toast.update(toastId, { 
                    render: "Đã xử lý xong!", 
                    type: "success", 
                    isLoading: false, 
                    autoClose: 2000 
                });
            }
        } catch (error) {
            console.error("AI Assistant Error:", error);
            toast.update(toastId, { 
                render: "Có lỗi xảy ra khi gọi AI!", 
                type: "error", 
                isLoading: false, 
                autoClose: 3000 
            });
        } finally {
            setIsLoading(false);
        }
    }, [editor, isLoading]);

    return {
        isLoading,
        handleAIAction
    };
};
