import { useState, useEffect, useRef } from 'react'
import rightImg from '@/assets/images/home/text-image.png'
import client from '@/assets/images/home/client-1.png'
import './OurTestimonial.scss'
import { useTranslation } from 'react-i18next'

const DURATION = 4000

const OurTestimonial = () => {
    const { t } = useTranslation()
    const [current, setCurrent] = useState(0)
    const [exiting, setExiting] = useState(false)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const barRef = useRef<HTMLDivElement>(null)

    const testimonials = [
        { id: 1, name: t('testimoniall.t1.name'), role: t('testimoniall.t1.role'), text: t('testimoniall.t1.text') },
        { id: 2, name: t('testimoniall.t2.name'), role: t('testimoniall.t2.role'), text: t('testimoniall.t2.text') },
        { id: 3, name: t('testimoniall.t3.name'), role: t('testimoniall.t3.role'), text: t('testimoniall.t3.text') },
        { id: 4, name: t('testimoniall.t4.name'), role: t('testimoniall.t4.role'), text: t('testimoniall.t4.text') },
    ]

    const startAuto = (idx: number) => {
        if (timerRef.current) clearInterval(timerRef.current)
        if (barRef.current) {
            barRef.current.style.transition = 'none'
            barRef.current.style.width = '0%'
            void barRef.current.offsetWidth
            barRef.current.style.transition = `width ${DURATION}ms linear`
            barRef.current.style.width = '100%'
        }
        timerRef.current = setInterval(() => goTo((idx + 1) % testimonials.length), DURATION)
    }

    const goTo = (idx: number) => {
        if (exiting || idx === current) return
        setExiting(true)
        if (timerRef.current) clearInterval(timerRef.current)
        if (barRef.current) { barRef.current.style.transition = 'none'; barRef.current.style.width = '0%' }
        setTimeout(() => { setCurrent(idx); setExiting(false) }, 380)
    }

    useEffect(() => {
        startAuto(current)
        return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }, [current])

    return (
        <section className="testimonial">
            <div className="testimonial__left">
                <div className="testimonial__header">
                    <span className="testimonial__tag">{t('testimoniall.tag')}</span>
                    <h1 className="testimonial__title">{t('testimoniall.title')}</h1>
                </div>

                <div className="testimonial__stack-wrap">
                    <div className="testimonial__stack">
                        {[0, 1, 2].map((offset) => {
                            const item = testimonials[(current + offset) % testimonials.length]
                            return (
                                <div
                                    key={item.id}
                                    className="testimonial__card"
                                    data-pos={offset === 0 && exiting ? 'exit' : offset.toString()}
                                    onClick={() => offset === 0 ? goTo((current + 1) % testimonials.length) : undefined}
                                >
                                    <div className="testimonial__author">
                                        <img src={client} alt={item.name} className="testimonial__avatar" />
                                        <div>
                                            <h3 className="testimonial__name">{item.name}</h3>
                                            <p className="testimonial__role">{item.role}</p>
                                        </div>
                                    </div>
                                    <div className="testimonial__quote">
                                        <span className="testimonial__qmark">"</span>
                                        <p className="testimonial__text">{item.text}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="testimonial__dots">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                className={`testimonial__dot ${i === current ? 'active' : ''}`}
                                onClick={() => goTo(i)}
                            />
                        ))}
                    </div>
                </div>

                <div className="testimonial__progress">
                    <div className="testimonial__bar" ref={barRef} />
                </div>
            </div>

            <div className="testimonial__right">
                <div className="testimonial__rating">
                    <p className="testimonial__clients">{t('testimoniall.clientsRating')}</p>
                    <div className="testimonial__stars">
                        {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                </div>
                <img src={rightImg} alt="4.8 Rating" className="testimonial__right-img" />
            </div>
        </section>
    )
}

export default OurTestimonial