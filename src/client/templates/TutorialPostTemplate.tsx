import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function TutorialPostTemplate({ data }: { data: any }) {
    return (
        <main className="bg-white tutorial-page-wrapper" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}>
            <style>{`
                /* CSS Reset & GitBook Typography strictly overriding Flow Template */
                .tutorial-page-wrapper h1, .tutorial-page-wrapper h2, .tutorial-page-wrapper h3, .tutorial-page-wrapper p, .tutorial-page-wrapper ul, .tutorial-page-wrapper li {
                    font-family: inherit;
                    letter-spacing: normal;
                }
                .gitbook-content h1 { font-size: 32px !important; font-weight: 700 !important; margin-bottom: 24px !important; margin-top: 0 !important; line-height: 1.2 !important; color: #111 !important; }
                .gitbook-content h2 { font-size: 24px !important; font-weight: 600 !important; margin-top: 40px !important; margin-bottom: 16px !important; border-bottom: 1px solid #e1e4e8; padding-bottom: 8px; color: #111 !important; line-height: 1.25 !important; }
                .gitbook-content h3 { font-size: 18px !important; font-weight: 600 !important; margin-top: 24px !important; margin-bottom: 16px !important; color: #111 !important; line-height: 1.25 !important; }
                .gitbook-content p { font-size: 15px !important; line-height: 1.6 !important; margin-bottom: 16px !important; margin-top: 0 !important; color: #3b454e !important; }
                .gitbook-content ul { list-style-type: disc !important; padding-left: 20px !important; margin-bottom: 16px !important; margin-top: 0 !important; }
                .gitbook-content li { margin-bottom: 4px !important; display: list-item !important; color: #3b454e !important; font-size: 15px !important; line-height: 1.6 !important;}
                .gitbook-content a { color: #3b82f6 !important; text-decoration: none !important; }
                .gitbook-content a:hover { text-decoration: underline !important; }
                .gitbook-content pre { margin-bottom: 16px !important; border-radius: 6px !important; font-size: 13px !important;}
                .gitbook-content hr { border: 0; border-bottom: 1px solid #eaecef; margin: 24px 0 !important; }
            `}</style>

            <div className="flex w-full mx-auto relative justify-between max-w-[1400px]">

                {/* Left Sidebar: Chapters (GitBook Style) */}
                <aside className="hidden lg:block w-[260px] flex-shrink-0 border-r border-[#e6e8eb]">
                    <div className="sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto py-8 pl-6 pr-4">
                        <nav className="flex flex-col space-y-[2px] text-[14px]">
                            <a href="#" className="font-semibold text-blue-600 uppercase tracking-widest text-xs mb-2">README</a>
                            <a href="#" className="hover:text-blue-600 text-[#5c6975] hover:bg-gray-50 px-2 py-1.5 -mx-2 rounded block transition-colors">Getting Started</a>
                            <a href="#" className="hover:text-blue-600 text-[#5c6975] hover:bg-gray-50 px-2 py-1.5 -mx-2 rounded block transition-colors">JavaScript</a>
                            <a href="#" className="hover:text-blue-600 text-[#5c6975] hover:bg-gray-50 px-2 py-1.5 -mx-2 rounded block transition-colors">Future JavaScript Now</a>
                            <a href="#" className="hover:text-blue-600 text-[#5c6975] hover:bg-gray-50 px-2 py-1.5 -mx-2 rounded block transition-colors">Project</a>
                            <a href="#" className="hover:text-blue-600 text-[#5c6975] hover:bg-gray-50 px-2 py-1.5 -mx-2 rounded block transition-colors">Node.js QuickStart</a>
                            <a href="#" className="hover:text-blue-600 text-[#5c6975] hover:bg-gray-50 px-2 py-1.5 -mx-2 rounded block transition-colors">Browser QuickStart</a>
                        </nav>
                    </div>
                </aside>

                {/* Main Content: Markdown Prose */}
                <div className="flex-1 min-w-0 px-8 sm:px-12 lg:px-20 py-10 pb-32 max-w-[850px] mx-auto">
                    <article className="gitbook-content w-full">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                            <h1 className="!mb-0">{data.title}</h1>
                        </div>
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            remarkPlugins={[remarkGfm]}
                        >
                            {data.content}
                        </ReactMarkdown>
                    </article>
                </div>

                {/* Right Sidebar: On This Page */}
                <aside className="hidden xl:block w-[240px] flex-shrink-0">
                    <div className="sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto py-10 pl-4 pr-6">
                        <div className="font-semibold text-[#5c6975] mb-4 uppercase tracking-wide text-[11px] flex items-center">
                            <svg className="w-3.5 h-3.5 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                            ON THIS PAGE
                        </div>
                        <nav className="flex flex-col space-y-[8px] text-[13px]">
                            <a href="#" className="block text-[#3b82f6] hover:text-blue-700 transition-colors">TypeScript Deep Dive</a>
                            <a href="#" className="block text-[#5c6975] hover:text-gray-900 transition-colors">Reviews</a>
                            <a href="#" className="block text-[#5c6975] hover:text-gray-900 transition-colors">Get Started</a>
                            <a href="#" className="block text-[#5c6975] hover:text-gray-900 transition-colors">Translations</a>
                            <a href="#" className="block text-[#5c6975] hover:text-gray-900 transition-colors">Other Options</a>
                            <a href="#" className="block text-[#5c6975] hover:text-gray-900 transition-colors">Special Thanks</a>
                            <a href="#" className="block text-[#5c6975] hover:text-gray-900 transition-colors">Share</a>
                        </nav>
                    </div>
                </aside>

            </div>
        </main>
    );
}
