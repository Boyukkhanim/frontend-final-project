import { useTeamMembers } from '@/hooks/useTeamMembers'
import TeamMemberCard from '@/components/common/TeamMemberCard/TeamMemberCard'
import Preloader from '@/components/common/Preloader/Preloader'
import './MemberList.scss'

const MemberList = () => {
    const { members, loading, error } = useTeamMembers()

    if (loading) return <Preloader />
    if (error) return (
        <p style={{ color: 'red', textAlign: 'center' }}>Xəta: {error}</p>
    )

    return (
        <div className="member-list">
            {members.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
            ))}
        </div>
    )
}

export default MemberList