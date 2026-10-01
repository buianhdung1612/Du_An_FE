

export default function TrendingRecent() {
    return (
        <section className="trending pb-65 position-relative">
            <div className="container">
                <div className="header-title mb-65">
                    <h3 className="font-heading mb-0 wow fadeIn animated">Recent Articles</h3>
                    <span className="sub-header-title text-grey-400 wow fadeIn animated">Don't miss new trend</span>
                </div>
                <div className="row">
                    <article className="col-md-6 mb-40 wow fadeIn animated">
                        <div className="post-card-1 border-radius-10 hover-up">
                            <div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-1.jpg)" }}>
                                <a className="img-link" href="#"></a>
                                <div className="post-meta-1 mb-20">
                                    <a href="#" className="tag-category bg-brand-1 shadown-1 text-dark button-shadow hover-up-3">Lifestyle</a>
                                </div>
                            </div>
                            <div className="post-content p-30">
                                <div className="post-card-content">
                                    <div className="entry-meta meta-1 float-left font-md mb-10">
                                        <span className="post-on has-dot">27 August</span>
                                    </div>
                                    <h4 className="post-title mb-30">
                                        <a href="#">After a Few Dates, They Traveled to the Other Side of the World</a>
                                    </h4>
                                    <div className="post-meta-2 font-md d-flext">
                                        <a href="#" tabIndex={0}>
                                            <img src="/client-assets/imgs/authors/author.jpg" alt="flow" />
                                            <span className="author-namge">Kate Adie</span>
                                        </a>
                                        <span className="time-to-read has-dot">6 mins to read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                    <article className="col-md-6 mb-40 wow fadeIn animated">
                        <div className="post-card-1 border-radius-10 hover-up">
                            <div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-2.jpg)" }}>
                                <a className="img-link" href="#"></a>
                                <div className="post-meta-1 mb-20">
                                    <a href="#" className="tag-category bg-primary shadown-1 text-dark button-shadow hover-up-3">Healthy</a>
                                </div>
                            </div>
                            <div className="post-content p-30">
                                <div className="post-card-content">
                                    <div className="entry-meta meta-1 float-left font-md mb-10">
                                        <span className="post-on has-dot">28 August</span>
                                    </div>
                                    <h4 className="post-title mb-30">
                                        <a href="#">Jessamyn Stanley's 5-Minute Yoga for Beginners</a>
                                    </h4>
                                    <div className="post-meta-2 font-md d-flext">
                                        <a href="#" tabIndex={0}>
                                            <img src="/client-assets/imgs/authors/author-2.jpg" alt="flow" />
                                            <span className="author-namge">Kate Adie</span>
                                        </a>
                                        <span className="time-to-read has-dot">6 mins to read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                    <article className="col-md-6 mb-40 wow fadeIn animated">
                        <div className="post-card-1 border-radius-10 hover-up">
                            <div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-3.jpg)" }}>
                                <a className="img-link" href="#"></a>
                                <div className="post-meta-1 mb-20">
                                    <a href="#" className="tag-category bg-warning shadown-1 text-dark button-shadow hover-up-3">Food</a>
                                </div>
                            </div>
                            <div className="post-content p-30">
                                <div className="post-card-content">
                                    <div className="entry-meta meta-1 float-left font-md mb-10">
                                        <span className="post-on has-dot">02 September</span>
                                    </div>
                                    <h4 className="post-title mb-30">
                                        <a href="#">How an MS Diagnosis Changed My Relationship With Food</a>
                                    </h4>
                                    <div className="post-meta-2 font-md d-flext">
                                        <a href="#" tabIndex={0}>
                                            <img src="/client-assets/imgs/authors/author-3.jpg" alt="flow" />
                                            <span className="author-namge">Kate Adie</span>
                                        </a>
                                        <span className="time-to-read has-dot">6 mins to read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                    <article className="col-md-6 mb-40 wow fadeIn animated">
                        <div className="post-card-1 border-radius-10 hover-up">
                            <div className="post-thumb thumb-overlay img-hover-slide position-relative" style={{ backgroundImage: "url(/client-assets/imgs/news/news-4.jpg)" }}>
                                <a className="img-link" href="#"></a>
                                <div className="post-meta-1 mb-20">
                                    <a href="#" className="tag-category bg-success shadown-1 text-dark button-shadow hover-up-3">Travel Tips</a>
                                </div>
                            </div>
                            <div className="post-content p-30">
                                <div className="post-card-content">
                                    <div className="entry-meta meta-1 float-left font-md mb-10">
                                        <span className="post-on has-dot">05 September</span>
                                    </div>
                                    <h4 className="post-title mb-30">
                                        <a href="#">Where to Score the Best Travel Deals on Cyber Monday</a>
                                    </h4>
                                    <div className="post-meta-2 font-md d-flext">
                                        <a href="#" tabIndex={0}>
                                            <img src="/client-assets/imgs/authors/author-4.jpg" alt="flow" />
                                            <span className="author-namge">Kate Adie</span>
                                        </a>
                                        <span className="time-to-read has-dot">6 mins to read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
