import { useState } from 'react'
import type { Game } from '@/hooks/useGames'
import GameDetailModal from '../GameDetailModal/GameDetailModal'
import './GameCard.scss'

type Props = {
    game: Game
}

const GameCard = ({ game }: Props) => {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <div className="game-card">
                <img src={game.image_url} alt={game.title} />

                <div className="game-card__overlay" />

                {/* Link əvəzinə button — z-index problemi aradan qalxır */}
                <button
                    className="game-card__eye"
                    aria-label="Detala bax"
                    onClick={(e) => {
                        e.stopPropagation()
                        setModalOpen(true)
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>

                <div className="game-card__content">
                    <span className="game-card__genre">{game.genre}</span>
                    <button
                        className="game-card__title"
                        onClick={() => setModalOpen(true)}
                    >
                        {game.title}
                    </button>
                </div>
            </div>

            {modalOpen && (
                <GameDetailModal
                    game={game}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    )
}

export default GameCard