import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { supabase } from '@/data/supabaseClient'
import { useTranslation } from 'react-i18next'
import './SearchOverlay.scss'

type AccessoryResult = {
    id: number
    name: string
    name_i18n: Record<string, string>
    price: number
    image_url: string
}

type Props = {
    open: boolean
    onClose: () => void
}

const SearchOverlay = ({ open, onClose }: Props) => {
    const { i18n, t } = useTranslation()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<AccessoryResult[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const getLang = () => i18n.language.slice(0, 2).toLowerCase() // 'az' | 'ru' | 'en'

    const getLocalizedName = (item: AccessoryResult) =>
        item.name_i18n?.[getLang()] ?? item.name

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 350)
        else { setQuery(''); setResults([]); setSearched(false) }
    }, [open])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    const search = async (val: string) => {
        if (!val.trim()) { setResults([]); setSearched(false); return }
        setLoading(true)
        setSearched(true)

        const { data } = await supabase
            .from('gaming_accessories')
            .select('id, name, name_i18n, price, image_url')
            .eq('is_active', true)
            .order('id', { ascending: true })

        if (data) {
            const lower = val.toLowerCase()
            const filtered = data.filter(item => {
                const localName = item.name_i18n?.[getLang()] ?? item.name
                return localName.toLowerCase().includes(lower)
            })
            setResults(filtered)
        }
        setLoading(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => search(val), 400)
    }

    return (
        <>
            <div className={`search-overlay__backdrop ${open ? 'open' : ''}`} onClick={onClose} />

            <div className={`search-overlay ${open ? 'open' : ''}`}>
                <button className="search-overlay__close" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <div className="search-overlay__inner">
                    {/* Input */}
                    <div className="search-overlay__box">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-overlay__icon" />
                        <input
                            ref={inputRef}
                            className="search-overlay__input"
                            placeholder={t('search.placeholder', 'Search accessories...')}
                            value={query}
                            onChange={handleChange}
                        />
                        {loading && (
                            <FontAwesomeIcon icon={faSpinner} className="search-overlay__spinner" spin />
                        )}
                    </div>

                    {/* Nəticələr */}
                    {searched && !loading && results.length === 0 && (
                        <p className="search-overlay__empty">
                            {t('search.noResults', 'No results found')}
                        </p>
                    )}

                    {results.length > 0 && (
                        <ul className="search-overlay__results">
                            {results.map(item => (
                                <li key={item.id}>
                                    <Link
                                        to={`/shop-details/${item.id}`}
                                        className="search-overlay__result-item"
                                        onClick={onClose}
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={getLocalizedName(item)}
                                            className="search-overlay__result-img"
                                        />
                                        <div className="search-overlay__result-info">
                                            <span className="search-overlay__result-name">
                                                {getLocalizedName(item)}
                                            </span>
                                            <span className="search-overlay__result-price">
                                                ${item.price}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}

export default SearchOverlay