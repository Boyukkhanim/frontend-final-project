import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/data/supabaseClient';
import rightImg from '@/assets/images/bg-image/shape-1.png';
import bgImg from '@/assets/images/bg-image/team-bg.jpg';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './OurBestTeam.scss';
import Preloader from '@/components/common/Preloader/Preloader';
import { useTranslation } from 'react-i18next';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image_url: string;
    description: string;
    experience: string;
    facebook_url: string;
    twitter_url: string;
    linkedin_url: string;
    instagram_url: string;
}

const OurBestTeam = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [activeIndex, setActiveIndex] = useState(1);
    const navigate = useNavigate();
    const sliderRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('team_members')
                .select('id, name, role, image_url, description, experience, facebook_url, twitter_url, linkedin_url, instagram_url')
                .order('id', { ascending: true });

            if (!error && data) setMembers(data);
            setLoading(false);
        };

        fetchMembers();
    }, []);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? members.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev === members.length - 1 ? 0 : prev + 1));
    };

    if (loading) return <Preloader />;

    const getVisibleMembers = () => {
        if (members.length === 0) return [];
        const prev = (activeIndex - 1 + members.length) % members.length;
        const next = (activeIndex + 1) % members.length;
        return [
            { member: members[prev], position: 'left' },
            { member: members[activeIndex], position: 'center' },
            { member: members[next], position: 'right' },
        ];
    };

    const visibleMembers = getVisibleMembers();

    return (
        <section
            className="our-best-team"
            style={{ backgroundImage: `url(${bgImg})` }}
        >
            <div className="our-best-team__overlay" />

            <div className="our-best-team__container">
                <div className="our-best-team__slider" ref={sliderRef}>
                    {visibleMembers.map(({ member, position }) => (
                        <div
                            key={`${member.id}-${position}`}
                            className={`team-card team-card--${position}`}
                            onClick={() => {
                                if (position === 'center') navigate(`/team/${member.id}`);
                                else if (position === 'left') handlePrev();
                                else handleNext();
                            }}
                        >
                            <div className="team-card__image-wrap">
                                <img src={member.image_url} alt={member.name} />
                                {position === 'center' && (
                                    <div className="team-card__social">
                                        {member.facebook_url && (
                                            <a href={member.facebook_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <FaFacebookF />
                                            </a>
                                        )}
                                        {member.twitter_url && (
                                            <a href={member.twitter_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <FaTwitter />
                                            </a>
                                        )}
                                        {member.linkedin_url && (
                                            <a href={member.linkedin_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <FaLinkedinIn />
                                            </a>
                                        )}
                                        {member.instagram_url && (
                                            <a href={member.instagram_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                                                <FaInstagram />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            {position === 'center' && (
                                <div className="team-card__info">
                                    <h3 className="team-card__name">{member.name}</h3>
                                    <p className="team-card__role">{member.role}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="our-best-team__content">
                    <span className="our-best-team__subtitle">{t('ourBestTeam.subtitle')}</span>
                    <h2 className="our-best-team__title">
                        {t('ourBestTeam.title')} <br /> {t('ourBestTeam.titleBr')}
                    </h2>
                    {/* {activeMember && (
                        // <p className="our-best-team__desc">{activeMember.description}</p>
                    )} */}
                    <div className="our-best-team__buttons">
                        <button className="team-btn team-btn--prev" onClick={handlePrev} aria-label={t('ourBestTeam.prevAriaLabel')}>
                            <span>&#x2197;</span>
                        </button>
                        <button className="team-btn team-btn--next" onClick={handleNext} aria-label={t('ourBestTeam.nextAriaLabel')}>
                            <span>&#x2199;</span>
                        </button>
                    </div>
                </div>
            </div>

            <img src={rightImg} alt="shape" className="our-best-team__shape" />
        </section>
    );
};

export default OurBestTeam;