import { useNavigate } from 'react-router-dom'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { FiArrowUp } from 'react-icons/fi'
import logo from '@/assets/images/icons/project-logo.svg'
import './Footer.scss'
import { useTranslation } from 'react-i18next'

const Footer = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const studioLinks = [
        { label: t('footer.aboutUs'), path: '/about-us' },
        { label: t('footer.ourGames'), path: '/our-games' },
        { label: t('footer.ourTeam'), path: '/our-team' },
        { label: t('footer.testimonial'), path: '/testimonial' },
        { label: t('footer.epicGallery'), path: '/epic-gallery' },
    ]

    const shopLinks = [
        { label: t('footer.shop'), path: '/shop' },
        { label: t('footer.cart'), path: '/shop-cart' },
        { label: t('footer.shopDetails'), path: '/shop-details' },
        { label: t('footer.checkout'), path: '/checkout' },
    ]

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <footer className="footer">
            <div className="footer__top">

                {/* Col 1 — Brand */}
                <div className="footer__brand">
                    <div className="footer__logo" onClick={() => navigate('/')}>
                        <img src={logo} alt="logo-img" />
                    </div>
                    <p className="footer__desc">{t('footer.desc')}</p>
                    <div className="footer__socials">
                        {[
                            { icon: <FaFacebookF />, href: '#' },
                            { icon: <FaTwitter />, href: '#' },
                            { icon: <FaLinkedinIn />, href: '#' },
                            { icon: <FaInstagram />, href: '#' },
                        ].map((s, i) => (
                            <a key={i} href={s.href} className="footer__social" target="_blank" rel="noreferrer">
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Col 2 — Our Studio */}
                <div className="footer__col">
                    <h4 className="footer__col-title">{t('footer.studioTitle')}</h4>
                    <ul className="footer__links">
                        {studioLinks.map((l, i) => (
                            <li key={i}>
                                <button onClick={() => navigate(l.path)} className="footer__link">
                                    {l.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 3 — Shop */}
                <div className="footer__col">
                    <h4 className="footer__col-title">{t('footer.shopTitle')}</h4>
                    <ul className="footer__links">
                        {shopLinks.map((l, i) => (
                            <li key={i}>
                                <button onClick={() => navigate(l.path)} className="footer__link">
                                    {l.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 4 — Download */}
                <div className="footer__col">
                    <h4 className="footer__col-title">{t('footer.downloadTitle')}</h4>
                    <div className="footer__stores">
                        <a href="#" className="footer__store" target="_blank" rel="noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.36.2.78.2 1.14 0l10.76-6.22-2.28-2.28-9.62 8.5zm-1.44-20.1a2 2 0 0 0-.24.96v18.76a2 2 0 0 0 .24.96l.1.1 10.5-10.5v-.24L1.84 3.56l-.1.1zm19.44 8.88-2.96-1.72-2.54 2.54 2.54 2.54 2.98-1.72a1.16 1.16 0 0 0 0-1.64zm-16.9 9.72 10.76-6.22-2.28-2.28-8.48 8.5z" /></svg>
                            <div>
                                <span>{t('footer.getItOn')}</span>
                                <strong>Google Play</strong>
                            </div>
                        </a>
                        <a href="#" className="footer__store" target="_blank" rel="noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                            <div>
                                <span>{t('footer.getItOn')}</span>
                                <strong>App Store</strong>
                            </div>
                        </a>
                    </div>
                </div>

            </div>

            {/* Bottom bar */}
            <div className="footer__bottom">
                <p className="footer__copy">{t('footer.copy')}</p>
                <div className="footer__bottom-links">
                    {[
                        { label: t('footer.comingSoon'), path: '/coming-soon' },
                        { label: t('footer.aboutUs'), path: '/about-us' },
                    ].map((item, i) => (
                        <button key={i} className="footer__bottom-link" onClick={() => navigate(item.path)}>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <button className="footer__scroll-top" onClick={scrollToTop} aria-label={t('footer.scrollTop')}>
                <FiArrowUp />
            </button>
        </footer>
    )
}

export default Footer