

export default function FeaturedGrid() {
    return (
        <section className="featured-grid pt-65 pb-65">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="position-relative mb-md-30">
                            <div className="carausel-post-1 hover-up border-radius-10 overflow-hidden transition-normal position-relative wow .img-fadeIn animated">
                                <div className="slide-fade-2">
                                    <div className="position-relative post-thumb">
                                        <div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-13.jpg)" }}>
                                            <a className="img-link" href="#"></a>
                                            <span className="top-right-icon bg-white"><i className="elegant-icon icon_ribbon_alt "></i></span>
                                            <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                                                <div className="post-meta-1 mb-20">
                                                    <a href="#" className="tag-category bg-brand-1 shadown-1 text-dark button-shadow hover-up-3" tabIndex={0}>Lifestyle</a>
                                                    <span className="post-date text-white changeless font-md">September 15, 2025</span>
                                                </div>
                                                <h3 className="post-title">
                                                    <a className="text-white changeless" href="#"> 30 Best Lifestyle Blogs to Follow in 2025</a>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    {/* (To match exact behavior, in real react we would use a pure CSS or react-slick slider) */}
                                </div>
                            </div>
                            <div className="slide-fade-arrow-cover-2"></div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="row">
                            <article className="col-lg-6 mb-30 mb-md-30">
                                <div className="position-relative post-thumb border-radius-10 overflow-hidden hover-up-3">
                                    <div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-1.jpg)" }}>
                                        <a className="img-link" href="#"></a>
                                        <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                                            <div className="post-meta-1 mb-20">
                                                <a href="#" className="tag-category bg-primary shadown-1 text-dark button-shadow hover-up-3" tabIndex={0}>Fashion</a>
                                            </div>
                                            <h5 className="post-title">
                                                <a className="text-white changeless" href="#">Beachmaster Elephant Seal Fights</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </article>
                            <article className="col-lg-6 mb-md-30">
                                <div className="position-relative post-thumb border-radius-10 overflow-hidden hover-up-3">
                                    <div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-2.jpg)" }}>
                                        <a className="img-link" href="#"></a>
                                        <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                                            <div className="post-meta-1 mb-20">
                                                <a href="#" className="tag-category bg-success shadown-1 text-dark button-shadow hover-up-3" tabIndex={0}>Food</a>
                                            </div>
                                            <h5 className="post-title">
                                                <a className="text-white changeless" href="#">Why We Need to Stop Talking About Food</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </article>
                            <article className="col-lg-6 mb-md-30">
                                <div className="position-relative post-thumb border-radius-10 overflow-hidden hover-up-3">
                                    <div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-3.jpg)" }}>
                                        <a className="img-link" href="#"></a>
                                        <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                                            <div className="post-meta-1 mb-20">
                                                <a href="#" className="tag-category bg-warning shadown-1 text-dark button-shadow hover-up-3" tabIndex={0}>Health</a>
                                            </div>
                                            <h5 className="post-title">
                                                <a className="text-white changeless" href="#">12 Best Health Blogs to Follow in 2025</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </article>
                            <article className="col-lg-6">
                                <div className="position-relative post-thumb border-radius-10 overflow-hidden hover-up-3">
                                    <div className="thumb-overlay position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-4.jpg)" }}>
                                        <a className="img-link" href="#"></a>
                                        <div className="post-content-overlay text-white ml-30 mr-30 pb-30">
                                            <div className="post-meta-1 mb-20">
                                                <a href="#" className="tag-category bg-danger shadown-1 text-dark button-shadow hover-up-3" tabIndex={0}>Travel</a>
                                            </div>
                                            <h5 className="post-title">
                                                <a className="text-white changeless" href="#">Shaving My Head During Quarantine</a>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
