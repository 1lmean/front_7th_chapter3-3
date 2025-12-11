// widgets/post-detail/model/usePostDetail.ts
import { useState } from "react"
import { useDialog } from "@/shared/lib/useDialog"
import { getCommentsByPost } from "@/entities/comment"
import { useCommentDelete } from "@/features/comment-delete"
import { useCommentLike } from "@/features/comment-like"
import type { Post } from "@/entities/post"
import type { Comment } from "@/entities/comment"

export function usePostDetail() {
    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

    const detailDialog = useDialog()
    const addCommentDialog = useDialog()
    const editCommentDialog = useDialog()

    const open = async (targetPost: Post) => {
        setPost(targetPost)
        // 댓글 fetch
        const data = await getCommentsByPost(targetPost.id)
        setComments(data)
        detailDialog.openDialog()
    }

    const close = () => {
        detailDialog.closeDialog()
        // 필요하면 post/comments 초기화
        // setPost(null)
        // setComments([])
        setSelectedComment(null)
        addCommentDialog.closeDialog()
        editCommentDialog.closeDialog()
    }

    const openAddComment = () => {
        addCommentDialog.openDialog()
    }

    const closeAddComment = () => {
        addCommentDialog.closeDialog()
    }

    const openEditComment = (comment: Comment) => {
        setSelectedComment(comment)
        editCommentDialog.openDialog()
    }

    const closeEditComment = () => {
        editCommentDialog.closeDialog()
        setSelectedComment(null)
    }

    const { handleDelete: handleDeleteComment } = useCommentDelete({
        onSuccess: ({ commentId }) => {
            setComments((prev) => prev.filter((c) => c.id !== commentId))
        },
    })

    const { handleLike: handleLikeComment } = useCommentLike({
        onSuccess: ({ comment }) => {
            setComments((prev) => prev.map((c) => (c.id === comment.id ? comment : c)))
        },
    })

    const handleCommentCreated = (newComment: Comment) => {
        setComments((prev) => [...prev, newComment])
        closeAddComment()
    }

    const handleCommentUpdated = (updated: Comment) => {
        setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        closeEditComment()
    }

    return {
        // 상태
        post,
        comments,
        selectedComment,

        // 상세 다이얼로그
        isOpen: detailDialog.isOpen,
        open,
        close,

        // 댓글 추가 다이얼로그
        isAddCommentOpen: addCommentDialog.isOpen,
        openAddComment,
        closeAddComment,
        handleCommentCreated,

        // 댓글 수정 다이얼로그
        isEditCommentOpen: editCommentDialog.isOpen,
        openEditComment,
        closeEditComment,
        handleCommentUpdated,

        // 댓글 액션
        handleDeleteComment,
        handleLikeComment,
    }
}

export type UsePostDetailResult = ReturnType<typeof usePostDetail>
