import './Home.scss';
import AboutSection from './sections/AboutSection/AboutSection';
import GamePlay from './sections/GamePlay/GamePlay';
import GamingAcs from './sections/GamingAcs/GamingAcs';
import HeroBanner from './sections/HeroBanner/HeroBanner';
import HighResolution from './sections/HighResolution/HighResolution';
import Join from './sections/Join/Join';
import LatestNewsAndBlogs from './sections/LatestNewsAndBlog/LatestNewsAndBlog';
import OurBestTeam from './sections/OurBestTeam/OurBestTeam';
import OurTestimonial from './sections/OurTestimontial/OurTestimonial';
import PromoSection from './sections/PromoSection/PromoSection';
const Home = () => {
    return (
        <div className="home-page">
            <div className="home-content">
                <HeroBanner />
                <AboutSection />
                <PromoSection />
                <HighResolution />
                <GamePlay />
                <GamingAcs />
                <OurTestimonial />
                <OurBestTeam />
                <LatestNewsAndBlogs />
                <Join />
            </div>
        </div>
    );
};


export default Home;
