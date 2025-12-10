// src/entities/post/model/validate.ts
import type { Post } from "../types"

export type ValidatePostResult =
    | { ok: true }
    | { ok: false; reason: "TITLE_REQUIRED" | "TITLE_TOO_LONG" | "BODY_REQUIRED" }

export function validatePost(post: Post): ValidatePostResult {
    if (!post.title.trim()) {
        return { ok: false, reason: "TITLE_REQUIRED" }
    }

    if (post.title.length > 100) {
        return { ok: false, reason: "TITLE_TOO_LONG" }
    }

    if (!post.body.trim()) {
        return { ok: false, reason: "BODY_REQUIRED" }
    }

    return { ok: true }
}
