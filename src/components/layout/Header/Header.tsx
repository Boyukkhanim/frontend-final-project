import { Link } from 'react-router-dom';
import logo from '../../../assets/images/icons/project-logo.svg';
import { useState, useEffect, type FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faSun, faMoon, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { logoutUser } from '@/store/slices/authSlice';
import './Header.scss';
import { useTranslation } from 'react-i18next';
import { toggleTheme } from '@/store/slices/themeSlice';
import { clearCart } from '@/store/slices/cartSlice';
import { clearWishlist } from '@/store/slices/wishlistSlice';
import SearchOverlay from '@/components/common/SearchOverlay/SearchOverlay';

interface SubMenuItem {
    title: string;
    link: string;
    img?: string;
    submenu?: SubMenuItem[];
}

interface MenuItem {
    title: string;
    link: string;
    submenu?: SubMenuItem[];
}

const LANGUAGES = [
    { code: 'EN', label: 'En' },
    { code: 'AZ', label: 'Az' },
    { code: 'RU', label: 'Ru' },
];

interface RenderSubMenuProps {
    items: SubMenuItem[];
}

const RenderSubMenu: FC<RenderSubMenuProps> = ({ items }) => (
    <ul className="dropdown-menu">
        {items.map((sub, j) => (
            <li key={j} className={sub.submenu ? 'dropdown-submenu' : ''}>
                <Link className="dropdown-item" to={sub.link}>{sub.title}</Link>
                {sub.submenu && <RenderSubMenu items={sub.submenu} />}
            </li>
        ))}
    </ul>
);


// ── Mobile submenu komponenti ─────────────────────────
interface MobileSubProps {
    items: SubMenuItem[];
    depth?: number;
}

const MobileSubMenu: FC<MobileSubProps> = ({ items, depth = 0 }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <ul className={depth === 0 ? 'mobile-nav__sub open' : 'mobile-nav__sub-sub open'}>
            {items.map((item, i) => (
                <li key={i}>
                    {item.submenu ? (
                        <>
                            <a
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.title}
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`mobile-nav__chevron ${openIndex === i ? 'open' : ''}`}
                                />
                            </a>
                            {openIndex === i && (
                                <MobileSubMenu items={item.submenu} depth={depth + 1} />
                            )}
                        </>
                    ) : (
                        <Link to={item.link}>{item.title}</Link>
                    )}
                </li>
            ))}
        </ul>
    );
};

