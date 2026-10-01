import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabularyPromptStore } from '../stores/useVocabularyPromptStore';
import { BookOpen, X, Clock, BrainCircuit } from 'lucide-react';
import { toast } from 'react-toastify';

export const VocabularyPromptModal: React.FC = () => {
    const { isPromptOpen, closePrompt, recordPromptTime, lastPromptTime, openPrompt } = useVocabularyPromptStore();
    const navigate = useNavigate();

    // 2 hours in milliseconds
    const PROMPT_INTERVAL = 2 * 60 * 60 * 1000;

    useEffect(() => {
        // Check periodically (e.g. every minute)
        const checkInterval = setInterval(() => {
            const now = Date.now();
            if (!lastPromptTime || (now - lastPromptTime > PROMPT_INTERVAL)) {
                if (!isPromptOpen) {
                    openPrompt();
                    toast.info("Đã đến giờ ôn tập từ vựng!", {
                        icon: <BrainCircuit className="text-blue-500" />
                    });
                }
            }
        }, 60000);

        // Check immediately on mount
        const now = Date.now();
        if (!lastPromptTime || (now - lastPromptTime > PROMPT_INTERVAL)) {
            openPrompt();
        }

        return () => clearInterval(checkInterval);
    }, [lastPromptTime, isPromptOpen, openPrompt, PROMPT_INTERVAL]);

    const handleLearn = () => {
        recordPromptTime();
        closePrompt();
        // Redirect to learning page, passing a query indicating 30 words study
        navigate('/admin/vocabulary/study?limit=30');
    };

    const handleCancel = () => {
        recordPromptTime();
        closePrompt();
    };

    if (!isPromptOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-blue-600 p-6 flex flex-col items-center justify-center text-white relative">
                    <button 
                        onClick={handleCancel}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-center">Đến giờ ôn tập!</h2>
                </div>
                
                <div className="p-6">
                    <p className="text-gray-600 text-center mb-6 text-lg">
                        Bạn có <span className="font-bold text-blue-600">30 từ vựng</span> cần ôn tập để củng cố trí nhớ. Hãy dành vài phút để học ngay nhé!
                    </p>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleLearn}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            <BrainCircuit size={20} />
                            Học ngay (30 từ)
                        </button>
                        
                        <button 
                            onClick={handleCancel}
                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Clock size={18} />
                            Nhắc lại sau 2 tiếng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
