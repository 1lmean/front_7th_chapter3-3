// src/features/comment-edit/model/useCommentEdit.ts
import { useEffect, useState } from "react"
import type { Comment } from "@/entities/comment/types"
import { updateComment } from "@/entities/comment/api/mutations"

type UseCommentEditOptions = {
    comment: Comment
    onSuccess: (updated: Comment) => void
}

export function useCommentEdit({ comment, onSuccess }: UseCommentEditOptions) {
    const [body, setBody] = useState(comment.body)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setBody(comment.body)
        setError(null)
    }, [comment])

    const handleSubmit = async () => {
        if (!body.trim()) {
            setError("댓글 내용을 입력해주세요.")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const updated = await updateComment(comment.id, { body })
            onSuccess(updated)
        } catch (e) {
            setError(e instanceof Error ? e.message : "댓글 수정 중 오류가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        body,
        setBody,
        isSubmitting,
        error,
        handleSubmit,
    }
}
