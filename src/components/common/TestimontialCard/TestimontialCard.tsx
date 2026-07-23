import { useLocalizedField } from '@/hooks/useLocalizedField'
import './TestimontialCard.scss'

type Props = {
    name: string
    role: string
    text: string
    initials: string
    imageUrl?: string | null
}

const TestimonialCard = ({ name, role, text, initials, imageUrl }: Props) => {
    const { localize } = useLocalizedField()
    return (
        <div className="t-card">
            <div className="t-card__qmark">"</div>
            <p className="t-card__text">{text}</p>
            <div className="t-card__divider" />
            <div className="t-card__author">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="t-card__avatar" />
                ) : (
                    <div className="t-card__avatar t-card__avatar--initials">
                        {initials}
                    </div>
                )}
                <div>
                    <h3 className="t-card__name">{name}</h3>
                    <p className="t-card__role">{role}</p>
                </div>
            </div>
        </div>
    )
}

export default TestimonialCard