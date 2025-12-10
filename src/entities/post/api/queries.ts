import type { PostApiResponse } from "../types";

export async function getPostList(params: { limit: number; skip: number }) {
    const res = await fetch(`/api/posts?limit=${params.limit}&skip=${params.skip}`)

    if (!res.ok) {
        throw new Error("게시물 목록 가져오기 실패")
    }

    const data = (await res.json()) as PostApiResponse
    return data
}

export async function getPostListByTag(tag: string) {
    const res = await fetch(`/api/posts/tag/${tag}`)

    if (!res.ok) {
        throw new Error("태그별 게시물 가져오기 실패")
    }

    const data = (await res.json()) as PostApiResponse
    return data
}

export async function getPostListBySearch(query: string) {
    const res = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)

    if (!res.ok) {
        throw new Error("게시물 검색 실패")
    }

    const data = (await res.json()) as PostApiResponse
    return data
}