import { useEffect, useState } from "react"
import { Edit2, MessageSquare, Plus, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shared/ui"

// FSD Entities
import { getUserList, getUserDetail, UserBadge, type User } from "@/entities/user"
import { getPostList, getPostListByTag, attachAuthorToPosts, type Post } from "@/entities/post"
import { getCommentsByPost, type Comment } from "@/entities/comment"

// FSD Features
import { PostCreateDialog } from "@/features/post-create"
import { PostEditDialog } from "@/features/post-edit"
import { usePostDelete } from "@/features/post-delete/model/usePostDelete"
import { PostSearchBar, usePostSearch } from "@/features/post-search"
import { usePostFilter, PostFilterControls } from "@/features/post-filter"
import { usePostPagination, PostPagination } from "@/features/post-pagination"
import { CommentCreateDialog } from "@/features/comment-create"
import { CommentEditDialog } from "@/features/comment-edit"
import { useCommentDelete } from "@/features/comment-delete"
import { useCommentLike } from "@/features/comment-like"
import { useDialog } from "@/shared/lib/useDialog"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  // Dialog states
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  const createPostDialog = useDialog()
  const editPostDialog = useDialog()

  // Post delete hook
  const { handleDelete: handleDeletePost } = usePostDelete({
    onSuccess: (id) => {
      setPosts(posts.filter((post) => post.id !== id))
    },
  })

  // Comment delete hook
  const { handleDelete: handleDeleteComment } = useCommentDelete({
    onSuccess: ({ commentId, postId }) => {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== commentId),
      }))
    },
  })

  // Comment like hook
  const { handleLike: handleLikeComment } = useCommentLike({
    onSuccess: ({ postId, comment: updatedComment }) => {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
      }))
    },
  })

  // Post search hook
  const postSearch = usePostSearch({
    onSuccess: async ({ posts: searchedPosts, total: searchTotal }) => {
      const usersData = await getUserList()
      const postsWithUsers = attachAuthorToPosts(searchedPosts, usersData)
      setPosts(postsWithUsers)
      setTotal(searchTotal)
    },
  })

  // Post filter hook
  const postFilter = usePostFilter({
    initialSortBy: (queryParams.get("sortBy") || "none") as any,
    initialSortOrder: (queryParams.get("sortOrder") || "asc") as any,
    initialTag: queryParams.get("tag") || "",
  })

  // Post pagination hook
  const pagination = usePostPagination({
    initialLimit: parseInt(queryParams.get("limit") || "10"),
    initialSkip: parseInt(queryParams.get("skip") || "0"),
    total,
  })

  // Refs
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (pagination.skip) params.set("skip", pagination.skip.toString())
    if (pagination.limit) params.set("limit", pagination.limit.toString())
    if (postSearch.query) params.set("search", postSearch.query)
    if (postFilter.sortBy) params.set("sortBy", postFilter.sortBy)
    if (postFilter.sortOrder) params.set("sortOrder", postFilter.sortOrder)
    if (postFilter.selectedTag) params.set("tag", postFilter.selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        getPostList({ limit: pagination.limit, skip: pagination.skip }),
        getUserList(),
      ])

      const postsWithUsers = attachAuthorToPosts(postsData.posts, usersData)
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }





  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
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
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 게시물 추가 (PostCreateDialog에서 처리)
  const handlePostCreated = () => {
    // 게시물 목록 새로고침
    if (postFilter.selectedTag) {
      fetchPostsByTag(postFilter.selectedTag)
    } else {
      fetchPosts()
    }
  }

  // 게시물 업데이트 (PostEditDialog에서 처리)
  const handlePostUpdated = (updated: Post) => {
    setPosts(posts.map((post) => (post.id === updated.id ? updated : post)))
  }



  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const commentsData = await getCommentsByPost(postId)
      setComments((prev) => ({ ...prev, [postId]: commentsData }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }



  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const userData = await getUserDetail(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }



  useEffect(() => {
    if (postFilter.selectedTag) {
      fetchPostsByTag(postFilter.selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [pagination.skip, pagination.limit, postFilter.sortBy, postFilter.sortOrder, postFilter.selectedTag])



  // 하이라이트 함수 추가
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
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
                <div>{highlightText(post.title, postSearch.query)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${postFilter.selectedTag === tag
                        ? "text-white bg-blue-500 hover:bg-blue-600"
                        : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                        }`}
                      onClick={() => {
                        postFilter.setSelectedTag(tag)
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {post.author && (
                <div className="cursor-pointer" onClick={() => openUserModal(post.author!)}>
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
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    editPostDialog.openDialog()
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, postSearch.query)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => handleLikeComment(postId, comment)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => createPostDialog.openDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <PostSearchBar
              query={postSearch.query}
              onQueryChange={postSearch.setQuery}
              onSearch={postSearch.handleSearch}
              isSearching={postSearch.isSearching}
            />
            <PostFilterControls
              tags={postFilter.tags}
              selectedTag={postFilter.selectedTag}
              sortBy={postFilter.sortBy}
              sortOrder={postFilter.sortOrder}
              onTagChange={(tag) => {
                postFilter.setSelectedTag(tag)
                fetchPostsByTag(tag)
                updateURL()
              }}
              onSortByChange={postFilter.setSortBy}
              onSortOrderChange={postFilter.setSortOrder}
            />
          </div>

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <PostPagination
            limit={pagination.limit}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            canPrev={pagination.canPrev}
            canNext={pagination.canNext}
            onChangeLimit={pagination.changeLimit}
            onPrev={pagination.goPrev}
            onNext={pagination.goNext}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostCreateDialog
        open={createPostDialog.isOpen}
        onOpenChange={createPostDialog.toggleDialog}
        onCreated={handlePostCreated}
      />

      {/* 게시물 수정 대화상자 */}
      {selectedPost && (
        <PostEditDialog
          open={editPostDialog.isOpen}
          onOpenChange={editPostDialog.toggleDialog}
          post={selectedPost}
          onUpdated={handlePostUpdated}
        />
      )}

      {/* 댓글 추가 대화상자 */}
      {selectedPost && (
        <CommentCreateDialog
          open={showAddCommentDialog}
          onOpenChange={setShowAddCommentDialog}
          postId={selectedPost.id}
          defaultUserId={1}
          onCreated={(newComment) => {
            setComments((prev) => ({
              ...prev,
              [newComment.postId]: [...(prev[newComment.postId] || []), newComment],
            }))
          }}
        />
      )}

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onUpdated={(updatedComment) => {
          setComments((prev) => ({
            ...prev,
            [updatedComment.postId]: prev[updatedComment.postId].map((comment) =>
              comment.id === updatedComment.id ? updatedComment : comment,
            ),
          }))
        }}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title && highlightText(selectedPost.title, postSearch.query)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{selectedPost?.body && highlightText(selectedPost.body, postSearch.query)}</p>
            {selectedPost?.id && renderComments(selectedPost.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
