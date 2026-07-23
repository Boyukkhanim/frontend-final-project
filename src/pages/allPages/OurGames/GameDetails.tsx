import './GameDetails.scss'
import { useGames } from '@/hooks/useGames'
import Preloader from '@/components/common/Preloader/Preloader'
import GameDetailRow from './sections/Gamedetailrow'
import PageHero from '@/components/common/PageHero/PageHero'
import { useTranslation } from 'react-i18next'

const GameDetails = () => {
    const { loading, games, error } = useGames()
    const { t } = useTranslation()

    if (loading) return <Preloader />
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{t('gameDetails.error')} {error}</p>

    return (
        <div className="about-page">
            <PageHero titleKey="gameDetails.title" currentKey="gameDetails.current" />
            <section className="gd-list">
                {games.map((game, index) => (
                    <GameDetailRow key={game.id} game={game} index={index} />
                ))}
            </section>
        </div>
    )
}

export default GameDetails