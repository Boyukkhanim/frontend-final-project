import GameList from '@/components/common/GameList/GameList'
import { useGames } from '@/hooks/useGames'
import './HighResolution.scss'
import Preloader from '@/components/common/Preloader/Preloader'
import { useTranslation } from 'react-i18next'

const HighResolution = () => {
    const { games, loading, error } = useGames()
    const { t } = useTranslation()

    if (loading) return <Preloader />
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{t('hero4.error')} {error}</p>

    return (
        <section className="hero4">
            <h2 className='hero4_tag'>{t('hero4.tag')}</h2>
            <h1 className='hero4_desc'>{t('hero4.title')}</h1>
            <GameList games={games.slice(0, 8)} />
        </section>
    )
}

export default HighResolution