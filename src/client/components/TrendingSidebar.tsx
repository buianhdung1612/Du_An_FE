

export default function TrendingSidebar() {
    return (
        <div className="widget-area">
            <div className="sidebar-widget widget-latest-posts mb-50 wow fadeIn animated">
                <div className="widget-header-1 position-relative mb-30">
                    <h5 className="mt-5 mb-30 font-heading">Most popular</h5>
                </div>
                <div className="post-block-list post-module-1">
                    <ul className="list-post">
                        <li className="wow fadeIn animated">
                            <div className="d-flex latest-small-thumb">
                                <div className="post-thumb d-flex mr-15 border-radius-10 img-hover-scale overflow-hidden">
                                    <a className="color-white" href="#" tabIndex={0}>
                                        <img src="/client-assets/imgs/news/thumb-11.jpg" alt="flow" />
                                    </a>
                                </div>
                                <div className="post-content media-body align-self-center">
                                    <h5 className="post-title mb-15 text-limit-3-row font-medium">
                                        <a href="#" tabIndex={0}>9 Things I Love About Shaving My Head During Quarantine</a>
                                    </h5>
                                    <div className="entry-meta meta-1 float-left font-sm">
                                        <span className="post-on has-dot">September 15, 2025</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="wow fadeIn animated">
                            <div className="d-flex latest-small-thumb">
                                <div className="post-thumb d-flex mr-15 border-radius-10 img-hover-scale overflow-hidden">
                                    <a className="color-white" href="#" tabIndex={0}>
                                        <img src="/client-assets/imgs/news/thumb-12.jpg" alt="flow" />
                                    </a>
                                </div>
                                <div className="post-content media-body align-self-center">
                                    <h5 className="post-title mb-15 text-limit-3-row font-medium">
                                        <a href="#" tabIndex={0}>Where to Score the Best Travel Deals on Cyber Monday</a>
                                    </h5>
                                    <div className="entry-meta meta-1 float-left font-sm">
                                        <span className="post-on has-dot">November 12, 2025</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="wow fadeIn animated">
                            <div className="d-flex latest-small-thumb">
                                <div className="post-thumb d-flex mr-15 border-radius-10 img-hover-scale overflow-hidden">
                                    <a className="color-white" href="#" tabIndex={0}>
                                        <img src="/client-assets/imgs/news/thumb-13.jpg" alt="flow" />
                                    </a>
                                </div>
                                <div className="post-content media-body align-self-center">
                                    <h5 className="post-title mb-15 text-limit-3-row font-medium">
                                        <a href="#" tabIndex={0}>5 Kinds of Food-Shamers You Will Encounter (and How to Deal)</a>
                                    </h5>
                                    <div className="entry-meta meta-1 float-left font-sm">
                                        <span className="post-on has-dot">April 10, 2025</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="wow fadeIn animated">
                            <div className="d-flex latest-small-thumb">
                                <div className="post-thumb d-flex mr-15 border-radius-10 img-hover-scale overflow-hidden">
                                    <a className="color-white" href="#" tabIndex={0}>
                                        <img src="/client-assets/imgs/news/thumb-4.jpg" alt="flow" />
                                    </a>
                                </div>
                                <div className="post-content media-body align-self-center">
                                    <h5 className="post-title mb-15 text-limit-3-row font-medium">
                                        <a href="#" tabIndex={0}>12 Best Books to Read at the Beach (or Anywhere) This Summer</a>
                                    </h5>
                                    <div className="entry-meta meta-1 float-left font-sm">
                                        <span className="post-on has-dot">June 15, 2025</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="sidebar-widget widget_instagram wow fadeIn animated">
                <div className="widget-header-1 position-relative mb-30">
                    <h5 className="mt-5 mb-30 font-heading">Gallery</h5>
                </div>
                <div className="instagram-gellay">
                    <ul className="insta-feed">
                        <li>
                            <a href="#" className="play-video"><img className="border-radius-10" src="/client-assets/imgs/news/thumb-1.jpg" alt="flow" /></a>
                        </li>
                        <li>
                            <a href="#" className="play-video"><img className="border-radius-10" src="/client-assets/imgs/news/thumb-2.jpg" alt="flow" /></a>
                        </li>
                        <li>
                            <a href="#" className="play-video"><img className="border-radius-10" src="/client-assets/imgs/news/thumb-3.jpg" alt="flow" /></a>
                        </li>
                        <li>
                            <a href="#" className="play-video"><img className="border-radius-10" src="/client-assets/imgs/news/thumb-4.jpg" alt="flow" /></a>
                        </li>
                        <li>
                            <a href="#" className="play-video"><img className="border-radius-10" src="/client-assets/imgs/news/thumb-5.jpg" alt="flow" /></a>
                        </li>
                        <li>
                            <a href="#" className="play-video"><img className="border-radius-10" src="/client-assets/imgs/news/thumb-6.jpg" alt="flow" /></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
