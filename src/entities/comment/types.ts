import type { User } from "@/entities/user/types"

export type Comment = {
    id: number
    body: string
    postId: number
    likes: number
    user: User
}

export type CommentCreateRequest = {
    body: string
    postId: number
    userId: number
}

export type CommentUpdateRequest = {
    body: string
}

export type CommentLikeRequest = {
    likes: number
}

export type CommentListResponse = {
    comments: Comment[]
    total?: number
    skip?: number
    limit?: number
}

export type CommentApiErrorCode =
    | "COMMENT_NOT_FOUND"
    | "COMMENT_FETCH_FAILED"
    | "COMMENT_CREATE_FAILED"
    | "COMMENT_UPDATE_FAILED"
    | "COMMENT_DELETE_FAILED"
    | "COMMENT_LIKE_FAILED"
    | "UNKNOWN"

export type CommentApiErrorResponse = {
    code: CommentApiErrorCode
    message?: string
}