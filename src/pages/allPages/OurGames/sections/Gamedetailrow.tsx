import type { Game } from '@/hooks/useGames'
import './Gamedetailrow.scss'

type Props = {
    game: Game
    index: number
}

const GameDetailRow = ({ game, index }: Props) => {
    const isEven = index % 2 === 0

    return (
        <div className={`gdr ${isEven ? 'gdr--normal' : 'gdr--reverse'}`}>

            {/* Image Side */}
            <div className="gdr__img-wrap">
                <div className="gdr__img-clip">
                    <img src={game.image_url} alt={game.title} />
                </div>
                <div className="gdr__img-accent" />
            </div>

            {/* Content Side */}
            <div className="gdr__content">
                <div className="gdr__meta">
                    <span className="gdr__genre">{game.genre}</span>
                    <span className="gdr__id">#{game.id.toString().padStart(3, '0')}</span>
                </div>

                <h2 className="gdr__title">{game.title}</h2>

                <div className="gdr__divider" />

                <p className="gdr__desc">{game.description}</p>

                <div className="gdr__stats">
                    <div className="gdr__stat">
                        <span className="gdr__stat-val">4.8<em>/5</em></span>
                        <span className="gdr__stat-label">Rating</span>
                    </div>
                    <div className="gdr__stat-sep" />
                    <div className="gdr__stat">
                        <span className="gdr__stat-val">2M<em>+</em></span>
                        <span className="gdr__stat-label">Players</span>
                    </div>
                    <div className="gdr__stat-sep" />
                    <div className="gdr__stat">
                        <span className="gdr__stat-val">PC<em>/PS5</em></span>
                        <span className="gdr__stat-label">Platform</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default GameDetailRow