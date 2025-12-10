// src/entities/post/model/joinAuthor.ts
import type { Post } from "../types"
import type { User } from "@/entities/user/types" //?

export function attachAuthorToPosts(posts: Post[], users: User[]): Post[] {
    return posts.map((post) => ({
        ...post,
        author: users.find((user) => user.id === post.userId),
    }))
}
