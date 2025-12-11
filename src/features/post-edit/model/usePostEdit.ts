import { useState, useEffect } from "react"
import type { Post } from "@/entities/post/types"
import { updatePost } from "@/entities/post/api/mutations"
import { validatePost } from "@/entities/post/lib/validatePost"

type UsePostEditOptions = {
    post: Post
    onSuccess: (updated: Post) => void
}

export function usePostEdit({ post, onSuccess }: UsePostEditOptions) {
    const [form, setForm] = useState<Post>(post)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setForm(post)
        setError(null)
    }, [post])

    const setField =
        <K extends keyof Post>(key: K) =>
            (value: Post[K]) => {
                setForm((prev) => ({
                    ...prev,
                    [key]: value,
                }))
            }

    const resetForm = () => {
        setForm(post)
        setError(null)
    }

    const handleSubmit = async () => {
        const result = validatePost(form)
        if (!result.ok) {
            switch (result.reason) {
                case "TITLE_REQUIRED":
                    setError("제목을 입력해주세요.")
                    break
                case "TITLE_TOO_LONG":
                    setError("제목은 100자 이하여야 합니다.")
                    break
                case "BODY_REQUIRED":
                    setError("내용을 입력해주세요.")
                    break
            }
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const updated = await updatePost(form)
            onSuccess(updated)
        } catch (e) {
            setError(e instanceof Error ? e.message : "게시물 수정 중 오류가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        form,
        isSubmitting,
        error,
        setField,
        resetForm,
        handleSubmit,
    }
}