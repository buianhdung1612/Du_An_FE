
import FeaturedGrid from '../components/FeaturedGrid';
import RecentArticles from '../components/RecentArticles';
import TrendingSidebar from '../components/TrendingSidebar';
import EditorsPicked from '../components/EditorsPicked';
import TrendingRecent from '../components/TrendingRecent';
import InstagramFollow from '../components/InstagramFollow';
import Newsletter from '../components/Newsletter';

export default function Home() {
    return (
        <main>
            <FeaturedGrid />

            <section className="recent-posts pb-65">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <RecentArticles />
                        </div>
                        <div className="col-lg-4 primary-sidebar sticky top-[100px] h-fit bg-transparent z-10 transition-all duration-300">
/* <TrendingSidebar /> */
                        </div>
                    </div>
                </div>
            </section>

            <EditorsPicked />
            <TrendingRecent />
            <InstagramFollow />
            <Newsletter />
        </main>
    );
}
