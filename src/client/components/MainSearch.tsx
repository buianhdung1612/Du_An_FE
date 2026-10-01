

export default function MainSearch() {
    return (
        <div className="main-search-form bg-brand-4">
            <div className="container">
                <div className="pt-50 pb-50">
                    <div className="row mb-20">
                        <div className="col-12 align-self-center main-search-form-cover m-auto">
                            <p className="text-center"><span className="display-1">Search</span></p>
                            <form action="#" className="search-header">
                                <div className="input-group w-100">
                                    <input type="text" className="form-control" placeholder="Search articles, places and people" />
                                    <div className="input-group-append">
                                        <button className="btn btn-search bg-transparent" type="submit">
                                            <img className="svg-icon-24" src="/client-assets/imgs/theme/svg/search.svg" alt="flow" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row mt-80 text-center">
                        <div className="col-12 font-small suggested-area">
                            <h5 className="suggested font-heading mb-20 text-grey-400"> <strong>Suggested keywords:</strong></h5>
                            <ul className="list-inline d-inline-block">
                                <li className="list-inline-item"><a href="#">Health</a></li>
                                <li className="list-inline-item"><a href="#">Travel tips</a></li>
                                <li className="list-inline-item"><a href="#">Lifestyle</a></li>
                                <li className="list-inline-item"><a href="#">Technology</a></li>
                                <li className="list-inline-item"><a href="#">Food</a></li>
                                <li className="list-inline-item"><a href="#">Books</a></li>
                                <li className="list-inline-item"><a href="#">Drink</a></li>
                                <li className="list-inline-item"><a href="#">Fashion</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
