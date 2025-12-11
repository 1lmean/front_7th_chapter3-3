import type { User } from "@/entities/user/types"

export type Post = {
    id: number
    title: string
    body: string
    userId: number
    tags?: string[]
    reactions?: PostReactions
    author?: User
}

export type PostReactions = {
    likes: number
    dislikes: number
}

export type PostTag = {
    slug: string
    url: string
}

export type PostSortBy = "none" | "id" | "title" | "reactions"
export type SortOrder = "asc" | "desc"

export type PostApiRequest = {
    title: string
    body: string
    userId: number
}

export type PostApiResponse = {
    posts: Post[]
    total: number
    skip: number
    limit: number
}

export type PostApiErrorCode = {}

export type PostApiErrorResponse = {
    code: PostApiErrorCode
    message?: string
}