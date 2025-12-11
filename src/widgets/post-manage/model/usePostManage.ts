import { useCallback, useEffect, useState } from "react"
import type { Post } from "@/entities/post"
import { getPostList, getPostListByTag, attachAuthorToPosts } from "@/entities/post"
import { getUserList } from "@/entities/user"
import { usePostSearch } from "@/features/post-search"
import { usePostFilter } from "@/features/post-filter"
import { usePostPagination } from "@/features/post-pagination"

export type SortBy = "none" | "id" | "title" | "reactions"
export type SortOrder = "asc" | "desc"

type UsePostManageOptions = {
    initialSkip?: number
    initialLimit?: number
    initialSortBy?: SortBy
    initialSortOrder?: SortOrder
    initialTag?: string
}

export type UsePostManageResult = {
    posts: Post[]
    total: number
    loading: boolean
    search: ReturnType<typeof usePostSearch>
    filter: ReturnType<typeof usePostFilter>
    pagination: ReturnType<typeof usePostPagination>

    fetchPostsByTag: (tag: string) => Promise<void>
    refetch: () => Promise<void>
}

export function usePostManage(options?: UsePostManageOptions): UsePostManageResult {
    const [posts, setPosts] = useState<Post[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)

    const filter = usePostFilter({
        initialSortBy: (options?.initialSortBy ?? "none") as SortBy,
        initialSortOrder: (options?.initialSortOrder ?? "asc") as SortOrder,
        initialTag: options?.initialTag ?? "",
    })

    const pagination = usePostPagination({
        initialLimit: options?.initialLimit ?? 10,
        initialSkip: options?.initialSkip ?? 0,
        total,
    })

    const search = usePostSearch({
        onSuccess: async ({ posts: searchedPosts, total: searchTotal }) => {
            const usersData = await getUserList()
            const postsWithUsers = attachAuthorToPosts(searchedPosts, usersData)
            setPosts(postsWithUsers)
            setTotal(searchTotal)
        },
    })

    const fetchPosts = useCallback(async () => {
        setLoading(true)
        try {
            const [postsData, usersData] = await Promise.all([
                getPostList({ limit: pagination.limit, skip: pagination.skip }),
                getUserList(),
            ])

            const postsWithUsers = attachAuthorToPosts(postsData.posts, usersData)
            setPosts(postsWithUsers)
            setTotal(postsData.total)
        } catch (e) {
            console.error("게시물 가져오기 오류:", e)
        } finally {
            setLoading(false)
        }
    }, [pagination.limit, pagination.skip])

    const fetchPostsByTag = useCallback(
        async (tag: string) => {
            if (!tag || tag === "all") {
                await fetchPosts()
                return
            }

            setLoading(true)
            try {
                const [postsData, usersData] = await Promise.all([
                    getPostListByTag(tag),
                    getUserList(),
                ])

                const postsWithUsers = attachAuthorToPosts(postsData.posts, usersData)
                setPosts(postsWithUsers)
                setTotal(postsData.total)
            } catch (e) {
                console.error("태그별 게시물 가져오기 오류:", e)
            } finally {
                setLoading(false)
            }
        },
        [fetchPosts],
    )

    useEffect(() => {
        if (filter.selectedTag) {
            void fetchPostsByTag(filter.selectedTag)
        } else {
            void fetchPosts()
        }
    }, [
        fetchPosts,
        fetchPostsByTag,
        pagination.skip,
        pagination.limit,
        filter.sortBy,
        filter.sortOrder,
        filter.selectedTag,
    ])

    return {
        posts,
        total,
        loading,
        search,
        filter,
        pagination,
        fetchPostsByTag,
        refetch: fetchPosts,
    }
}
