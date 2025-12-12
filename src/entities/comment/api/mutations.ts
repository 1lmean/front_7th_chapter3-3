import type {
    Comment,
    CommentCreateRequest,
    CommentUpdateRequest,
    CommentLikeRequest,
    CommentApiErrorResponse,
} from "../types"
import { API_BASE_URL } from "@/shared/api/config";

export async function createComment(req: CommentCreateRequest) {
    const res = await fetch(`${API_BASE_URL}/comments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    })

    if (!res.ok) {
        const error: CommentApiErrorResponse = {
            code: "COMMENT_CREATE_FAILED",
            message: "댓글 생성 실패",
        }
        throw error
    }

    const data = (await res.json()) as Comment
    return data
}

export async function updateComment(id: number, req: CommentUpdateRequest) {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    })

    if (!res.ok) {
        const error: CommentApiErrorResponse = {
            code: "COMMENT_UPDATE_FAILED",
            message: "댓글 수정 실패",
        }
        throw error
    }

    const data = (await res.json()) as Comment
    return data
}

export async function deleteComment(id: number) {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        const error: CommentApiErrorResponse = {
            code: "COMMENT_DELETE_FAILED",
            message: "댓글 삭제 실패",
        }
        throw error
    }
}

export async function likeComment(id: number, req: CommentLikeRequest) {
    const res = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    })

    if (!res.ok) {
        const error: CommentApiErrorResponse = {
            code: "COMMENT_LIKE_FAILED",
            message: "댓글 좋아요 실패",
        }
        throw error
    }

    const data = (await res.json()) as Comment
    return data
}
