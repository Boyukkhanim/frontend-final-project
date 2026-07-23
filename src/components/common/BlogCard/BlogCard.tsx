import { useState, type FC } from 'react'
import { FiArrowUpRight, FiCalendar } from 'react-icons/fi'
import BlogModal from '../BlogModal/BlogModal';
import './BlogCard.scss'
interface BlogCardProps {
    id: number
    title: string
    titleaz?: string
    titleru?: string
    image_url: string
    content: string
    contentaz?: string
    contentru?: string
    created_at: string
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).toUpperCase()
}

const BlogCard: FC<BlogCardProps> = ({ id, title, titleaz, titleru, image_url, content, contentaz, contentru, created_at }) => {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <>
            <article className="blog-card">
                <div className="blog-card__img-wrap">
                    <img src={image_url} alt={title} className="blog-card__img" />
                    <div className="blog-card__img-overlay" />
                </div>

                <div className="blog-card__body">
                    <div className="blog-card__meta">
                        <FiCalendar className="blog-card__meta-icon" />
                        <span className="blog-card__date">{formatDate(created_at)}</span>
                    </div>

                    <div className="blog-card__divider" />

                    <h3 className="blog-card__title">{title}</h3>
                    <p className="blog-card__excerpt">{content}</p>

                    <button
                        className="blog-card__arrow"
                        onClick={() => setModalOpen(true)}
                        aria-label="Blogu oxu"
                    >
                        <FiArrowUpRight />
                    </button>
                </div>
            </article>

            {modalOpen && (
                <BlogModal
                    id={id}
                    title={title}
                    titleaz={titleaz}
                    titleru={titleru}
                    image_url={image_url}
                    content={content}
                    contentaz={contentaz}
                    contentru={contentru}
                    created_at={created_at}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    )
}

export default BlogCard;