import { useNavigate } from 'react-router-dom'
import './Join.scss'
import { useTranslation } from 'react-i18next'

const Join = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <section className="join">
            <div className="join__stripes">
                <span /><span /><span />
            </div>

            <div className="join__content">
                <h2 className="join__title">
                    {t('join.titleLine1')}<br />
                    {t('join.titleLine2')}<br />
                    {t('join.titleLine3')}
                </h2>
                <button
                    className="join__btn"
                    onClick={() => navigate('/contact-us')}
                >
                    {t('join.btn')}
                </button>
            </div>

            <div className="join__overlay" />
        </section>
    )
}

export default Join