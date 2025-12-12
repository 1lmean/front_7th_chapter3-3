import type { CommentListResponse, CommentApiErrorResponse } from "../types"
import { API_BASE_URL } from "@/shared/api/config";

export async function getCommentsByPost(postId: number) {
    const res = await fetch(`${API_BASE_URL}/comments/post/${postId}`)

    if (!res.ok) {
        const error: CommentApiErrorResponse = {
            code: "COMMENT_FETCH_FAILED",
            message: "댓글 가져오기 실패",
        }
        throw error
    }

    const data = (await res.json()) as CommentListResponse
    return data.comments
}
