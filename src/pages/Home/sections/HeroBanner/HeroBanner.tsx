import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { hero, hammerImg } from '@/assets'
import './HeroBanner.scss'
import { useTranslation } from 'react-i18next'

const HeroBanner = () => {
    const navigate = useNavigate()
    const hammerRef = useRef<HTMLImageElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const { t } = useTranslation();
    useEffect(() => {
        const hammer = hammerRef.current
        const content = contentRef.current
        if (!hammer || !content) return

        let frame: number
        let t = 0
        const animate = () => {
            t += 0.015
            hammer.style.transform = `translateY(${Math.sin(t) * 12}px) rotate(${Math.sin(t * 0.5) * 2}deg)`
            frame = requestAnimationFrame(animate)
        }
        animate()

        // Stagger reveal
        const els = content.querySelectorAll<HTMLElement>('.hero__animate')
        els.forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.15}s`
            el.classList.add('hero__animate--visible')
        })

        return () => cancelAnimationFrame(frame)
    }, [])

    return (
        <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
            <div className="hero__noise" />
            <div className="hero__gradient" />

            <div className="hero__inner">
                <div className="hero__left">
                    <img ref={hammerRef} src={hammerImg} alt="Hammer" className="hero__hammer" />
                </div>

                <div className="hero__right" ref={contentRef}>
                    <p className="hero__sub hero__animate">
                        {t('home.hero__sub')}
                    </p>
                    <h1 className="hero__title hero__animate">
                        {t('home.hero__title')}<br />
                        {t('home.hero__br')}
                    </h1>
                    <div className="hero__buttons hero__animate">
                        <button className="hero__btn hero__btn--red" onClick={() => navigate('/our-games')}>
                            {t('home.hero__btnOne')}
                        </button>
                        <button className="hero__btn hero__btn--outline" onClick={() => navigate('/our-games')}>
                            {t('home.hero__btnTwo')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative corner lines */}
            <div className="hero__corner hero__corner--tl" />
            <div className="hero__corner hero__corner--br" />
        </section>
    )
}

export default HeroBanner