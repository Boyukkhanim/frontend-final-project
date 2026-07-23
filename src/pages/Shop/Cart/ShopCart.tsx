import { Link } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
    removeFromCart, increaseQty, decreaseQty, clearCart,
    syncRemoveFromCart, syncUpdateQty, syncClearCart
} from '@/store/slices/cartSlice'
import './ShopCart.scss'
import { useTranslation } from 'react-i18next'
import { useLocalizedField } from '@/hooks/useLocalizedField'

const ShopCart = () => {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const { localize } = useLocalizedField()
    const cartItems = useAppSelector(state => state.cart.items)
    const user = useAppSelector(state => state.auth.user)

    const subtotal = cartItems.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0)
    const shipping = cartItems.length > 0 ? 10 : 0
    const total = subtotal + shipping

    const handleIncrease = (id: number, currentQty: number) => {
        if (user) dispatch(syncUpdateQty({ userId: user.id, productId: id, quantity: currentQty + 1 }))
        else dispatch(increaseQty(id))
    }

    const handleDecrease = (id: number, currentQty: number) => {
        if (user) dispatch(syncUpdateQty({ userId: user.id, productId: id, quantity: currentQty - 1 }))
        else dispatch(decreaseQty(id))
    }

    const handleRemove = (id: number) => {
        if (user) dispatch(syncRemoveFromCart({ userId: user.id, productId: id }))
        else dispatch(removeFromCart(id))
    }

    const handleClear = () => {
        if (user) dispatch(syncClearCart(user.id))
        else dispatch(clearCart())
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <div className="cart-empty__inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <h2>{t('cart.emptyTitle')} <span>{t('cart.emptyTitleRed')}</span></h2>
                    <p>{t('cart.emptyDesc')}</p>
                    <Link to="/shop" className="cart-empty__btn">{t('cart.goShop')}</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="shop-cart">
            <div className="container">
                <div className="cart-title">
                    <span className="cart-title__tag">{t('cart.titleTag')}</span>
                    <h1>{t('cart.title')} <span className="red">{t('cart.titleRed')}</span></h1>
                </div>

                <div className="cart-layout">
                    <div className="cart-table-wrap">
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>{t('cart.product')}</th>
                                    <th>{t('cart.price')}</th>
                                    <th>{t('cart.quantity')}</th>
                                    <th>{t('cart.total')}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(item => (
                                    <tr key={item.id}>
                                        <td className="cart-table__product">
                                            <img src={item.image_url} alt={localize(item.name_i18n)} />
                                            <span>{localize(item.name_i18n)}</span>
                                        </td>
                                        <td className="cart-table__price">${item.discountedPrice.toFixed(2)}</td>
                                        <td className="cart-table__qty">
                                            <div className="qty-control">
                                                <button onClick={() => handleDecrease(item.id, item.quantity)}>−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleIncrease(item.id, item.quantity)}>+</button>
                                            </div>
                                        </td>
                                        <td className="cart-table__total">${(item.discountedPrice * item.quantity).toFixed(2)}</td>
                                        <td className="cart-table__remove">
                                            <button onClick={() => handleRemove(item.id)}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="cart-actions">
                            <Link to="/shop" className="cart-actions__continue">← {t('cart.continueShopping')}</Link>
                            <button className="cart-actions__clear" onClick={handleClear}>{t('cart.clearCart')}</button>
                        </div>
                    </div>

                    <div className="cart-summary">
                        <h3>{t('cart.orderSummary')} <span className="red">{t('cart.orderSummaryRed')}</span></h3>
                        <div className="cart-summary__row">
                            <span>{t('cart.subtotal')}</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary__row">
                            <span>{t('cart.shipping')}</span>
                            <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary__divider" />
                        <div className="cart-summary__row cart-summary__row--total">
                            <span>{t('cart.totalLabel')}</span>
                            <span className="red">${total.toFixed(2)}</span>
                        </div>
                        <div className="cart-summary__coupon">
                            <input type="text" placeholder={t('cart.couponPlaceholder')} />
                            <button>{t('cart.apply')}</button>
                        </div>
                        <Link to="/checkout" className="cart-summary__checkout">{t('cart.checkout')}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopCart