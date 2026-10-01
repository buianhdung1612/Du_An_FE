

export default function Header() {
    return (
        <>
            <div className="topbar bg-brand-3 pt-15 pb-15 font-md">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 align-self-center">
                            <span className="date text-muted">Today: 4 November, 2025</span>
                        </div>
                        <div className="col-sm-6 text-right align-self-center">
                            <ul className="social-network d-inline-block list-inline mb-0 float-right">
                                <li className="list-inline-item"><a href="#" target="_blank" title="Facebook"><i className="elegant-icon social_facebook"></i></a></li>
                                <li className="list-inline-item"><a href="#" target="_blank" title="Tweet now"><i className="elegant-icon social_twitter"></i></a></li>
                                <li className="list-inline-item"><a href="#" target="_blank" title="Pin it"><i className="elegant-icon social_pinterest"></i></a></li>
                                <li className="list-inline-item"><a href="#" target="_blank" title="Skype"><i className="elegant-icon social_skype"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <header className="main-header header-sticky header-fluid">
                <div className="position-relative">
                    <div className="container-fluid align-self-center">
                        <div className="header-style-1 header-style-2">
                            <div className="logo">
                                <a href="/">
                                    <img className="light-mode" src="/client-assets/imgs/theme/logo.svg" alt="flow" />
                                    <img className="darrk-mode" src="/client-assets/imgs/theme/logo-white.svg" alt="flow" />
                                </a>
                            </div>
                            <div className="main-nav d-none d-lg-block">
                                <nav>
                                    <ul className="main-menu d-none d-lg-inline">
                                        <li className="menu-item-has-children">
                                            <a href="/">Home</a>
                                        </li>
                                        <li> <a href="/docs">Docs</a> </li>
                                        <li> <a href="/about">About</a> </li>
                                        <li className="menu-item-has-children">
                                            <a href="/blog">Blog</a>
                                        </li>
                                        <li> <a href="/design">Design</a> </li>
                                        <li> <a href="/contact">Contact</a> </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="header-right d-none d-lg-flex">
                                <div className="dark-light-mode">
                                    <label htmlFor="switch" className="toggle dark-light-switcher">
                                        <input type="checkbox" className="input" id="switch" />
                                        <div className="icon icon--moon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <div className="icon icon--sun">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                                                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"></path>
                                            </svg>
                                        </div>
                                    </label>
                                </div>
                                <button className="search-icon d-md-inline" type="button">
                                    <svg width="49" height="47" viewBox="0 0 49 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.532 37.2083C31.3685 37.2083 38.532 30.1941 38.532 21.5417C38.532 12.8892 31.3685 5.875 22.532 5.875C13.6954 5.875 6.53198 12.8892 6.53198 21.5417C6.53198 30.1941 13.6954 37.2083 22.532 37.2083Z" stroke="#111111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M42.532 41.125L33.832 32.6062" stroke="#111111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn btn-md bg-dark text-white changeless ml-15 box-shadow d-none d-lg-inline">
                                    <a href="#">Buy Now</a>
                                </button>
                            </div>
                        </div>
                        <div className="mobile_menu d-lg-none d-block"></div>
                    </div>
                </div>
            </header>
        </>
    );
}
