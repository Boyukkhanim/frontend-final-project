import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AccessoryCard from '@/components/common/AccessoryCard/AccessoryCard'
import { useGameAccessories } from '@/hooks/useGameAccessories'
import './Shop.scss'
import PageHero from '@/components/common/PageHero/PageHero'

const ITEMS_PER_PAGE = 8

const Shop = () => {
    const { t } = useTranslation()
    const { accessories, loading, error } = useGameAccessories()
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('default')
    const [currentPage, setCurrentPage] = useState(1)

    const filtered = accessories
        .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price
            if (sortBy === 'price-desc') return b.price - a.price
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            return 0
        })

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleSearch = (val: string) => {
        setSearch(val)
        setCurrentPage(1)
    }

    return (
        <div className="shop-page">

            <PageHero titleKey="shopp.title" currentKey="shopp.current" />

            {/* Content */}
            <div className="container">

                {/* Search + Sort */}
                <div className="shop-page__controls">
                    <div className="shop-page__search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder={t('shopp.searchPlaceholder')}
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="shop-page__sort"
                        value={sortBy}
                        onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }}
                    >
                        <option value="default">{t('shopp.sort.default')}</option>
                        <option value="price-asc">{t('shopp.sort.priceAsc')}</option>
                        <option value="price-desc">{t('shopp.sort.priceDesc')}</option>
                        <option value="name">{t('shopp.sort.name')}</option>
                    </select>

                    <span className="shop-page__count">
                        {t('shopp.showing', { count: paginated.length, total: filtered.length })}
                    </span>
                </div>

                {/* Grid */}
                {loading && <p className="shop-page__status">{t('shopp.loading')}</p>}
                {error && <p className="shop-page__status shop-page__status--error">{t('shopp.error', { error })}</p>}

                {!loading && !error && filtered.length === 0 && (
                    <p className="shop-page__status">{t('shopp.noProducts')}</p>
                )}

                {!loading && !error && (
                    <div className="shop-page__grid">
                        {paginated.map(item => (
                            <AccessoryCard key={item.id} accessory={item} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="shop-pagination">
                        <button
                            className="shop-pagination__arrow"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            aria-label={t('shopp.pagination.prev')}
                        >
                            ‹
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`shop-pagination__btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                                aria-label={t('shopp.pagination.page', { page })}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {String(page).padStart(2, '0')}
                            </button>
                        ))}

                        <button
                            className="shop-pagination__arrow"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            aria-label={t('shopp.pagination.next')}
                        >
                            ›
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Shop