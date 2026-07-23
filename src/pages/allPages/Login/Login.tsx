import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { loginUser, clearError } from '../../../store/slices/authSlice';
import { loadCartFromSupabase } from '../../../store/slices/cartSlice';
import { loadWishlistFromSupabase } from '../../../store/slices/wishlistSlice';
import { useTranslation } from 'react-i18next';
import './Login.scss';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useAppSelector((state) => state.auth);
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    useEffect(() => {
        return () => { dispatch(clearError()); };
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser(formData)).then((action) => {
            if (loginUser.fulfilled.match(action) && action.payload) {
                const userId = action.payload.id;
                dispatch(loadCartFromSupabase(userId));
                dispatch(loadWishlistFromSupabase(userId));
            }
        });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-header">
                        <span className="auth-tag">{t('auth.welcomeBack')}</span>
                        <h2><span className="red">{t('auth.loginAccount')}</span></h2>
                        <p>{t('auth.loginSubtitle')}</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>{t('auth.email')}</label>
                            <input
                                type="email"
                                name="email"
                                placeholder={t('auth.emailPlaceholder')}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('auth.password')}</label>
                            <input
                                type="password"
                                name="password"
                                placeholder={t('auth.passwordPlaceholder')}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? t('auth.loading') : t('auth.login')}
                        </button>
                    </form>

                    <p className="auth-redirect">
                        {t('auth.noAccount')} <Link to="/register">{t('auth.register')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;