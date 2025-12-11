import type { Post, PostSortBy, SortOrder } from "../types"

export const sortPostList = (posts: Post[], sortBy: PostSortBy, sortOrder: SortOrder) => {
    if (sortBy === "none") return posts

    const sorted = [...posts].sort((a, b) => {
        let aVal: string | number = ""
        let bVal: string | number = ""

        if (sortBy === "title") {
            aVal = a.title
            bVal = b.title
        } else if (sortBy === "id") {
            aVal = a.id
            bVal = b.id
        } else if (sortBy === "reactions") {
            aVal = a.reactions?.likes || 0
            bVal = b.reactions?.likes || 0
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
            return aVal - bVal
        }
        return String(aVal).localeCompare(String(bVal))
    })

    return sortOrder === "asc" ? sorted : sorted.reverse()
}