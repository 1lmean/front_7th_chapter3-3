// src/features/comment-delete/model/useCommentDelete.ts
import { useState } from "react"
import { deleteComment } from "@/entities/comment/api"

type UseCommentDeleteOptions = {
    onSuccess?: (params: { commentId: number; postId: number }) => void
}

export function useCommentDelete(options?: UseCommentDeleteOptions) {
    const { onSuccess } = options || {}

    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async (commentId: number, postId: number) => {
        setIsDeleting(true)
        setError(null)

        try {
            await deleteComment(commentId)
            onSuccess?.({ commentId, postId })
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "댓글 삭제 중 오류가 발생했습니다.",
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return {
        isDeleting,
        error,
        handleDelete,
    }
}
