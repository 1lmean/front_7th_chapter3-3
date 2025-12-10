import type { User } from "../types"

export function UserBadge({ user }: { user: User }) {
    return (
        <div className="flex items-center space-x-2">
            <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
            <span>{user.username}</span>
        </div>
    )
}
