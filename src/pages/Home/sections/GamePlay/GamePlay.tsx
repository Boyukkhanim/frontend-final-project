import React, { useRef, useState } from "react";
import "./GamePlay.scss";
import videoBg from "@/assets/images/home/video-bg.jpg";
import { useTranslation } from "react-i18next";

const GamePlay: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const playBtnRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation();

    return (
        <div className="gameplay-wrapper">
            <section className="gameplay-section">
                <div className="gameplay-bg">
                    <img
                        src={videoBg}
                        alt="Sweet Revenge Background"
                        className="gameplay-bg__img"
                    />
                </div>

                <div className="gameplay-corner gameplay-corner--tl" />

                <div className="gameplay-content">
                    <span className="gameplay-badge">{t('home.gameplay_badge')}</span>
                    <h2 className="gameplay-title">
                        {t('home.gameplay_title')}
                        <br />
                        {t('home.gameplay_title_br')}
                    </h2>
                    <button className="gameplay-play-btn">{t('home.gameplay_btn')}</button>
                </div>

                <button
                    className={`gameplay-video-btn${isHovered ? " gameplay-video-btn--hovered" : ""}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    ref={playBtnRef}
                    aria-label="Play video"
                >
                    <span className="gameplay-video-btn__ring" />
                    <svg
                        className="gameplay-video-btn__icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </button>

                <span className="gameplay-dot gameplay-dot--1" />
                <span className="gameplay-dot gameplay-dot--2" />
            </section>
        </div>
    );
};

export default GamePlay;