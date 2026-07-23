import { useEffect, useState } from 'react'
import { supabase } from '@/data/supabaseClient'

export type LocalizedField = Record<string, string>

export type GameAccessory = {
    id: number
    name: string
    name_i18n: LocalizedField
    price: number
    image_url: string
    is_active: boolean
}

export const useGameAccessories = () => {
    const [accessories, setAccessories] = useState<GameAccessory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAccessories = async () => {
            const { data, error } = await supabase
                .from('gaming_accessories')
                .select('id, name, name_i18n, price, image_url, is_active')
                .eq('is_active', true)
                .order('id', { ascending: true })

            if (error) setError(error.message)
            else setAccessories(data || [])
            setLoading(false)
        }
        fetchAccessories()
    }, [])

    return { accessories, loading, error }
}

export const useGameAccessoryById = (id: number) => {
    const [accessory, setAccessory] = useState<GameAccessory | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return
        const fetch = async () => {
            const { data, error } = await supabase
                .from('gaming_accessories')
                .select('id, name, name_i18n, price, image_url, is_active')
                .eq('id', id)
                .single()

            if (error) setError(error.message)
            else setAccessory(data)
            setLoading(false)
        }
        fetch()
    }, [id])

    return { accessory, loading, error }
}