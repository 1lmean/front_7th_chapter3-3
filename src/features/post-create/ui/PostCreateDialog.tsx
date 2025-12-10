import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Input,
    Textarea,
} from "@/shared/ui"
import { usePostCreate } from "../model/usePostCreate"

type PostCreateDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

export function PostCreateDialog({ open, onOpenChange, onCreated }: PostCreateDialogProps) {
    const { form, setField, handleSubmit, isSubmitting, error } = usePostCreate({
        defaultUserId: 1,
        onSuccess: () => {
            onCreated?.()
            onOpenChange(false)
        },
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>새 게시물 추가</DialogTitle>
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
                    <Input
                        type="number"
                        placeholder="사용자 ID"
                        value={form.userId}
                        onChange={(e) => setField("userId")(Number(e.target.value))}
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            취소
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "추가 중..." : "게시물 추가"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
