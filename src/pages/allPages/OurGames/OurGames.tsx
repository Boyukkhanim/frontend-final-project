import './OurGames.scss'
import { useGames } from '@/hooks/useGames'
import Preloader from '@/components/common/Preloader/Preloader'
import GameList from '@/components/common/GameList/GameList'
import AboutSection from '@/pages/Home/sections/AboutSection/AboutSection'
import PageHero from '@/components/common/PageHero/PageHero'
import { useTranslation } from 'react-i18next'

const OurGames = () => {
    const { loading, games, error } = useGames()
    const { t } = useTranslation()

    if (loading) return <Preloader />
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{t('ourGames.error')} {error}</p>

    return (
        <div className="about-page">
            <PageHero titleKey="ourGames.title" currentKey="ourGames.current" />
            <div className="bottom">
                <GameList games={games.slice(0, 8)} />
                <AboutSection />
            </div>
        </div>
    )
}

export default OurGames