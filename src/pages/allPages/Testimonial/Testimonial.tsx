import './Testimontial.scss'
import { useTestimonials } from '@/hooks/useTestimontials'
import TestimonialCard from '@/components/common/TestimontialCard/TestimontialCard'
import Preloader from '@/components/common/Preloader/Preloader'
import PageHero from '@/components/common/PageHero/PageHero'
import { useTranslation } from 'react-i18next'

const Testimontial = () => {
    const { testimonials, loading, error } = useTestimonials()
    const { t } = useTranslation()

    return (
        <div className="about-page">
            <PageHero titleKey="testimonialPage.title" currentKey="testimonialPage.current" />

            <section className="t-grid-section">
                {loading && <Preloader />}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{t('testimonialPage.error')} {error}</p>}
                {!loading && !error && (
                    <div className="t-grid">
                        {testimonials.map((t) => (
                            <TestimonialCard
                                key={t.id}
                                initials={t.initials}
                                name={t.name}
                                role={t.role}
                                text={t.text}
                                imageUrl={t.image_url}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Testimontial