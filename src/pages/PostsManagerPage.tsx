import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../shared/ui"

// FSD Entities
import { getUserList } from "@/entities/user"
import { getPostList, getPostListByTag, attachAuthorToPosts, sortPostList, type Post } from "@/entities/post"

// FSD Features
import { PostCreateDialog } from "@/features/post-create"
import { PostEditDialog } from "@/features/post-edit"
import { usePostDelete } from "@/features/post-delete/model/usePostDelete"
import { PostSearchBar, usePostSearch } from "@/features/post-search"
import { usePostFilter, PostFilterControls } from "@/features/post-filter"
import { usePostPagination, PostPagination } from "@/features/post-pagination"
import { useDialog } from "@/shared/lib/useDialog"
import { useUserDetail } from "@/features/user-detail"
import { UserDetailDialog } from "@/features/user-detail/ui/UserDetailDialog"

// Widgets
import { PostTable } from "@/widgets/post-table"
import { PostDetail } from "@/widgets/post-detail"
import { usePostDetail } from "@/widgets/post-detail/model/usePostDetail"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null) // 수정용만 사용
  const [loading, setLoading] = useState(false)

  // Dialog states
  const createPostDialog = useDialog()
  const editPostDialog = useDialog()

  const userDetail = useUserDetail()
  const postDetail = usePostDetail()

  // Post delete hook
  const { handleDelete: handleDeletePost } = usePostDelete({
    onSuccess: (id) => {
      setPosts((prev) => prev.filter((post) => post.id !== id))
    },
  })

  // Post search hook
  const postSearch = usePostSearch({
    onSuccess: async ({ posts: searchedPosts, total: searchTotal }) => {
      const usersData = await getUserList()
      let postsWithUsers = attachAuthorToPosts(searchedPosts, usersData)

      postsWithUsers = sortPostList(
        postsWithUsers,
        postFilter.sortBy,
        postFilter.sortOrder,
      )

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

      let postsWithUsers = attachAuthorToPosts(postsData.posts, usersData)

      postsWithUsers = sortPostList(
        postsWithUsers,
        postFilter.sortBy,
        postFilter.sortOrder,
      )

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
      await fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        getPostListByTag(tag),
        getUserList(),
      ])

      let postsWithUsers = attachAuthorToPosts(postsData.posts, usersData)

      postsWithUsers = sortPostList(
        postsWithUsers,
        postFilter.sortBy,
        postFilter.sortOrder,
      )

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
    if (postFilter.selectedTag) {
      void fetchPostsByTag(postFilter.selectedTag)
    } else {
      void fetchPosts()
    }
  }

  // 게시물 업데이트 (PostEditDialog에서 처리)
  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((post) => (post.id === updated.id ? updated : post)))
  }

  // 게시물 상세 보기 (이제 postDetail 훅만 사용)
  const handleOpenPostDetail = (post: Post) => {
    postDetail.open(post)
  }

  useEffect(() => {
    if (postFilter.selectedTag) {
      void fetchPostsByTag(postFilter.selectedTag)
    } else {
      void fetchPosts()
    }
    updateURL()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.skip, pagination.limit, postFilter.sortBy, postFilter.sortOrder, postFilter.selectedTag])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={createPostDialog.openDialog}>
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
                void fetchPostsByTag(tag)
                updateURL()
              }}
              onSortByChange={postFilter.setSortBy}
              onSortOrderChange={postFilter.setSortOrder}
            />
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              highlightQuery={postSearch.query}
              selectedTag={postFilter.selectedTag}
              onTagClick={(tag) => {
                postFilter.setSelectedTag(tag)
                void fetchPostsByTag(tag)
                updateURL()
              }}
              onAuthorClick={(userId) => userDetail.open(userId)}
              onOpenDetail={handleOpenPostDetail}
              onEdit={(post) => {
                setSelectedPost(post)
                editPostDialog.openDialog()
              }}
              onDelete={handleDeletePost}
            />
          )}

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

      {/* 게시물 상세 보기 + 댓글 위젯 */}
      <PostDetail
        detail={postDetail}
        highlightQuery={postSearch.query}
      />

      {/* 사용자 모달 */}
      <UserDetailDialog
        isOpen={userDetail.isOpen}
        onOpenChange={userDetail.close}
        user={userDetail.user}
      />
    </Card>
  )
}

export default PostsManager
