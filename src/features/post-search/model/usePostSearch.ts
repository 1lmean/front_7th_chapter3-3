import { useState } from "react"
import type { Post } from "@/entities/post/types"
import { getPostListBySearch } from "@/entities/post/api/queries"

type UsePostSearchOptions = {
    onSuccess: (data: { posts: Post[]; total: number }) => void
}

export function usePostSearch({ onSuccess }: UsePostSearchOptions) {
    const [query, setQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        if (!query.trim()) {
            // 빈 검색어면 굳이 API 안 치고, 상위에서 "전체 목록 다시 불러오기" 하게 둘 수도 있음
            return
        }

        setIsSearching(true)
        setError(null)

        try {
            const data = await getPostListBySearch(query)
            onSuccess({ posts: data.posts, total: data.total })
        } catch (e) {
            setError(e instanceof Error ? e.message : "게시물 검색 중 오류가 발생했습니다.")
        } finally {
            setIsSearching(false)
        }
    }

    return {
        query,
        setQuery,
        isSearching,
        error,
        handleSearch,
    }
}