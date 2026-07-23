import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './OrderSuccess.scss'

const OrderSuccess = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    // 6 saniyə sonra avtomatik ana səhifəyə yönləndir
    useEffect(() => {
        const timer = setTimeout(() => navigate('/'), 6000)
        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div className="order-success">
            <div className="order-success__card">
                <div className="order-success__icon-wrap">
                    <svg className="order-success__checkmark" viewBox="0 0 52 52">
                        <circle className="order-success__circle" cx="26" cy="26" r="25" fill="none" />
                        <path className="order-success__check" fill="none" d="M14 27l8 8 16-16" />
                    </svg>
                </div>

                <h1 className="order-success__title">
                    {t('orderSuccess.title') || 'Order Placed!'}
                </h1>
                <p className="order-success__subtitle">
                    {t('orderSuccess.subtitle') || 'Thank you for your purchase. Your order has been received.'}
                </p>
                <p className="order-success__redirect">
                    {t('orderSuccess.redirect') || 'Redirecting to home in a few seconds...'}
                </p>

                <button
                    className="order-success__btn"
                    onClick={() => navigate('/')}
                >
                    {t('orderSuccess.goHome') || 'Back to Home'}
                </button>
            </div>
        </div>
    )
}

export default OrderSuccess