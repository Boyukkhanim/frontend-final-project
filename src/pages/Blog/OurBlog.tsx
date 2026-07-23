import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/data/supabaseClient'
import BlogCard from '@/components/common/BlogCard/BlogCard'
import './OurBlog.scss'
import Preloader from '@/components/common/Preloader/Preloader'
import { useTranslation } from 'react-i18next'
import PageHero from '@/components/common/PageHero/PageHero'
import BlogAdminPanel from '@/components/common/BlogAdminPanel/BlogAdminPanel'

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

const BLOGS_PER_PAGE = 6

const OurBlog = () => {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const { i18n } = useTranslation()
    const lang = i18n.language

    const fetchBlogs = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('blog')
            .select('id, title, titleaz, titleru, image_url, content, contentaz, contentru, created_at')
            .order('created_at', { ascending: false })

        if (!error && data) setBlogs(data)
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchBlogs()
    }, [fetchBlogs])

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

    const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE)
    const paginated = blogs.slice((page - 1) * BLOGS_PER_PAGE, page * BLOGS_PER_PAGE)

    return (
        <div className="about-page">
            <PageHero titleKey="ourBlog.title" currentKey="ourBlog.current" />

            <section className="our-blog">
                {loading ? (
                    <Preloader />
                ) : (
                    <>
                        <div className="our-blog__grid">
                            {paginated.map((blog) => (
                                <BlogCard
                                    key={blog.id}
                                    {...blog}
                                    title={getTitle(blog)}
                                    content={getContent(blog)}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="our-blog__pagination">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        className={`our-blog__page-btn ${p === page ? 'active' : ''}`}
                                        onClick={() => {
                                            setPage(p)
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Admin Panel — fixed bottom-right, yalnız Supabase auth ilə görünür */}
            <BlogAdminPanel onBlogsChanged={fetchBlogs} />
        </div>
    )
}

export default OurBlog