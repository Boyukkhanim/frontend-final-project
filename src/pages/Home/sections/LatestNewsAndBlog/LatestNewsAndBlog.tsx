import { useEffect, useState } from 'react'
import { supabase } from '@/data/supabaseClient'
import BlogCard from '@/components/common/BlogCard/BlogCard'
import './LatestNewsAndBlog.scss'
import Preloader from '@/components/common/Preloader/Preloader'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Blog {
    id: number
    title: string
    titleaz: string
    titleru: string
    image_url: string
    content: string
    contentaz: string
    contentru: string
    created_at: string
}

const LatestNewsAndBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const { t, i18n } = useTranslation()
    const lang = i18n.language

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('blog')
                .select('id, title, titleaz, titleru, image_url, content, contentaz, contentru, created_at')
                .order('created_at', { ascending: false })
                .limit(3)

            if (!error && data) setBlogs(data)
            setLoading(false)
        }

        fetchBlogs()
    }, [])

    if (loading) return <Preloader />

    const getTitle = (blog: Blog) => {
        if (lang === 'az' && blog.titleaz) return blog.titleaz
        if (lang === 'ru' && blog.titleru) return blog.titleru
        return blog.title
    }

    const getContent = (blog: Blog) => {
        if (lang === 'az' && blog.contentaz) return blog.contentaz
        if (lang === 'ru' && blog.contentru) return blog.contentru
        return blog.content
    }

    return (
        <section className="latest-blogs">
            <div className="latest-blogs__header">
                <div className="latest-blogs__header-left">
                    <span className="latest-blogs__tag">{t('latestBlogs.tag')}</span>
                    <h2 className="latest-blogs__title">{t('latestBlogs.title')}</h2>
                </div>
                <Link to="/blog" className="latest-blogs__view-all">
                    {t('latestBlogs.viewAll')}
                </Link>
            </div>

            <div className="latest-blogs__grid">
                {blogs.map((blog) => (
                    <BlogCard
                        key={blog.id}
                        {...blog}
                        title={getTitle(blog)}
                        content={getContent(blog)}
                    />
                ))}
            </div>
        </section>
    )
}

export default LatestNewsAndBlogs