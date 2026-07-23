import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { registerUser, clearError } from '../../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';
import './Register.scss';

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
    });
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        return () => { dispatch(clearError()); };
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLocalError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setLocalError(t('auth.passwordMismatch'));
            return;
        }
        if (formData.password.length < 6) {
            setLocalError(t('auth.passwordShort'));
            return;
        }
        dispatch(registerUser({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            phone: formData.phone,
        })).then((action) => {
            if (registerUser.fulfilled.match(action)) {
                navigate('/login');
            }
        });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-header">
                        <span className="auth-tag">{t('auth.joinUs')}</span>
                        <h2>{t('auth.createAccount')} <span className="red">{t('auth.accountRed')}</span></h2>
                        <p>{t('auth.registerSubtitle')}</p>
                    </div>

                    {(error || localError) && (
                        <div className="auth-error">{localError || error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>{t('auth.fullName')}</label>
                            <input
                                type="text"
                                name="full_name"
                                placeholder={t('auth.fullNamePlaceholder')}
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                            <label>{t('auth.phone')}</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder={t('auth.phonePlaceholder')}
                                value={formData.phone}
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
                        <div className="form-group">
                            <label>{t('auth.confirmPassword')}</label>
                            <input
                                type="password"
                                name="confirm_password"
                                placeholder={t('auth.confirmPasswordPlaceholder')}
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? t('auth.loading') : t('auth.createAccountBtn')}
                        </button>
                    </form>

                    <p className="auth-redirect">
                        {t('auth.haveAccount')} <Link to="/login">{t('auth.login')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;