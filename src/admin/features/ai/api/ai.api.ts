import { apiApp } from "@admin/shared/api/core";

export type AIActionType = 
    | 'improve' 
    | 'grammar' 
    | 'continue' 
    | 'translate' 
    | 'explain_code' 
    | 'summarize';

/**
 * Gọi API xử lý AI từ Backend (Logic đã được chuyển sang server để bảo mật)
 * Sử dụng apiApp (Axios) để tự động đính kèm Token từ AuthStore
 */
export const callGroqAI = async (content: string, action: AIActionType) => {
    try {
        const response = await apiApp.post('/api/v1/admin/ai/process', { 
            content, 
            action 
        });

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Lỗi xử lý AI");
        }
    } catch (error: any) {
        console.error("AI API Error:", error);
        // Trả về thông báo lỗi chi tiết từ server nếu có
        const message = error.response?.data?.message || error.message || "Lỗi xử lý AI";
        throw new Error(message);
    }
};
