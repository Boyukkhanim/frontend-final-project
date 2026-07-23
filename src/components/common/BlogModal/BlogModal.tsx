import { useEffect } from 'react'
import { FiCalendar, FiX } from 'react-icons/fi'
import './BlogModal.scss'
import { useTranslation } from 'react-i18next'

interface BlogModalProps {
    id: number
    title: string
    titleaz?: string
    titleru?: string
    image_url: string
    content: string
    contentaz?: string
    contentru?: string
    created_at: string
    onClose: () => void
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).toUpperCase()
}

const BlogModal = ({ title, titleaz, titleru, image_url, content, contentaz, contentru, created_at, onClose }: BlogModalProps) => {
    const { i18n, t } = useTranslation()
    const lang = i18n.language

    const localTitle = (lang === 'az' && titleaz) ? titleaz
        : (lang === 'ru' && titleru) ? titleru
            : title

    const localContent = (lang === 'az' && contentaz) ? contentaz
        : (lang === 'ru' && contentru) ? contentru
            : content

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <div className="blog-modal-overlay" onClick={onClose}>
            <div className="blog-modal" onClick={e => e.stopPropagation()} role="dialog">

                <div className="blog-modal__left">
                    <img src={image_url} alt={localTitle} className="blog-modal__img" />
                </div>

                <div className="blog-modal__right">
                    <div className="blog-modal__tag">
                        <span className="blog-modal__tag-dot" />
                        {t('latestBlogs.tag')}
                    </div>

                    <h2 className="blog-modal__title">{localTitle}</h2>

                    <div className="blog-modal__meta">
                        <FiCalendar className="blog-modal__meta-icon" />
                        <span className="blog-modal__date">{formatDate(created_at)}</span>
                    </div>

                    <div className="blog-modal__divider" />

                    <p className="blog-modal__content">{localContent}</p>
                </div>

                <button className="blog-modal__close" onClick={onClose} aria-label={t('blogModal.close')}>
                    <FiX />
                </button>
            </div>
        </div>
    )
}

export default BlogModal