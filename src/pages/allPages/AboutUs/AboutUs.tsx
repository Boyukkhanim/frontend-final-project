import AboutSection from '@/pages/Home/sections/AboutSection/AboutSection'
import GamePlay from '@/pages/Home/sections/GamePlay/GamePlay'
import OurTestimonial from '@/pages/Home/sections/OurTestimontial/OurTestimonial'
import Counter from '@/components/common/Counter/Counter'
import PageHero from '@/components/common/PageHero/PageHero'

const AboutUs = () => {
    return (
        <div className="about-page">
            <PageHero titleKey="aboutUs.title" currentKey="aboutUs.current" />
            <AboutSection />
            <GamePlay />
            <Counter />
            <OurTestimonial />
        </div>
    )
}

export default AboutUs