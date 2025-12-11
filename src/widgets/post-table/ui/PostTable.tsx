// src/widgets/post-table/ui/PostTable.tsx
import { ThumbsDown, ThumbsUp, Edit2, MessageSquare, Trash2 } from "lucide-react"
import type { Post } from "@/entities/post"
import { UserBadge } from "@/entities/user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@/shared/ui"
import { highlightText } from "@/shared/lib/highlightText"

type PostTableProps = {
    posts: Post[]
    highlightQuery: string
    selectedTag: string | null
    onTagClick: (tag: string) => void
    onAuthorClick: (userId: number) => void
    onOpenDetail: (post: Post) => void
    onEdit: (post: Post) => void
    onDelete: (postId: number) => void
}

export function PostTable({
    posts,
    highlightQuery,
    selectedTag,
    onTagClick,
    onAuthorClick,
    onOpenDetail,
    onEdit,
    onDelete,
}: PostTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>제목</TableHead>
                    <TableHead className="w-[150px]">작성자</TableHead>
                    <TableHead className="w-[150px]">반응</TableHead>
                    <TableHead className="w-[150px]">작업</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {posts.map((post) => (
                    <TableRow key={post.id}>
                        <TableCell>{post.id}</TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <div>{highlightText(post.title, highlightQuery)}</div>

                                <div className="flex flex-wrap gap-1">
                                    {post.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${selectedTag === tag
                                                    ? "text-white bg-blue-500 hover:bg-blue-600"
                                                    : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                                                }`}
                                            onClick={() => onTagClick(tag)}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            {post.author && (
                                <div className="cursor-pointer" onClick={() => onAuthorClick(post.author!.id)}>
                                    <UserBadge user={post.author} />
                                </div>
                            )}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{post.reactions?.likes || 0}</span>
                                <ThumbsDown className="w-4 h-4" />
                                <span>{post.reactions?.dislikes || 0}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => onOpenDetail(post)}>
                                    <MessageSquare className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        onEdit(post)
                                    }}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
