import GameCard from "../GameCard/GameCard"
import type { Game } from '@/hooks/useGames'
import './GameList.scss'

type Props = {
    games: Game[]   // any[] əvəzinə
}

const GameList = ({ games }: Props) => {
    return (
        <div className="game-list">
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    )
}

export default GameList