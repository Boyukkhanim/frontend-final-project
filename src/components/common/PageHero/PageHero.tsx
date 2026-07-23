import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import aboutBg from '@/assets/images/bg-image/breadcrumb.png'
import { useTranslation } from 'react-i18next'
import './PageHero.scss'

interface ExtraBreadcrumb {
    labelKey: string
    to: string
}

interface PageHeroProps {
    titleKey: string
    currentKey?: string
    currentLabel?: string
    extraBreadcrumb?: ExtraBreadcrumb
}

const PageHero = ({ titleKey, currentKey, currentLabel, extraBreadcrumb }: PageHeroProps) => {
    const { t } = useTranslation()

    return (
        <section
            className="page-hero"
            style={{ backgroundImage: `url(${aboutBg})` }}
        >
            <div className="page-hero__overlay" />
            <div className="page-hero__glow" />
            <div className="page-hero__content">
                <h1 className="page-hero__title">{t(titleKey)}</h1>
                <div className="page-hero__breadcrumb">
                    <FaHome className="page-hero__breadcrumb-icon" />
                    <Link to="/" className="page-hero__breadcrumb-home">{t('pageHero.home')}</Link>

                    {extraBreadcrumb && (
                        <>
                            <span className="page-hero__breadcrumb-sep">:</span>
                            <Link to={extraBreadcrumb.to} className="page-hero__breadcrumb-home">
                                {t(extraBreadcrumb.labelKey)}
                            </Link>
                        </>
                    )}

                    <span className="page-hero__breadcrumb-sep">:</span>
                    <span className="page-hero__breadcrumb-current">
                        {currentLabel ?? (currentKey ? t(currentKey) : '')}
                    </span>
                </div>
            </div>
        </section>
    )
}

export default PageHero