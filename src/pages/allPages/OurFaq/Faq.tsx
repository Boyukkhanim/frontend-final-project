import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa'
import './Faq.scss'
import { useTranslation } from 'react-i18next'
import PageHero from '@/components/common/PageHero/PageHero'

const Faq = () => {
    const [openId, setOpenId] = useState<number | null>(null)
    const { t } = useTranslation()

    const faqs = [
        { id: 1, question: t('faq.q1'), answer: t('faq.a1') },
        { id: 2, question: t('faq.q2'), answer: t('faq.a2') },
        { id: 3, question: t('faq.q3'), answer: t('faq.a3') },
        { id: 4, question: t('faq.q4'), answer: t('faq.a4') },
        { id: 5, question: t('faq.q5'), answer: t('faq.a5') },
    ]

    const toggle = (id: number) => {
        setOpenId((prev) => (prev === id ? null : id))
    }

    return (
        <div className="about-page">
            <PageHero titleKey="faq.title" currentKey="faq.current" />

            <section className="faq-section">
                <div className="faq-section__inner">
                    <div className="faq-section__left">
                        <h2 className="faq-section__title">{t('faq.heading')}</h2>
                        <p className="faq-section__desc">{t('faq.desc')}</p>

                        <div className="faq-accordion">
                            {faqs.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    className={`faq-accordion__item ${openId === faq.id ? 'faq-accordion__item--open' : ''}`}
                                >
                                    <button
                                        className="faq-accordion__header"
                                        onClick={() => toggle(faq.id)}
                                    >
                                        <span className="faq-accordion__num">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="faq-accordion__question">{faq.question}</span>
                                        <FaChevronDown className="faq-accordion__icon" />
                                    </button>
                                    <div className="faq-accordion__body">
                                        <p className="faq-accordion__answer">{faq.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="faq-contact">
                        <h3 className="faq-contact__title">{t('faq.needHelp')}</h3>
                        <p className="faq-contact__sub">{t('faq.needHelpSub')}</p>

                        <div className="faq-contact__divider" />

                        <div className="faq-contact__items">
                            <div className="faq-contact__item">
                                <div className="faq-contact__icon-wrap"><FaPhone /></div>
                                <div>
                                    <p className="faq-contact__label">{t('faq.callUs')}</p>
                                    <p className="faq-contact__value">+009 438 222 9540</p>
                                </div>
                            </div>

                            <div className="faq-contact__item">
                                <div className="faq-contact__icon-wrap"><FaEnvelope /></div>
                                <div>
                                    <p className="faq-contact__label">{t('faq.mailUs')}</p>
                                    <p className="faq-contact__value">infor@xridergamil.com</p>
                                </div>
                            </div>

                            <div className="faq-contact__item">
                                <div className="faq-contact__icon-wrap"><FaMapMarkerAlt /></div>
                                <div>
                                    <p className="faq-contact__label">{t('faq.location')}</p>
                                    <p className="faq-contact__value">Toronto, Montreal, City</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Faq