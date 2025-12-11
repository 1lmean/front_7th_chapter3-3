import { useMemo, useState } from "react"

type UsePostPaginationOptions = {
    initialLimit?: number
    initialSkip?: number
    total?: number
    onChange?: (params: { skip: number; limit: number }) => void
}

export function usePostPagination(options?: UsePostPaginationOptions) {
    const {
        initialLimit = 10,
        initialSkip = 0,
        total = 0,
        onChange,
    } = options || {}

    const [limit, setLimit] = useState(initialLimit)
    const [skip, setSkip] = useState(initialSkip)

    const currentPage = useMemo(() => Math.floor(skip / limit) + 1, [skip, limit])
    const totalPages = useMemo(
        () => (total > 0 ? Math.ceil(total / limit) : 1),
        [total, limit],
    )

    const canPrev = skip > 0
    const canNext = skip + limit < total

    const applyChange = (next: { skip: number; limit: number }) => {
        setSkip(next.skip)
        setLimit(next.limit)
        onChange?.(next)
    }

    const goPrev = () => {
        if (!canPrev) return
        applyChange({ skip: Math.max(0, skip - limit), limit })
    }

    const goNext = () => {
        if (!canNext) return
        applyChange({ skip: skip + limit, limit })
    }

    const changeLimit = (nextLimit: number) => {
        // limit 바꾸면 페이지 기준 다시 계산 (여기서는 그냥 첫 페이지로 돌려도 됨)
        applyChange({ skip: 0, limit: nextLimit })
    }

    return {
        skip,
        limit,
        currentPage,
        totalPages,
        canPrev,
        canNext,
        goPrev,
        goNext,
        changeLimit,
    }
}
