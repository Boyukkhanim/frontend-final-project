import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGameAccessoryById, useGameAccessories } from '@/hooks/useGameAccessories'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { addToCart, syncAddToCart } from '@/store/slices/cartSlice'
import { toggleWishlist, syncToggleWishlist } from '@/store/slices/wishlistSlice'
import AccessoryCard from '@/components/common/AccessoryCard/AccessoryCard'
import { useLocalizedField } from '@/hooks/useLocalizedField'
import PageHero from '@/components/common/PageHero/PageHero'
import './ShopDetails.scss'

const DISCOUNT = 25

const ShopDetails = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const { localize } = useLocalizedField()

    const { accessory, loading, error } = useGameAccessoryById(Number(id))
    const { accessories } = useGameAccessories()
    const [qty, setQty] = useState(1)
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

    const user = useAppSelector(state => state.auth.user)
    const isInWishlist = useAppSelector(state =>
        state.wishlist.items.some(i => i.id === accessory?.id)
    )

    const discountedPrice = accessory
        ? parseFloat((accessory.price * (1 - DISCOUNT / 100)).toFixed(2))
        : 0

    const related = accessories.filter(a => a.id !== accessory?.id).slice(0, 4)

    const handleAddToCart = () => {
        if (!accessory) return
        const item = { ...accessory, quantity: qty, discountedPrice }
        if (user) {
            dispatch(syncAddToCart({ userId: user.id, item }))
        } else {
            dispatch(addToCart(item))
        }
    }

    const handleBuyNow = () => {
        if (!accessory) return
        const item = { ...accessory, quantity: qty, discountedPrice }
        if (user) {
            dispatch(syncAddToCart({ userId: user.id, item }))
        } else {
            dispatch(addToCart(item))
        }
        navigate('/shop-cart')
    }

    const handleToggleWishlist = () => {
        if (!accessory) return
        if (user) {
            dispatch(syncToggleWishlist({ userId: user.id, item: accessory, isInWishlist }))
        } else {
            dispatch(toggleWishlist(accessory))
        }
    }

    if (loading) return <div className="sd-status">{t('shopDetails.loading')}</div>
    if (error || !accessory) return <div className="sd-status sd-status--error">{t('shopDetails.notFound')}</div>

    return (
        <div className="sd-page">
            <PageHero
                titleKey="shopDetails.heroTitle"
                currentKey="shopDetails.heroCurrent"
                extraBreadcrumb={{ labelKey: 'shopp.title', to: '/shop-page' }}
                currentLabel={localize(accessory.name_i18n)}
            />

            <div className="container">
                <div className="sd-main">
                    <div className="sd-main__img-wrap">
                        <span className="sd-main__badge">{DISCOUNT}% OFF</span>
                        <img src={accessory.image_url} alt={localize(accessory.name_i18n)} />
                    </div>

                    <div className="sd-main__info">
                        <div className="sd-main__brand">
                            <span className="sd-main__brand-dot" />
                            {t('shopDetails.brand')}
                        </div>
                        <h1 className="sd-main__title">{localize(accessory.name_i18n)}</h1>
                        <div className="sd-main__stars">
                            {[1, 2, 3, 4, 5].map(i => (
                                <span key={i} className={`sd-main__star ${i <= 4 ? 'filled' : ''}`}>★</span>
                            ))}
                            <span className="sd-main__review">
                                {t('shopDetails.reviews', { count: 24 })}
                            </span>
                        </div>
                        <div className="sd-main__divider" />
                        <div className="sd-main__prices">
                            <div className="sd-main__price-new">${discountedPrice.toFixed(2)}</div>
                            <div className="sd-main__price-old">${accessory.price.toFixed(2)}</div>
                            <span className="sd-main__price-badge">-{DISCOUNT}%</span>
                        </div>
                        <div className="sd-main__status">
                            {t('shopDetails.availability')}: <span>{t('shopDetails.inStock')}</span>
                        </div>
                        <div className="sd-main__code">
                            {t('shopDetails.productCode')}: <span>#{accessory.id.toString().padStart(4, '0')}</span>
                        </div>
                        <div className="sd-main__divider" />
                        <div className="sd-main__actions">
                            <div className="sd-main__qty">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                                <span>{qty}</span>
                                <button onClick={() => setQty(q => q + 1)}>+</button>
                            </div>
                            <button className="sd-main__cart-btn" onClick={handleAddToCart}>
                                {t('shopDetails.addToCart')}
                            </button>
                            <button className="sd-main__buy-btn" onClick={handleBuyNow}>
                                {t('shopDetails.buyNow')}
                            </button>
                        </div>
                        <button
                            className={`sd-main__wishlist ${isInWishlist ? 'active' : ''}`}
                            onClick={handleToggleWishlist}
                        >
                            {isInWishlist ? t('shopDetails.addedToWishlist') : t('shopDetails.addToWishlist')}
                        </button>
                    </div>
                </div>

                <div className="sd-tabs">
                    <div className="sd-tabs__nav">
                        {(['description', 'specs', 'reviews'] as const).map(tab => (
                            <button
                                key={tab}
                                className={`sd-tabs__btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {t(`shopDetails.tabs.${tab}`)}
                            </button>
                        ))}
                    </div>
                    <div className="sd-tabs__content">
                        {activeTab === 'description' && (
                            <div className="sd-tabs__panel">
                                <p>{t('shopDetails.descriptionText1')}</p>
                                <p>{t('shopDetails.descriptionText2')}</p>
                            </div>
                        )}
                        {activeTab === 'specs' && (
                            <div className="sd-tabs__panel">
                                <table className="sd-specs-table">
                                    <tbody>
                                        <tr><td>{t('shopDetails.specs.brand')}</td><td>XPORTS Gear</td></tr>
                                        <tr><td>{t('shopDetails.specs.model')}</td><td>#{accessory.id.toString().padStart(4, '0')}</td></tr>
                                        <tr><td>{t('shopDetails.specs.price')}</td><td>${accessory.price.toFixed(2)}</td></tr>
                                        <tr><td>{t('shopDetails.specs.discount')}</td><td>{DISCOUNT}%</td></tr>
                                        <tr><td>{t('shopDetails.specs.status')}</td><td>{t('shopDetails.inStock')}</td></tr>
                                        <tr><td>{t('shopDetails.specs.warranty')}</td><td>{t('shopDetails.specs.warrantyValue')}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="sd-tabs__panel">
                                <div className="sd-review">
                                    <div className="sd-review__header">
                                        <div className="sd-review__avatar">JD</div>
                                        <div>
                                            <p className="sd-review__name">John Doe</p>
                                            <div className="sd-review__stars">★★★★★</div>
                                        </div>
                                    </div>
                                    <p className="sd-review__text">{t('shopDetails.reviewText')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {related.length > 0 && (
                    <div className="sd-related">
                        <div className="sd-related__header">
                            <span className="sd-related__tag">{t('shopDetails.moreProducts')}</span>
                            <h2>
                                {t('shopDetails.related')} <span className="red">{t('shopDetails.products')}</span>
                            </h2>
                        </div>
                        <div className="sd-related__grid">
                            {related.map(item => (
                                <AccessoryCard key={item.id} accessory={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShopDetails