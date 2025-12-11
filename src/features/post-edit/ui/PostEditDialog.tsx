import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Input,
    Textarea,
} from "@/shared/ui"
import type { Post } from "@/entities/post/types"
import { usePostEdit } from "../model/usePostEdit"

type PostEditDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    post: Post
    onUpdated: (post: Post) => void
}

export function PostEditDialog({ open, onOpenChange, post, onUpdated }: PostEditDialogProps) {
    const { form, setField, handleSubmit, isSubmitting, error } = usePostEdit({
        post,
        onSuccess: (updated) => {
            onUpdated(updated)
            onOpenChange(false)
        },
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>게시물 수정</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="제목"
                        value={form.title}
                        onChange={(e) => setField("title")(e.target.value)}
                    />
                    <Textarea
                        rows={10}
                        placeholder="내용"
                        value={form.body}
                        onChange={(e) => setField("body")(e.target.value)}
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
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
