import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

export default function EditorsPicked() {
    const sliderRef = useRef<Slider>(null);

    const settings = {
        infinite: true,
        dots: false,
        arrows: false,
        autoplay: false,
        autoplaySpeed: 3000,
        fade: true,
        fadeSpeed: 1500,
    };

    return (
        <section className="pb-65">
            <div className="container">
                <h3 className="mb-65 font-heading wow fadeIn animated">Editor's picked</h3>
                <div className="position-relative wow fadeIn animated mb-65">
                    <div className="slide-fade-inner bg-brand-4 border-radius-10 p-65 p-sm-25">
                        <Slider ref={sliderRef} className="slide-fade" {...settings}>
                            <div className="slide-fade-item">
                                <div className="row">
                                    <div className="col-lg-6 col-md-12">
                                        <div className="post-meta-1 mb-20 mt-50">
                                            <a href="#" className="tag-category bg-brand-1 shadown-1 text-dark button-shadow hover-up-3">Lifestyle</a>
                                            <span className="post-date text-muted font-md">September 15, 2025</span>
                                        </div>
                                        <h2 className="post-title mb-30 fw-700">
                                            <a href="#">The 28 Best Skincare Products of 2025</a>
                                        </h2>
                                        <div className="post-excerpt text-grey-400 mb-30">
                                            Tempus ultricies augue luctus et ut suscipit. Morbi arcu, ultrices purus dolor erat bibendum sapien metus. Sit mi, pharetra, morbi arcu id. Pellentesque dapibus nibh augue senectus. Ad pri docendi aliquando, per an minim novum fuisset, eam doctus accumsan ad. Id veritus tibique per
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <figure className="position-relative">
                                            <img className="border-radius-10 post-thumb" src="/client-assets/imgs/news/news-17.jpg" alt="flow" />
                                        </figure>
                                    </div>
                                </div>
                            </div>
                            <div className="slide-fade-item">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="post-meta-1 mb-20 mt-50">
                                            <a href="#" className="tag-category bg-warning shadown-1 text-dark button-shadow hover-up-3">Beauty</a>
                                            <span className="post-date text-muted font-md">September 15, 2025</span>
                                        </div>
                                        <h2 className="post-title mb-30 fw-700">
                                            <a href="#">Rice Water for Hair Growth: Does It Actually Work?</a>
                                        </h2>
                                        <div className="post-excerpt text-grey-400 mb-30">
                                            Qualisque persecuti eu vis. Et his eruditi fastidii gloriatur. In nec aliquam lobortis definitionem, aeterno qualisque appellantur ea sea
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <figure className="position-relative">
                                            <img className="border-radius-10 post-thumb" src="/client-assets/imgs/news/news-18.jpg" alt="flow" />
                                        </figure>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-none min-w-full snap-center slide-fade-item">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="post-meta-1 mb-20 mt-50">
                                            <a href="#" className="tag-category bg-primary shadown-1 text-dark button-shadow hover-up-3">Music</a>
                                            <span className="post-date text-muted font-md">September 15, 2025</span>
                                        </div>
                                        <h2 className="post-title mb-30 fw-700">
                                            <a href="#">5 Science-Backed Reasons Why Music is Good for You</a>
                                        </h2>
                                        <div className="post-excerpt text-grey-400 mb-30">
                                            An vis natum detracto nominati, ei mundi animal definitionem his, saepe indoctum pericula an sea. Vix ut admodum nostrum fastidii.
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <figure className="position-relative">
                                            <img className="border-radius-10 post-thumb" src="/client-assets/imgs/news/news-19.jpg" alt="flow" />
                                        </figure>
                                    </div>
                                </div>
                            </div>
                        </Slider>
                    </div>
                    <div className="slide-fade-arrow-cover">
                        <span className="flow-arrow flow-arrow-up" onClick={() => sliderRef.current?.slickPrev()}></span>
                        <span className="flow-arrow flow-arrow-down" onClick={() => sliderRef.current?.slickNext()}></span>
                    </div>
                </div>
                <div className="row wow fadeIn animated">
                    <div className="col-lg-4 mb-md-30">
                        <div className="d-flex latest-small-thumb">
                            <div className="post-thumb d-flex mr-15 border-radius-10 img-hover-scale overflow-hidden">
                                <a className="color-white" href="#" tabIndex={0}>
                                    <img src="/client-assets/imgs/news/thumb-11.jpg" alt="flow" />
                                </a>
                            </div>
                            <div className="post-content media-body align-self-center">
                                <h5 className="post-title mb-15 text-limit-3-row font-medium">
                                    <a href="#" tabIndex={0}>12 Best Books to Read at the Beach This Summer</a>
                                </h5>
                                <div className="entry-meta meta-1 float-left font-sm">
                                    <span className="post-on has-dot">September 15, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-md-30">
                        <div className="d-flex latest-small-thumb">
                            <div className="post-thumb d-flex mr-15 border-radius-10 img-hover-scale overflow-hidden">
                                <a className="color-white" href="#" tabIndex={0}>
                                    <img src="/client-assets/imgs/news/thumb-12.jpg" alt="flow" />
                                </a>
                            </div>
                            <div className="post-content media-body align-self-center">
                                <h5 className="post-title mb-15 text-limit-3-row font-medium">
                                    <a href="#" tabIndex={0}>9 Things I Love About Shaving My Head During Quarantine</a>
                                </h5>
                                <div className="entry-meta meta-1 float-left font-sm">
                                    <span className="post-on has-dot">August 5, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-md-30">
                        <div className="d-flex latest-small-thumb">
                            <div className="post-thumb d-flex mr-15 border-radius-10 img-hover-scale overflow-hidden">
                                <a className="color-white" href="#" tabIndex={0}>
                                    <img src="/client-assets/imgs/news/thumb-13.jpg" alt="flow" />
                                </a>
                            </div>
                            <div className="post-content media-body align-self-center">
                                <h5 className="post-title mb-15 text-limit-3-row font-medium">
                                    <a href="#" tabIndex={0}>Rice Water for Hair Growth: Does It Actually Work?</a>
                                </h5>
                                <div className="entry-meta meta-1 float-left font-sm">
                                    <span className="post-on has-dot">January 14, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
