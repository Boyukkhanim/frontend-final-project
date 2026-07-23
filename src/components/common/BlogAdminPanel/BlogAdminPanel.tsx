import { useEffect, useState } from 'react'
import { supabase } from '@/data/supabaseClient'
import './BlogAdminPanel.scss'

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

interface BlogAdminPanelProps {
    onBlogsChanged: () => void
}

const emptyForm = {
    title: '',
    titleaz: '',
    titleru: '',
    image_url: '',
    content: '',
    contentaz: '',
    contentru: '',
}

const BlogAdminPanel = ({ onBlogsChanged }: BlogAdminPanelProps) => {
    // Auth state
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')
    const [authLoading, setAuthLoading] = useState(false)

    // Panel open/close
    const [panelOpen, setPanelOpen] = useState(false)

    // Blogs list
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [blogsLoading, setBlogsLoading] = useState(false)

    // Form state
    const [form, setForm] = useState(emptyForm)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formOpen, setFormOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

    // Check session + admin role on mount
    useEffect(() => {
        const checkAdmin = (session: any) => {
            if (!session) { setIsLoggedIn(false); setIsAdmin(false); return }
            setIsLoggedIn(true)
            const role = session.user?.user_metadata?.role
            setIsAdmin(role === 'admin')
        }

        supabase.auth.getSession().then(({ data }) => checkAdmin(data.session))

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            checkAdmin(session)
        })
        return () => listener.subscription.unsubscribe()
    }, [])

    // Fetch blogs when panel opens
    useEffect(() => {
        if (panelOpen && isLoggedIn && isAdmin) fetchBlogs()
    }, [panelOpen, isLoggedIn, isAdmin])

    const fetchBlogs = async () => {
        setBlogsLoading(true)
        const { data, error } = await supabase
            .from('blog')
            .select('*')
            .order('created_at', { ascending: false })
        if (!error && data) setBlogs(data)
        setBlogsLoading(false)
    }

    const handleLogin = async () => {
        setAuthLoading(true)
        setAuthError('')
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setAuthError(error.message)
            setAuthLoading(false)
            return
        }
        const role = data.user?.user_metadata?.role
        if (role !== 'admin') {
            setAuthError('Bu hesabın admin icazəsi yoxdur.')
            await supabase.auth.signOut()
        }
        setAuthLoading(false)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setPanelOpen(false)
    }

    const openAddForm = () => {
        setEditingId(null)
        setForm(emptyForm)
        setFormError('')
        setFormOpen(true)
    }

    const openEditForm = (blog: Blog) => {
        setEditingId(blog.id)
        setForm({
            title: blog.title,
            titleaz: blog.titleaz,
            titleru: blog.titleru,
            image_url: blog.image_url,
            content: blog.content,
            contentaz: blog.contentaz,
            contentru: blog.contentru,
        })
        setFormError('')
        setFormOpen(true)
    }

    const handleSave = async () => {
        if (!form.title.trim() || !form.content.trim() || !form.image_url.trim()) {
            setFormError('EN başlıq, məzmun və şəkil URL mütləqdir.')
            return
        }
        setSaving(true)
        setFormError('')

        if (editingId !== null) {
            const { error } = await supabase.from('blog').update(form).eq('id', editingId)
            if (error) { setFormError(error.message); setSaving(false); return }
        } else {
            const { error } = await supabase.from('blog').insert([form])
            if (error) { setFormError(error.message); setSaving(false); return }
        }

        setSaving(false)
        setFormOpen(false)
        setEditingId(null)
        setForm(emptyForm)
        await fetchBlogs()
        onBlogsChanged()
    }

    const handleDelete = async (id: number) => {
        const { error } = await supabase.from('blog').delete().eq('id', id)
        if (!error) {
            setDeleteConfirmId(null)
            await fetchBlogs()
            onBlogsChanged()
        }
    }

    // Admin deyilsə heç nə render etmə
    if (!isAdmin && !panelOpen) {
        // Trigger düyməsini yalnız admin görür — amma login formu üçün
        // panel açılabilir, login sonrası admin deyilsə bağlanır
    }

    return (
        <div className="bap">
            {/* Trigger düyməsi — hamı görür, içəri girəndə login formu çıxır */}
            <button
                className="bap__trigger"
                onClick={() => setPanelOpen(true)}
                title="Admin Panel"
            >
                <span className="bap__trigger-icon">⚙</span>
                <span className="bap__trigger-label">Admin Panel</span>
            </button>

            {/* Overlay */}
            {panelOpen && (
                <div className="bap__overlay" onClick={() => setPanelOpen(false)} />
            )}

            {/* Drawer */}
            <aside className={`bap__drawer ${panelOpen ? 'bap__drawer--open' : ''}`}>
                <div className="bap__drawer-header">
                    <span className="bap__drawer-title">Blog Admin</span>
                    <button className="bap__close" onClick={() => setPanelOpen(false)}>✕</button>
                </div>

                {!isLoggedIn || !isAdmin ? (
                    /* ── Login Form ── */
                    <div className="bap__login">
                        <p className="bap__login-desc">Davam etmək üçün daxil olun</p>
                        <input
                            className="bap__input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        />
                        <input
                            className="bap__input"
                            type="password"
                            placeholder="Şifrə"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        />
                        {authError && <p className="bap__error">{authError}</p>}
                        <button
                            className="bap__btn bap__btn--primary"
                            onClick={handleLogin}
                            disabled={authLoading}
                        >
                            {authLoading ? 'Gözləyin...' : 'Daxil ol'}
                        </button>
                    </div>
                ) : (
                    /* ── Admin Content ── */
                    <div className="bap__content">
                        <div className="bap__toolbar">
                            <button className="bap__btn bap__btn--primary" onClick={openAddForm}>
                                + Yeni Blog
                            </button>
                            <button className="bap__btn bap__btn--ghost" onClick={handleLogout}>
                                Çıxış
                            </button>
                        </div>

                        {blogsLoading ? (
                            <p className="bap__info">Yüklənir...</p>
                        ) : (
                            <ul className="bap__list">
                                {blogs.map(blog => (
                                    <li key={blog.id} className="bap__list-item">
                                        <img src={blog.image_url} alt={blog.title} className="bap__list-img" />
                                        <div className="bap__list-info">
                                            <span className="bap__list-title">{blog.title}</span>
                                            <span className="bap__list-date">
                                                {new Date(blog.created_at).toLocaleDateString('az-AZ')}
                                            </span>
                                        </div>
                                        <div className="bap__list-actions">
                                            <button
                                                className="bap__btn bap__btn--sm bap__btn--edit"
                                                onClick={() => openEditForm(blog)}
                                            >
                                                ✎
                                            </button>
                                            {deleteConfirmId === blog.id ? (
                                                <>
                                                    <button
                                                        className="bap__btn bap__btn--sm bap__btn--danger"
                                                        onClick={() => handleDelete(blog.id)}
                                                    >
                                                        Təsdiqlə
                                                    </button>
                                                    <button
                                                        className="bap__btn bap__btn--sm bap__btn--ghost"
                                                        onClick={() => setDeleteConfirmId(null)}
                                                    >
                                                        Ləğv et
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="bap__btn bap__btn--sm bap__btn--danger"
                                                    onClick={() => setDeleteConfirmId(blog.id)}
                                                >
                                                    🗑
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </aside>

            {/* ── Blog Form Modal ── */}
            {formOpen && (
                <>
                    <div className="bap__modal-overlay" onClick={() => setFormOpen(false)} />
                    <div className="bap__modal">
                        <div className="bap__modal-header">
                            <h3>{editingId ? 'Blogu Redaktə Et' : 'Yeni Blog Əlavə Et'}</h3>
                            <button className="bap__close" onClick={() => setFormOpen(false)}>✕</button>
                        </div>

                        <div className="bap__modal-body">
                            <div className="bap__form-group">
                                <label>Başlıq (EN) *</label>
                                <input
                                    className="bap__input"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="English title"
                                />
                            </div>
                            <div className="bap__form-group">
                                <label>Başlıq (AZ)</label>
                                <input
                                    className="bap__input"
                                    value={form.titleaz}
                                    onChange={e => setForm(f => ({ ...f, titleaz: e.target.value }))}
                                    placeholder="Azərbaycanca başlıq"
                                />
                            </div>
                            <div className="bap__form-group">
                                <label>Başlıq (RU)</label>
                                <input
                                    className="bap__input"
                                    value={form.titleru}
                                    onChange={e => setForm(f => ({ ...f, titleru: e.target.value }))}
                                    placeholder="Заголовок на русском"
                                />
                            </div>
                            <div className="bap__form-group">
                                <label>Şəkil URL *</label>
                                <input
                                    className="bap__input"
                                    value={form.image_url}
                                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                                    placeholder="https://..."
                                />
                                {form.image_url && (
                                    <img src={form.image_url} alt="preview" className="bap__img-preview" />
                                )}
                            </div>
                            <div className="bap__form-group">
                                <label>Məzmun (EN) *</label>
                                <textarea
                                    className="bap__input bap__textarea"
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="English content"
                                    rows={4}
                                />
                            </div>
                            <div className="bap__form-group">
                                <label>Məzmun (AZ)</label>
                                <textarea
                                    className="bap__input bap__textarea"
                                    value={form.contentaz}
                                    onChange={e => setForm(f => ({ ...f, contentaz: e.target.value }))}
                                    placeholder="Azərbaycanca məzmun"
                                    rows={4}
                                />
                            </div>
                            <div className="bap__form-group">
                                <label>Məzmun (RU)</label>
                                <textarea
                                    className="bap__input bap__textarea"
                                    value={form.contentru}
                                    onChange={e => setForm(f => ({ ...f, contentru: e.target.value }))}
                                    placeholder="Содержание на русском"
                                    rows={4}
                                />
                            </div>

                            {formError && <p className="bap__error">{formError}</p>}
                        </div>

                        <div className="bap__modal-footer">
                            <button
                                className="bap__btn bap__btn--ghost"
                                onClick={() => setFormOpen(false)}
                            >
                                Ləğv et
                            </button>
                            <button
                                className="bap__btn bap__btn--primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Saxlanılır...' : editingId ? 'Yadda saxla' : 'Əlavə et'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default BlogAdminPanel