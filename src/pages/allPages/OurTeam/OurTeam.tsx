import './OurTeam.scss'
import MemberList from '@/components/common/MemberList/MemberList'
import PageHero from '@/components/common/PageHero/PageHero'

const OurTeam = () => {
    return (
        <div className="about-page">
            <PageHero titleKey="ourTeam.title" currentKey="ourTeam.current" />
            <section className="gd-list">
                <MemberList />
            </section>
        </div>
    )
}

export default OurTeam