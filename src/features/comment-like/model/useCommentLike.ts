import { useState } from "react"
import type { Comment } from "@/entities/comment/types"
import { likeComment } from "@/entities/comment/api"

type UseCommentLikeOptions = {
    onSuccess?: (params: { postId: number; comment: Comment }) => void
}

export function useCommentLike(options?: UseCommentLikeOptions) {
    const { onSuccess } = options || {}

    const [isLiking, setIsLiking] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLike = async (postId: number, comment: Comment) => {
        // comment는 현재 화면에 보이는 댓글(현재 likes 포함)
        const nextLikes = comment.likes + 1

        setIsLiking(true)
        setError(null)

        try {
            // 서버에 "likes를 nextLikes로 설정해라" 요청
            const updated = await likeComment(comment.id, { likes: nextLikes })

            // 상위(페이지)에서 comments 상태를 갱신할 수 있도록 콜백 호출
            onSuccess?.({ postId, comment: updated })
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "댓글 좋아요 처리 중 오류가 발생했습니다.",
            )
        } finally {
            setIsLiking(false)
        }
    }

    return {
        isLiking,
        error,
        handleLike,
    }
}
