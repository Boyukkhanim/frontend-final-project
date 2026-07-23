// Counter.tsx
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Counter.scss'

interface CounterItem {
    value: number
    suffix: string
    labelKey: string
}

const counters: CounterItem[] = [
    { value: 200, suffix: '+', labelKey: 'counter.market' },
    { value: 95, suffix: '+', labelKey: 'counter.specialists' },
    { value: 1.2, suffix: 'K+', labelKey: 'counter.games' },
    { value: 3.5, suffix: 'K+', labelKey: 'counter.clients' },
]

const useCountUp = (target: number, duration: number, trigger: boolean) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (!trigger) return
        let start = 0
        const step = target / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(timer) }
            else setCount(parseFloat(start.toFixed(1)))
        }, 16)
        return () => clearInterval(timer)
    }, [trigger, target, duration])
    return count
}

const CounterCard = ({ item, trigger }: { item: CounterItem; trigger: boolean }) => {
    const { t } = useTranslation()
    const count = useCountUp(item.value, 1800, trigger)
    const display = Number.isInteger(item.value) ? Math.round(count) : count.toFixed(1)

    return (
        <div className="counter-card">
            <div className="counter-card__circle">
                <div className="counter-card__number">
                    {display}
                    <span className="counter-card__suffix">{item.suffix}</span>
                </div>
                <p className="counter-card__label">{t(item.labelKey)}</p>
            </div>
        </div>
    )
}

const Counter = () => {
    const [triggered, setTriggered] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="counter-section" ref={ref}>
            <div className="counter-section__grid">
                {counters.map((item, i) => (
                    <CounterCard key={i} item={item} trigger={triggered} />
                ))}
            </div>
        </section>
    )
}

export default Counter