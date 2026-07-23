import { useEffect, useState } from 'react'
import './Preloader.scss'

const Preloader = () => {
    const [visible, setVisible] = useState(true)
    const [fading, setFading] = useState(false)

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFading(true), 1800)
        const hideTimer = setTimeout(() => setVisible(false), 2400)
        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(hideTimer)
        }
    }, [])

    if (!visible) return null

    return (
        <div className={`preloader ${fading ? 'preloader--fade' : ''}`}>
            <div className="preloader__spinner" />
            <div className="preloader__logo">
                <span className="preloader__logo-text">XPORTS</span>
            </div>
            <p className="preloader__loading">L O A D I N G</p>
        </div>
    )
}

export default Preloader