import type { User } from "../types"

export function getFullName(user: User) {
    return `${user.firstName} ${user.lastName}`
}

export function toUserPreview(user: User) {
    return {
        id: user.id,
        username: user.username,
        image: user.image,
    }
}