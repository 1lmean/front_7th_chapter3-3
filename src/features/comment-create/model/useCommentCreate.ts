// src/features/comment-create/model/useCommentCreate.ts
import { useState } from "react"
import type { Comment } from "@/entities/comment/types"
import { createComment } from "@/entities/comment/api/mutations"

type UseCommentCreateOptions = {
    postId: number
    defaultUserId: number
    onSuccess: (created: Comment) => void
}

export function useCommentCreate({ postId, defaultUserId, onSuccess }: UseCommentCreateOptions) {
    const [body, setBody] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const reset = () => {
        setBody("")
        setError(null)
    }

    const handleSubmit = async () => {
        if (!body.trim()) {
            setError("댓글 내용을 입력해주세요.")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const created = await createComment({
                postId,
                userId: defaultUserId,
                body,
            })
            onSuccess(created)
            reset()
        } catch (e) {
            setError(e instanceof Error ? e.message : "댓글 생성 중 오류가 발생했습니다.")
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
        reset,
    }
}
