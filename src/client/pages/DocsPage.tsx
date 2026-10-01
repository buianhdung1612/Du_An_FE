import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/docs.css';
import * as docApi from '../api/doc.api';

export default function DocsPage() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await docApi.getCategories();
                if (res.success) setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="docs-wrapper">
            {/* Hero Section */}
            <div className="hero-section-2 section position-relative">
                <div className="hero-item hero-item-2" style={{ backgroundImage: 'url(/client-assets/imgs/hero/hero-2.jpg)' }}>
                    <div className="container container-1370">
                        <div className="row align-items-center">
                            <div className="col-lg-12 col-md-12 col-12">
                                <div className="hero-slider-content-2">
                                    <h2 className="text-white">DỄ DÀNG HỌC NHỮNG GÌ BẠN CẦN</h2>
                                    <div className="hero-search-box">
                                        <form action="#" onSubmit={(e) => e.preventDefault()}>
                                            <input type="text" placeholder="Tìm kiếm tài liệu..." />
                                            <button className="docs-btn">Tìm kiếm</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Information Area */}
            <div className="all-information-area section pt-100 pb-80">
                <div className="container">
                    <div className="row row-20">
                        <div className="col-lg-9">
                            <div className="row row-25">
                                {categories.map((cat, idx) => (
                                    <div className="col-lg-6" key={idx}>
                                        <div className="single-information mb-50">
                                            <h4>
                                                <span className="icon-wrap">{cat.avatar || '📁'}</span> 
                                                {cat.name}
                                            </h4>
                                            <p className="text-muted mb-4">{cat.description}</p>
                                            <ul className="information">
                                                <li>
                                                    <Link to={`/docs/${cat.slug}`} className="view-more">
                                                        Xem tài liệu →
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <div className="col-12 text-center py-5">
                                        <p>Không tìm thấy tài liệu nào. Vui lòng thêm danh mục trong trang quản trị.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-3">
                            <div className="info-right-sidebar">
                                <div className="single-sidebar-widget mb-30">
                                    <h4>Danh mục</h4>
                                    <ul className="cat-list">
                                        {categories.map(c => (
                                            <li key={c._id}><Link to={`/docs/${c.slug}`}>{c.name}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="single-sidebar-widget mb-30">
                                    <div className="news-latter-box">
                                        <p>Để nhận được các cập nhật và tin tức mới nhất thường xuyên</p>
                                        <h4><span>Đăng ký</span> <br /> bản tin của chúng tôi</h4>
                                        <div className="subscribe-form-docs">
                                            <input type="email" placeholder="Nhập email của bạn" />
                                            <button className="docs-btn">Đăng ký</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
