// src/features/post-delete/model/usePostDelete.ts
import { useState } from "react"
import { deletePost } from "@/entities/post/api/mutations"

type UsePostDeleteOptions = {
    onSuccess: (id: number) => void
}

export function usePostDelete(options?: UsePostDeleteOptions) {
    const { onSuccess } = options || {}

    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async (id: number) => {
        setIsDeleting(true)
        setError(null)

        try {
            await deletePost(id)
            onSuccess?.(id)
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "게시물 삭제 중 오류가 발생했습니다."
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
