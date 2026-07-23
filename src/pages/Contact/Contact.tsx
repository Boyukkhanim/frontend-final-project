import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { supabase } from '@/data/supabaseClient'
import { useTranslation } from 'react-i18next'
import PageHero from '@/components/common/PageHero/PageHero'
import './Contact.scss'

const Contact = () => {
    const { t } = useTranslation()
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        message: '',
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError(null)
        setSuccess(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await supabase.from('contacts').insert([formData])
        if (error) setError(error.message)
        else {
            setSuccess(true)
            setFormData({ full_name: '', email: '', message: '' })
        }
        setLoading(false)
    }

    return (
        <div className="about-page">
            <PageHero titleKey="contactt.title" currentKey="contactt.current" />

            <section className="contact-section">
                <div className="container">
                    <div className="contact-layout">

                        {/* Left — Form */}
                        <div className="contact-form-wrap">
                            <h2 className="contact-form-wrap__title">{t('contactt.formTitle')}</h2>
                            <p className="contact-form-wrap__sub">{t('contactt.formSub')}</p>

                            {success && <div className="contact-success">✓ {t('contactt.success')}</div>}
                            {error && <div className="contact-error">{error}</div>}

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="contact-form__row">
                                    <div className="contact-form__group">
                                        <label>{t('contactt.nameLabel')}</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            placeholder={t('contactt.namePlaceholder')}
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="contact-form__group">
                                        <label>{t('contactt.emailLabel')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder={t('contactt.emailPlaceholder')}
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="contact-form__group">
                                    <label>{t('contactt.messageLabel')}</label>
                                    <textarea
                                        name="message"
                                        placeholder={t('contactt.messagePlaceholder')}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={7}
                                    />
                                </div>

                                <button type="submit" className="contact-form__btn" disabled={loading}>
                                    {loading ? t('contactt.sending') : t('contactt.submit')}
                                </button>
                            </form>
                        </div>

                        {/* Right — Info Card */}
                        <div className="contact-card">
                            <div className="contact-card__top">
                                <h3>{t('contactt.cardTitle')}</h3>
                                <p>{t('contactt.cardSub')}</p>

                                <div className="contact-card__divider" />

                                <div className="contact-card__items">
                                    <div className="contact-card__item">
                                        <div className="contact-card__icon"><FaPhone /></div>
                                        <div>
                                            <p className="contact-card__label">{t('contactt.callLabel')}</p>
                                            <p className="contact-card__value">+009 438 222 9540</p>
                                        </div>
                                    </div>

                                    <div className="contact-card__item">
                                        <div className="contact-card__icon"><FaEnvelope /></div>
                                        <div>
                                            <p className="contact-card__label">{t('contactt.mailLabel')}</p>
                                            <p className="contact-card__value">INFOR@XRIDERGAMIL.COM</p>
                                        </div>
                                    </div>

                                    <div className="contact-card__item">
                                        <div className="contact-card__icon"><FaMapMarkerAlt /></div>
                                        <div>
                                            <p className="contact-card__label">{t('contactt.locationLabel')}</p>
                                            <p className="contact-card__value">TORONTO, MONTREAL, CITY</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact