import { Plus, ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from "@/shared/ui"
import { highlightText } from "@/shared/lib/highlightText"
import { CommentCreateDialog } from "@/features/comment-create"
import { CommentEditDialog } from "@/features/comment-edit"
import type { UsePostDetailResult } from "../model/usePostDetail"

type PostDetailProps = {
    detail: UsePostDetailResult
    highlightQuery: string
}

export function PostDetail({ detail, highlightQuery }: PostDetailProps) {
    const {
        post,
        comments,
        isOpen,
        isAddCommentOpen,
        isEditCommentOpen,
        selectedComment,
        openAddComment,
        closeAddComment,
        openEditComment,
        closeEditComment,
        close,
        handleCommentCreated,
        handleCommentUpdated,
        handleDeleteComment,
        handleLikeComment,
    } = detail

    return (
        <>
            {/* 게시물 상세 다이얼로그 */}
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) close()
                }}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{post?.title && highlightText(post.title, highlightQuery)}</DialogTitle>
                    </DialogHeader>

                    {!post ? null : (
                        <div className="space-y-4">
                            <p>{highlightText(post.body, highlightQuery)}</p>

                            {/* 댓글 섹션 */}
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold">댓글</h3>
                                    <Button size="sm" onClick={openAddComment}>
                                        <Plus className="w-3 h-3 mr-1" />
                                        댓글 추가
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="flex items-center justify-between text-sm border-b pb-1"
                                        >
                                            <div className="flex items-center space-x-2 overflow-hidden">
                                                <span className="font-medium truncate">
                                                    {comment.user.username}:
                                                </span>
                                                <span className="truncate">
                                                    {highlightText(comment.body, highlightQuery)}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => post && handleLikeComment(post.id, comment)}
                                                >
                                                    <ThumbsUp className="w-3 h-3" />
                                                    <span className="ml-1 text-xs">{comment.likes}</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditComment(comment)}
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => post && handleDeleteComment(comment.id, post.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* 댓글 추가 다이얼로그 */}
            {post && (
                <CommentCreateDialog
                    open={isAddCommentOpen}
                    onOpenChange={(open) => {
                        if (!open) closeAddComment()
                    }}
                    postId={post.id}
                    defaultUserId={1}
                    onCreated={handleCommentCreated}
                />
            )}

            {/* 댓글 수정 다이얼로그 */}
            {selectedComment && (
                <CommentEditDialog
                    open={isEditCommentOpen}
                    onOpenChange={(open) => {
                        if (!open) closeEditComment()
                    }}
                    comment={selectedComment}
                    onUpdated={handleCommentUpdated}
                />
            )}
        </>
    )
}
