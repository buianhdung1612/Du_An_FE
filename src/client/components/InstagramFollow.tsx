import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
export default function InstagramFollow() {
    const sliderRef = useRef<Slider>(null);

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        arrows: false,
        autoplay: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        loop: true,
        adaptiveHeight: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    return (
        <section className="instargram bg-brand-4">
            <div className="container">
                <div className="header-title-2 text-center mb-65">
                    <h4 className="mb-0 text-grey-400 wow fadeIn animated">
                        <img src="/client-assets/imgs/theme/svg/instagram.svg" alt="flow" />
                        <span>Follow Us</span>
                    </h4>
                    <h3 className="font-heading wow fadeIn animated">on Instagram</h3>
                </div>
                <div className="position-relative wow fadeIn animated">
                    <Slider ref={sliderRef} className="carausel-3-columns" {...settings}>
                        <div className="post-card-1 instagram-card border-radius-10 hover-up p-30 flex-fill">
                            <figure className="mb-30 img-hover-scale overflow-hidden border-radius-10">
                                <img className="border-radius-10" src="/client-assets/imgs/news/news-12.jpg" alt="flow" />
                            </figure>
                            <div className="post-meta-2 font-md d-flex">
                                <a className="align-self-center" href="#">
                                    <img src="/client-assets/imgs/authors/author.jpg" alt="flow" />
                                </a>
                                <div className="mb-0">
                                    <a href="#"> <strong className="author-namge">Kate Adie</strong></a>
                                    <p className="post-on font-sm text-grey-400 mb-0 mt-0">3 minutes ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="post-card-1 instagram-card border-radius-10 hover-up p-30 flex-fill">
                            <figure className="mb-30 img-hover-scale overflow-hidden border-radius-10">
                                <img className="border-radius-10" src="/client-assets/imgs/news/news-13.jpg" alt="flow" />
                            </figure>
                            <div className="post-meta-2 font-md d-flex">
                                <a className="align-self-center" href="#">
                                    <img src="/client-assets/imgs/authors/author.jpg" alt="flow" />
                                </a>
                                <div className="mb-0">
                                    <a href="#"> <strong className="author-namge">Kate Adie</strong></a>
                                    <p className="post-on font-sm text-grey-400 mb-0 mt-0">3 minutes ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="post-card-1 instagram-card border-radius-10 hover-up p-30 flex-fill">
                            <figure className="mb-30 img-hover-scale overflow-hidden border-radius-10">
                                <img className="border-radius-10" src="/client-assets/imgs/news/news-14.jpg" alt="flow" />
                            </figure>
                            <div className="post-meta-2 font-md d-flex">
                                <a className="align-self-center" href="#">
                                    <img src="/client-assets/imgs/authors/author.jpg" alt="flow" />
                                </a>
                                <div className="mb-0">
                                    <a href="#"> <strong className="author-namge">Kate Adie</strong></a>
                                    <p className="post-on font-sm text-grey-400 mb-0 mt-0">3 minutes ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="post-card-1 instagram-card border-radius-10 hover-up p-30 flex-fill">
                            <figure className="mb-30 img-hover-scale overflow-hidden border-radius-10">
                                <img className="border-radius-10" src="/client-assets/imgs/news/news-11.jpg" alt="flow" />
                            </figure>
                            <div className="post-meta-2 font-md d-flex">
                                <a className="align-self-center" href="#">
                                    <img src="/client-assets/imgs/authors/author.jpg" alt="flow" />
                                </a>
                                <div className="mb-0">
                                    <a href="#"> <strong className="author-namge">Kate Adie</strong></a>
                                    <p className="post-on font-sm text-grey-400 mb-0 mt-0">3 minutes ago</p>
                                </div>
                            </div>
                        </div>
                    </Slider>
                    <div className="carausel-3-columns-arrow-cover mt-30">
                        <span className="flow-arrow flow-arrow-left" onClick={() => sliderRef.current?.slickPrev()}></span>
                        <span className="flow-arrow flow-arrow-right" onClick={() => sliderRef.current?.slickNext()}></span>
                    </div>
                </div>
            </div>
        </section>
    );
}
