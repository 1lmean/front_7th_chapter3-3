// src/features/post-filter/model/usePostFilter.ts
import { useEffect, useState } from "react"
import type { PostSortBy, SortOrder, PostTag } from "@/entities/post/types"
import { getPostTags } from "@/entities/post/api/queries"

type UsePostFilterOptions = {
    initialSortBy?: PostSortBy
    initialSortOrder?: SortOrder
    initialTag?: string
    onChange?: (filter: {
        sortBy: PostSortBy
        sortOrder: SortOrder
        tag: string | null
    }) => void
}

export function usePostFilter(options?: UsePostFilterOptions) {
    const {
        initialSortBy = "none",
        initialSortOrder = "asc",
        initialTag = "",
        onChange,
    } = options || {}

    const [tags, setTags] = useState<PostTag[]>([])
    const [selectedTag, setSelectedTag] = useState<string>(initialTag)
    const [sortBy, setSortBy] = useState<PostSortBy>(initialSortBy)
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder)
    const [isLoadingTags, setIsLoadingTags] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadTags = async () => {
            setIsLoadingTags(true)
            setError(null)
            try {
                const data = await getPostTags()
                setTags(data)
            } catch (e) {
                setError(e instanceof Error ? e.message : "태그 목록을 가져오는 중 오류가 발생했습니다.")
            } finally {
                setIsLoadingTags(false)
            }
        }

        loadTags()
    }, [])

    // 필터 값이 바뀔 때마다 상위에 알려주기
    useEffect(() => {
        onChange?.({
            sortBy,
            sortOrder,
            tag: selectedTag === "" || selectedTag === "all" ? null : selectedTag,
        })
    }, [sortBy, sortOrder, selectedTag, onChange])

    return {
        tags,
        isLoadingTags,
        error,
        selectedTag,
        sortBy,
        sortOrder,
        setSelectedTag,
        setSortBy,
        setSortOrder,
    }
}
