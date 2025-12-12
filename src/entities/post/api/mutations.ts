// ?: createPost와 updatePost의 파라미터를 통일하고 싶음.
import type { Post, PostApiRequest } from "../types"
import { API_BASE_URL } from "@/shared/api/config";

export async function createPost(req: PostApiRequest) {
    const res = await fetch(`${API_BASE_URL}/posts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    })

    if (!res.ok) {
        throw new Error("게시물 생성 실패")
    }

    const data = (await res.json()) as Post
    return data
}

export async function updatePost(post: Post) {
    const res = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    })

    if (!res.ok) {
        throw new Error("게시물 업데이트 실패")
    }

    const data = (await res.json()) as Post
    return data
}

export async function deletePost(id: number) {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        throw new Error("게시물 삭제 실패")
    }
}