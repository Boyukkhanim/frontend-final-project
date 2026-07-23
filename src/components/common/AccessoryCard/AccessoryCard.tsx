import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { addToCart, syncAddToCart } from '@/store/slices/cartSlice'
import { toggleWishlist, syncToggleWishlist } from '@/store/slices/wishlistSlice'
import type { GameAccessory } from '@/hooks/useGameAccessories'
import AccessoryModal from '../AccessoryModal/AccessoryModal'
import { useLocalizedField } from '@/hooks/useLocalizedField'
import { useTranslation } from 'react-i18next'
import './AccessoryCard.scss'

type Props = {
    accessory: GameAccessory
}

const DISCOUNT = 25

const AccessoryCard = ({ accessory }: Props) => {
    const { localize } = useLocalizedField()
    const [modalOpen, setModalOpen] = useState(false)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const user = useAppSelector(state => state.auth.user)
    const cartItems = useAppSelector(state => state.cart.items)
    const wishlistItems = useAppSelector(state => state.wishlist.items)

    const discountedPrice = parseFloat((accessory.price * (1 - DISCOUNT / 100)).toFixed(2))
    const isInCart = cartItems.some(i => i.id === accessory.id)
    const isInWishlist = wishlistItems.some(i => i.id === accessory.id)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        const item = { ...accessory, quantity: 1, discountedPrice }
        if (user) {
            dispatch(syncAddToCart({ userId: user.id, item }))
        } else {
            dispatch(addToCart(item))
        }
    }

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (user) {
            dispatch(syncToggleWishlist({ userId: user.id, item: accessory, isInWishlist }))
        } else {
            dispatch(toggleWishlist(accessory))
        }
    }

    return (
        <>
            <div className="ac-card" onClick={() => setModalOpen(true)}>
                <span className="ac-card__badge">{DISCOUNT}% OFF</span>

                <div className="ac-card__actions">
                    <button
                        className={`ac-card__btn ${isInWishlist ? 'active' : ''}`}
                        aria-label={t('acs.like')}
                        onClick={handleToggleWishlist}
                    >
                        <svg viewBox="0 0 24 24" fill={isInWishlist ? 'red' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>

                    <button
                        className={`ac-card__btn ${isInCart ? 'active' : ''}`}
                        aria-label={t('acs.add_to_cart_aria')}
                        onClick={handleAddToCart}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke={isInCart ? 'red' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </button>

                    <button
                        className="ac-card__btn"
                        aria-label={t('acs.quick_view')}
                        onClick={e => { e.stopPropagation(); setModalOpen(true) }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>

                    <Link
                        className="ac-card__btn"
                        to={`/shop-details/${accessory.id}`}
                        onClick={e => e.stopPropagation()}
                        aria-label={t('acs.view_detail')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </Link>
                </div>

                <div className="ac-card__img-wrap">
                    <img src={accessory.image_url} alt={localize(accessory.name_i18n)} />
                </div>

                <div className="ac-card__body">
                    <h3 className="ac-card__name">{localize(accessory.name_i18n)}</h3>
                    <p className="ac-card__price">
                        <span className="price-new">${discountedPrice}</span>
                        <span className="price-old">${accessory.price.toFixed(2)}</span>
                    </p>
                </div>
            </div>

            {modalOpen && (
                <AccessoryModal
                    accessory={accessory}
                    discount={DISCOUNT}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    )
}

export default AccessoryCard