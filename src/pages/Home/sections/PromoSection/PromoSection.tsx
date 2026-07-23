import './PromoSection.scss';
import overlay from '@/assets/images/bg-image/overlay.png'
import circle from '@/assets/images/icons/home-icon/circle.png'
import { hero3 } from '@/assets';
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const MarqueeRow = ({ text }: { text: string }) => (
    <>
        {Array(6).fill(null).map((_, i) => (
            <span key={i} className="marquee__item">
                {text}
                <img src={circle} alt="" className="marquee__item__icon" />
            </span>
        ))}
    </>
)

const PromoSection = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div>
            <div className='marquee'>
                <img src={overlay} alt="Overlay" className="marquee__overlay" />
                <div className="marquee__row marquee__row--left">
                    <MarqueeRow text={t('promoSection.marqueeRow1')} />
                    <MarqueeRow text={t('promoSection.marqueeRow1')} />
                </div>
                <div className="marquee__row marquee__row--right">
                    <MarqueeRow text={t('promoSection.marqueeRow2')} />
                    <MarqueeRow text={t('promoSection.marqueeRow2')} />
                </div>
            </div>

            <section
                className="hero-3 d-flex align-items-center"
                style={{ backgroundImage: `url(${hero3})` }}
            >
                <div className="container">
                    <div className="row g-4 align-items-center justify-content-between">

                        <div className="col-12 col-lg-5">
                            <div className="gt-games-content">
                                <h6>{t('promoSection.leftTag')}</h6>
                                <h2>
                                    {t('promoSection.leftTitle')}<br />
                                    {t('promoSection.leftTitleBr')}
                                </h2>
                                <button
                                    className="gt-theme-btn"
                                    onClick={() => navigate('/game-details')}
                                >
                                    <span>{t('promoSection.leftBtn')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className="gt-games-content">
                                <h6>{t('promoSection.rightTag')}</h6>
                                <h2>
                                    {t('promoSection.rightTitle')}<br />
                                    {t('promoSection.rightTitleBr')}
                                </h2>
                                <button
                                    className="gt-theme-btn"
                                    onClick={() => navigate('/game-details')}
                                >
                                    <span>{t('promoSection.rightBtn')}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default PromoSection