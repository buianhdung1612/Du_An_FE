import TrendingSidebar from '../components/TrendingSidebar';
import Newsletter from '../components/Newsletter';

export default function StandardPostTemplate({ data }: { data: any }) {
    return (
        <main>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="container single-content">
                            <div className="entry-header entry-header-style-1 mb-50 pt-65">
                                <div className="post-meta-1 mb-20">
                                    <span className="tag-category bg-brand-1 shadown-1 text-dark button-shadow hover-up-3">Lifestyle</span>
                                    <span className="post-date text-muted font-md">September 15, 2025</span>
                                </div>
                                <h1 className="entry-title mb-50 fw-700">
                                    {data.title}
                                </h1>
                                <div className="row align-self-center">
                                    <div className="col-md-6">
                                        <div className="post-meta-2 font-md d-flext align-self-center mb-md-30">
                                            <a href="#">
                                                <img src="/client-assets/imgs/authors/author.jpg" alt="flow" />
                                                <span className="author-namge">Kate Adie</span>
                                            </a>
                                            <span className="time-to-read has-dot">6 mins to read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <figure className="image mb-30 m-auto text-center border-radius-10 hover-up-3">
                                <img className="border-radius-10" width="100%" src="/client-assets/imgs/news/news-16.jpg" alt="post-title" />
                            </figure>

                            <article className="entry-wraper mb-50">
                                <div
                                    className="entry-main-content wow fadeIn animated"
                                    dangerouslySetInnerHTML={{ __html: data.content }}
                                />

                                <div className="entry-bottom mt-50 mb-30 wow fadeIn animated">
                                    <div className="tags w-50 w-sm-100">
                                        <h5 className="mb-15">Tags: </h5>
                                        <a href="#" rel="tag" className="hover-up-3">deer</a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>

                    <div className="col-lg-4 primary-sidebar sticky top-16 h-fit bg-white">
                        <TrendingSidebar />
                    </div>
                </div>
            </div>

            <Newsletter />
        </main>
    );
}
