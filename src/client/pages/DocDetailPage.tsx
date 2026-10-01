import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/docs.css';
import * as docApi from '../api/doc.api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

export default function DocDetailPage() {
    const { categorySlug, articleSlug } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [sidebarData, setSidebarData] = useState<any>({ category: null, articles: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (articleSlug) {
                    // Fetch specific article
                    const artRes = await docApi.getArticleDetail(articleSlug);
                    if (artRes.success) {
                        setArticle(artRes.data);
                        // Also fetch siblings for sidebar if not already loaded
                        const catRes = await docApi.getArticlesByCategory(artRes.data.docCategoryId.slug);
                        if (catRes.success) setSidebarData(catRes.data);
                    }
                } else if (categorySlug) {
                    // Fetch category and its first article
                    const catRes = await docApi.getArticlesByCategory(categorySlug);
                    if (catRes.success) {
                        setSidebarData(catRes.data);
                        if (catRes.data.articles.length > 0) {
                            // Fetch content of the first article
                            const firstArt = catRes.data.articles[0];
                            const artRes = await docApi.getArticleDetail(firstArt.slug);
                            if (artRes.success) setArticle(artRes.data);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching doc details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categorySlug, articleSlug]);

    if (loading) return <div className="p-5 text-center">Đang tải tài liệu...</div>;

    if (!article && !sidebarData.category) return <div className="p-5 text-center">Không tìm thấy tài liệu.</div>;

    return (
        <div className="docs-wrapper">
            {/* Documentation Content Area */}
            <div className="documentation-layout-area section pt-50 pb-100">
                <div className="container container-1370">
                    <div className="row no-gutters shadow-lg rounded overflow-hidden border">
                        {/* Sidebar */}
                        <div className="col-12 col-lg-3 grey-bg p-4 sticky-sidebar border-right">
                            <div className="sidebar-area">
                                <h4 className="mb-4 text-teal">{sidebarData.category?.name}</h4>
                                <ul className="side-nav">
                                    <li className="has-sub open">
                                        <ul className="side-sub-nav ml-0 pl-0">
                                            {sidebarData.articles.map((art: any) => (
                                                <li key={art._id}>
                                                    <Link 
                                                        to={`/docs/article/${art.slug}`} 
                                                        className={article?.slug === art.slug ? "active font-weight-bold" : ""}
                                                    >
                                                        {art.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                                <div className="mt-5">
                                    <Link to="/docs" className="text-muted small">← Quay lại trang Docs</Link>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-12 col-lg-9 bg-white p-5">
                            <div className="main-content">
                                {article ? (
                                    <>
                                        <div className="single-content-section mb-5">
                                            <h2 className="mb-4">{article.title}</h2>
                                            <div className="markdown-content prose max-w-none">
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]} 
                                                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                                                >
                                                    {article.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-5">
                                        <h3>Không tìm thấy bài viết nào cho danh mục này.</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
