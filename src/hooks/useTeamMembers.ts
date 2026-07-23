import axios from 'axios'
import { useEffect, useState } from 'react'

export type TeamMember = {
    id: number
    name: string
    role: string
    image_url: string
    description: string
    experience: string
    facebook_url: string
    twitter_url: string
    linkedin_url: string
    instagram_url: string
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const useTeamMembers = () => {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data } = await axios.get<TeamMember[]>(
                    `${SUPABASE_URL}/rest/v1/team_members?select=*&order=id.asc`,
                    {
                        headers: {
                            apikey: SUPABASE_ANON_KEY,
                            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                        },
                    }
                )
                setMembers(data)
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

        fetchMembers()
    }, [])

    return { members, loading, error }
}