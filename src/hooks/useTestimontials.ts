
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocalizedField } from './useLocalizedField'

export type Testimonial = {
    id: number
    name: string
    role: string
    text: string
    initials: string
    image_url: string | null
    created_at: string
    textaz: string
    textru: string
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const useTestimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { localize } = useLocalizedField()

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await axios.get<Omit<Testimonial, 'text'>[]>(
                    `${SUPABASE_URL}/rest/v1/testimonials?select=*&order=id.asc`,
                    {
                        headers: {
                            apikey: SUPABASE_ANON_KEY,
                            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                        },
                    }
                )
                const localized = data.map((item) => ({
                    ...item,
                    text: localize({ az: item.textaz, ru: item.textru }),
                }))
                setTestimonials(localized)
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

        fetchTestimonials()
    }, [localize])

    return { testimonials, loading, error }
}