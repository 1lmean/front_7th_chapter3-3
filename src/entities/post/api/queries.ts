import type { PostApiResponse } from "../types";
import { API_BASE_URL } from "@/shared/api/config";

export async function getPostList(params: { limit: number; skip: number }) {
    const res = await fetch(`${API_BASE_URL}/posts?limit=${params.limit}&skip=${params.skip}`)

    if (!res.ok) {
        throw new Error("게시물 목록 가져오기 실패")
    }

    const data = (await res.json()) as PostApiResponse
    return data
}

export async function getPostListByTag(tag: string) {
    const res = await fetch(`${API_BASE_URL}/posts/tag/${tag}`)

    if (!res.ok) {
        throw new Error("태그별 게시물 가져오기 실패")
    }

    const data = (await res.json()) as PostApiResponse
    return data
}

export async function getPostListBySearch(query: string) {
    const res = await fetch(`${API_BASE_URL}/posts/search?q=${encodeURIComponent(query)}`)

    if (!res.ok) {
        throw new Error("게시물 검색 실패")
    }

    const data = (await res.json()) as PostApiResponse
    return data
}

export async function getPostTags() {
    const res = await fetch(`${API_BASE_URL}/posts/tags`)

    if (!res.ok) {
        throw new Error("태그 목록 가져오기 실패")
    }

    const data = (await res.json()) as import("../types").PostTag[]
    return data
}