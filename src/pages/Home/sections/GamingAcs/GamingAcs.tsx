import AccessoryCard from '@/components/common/AccessoryCard/AccessoryCard'
import { useGameAccessories } from '@/hooks/useGameAccessories'
import './GamingAcs.scss'
import { useTranslation } from 'react-i18next'

const GamingAcs = () => {
    const { accessories, loading, error } = useGameAccessories()
    const { t } = useTranslation()

    if (loading) return <p className="gacs-status">{t('acs.loading')}</p>
    if (error) return <p className="gacs-status gacs-status--error">{t('acs.error')} {error}</p>

    return (
        <section className="gacs">
            <div className="gacs__header">
                <h2 className="gacs__tag">{t('acs.tag')}</h2>
                <h1 className="gacs__title">{t('acs.title')}</h1>
            </div>
            <div className="gacs__grid">
                {accessories.slice(0, 4).map(item => (
                    <AccessoryCard key={item.id} accessory={item} />
                ))}
            </div>
        </section>
    )
}

export default GamingAcs