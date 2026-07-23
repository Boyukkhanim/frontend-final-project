import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/data/supabaseClient'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/hooks/useAppSelector'
import { syncClearCart } from '@/store/slices/cartSlice'
import PageHero from '@/components/common/PageHero/PageHero'
import './Checkout.scss'

const COUPONS: Record<string, number> = {
    SAVE10: 10,
}

const paymentOptions = [
    { id: 'credit', labelKey: 'checkout.creditDebit' },
    { id: 'paypal', labelKey: 'checkout.paypal' },
    { id: 'payoneer', labelKey: 'checkout.payoneer' },
    { id: 'visa', labelKey: 'checkout.visa' },
    { id: 'mastercard', labelKey: 'checkout.mastercard' },
    { id: 'fastpay', labelKey: 'checkout.fastpay' },
]

const countries = ['USA', 'Azerbaijan', 'Turkey', 'Germany', 'United Kingdom', 'Canada', 'France']

const Checkout = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()

    const cartItems = useAppSelector(state => state.cart.items)

    const [userId, setUserId] = useState<string | null>(null)
    const [authChecked, setAuthChecked] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [selectedPayment, setSelectedPayment] = useState('credit')
    const [billing, setBilling] = useState({
        first_name: '',
        last_name: '',
        email: '',
        country: 'USA',
        address: '',
    })
    const [payment, setPayment] = useState({
        card_number: '',
        expiry: '',
        cvv: '',
        name_on_card: '',
        save: false,
    })

    // Coupon state
    const [couponInput, setCouponInput] = useState('')
    const [appliedDiscount, setAppliedDiscount] = useState(0)
    const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null)

    // Məbləğ hesablaması
    const subtotal = cartItems.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0)
    const discountAmount = (subtotal * appliedDiscount) / 100
    const total = subtotal - discountAmount

    // Auth yoxla
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                navigate('/login', { replace: true })
            } else {
                setUserId(data.session.user.id)
            }
            setAuthChecked(true)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) navigate('/login', { replace: true })
            else setUserId(session.user.id)
        })

        return () => listener.subscription.unsubscribe()
    }, [navigate])

    const handleApplyCoupon = () => {
        const code = couponInput.trim().toUpperCase()
        const discount = COUPONS[code]
        if (discount) {
            setAppliedDiscount(discount)
            setCouponMsg({ text: `${discount}% endirim tətbiq edildi!`, ok: true })
        } else {
            setAppliedDiscount(0)
            setCouponMsg({ text: 'Kod tapılmadı.', ok: false })
        }
    }

    const handleBillingChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => setBilling({ ...billing, [e.target.name]: e.target.value })

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setPayment({ ...payment, [name]: type === 'checkbox' ? checked : value })
    }

    const formatCardNumber = (value: string) =>
        value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

    const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        setPayment({ ...payment, card_number: formatCardNumber(e.target.value) })

    const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 6)
        if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2)
        setPayment({ ...payment, expiry: val })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userId) return
        setSubmitting(true)
        try {
            await dispatch(syncClearCart(userId))
            navigate('/order-success', { replace: true })
        } catch (err) {
            console.error('Checkout error:', err)
            setSubmitting(false)
        }
    }

    if (!authChecked) return null

    return (
        <div className="about-page">
            <PageHero titleKey="checkout.title" currentKey="checkout.current" />

            <section className="checkout-section">
                <div className="container">
                    <div className="checkout-layout">

                        {/* Left — Payment Type */}
                        <div className="checkout-sidebar">
                            <p className="checkout-sidebar__label">{t('checkout.selectOne')}</p>
                            <ul className="checkout-sidebar__list">
                                {paymentOptions.map(opt => (
                                    <li key={opt.id} className="checkout-sidebar__item">
                                        <label className="checkout-sidebar__radio-label">
                                            <input
                                                type="radio"
                                                name="payment_type"
                                                value={opt.id}
                                                checked={selectedPayment === opt.id}
                                                onChange={() => setSelectedPayment(opt.id)}
                                                className="checkout-sidebar__radio"
                                            />
                                            <span className="checkout-sidebar__radio-custom" />
                                            {t(opt.labelKey)}
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            {/* Order Summary */}
                            <div className="checkout-summary">
                                <p className="checkout-sidebar__label" style={{ marginTop: '32px' }}>
                                    {t('checkout.orderSummary') || 'Order Summary'}
                                </p>
                                <div className="checkout-summary__row">
                                    <span>{t('checkout.subtotal') || 'Subtotal'}</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {appliedDiscount > 0 && (
                                    <div className="checkout-summary__row checkout-summary__row--discount">
                                        <span>Endirim ({appliedDiscount}%)</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="checkout-summary__row checkout-summary__row--total">
                                    <span>{t('checkout.total') || 'Total'}</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="checkout-coupon">
                                <p className="checkout-sidebar__label" style={{ marginTop: '24px' }}>
                                    {t('checkout.coupon') || 'Coupon Code'}
                                </p>
                                <div className="checkout-coupon__row">
                                    <input
                                        className="checkout-coupon__input"
                                        type="text"
                                        placeholder="SAVE10"
                                        value={couponInput}
                                        onChange={e => setCouponInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                                    />
                                    <button
                                        type="button"
                                        className="checkout-coupon__btn"
                                        onClick={handleApplyCoupon}
                                    >
                                        {t('checkout.apply') || 'Apply'}
                                    </button>
                                </div>
                                {couponMsg && (
                                    <p className={`checkout-coupon__msg ${couponMsg.ok ? 'ok' : 'err'}`}>
                                        {couponMsg.text}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right — Forms */}
                        <div className="checkout-main">
                            <form onSubmit={handleSubmit} className="checkout-form">

                                <h2 className="checkout-form__section-title">{t('checkout.billingAddress')}</h2>

                                <div className="checkout-form__row">
                                    <div className="checkout-form__group">
                                        <input type="text" name="first_name" placeholder={t('checkout.firstName')}
                                            value={billing.first_name} onChange={handleBillingChange} required />
                                    </div>
                                    <div className="checkout-form__group">
                                        <input type="text" name="last_name" placeholder={t('checkout.lastName')}
                                            value={billing.last_name} onChange={handleBillingChange} required />
                                    </div>
                                </div>

                                <div className="checkout-form__row">
                                    <div className="checkout-form__group">
                                        <input type="email" name="email" placeholder={t('checkout.email')}
                                            value={billing.email} onChange={handleBillingChange} required />
                                    </div>
                                    <div className="checkout-form__group">
                                        <select name="country" value={billing.country} onChange={handleBillingChange}>
                                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="checkout-form__group checkout-form__group--full">
                                    <textarea name="address" placeholder={t('checkout.address')}
                                        value={billing.address} onChange={handleBillingChange} rows={4} required />
                                </div>

                                <h2 className="checkout-form__section-title checkout-form__section-title--mt">
                                    {t('checkout.paymentMethods')}
                                </h2>

                                <div className="checkout-form__group checkout-form__group--full">
                                    <label className="checkout-form__field-label">{t('checkout.cardNumber')}</label>
                                    <input type="text" name="card_number" placeholder="0000 0000 0000 0000"
                                        value={payment.card_number} onChange={handleCardInput} maxLength={19} required />
                                </div>

                                <div className="checkout-form__row">
                                    <div className="checkout-form__group">
                                        <label className="checkout-form__field-label">{t('checkout.expiryDate')}</label>
                                        <input type="text" name="expiry" placeholder="DD/MM/YY"
                                            value={payment.expiry} onChange={handleExpiryInput} required />
                                    </div>
                                    <div className="checkout-form__group">
                                        <label className="checkout-form__field-label">{t('checkout.cvv')}</label>
                                        <input type="text" name="cvv" placeholder={t('checkout.cvvPlaceholder')}
                                            value={payment.cvv} onChange={handlePaymentChange} maxLength={3} required />
                                    </div>
                                </div>

                                <div className="checkout-form__group checkout-form__group--full">
                                    <label className="checkout-form__field-label">{t('checkout.nameOnCard')}</label>
                                    <input type="text" name="name_on_card" placeholder={t('checkout.namePlaceholder')}
                                        value={payment.name_on_card} onChange={handlePaymentChange} required />
                                </div>

                                <label className="checkout-form__save">
                                    <input type="checkbox" name="save" checked={payment.save}
                                        onChange={handlePaymentChange} className="checkout-form__save-input" />
                                    <span className="checkout-form__save-box" />
                                    {t('checkout.saveCard')}
                                </label>

                                <button type="submit" className="checkout-form__btn" disabled={submitting}>
                                    {submitting ? t('checkout.processing') || 'Processing...' : t('checkout.payNow')}
                                </button>

                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default Checkout