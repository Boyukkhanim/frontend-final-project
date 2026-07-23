import axios from 'axios'
import { useEffect, useState } from 'react'
import type { LocalizedField } from './useGameAccessories'

export type Game = {
    id: number
    title: string          // köhnə — saxla (ehtiyat)
    title_i18n: LocalizedField
    description: string    // köhnə — saxla
    description_i18n: LocalizedField
    genre: string          // genre tək dildədir, i18n lazım deyil (adətən EN olur)
    image_url: string
    is_active: boolean
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const useGames = () => {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const { data } = await axios.get<Game[]>(
                    `${SUPABASE_URL}/rest/v1/games?select=*&order=id.asc`,
                    {
                        headers: {
                            apikey: SUPABASE_ANON_KEY,
                            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                        },
                    }
                )
                setGames(data)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message ?? err.message)
                } else {
                    setError('Bilinməyən xəta')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchGames()
    }, [])

    return { games, loading, error }
}