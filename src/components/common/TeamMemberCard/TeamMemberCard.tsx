import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import type { TeamMember } from '@/hooks/useTeamMembers'
import './TeamMemberCard.scss'

type Props = {
    member: TeamMember
}

const TeamMemberCard = ({ member }: Props) => {
    return (
        <div className="tm-card">
            {/* Image */}
            <div className="tm-card__img-wrap">
                <img src={member.image_url} alt={member.name} />

                {/* Red overlay — slides up on hover */}
                <div className="tm-card__overlay">
                    {/* Social links */}
                    <div className="tm-card__social">
                        {member.facebook_url && (
                            <a
                                href={member.facebook_url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                            >
                                <FaFacebookF />
                            </a>
                        )}
                        {member.twitter_url && (
                            <a
                                href={member.twitter_url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Twitter"
                            >
                                <FaTwitter />
                            </a>
                        )}
                        {member.linkedin_url && (
                            <a
                                href={member.linkedin_url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedinIn />
                            </a>
                        )}
                        {member.instagram_url && (
                            <a
                                href={member.instagram_url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>
                        )}
                    </div>

                    {/* Divider line */}
                    <div className="tm-card__overlay-line" />

                    {/* Name + Role */}
                    <div className="tm-card__info">
                        <h3 className="tm-card__name">{member.name}</h3>
                        <p className="tm-card__role">{member.role}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamMemberCard