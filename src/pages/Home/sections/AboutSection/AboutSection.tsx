import { useEffect, useRef } from 'react'
import { icon1, icon2, icon3, icon4, photo1, photo2 } from '@/assets'
import './AboutSection.scss'
import { useTranslation } from 'react-i18next'




const AboutSection = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const { t } = useTranslation();
    const features = [
        { icon: icon1, title: 'VR Supported', desc: t('home.about_feature_card') },
        { icon: icon2, title: 'Location Tagging', desc: t('home.about_feature_card') },
        { icon: icon3, title: 'Multi Dimension', desc: t('home.about_feature_card') },
        { icon: icon4, title: 'Console System', desc: t('home.about_feature_card') },
    ]
    useEffect(() => {
        const section = sectionRef.current
        if (!section) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    section.querySelectorAll<HTMLElement>('.about__animate').forEach((el, i) => {
                        el.style.transitionDelay = `${i * 0.1}s`
                        el.classList.add('about__animate--visible')
                    })
                    observer.disconnect()
                }
            },
            { threshold: 0.15 }
        )
        observer.observe(section)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="about" ref={sectionRef}>
            <div className="about__inner">

                {/* ── Left ── */}
                <div className="about__left">
                    <div className="about__tag about__animate">{t('home.about_tag')}</div>

                    <h2 className="about__title about__animate">
                        {t('home.about_title')}<br />
                        <span>{t('home.about_span')}</span>
                    </h2>

                    <p className="about__desc about__animate">
                        {t('home.about_desc')}
                    </p>

                    <div className="about__grid">
                        {features.map((f, i) => (
                            <div className="about__card about__animate" key={i}>
                                <div className="about__card-icon">
                                    <img src={f.icon} alt={f.title} />
                                </div>
                                <div className="about__card-text">
                                    <h4>{f.title}</h4>
                                    <p>{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right ── */}
                <div className="about__right about__animate">
                    <img src={photo1} alt="Game 1" className="about__photo1" />

                    <div className="about__photo2-wrap">
                        <img src={photo2} alt="Game 2" className="about__photo2" />
                        <div className="about__red-border" />
                    </div>

                    {/* Floating badge */}
                    <div className="about__badge about__animate">
                        <span className="about__badge-num">10+</span>
                        <span className="about__badge-label">{t('home.years')}<br />{t('home.about_br')}</span>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default AboutSection