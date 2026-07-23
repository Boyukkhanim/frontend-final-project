import { Link } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { toggleWishlist, syncToggleWishlist, clearWishlist } from '@/store/slices/wishlistSlice'
import { addToCart, syncAddToCart } from '@/store/slices/cartSlice'
import AccessoryModal from '@/components/common/AccessoryModal/AccessoryModal'
import { useState } from 'react'
import type { GameAccessory } from '@/hooks/useGameAccessories'
import { useTranslation } from 'react-i18next'
import { useLocalizedField } from '@/hooks/useLocalizedField'
import './Wishlist.scss'
import PageHero from '@/components/common/PageHero/PageHero'

const DISCOUNT = 25

const Wishlist = () => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const { localize } = useLocalizedField()

    const user = useAppSelector(state => state.auth.user)
    const wishlistItems = useAppSelector(state => state.wishlist.items)
    const cartItems = useAppSelector(state => state.cart.items)
    const [modalItem, setModalItem] = useState<GameAccessory | null>(null)

    const handleRemove = (item: GameAccessory) => {
        if (user) {
            dispatch(syncToggleWishlist({ userId: user.id, item, isInWishlist: true }))
        } else {
            dispatch(toggleWishlist(item))
        }
    }

    const handleAddToCart = (item: GameAccessory) => {
        const discountedPrice = parseFloat((item.price * (1 - DISCOUNT / 100)).toFixed(2))
        const cartItem = { ...item, quantity: 1, discountedPrice }
        if (user) {
            dispatch(syncAddToCart({ userId: user.id, item: cartItem }))
        } else {
            dispatch(addToCart(cartItem))
        }
    }

    const handleClearAll = () => {
        // Hər birini ayrı-ayrı sil (Supabase-də hər biri üçün DELETE)
        wishlistItems.forEach(item => {
            if (user) {
                dispatch(syncToggleWishlist({ userId: user.id, item, isInWishlist: true }))
            } else {
                dispatch(toggleWishlist(item))
            }
        })
        // Guest üçün birbaşa clearWishlist də işləyər, amma yuxarıdakı loop hər ikisini əhatə edir
        if (!user) dispatch(clearWishlist())
    }

    return (
        <div className="wishlist-page">

            <PageHero titleKey="wishlist.title" currentKey="wishlist.title" />

            <div className="container">
                {wishlistItems.length === 0 ? (
                    <div className="wishlist-page__empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <p>{t('wishlist.empty', 'Your wishlist is empty.')}</p>
                        <Link to="/shop" className="wishlist-page__empty-btn">
                            {t('wishlist.go_shop', 'Go to Shop')}
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="wishlist-page__header">
                            <span className="wishlist-page__count">
                                {wishlistItems.length} {t('wishlist.items', 'items')}
                            </span>
                            <button
                                className="wishlist-page__clear"
                                onClick={handleClearAll}
                            >
                                {t('wishlist.clear_all', 'Clear All')}
                            </button>
                        </div>

                        <div className="wishlist-page__grid">
                            {wishlistItems.map(item => {
                                const discountedPrice = parseFloat((item.price * (1 - DISCOUNT / 100)).toFixed(2))
                                const isInCart = cartItems.some(c => c.id === item.id)

                                return (
                                    <div
                                        className="wl-card"
                                        key={item.id}
                                        onClick={() => setModalItem(item)}
                                    >
                                        <span className="wl-card__badge">{DISCOUNT}% OFF</span>

                                        <div className="wl-card__actions">
                                            <button
                                                className="wl-card__btn wl-card__btn--remove"
                                                aria-label={t('wishlist.remove', 'Remove')}
                                                onClick={e => { e.stopPropagation(); handleRemove(item) }}
                                            >
                                                <svg viewBox="0 0 24 24" fill="red" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                            </button>

                                            <button
                                                className={`wl-card__btn ${isInCart ? 'active' : ''}`}
                                                aria-label={t('wishlist.add_cart', 'Add to Cart')}
                                                onClick={e => { e.stopPropagation(); handleAddToCart(item) }}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke={isInCart ? 'red' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="9" cy="21" r="1" />
                                                    <circle cx="20" cy="21" r="1" />
                                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                                </svg>
                                            </button>

                                            <button
                                                className="wl-card__btn"
                                                aria-label={t('wishlist.quick_view', 'Quick View')}
                                                onClick={e => { e.stopPropagation(); setModalItem(item) }}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>

                                            <Link
                                                className="wl-card__btn"
                                                to={`/shop-details/${item.id}`}
                                                onClick={e => e.stopPropagation()}
                                                aria-label={t('wishlist.view_detail', 'View Detail')}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </Link>
                                        </div>

                                        <div className="wl-card__img-wrap">
                                            <img src={item.image_url} alt={localize(item.name_i18n)} />
                                        </div>

                                        <div className="wl-card__body">
                                            <h3 className="wl-card__name">{localize(item.name_i18n)}</h3>
                                            <p className="wl-card__price">
                                                <span className="price-new">${discountedPrice}</span>
                                                <span className="price-old">${item.price.toFixed(2)}</span>
                                            </p>
                                            <button
                                                className={`wl-card__cart-btn ${isInCart ? 'in-cart' : ''}`}
                                                onClick={e => { e.stopPropagation(); handleAddToCart(item) }}
                                            >
                                                {isInCart
                                                    ? t('wishlist.in_cart', '✓ In Cart')
                                                    : t('wishlist.add_cart', 'Add to Cart')
                                                }
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>

            {modalItem && (
                <AccessoryModal
                    accessory={modalItem}
                    discount={DISCOUNT}
                    onClose={() => setModalItem(null)}
                />
            )}
        </div>
    )
}

export default Wishlist