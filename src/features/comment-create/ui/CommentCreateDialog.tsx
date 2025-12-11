import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "@/shared/ui"
import { useCommentCreate } from "../model/useCommentCreate"
import type { Comment } from "@/entities/comment"

type CommentCreateDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    postId: number
    defaultUserId: number
    onCreated: (comment: Comment) => void
}

export function CommentCreateDialog({
    open,
    onOpenChange,
    postId,
    defaultUserId,
    onCreated,
}: CommentCreateDialogProps) {
    const { body, setBody, isSubmitting, error, handleSubmit } = useCommentCreate({
        postId,
        defaultUserId,
        onSuccess: (created) => {
            onCreated(created)
            onOpenChange(false)
        },
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>새 댓글 추가</DialogTitle>
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
                            {isSubmitting ? "추가 중..." : "추가"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