// ── Ana komponent ─────────────────────────────────────
const Header = () => {
    const { t, i18n } = useTranslation();
    const isDark = useAppSelector(state => state.theme.isDark);
    const [langOpen, setLangOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false)
    const currentLang = i18n.language.toUpperCase().slice(0, 2);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const cartItems = useAppSelector((state) => state.cart.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Scroll: header arxası üçün
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Mobile menyu açıq ikən body scroll kilidlənir
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const closeMobile = () => {
        setMobileOpen(false);
        setOpenMobileIndex(null);
    };
    const menuItems: MenuItem[] = [
        { title: t('nav.home'), link: '/' },
        {
            title: t('nav.pages'), link: '/pages',
            submenu: [
                { title: t('nav.about'), link: '/about-us' },
                {
                    title: t('nav.ourGames'), link: '/our-games',

                },
                { title: t('nav.ourTeam'), link: '/our-team' },
                { title: t('nav.wishlist'), link: '/wishlist' },
                { title: t('nav.testimonial'), link: '/testimonial' },
                { title: t('nav.faq'), link: '/faq' },
                { title: '404 PAGE', link: '*' },
            ],
        },
        {
            title: t('nav.shop'), link: '/shop',
            submenu: [
                { title: t('nav.shopPage'), link: '/shop' },
                { title: t('nav.shopCart'), link: '/shop-cart' },
                { title: t('nav.checkout'), link: '/checkout' },
            ],
        },
        { title: t('nav.blog'), link: '/blog' },
        { title: t('nav.contact'), link: '/contact-us' },
    ];

    const handleLogout = () => {
        dispatch(logoutUser())
        dispatch(clearCart())
        dispatch(clearWishlist())
        closeMobile()
    }


    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container d-flex justify-content-between align-items-center">

                {/* Logo */}
                <Link to="/" onClick={closeMobile}>
                    <img src={logo} alt="logo-img" />
                </Link>

                {/* ── Desktop nav ── */}
                <div className="nav">
                    <ul className="dropdown d-flex align-items-center gap-5 mt-4">
                        {menuItems.map((menu, i) => (
                            <li key={i} className="dropdown">
                                <Link className="item" to={menu.link}>{menu.title}</Link>
                                {menu.submenu && (
                                    <ul className="dropdown-menu">
                                        {menu.submenu.map((sub, j) => (
                                            <li key={j} className={sub.submenu ? 'dropdown-submenu' : ''}>
                                                <Link className="dropdown-item" to={sub.link}>{sub.title}</Link>
                                                {sub.submenu && <RenderSubMenu items={sub.submenu} />}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Sağ ikonlar ── */}
                <div className="header-icons">
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="icon"
                        onClick={() => setSearchOpen(true)}
                        style={{ cursor: 'pointer' }}
                    />

                    <Link to="/shop-cart" className="cart-icon-wrap">
                        <FontAwesomeIcon icon={faCartShopping} className="icon" />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    <button className="mode-toggle" onClick={() => dispatch(toggleTheme())}>
                        <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
                    </button>

                    {/* Desktop lang selector */}
                    <div className="lang-selector">
                        <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                            {currentLang} <span className="lang-arrow">▾</span>
                        </button>
                        {langOpen && (
                            <ul className="lang-dropdown">
                                {LANGUAGES.map(lang => (
                                    <li
                                        key={lang.code}
                                        className={lang.code === currentLang ? 'active' : ''}
                                        onClick={() => { i18n.changeLanguage(lang.code.toLowerCase()); setLangOpen(false); }}
                                    >
                                        {lang.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Desktop auth (tablet-də gizlənir, mobile nav-da göstərilir) */}
                    {user ? (
                        <div className="user-auth">
                            <span className="user-name">{user.full_name || user.email}</span>
                            <button className="btn btn-outline-danger rounded-pill px-3" onClick={handleLogout}>
                                {t('auth.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="auth-btns">
                            <Link className="btn btn-light rounded-pill px-3" to="/login">{t('auth.signIn')}</Link>
                            <Link className="btn btn-danger rounded-pill px-3" to="/register">{t('auth.register')}</Link>
                        </div>
                    )}

                    {/* ── Hamburger düyməsi ── */}
                    <button
                        className={`hamburger ${mobileOpen ? 'open' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menyunu aç/bağla"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>

            {/* ── Mobile nav overlay ── */}
            <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
                <ul className="mobile-nav__list">
                    {menuItems.map((menu, i) => (
                        <li key={i} className="mobile-nav__item">
                            {menu.submenu ? (
                                <>
                                    <span
                                        className="mobile-nav__link"
                                        onClick={() => setOpenMobileIndex(openMobileIndex === i ? null : i)}
                                    >
                                        {menu.title}
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={`mobile-nav__chevron ${openMobileIndex === i ? 'open' : ''}`}
                                        />
                                    </span>
                                    {openMobileIndex === i && (
                                        <MobileSubMenu items={menu.submenu} />
                                    )}
                                </>
                            ) : (
                                <Link className="mobile-nav__link" to={menu.link} onClick={closeMobile}>
                                    {menu.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Mobile nav alt hissə */}
                <div className="mobile-nav__footer">

                    {/* Dil seçimi */}
                    <div className="mobile-nav__lang">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                className={lang.code === currentLang ? 'active' : ''}
                                onClick={() => i18n.changeLanguage(lang.code.toLowerCase())}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>

                    {/* Auth */}
                    {user ? (
                        <div className="mobile-nav__user">
                            <span className="user-name">{user.full_name || user.email}</span>
                            <button className="btn btn-outline-danger rounded-pill px-3" onClick={handleLogout}>
                                {t('auth.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="mobile-nav__auth">
                            <Link className="btn btn-light rounded-pill" to="/login" onClick={closeMobile}>
                                {t('auth.signIn')}
                            </Link>
                            <Link className="btn btn-danger rounded-pill" to="/register" onClick={closeMobile}>
                                {t('auth.register')}
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
            <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        </header>
    );
};

export default Header;