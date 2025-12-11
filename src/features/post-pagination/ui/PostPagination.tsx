import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

type PostPaginationProps = {
    limit: number
    currentPage: number
    totalPages: number
    canPrev: boolean
    canNext: boolean
    onChangeLimit: (limit: number) => void
    onPrev: () => void
    onNext: () => void
}

export function PostPagination({
    limit,
    currentPage,
    totalPages,
    canPrev,
    canNext,
    onChangeLimit,
    onPrev,
    onNext,
}: PostPaginationProps) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span>표시</span>
                <Select
                    value={String(limit)}
                    onValueChange={(value) => onChangeLimit(Number(value))}
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                    </SelectContent>
                </Select>
                <span>항목</span>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button disabled={!canPrev} onClick={onPrev}>
                        이전
                    </Button>
                    <Button disabled={!canNext} onClick={onNext}>
                        다음
                    </Button>
                </div>
            </div>
        </div>
    )
}
