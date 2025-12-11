// src/features/comment-edit/ui/CommentEditDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/shared/ui"
import type { Comment } from "@/entities/comment/types"
import { useCommentEdit } from "../model/useCommentEdit"

type CommentEditDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    comment: Comment | null
    onUpdated: (comment: Comment) => void
}

export function CommentEditDialog({
    open,
    onOpenChange,
    comment,
    onUpdated,
}: CommentEditDialogProps) {
    if (!comment) return null

    const { body, setBody, isSubmitting, error, handleSubmit } = useCommentEdit({
        comment,
        onSuccess: (updated) => {
            onUpdated(updated)
            onOpenChange(false)
        },
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>댓글 수정</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Textarea
                        placeholder="댓글 내용"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            취소
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "수정 중..." : "수정 완료"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
