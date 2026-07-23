import { useEffect } from 'react'
import type { Game } from '@/hooks/useGames'
import './GameDetailModal.scss'
import { useLocalizedField } from '@/hooks/useLocalizedField'
import { useTranslation } from 'react-i18next'

type Props = {
    game: Game
    onClose: () => void
}

const GameDetailModal = ({ game, onClose }: Props) => {
    const { t } = useTranslation()
    const { localize } = useLocalizedField()
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <div className="gd-overlay" onClick={onClose}>
            <div className="gd-modal" onClick={e => e.stopPropagation()} role="dialog">

                <div className="gd-modal__img-wrap">
                    <img src={game.image_url} alt={localize(game.title_i18n)} />
                    <div className="gd-modal__img-bar" />
                </div>

                <button className="gd-modal__close" onClick={onClose} aria-label={t('gamedetail.close')}>✕</button>

                <div className="gd-modal__body">
                    <div className="gd-modal__genre-row">
                        <span className="gd-modal__genre">{game.genre}</span>
                        <span className="gd-modal__id">#{game.id.toString().padStart(3, '0')}</span>
                    </div>

                    <h2 className="gd-modal__title">{game.title}</h2>

                    <p className="gd-modal__desc">{game.description}</p>

                    <div className="gd-modal__stats">
                        <div className="gd-modal__stat">
                            <div className="gd-modal__stat-label">{t('gamedetail.rating')}</div>


                            <div className="gd-modal__stat-val"><span>4.8</span> / 5</div>
                        </div>
                        <div className="gd-modal__stat">
                            <div className="gd-modal__stat-label">{t('gamedetail.players')}</div>
                            <div className="gd-modal__stat-val">2<span>M</span>+</div>
                        </div>
                        <div className="gd-modal__stat">
                            <div className="gd-modal__stat-label">{t('gamedetail.platform')}</div>
                            <div className="gd-modal__stat-val" style={{ fontSize: '13px' }}>PC / PS5</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameDetailModal