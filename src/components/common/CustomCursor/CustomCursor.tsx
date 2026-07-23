import { useEffect, useRef } from 'react'
import './CustomCursor.scss'

const CustomCursor = () => {
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let mouseX = 0, mouseY = 0
        let ringX = 0, ringY = 0
        let frame: number

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY

            // Dot — anında izləyir
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`
            }
        }

        // Ring — lag ilə izləyir (lerp)
        const animate = () => {
            ringX += (mouseX - ringX) * 0.12
            ringY += (mouseY - ringY) * 0.12

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`
            }
            frame = requestAnimationFrame(animate)
        }

        // Hover effekti — linklər və düymələr üzərindəki ring böyüsün
        const onEnter = () => {
            ringRef.current?.classList.add('cursor-ring--hover')
            dotRef.current?.classList.add('cursor-dot--hover')
        }
        const onLeave = () => {
            ringRef.current?.classList.remove('cursor-ring--hover')
            dotRef.current?.classList.remove('cursor-dot--hover')
        }

        const addHover = () => {
            document.querySelectorAll('a, button, [role="button"]').forEach(el => {
                el.addEventListener('mouseenter', onEnter)
                el.addEventListener('mouseleave', onLeave)
            })
        }

        document.addEventListener('mousemove', onMove)
        animate()
        addHover()

        // DOM dəyişəndə yenidən hover əlavə et
        const mo = new MutationObserver(addHover)
        mo.observe(document.body, { childList: true, subtree: true })

        return () => {
            document.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(frame)
            mo.disconnect()
        }
    }, [])

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    )
}

export default CustomCursor