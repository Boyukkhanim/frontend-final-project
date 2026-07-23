import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { addToCart, syncAddToCart } from '@/store/slices/cartSlice'
import { toggleWishlist, syncToggleWishlist } from '@/store/slices/wishlistSlice'
import type { GameAccessory } from '@/hooks/useGameAccessories'
import './AccessoryModal.scss'
import { useLocalizedField } from '@/hooks/useLocalizedField'
import { useTranslation } from 'react-i18next'

type Props = {
    accessory: GameAccessory
    discount: number
    onClose: () => void
}

const AccessoryModal = ({ accessory, discount, onClose }: Props) => {
    const { localize } = useLocalizedField()
    const [qty, setQty] = useState(1)
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const user = useAppSelector(state => state.auth.user)
    const isInWishlist = useAppSelector(state =>
        state.wishlist.items.some(i => i.id === accessory.id)
    )

    const discountedPrice = parseFloat((accessory.price * (1 - discount / 100)).toFixed(2))

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    const handleAddToCart = () => {
        const item = { ...accessory, quantity: qty, discountedPrice }
        if (user) {
            dispatch(syncAddToCart({ userId: user.id, item }))
        } else {
            dispatch(addToCart(item))
        }
        onClose()
    }

    const handleBuyNow = () => {
        const item = { ...accessory, quantity: qty, discountedPrice }
        if (user) {
            dispatch(syncAddToCart({ userId: user.id, item }))
        } else {
            dispatch(addToCart(item))
        }
        navigate('/shop-cart')
        onClose()
    }

    const handleToggleWishlist = () => {
        if (user) {
            dispatch(syncToggleWishlist({ userId: user.id, item: accessory, isInWishlist }))
        } else {
            dispatch(toggleWishlist(accessory))
        }
    }

    return (
        <div className="ac-modal-overlay" onClick={onClose}>
            <div className="ac-modal" onClick={e => e.stopPropagation()} role="dialog">

                <div className="ac-modal__left">
                    <div className="ac-modal__main-img">
                        <img src={accessory.image_url} alt={localize(accessory.name_i18n)} />
                    </div>
                </div>

                <div className="ac-modal__right">
                    <div className="ac-modal__brand">
                        <span className="ac-modal__brand-dot" />
                        {t('acs.brand')}
                    </div>

                    <h2 className="ac-modal__title">{localize(accessory.name_i18n)}</h2>

                    <div className="ac-modal__stars">
                        {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} className={`ac-modal__star ${i <= 4 ? 'filled' : ''}`}>★</span>
                        ))}
                        <span className="ac-modal__review">{t('acs.reviews')}</span>
                    </div>

                    <div className="ac-modal__divider" />

                    <div className="ac-modal__prices">
                        <div className="ac-modal__price-tag">
                            {t('acs.regular_price')} <span>${accessory.price.toFixed(2)}</span>
                        </div>
                        <div className="ac-modal__price-tag ac-modal__price-tag--discount">
                            {t('acs.discount_price')} <span>${discountedPrice.toFixed(2)}</span>
                        </div>
                        <div className="ac-modal__price-tag">
                            {t('acs.code')} <span>#{accessory.id.toString().padStart(4, '0')}</span>
                        </div>
                    </div>

                    <div className="ac-modal__status">
                        {t('acs.status')} <span>{t('acs.in_stock')}</span>
                    </div>

                    <div className="ac-modal__actions">
                        <div className="ac-modal__qty">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(q => q + 1)}>+</button>
                        </div>
                        <button className="ac-modal__add" onClick={handleAddToCart}>
                            {t('acs.add_to_cart')}
                        </button>
                        <button className="ac-modal__buy" onClick={handleBuyNow}>
                            {t('acs.buy_now')}
                        </button>
                    </div>

                    <button
                        className={`ac-modal__wishlist ${isInWishlist ? 'active' : ''}`}
                        onClick={handleToggleWishlist}
                    >
                        {isInWishlist ? `♥ ${t('acs.added_to_wishlist')}` : `♡ ${t('acs.add_to_wishlist')}`}
                    </button>
                </div>

                <button className="ac-modal__close" onClick={onClose}>✕</button>
            </div>
        </div>
    )
}

export default AccessoryModal