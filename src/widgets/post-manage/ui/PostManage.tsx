// src/widgets/post-list/ui/PostList.tsx
import type { Post } from "@/entities/post"
import { PostSearchBar } from "@/features/post-search"
import { PostFilterControls } from "@/features/post-filter"
import { PostPagination } from "@/features/post-pagination"
import { PostTable } from "@/widgets/post-table"
import type { UsePostManageResult } from "../model/usePostManage"

type PostManageProps = {
    postManage: UsePostManageResult
    onClickAuthor: (userId: number) => void
    onClickDetail: (post: Post) => void
    onClickEdit: (post: Post) => void
    onClickDelete: (postId: number) => void
}

export function PostManage({
    postManage,
    onClickAuthor,
    onClickDetail,
    onClickEdit,
    onClickDelete,
}: PostManageProps) {
    const { posts, loading, search, filter, pagination, fetchPostsByTag } = postManage

    return (
        <div className="flex flex-col gap-4">
            {/* 검색 + 필터 */}
            <div className="flex gap-4">
                <PostSearchBar
                    query={search.query}
                    onQueryChange={search.setQuery}
                    onSearch={search.handleSearch}
                    isSearching={search.isSearching}
                />
                <PostFilterControls
                    tags={filter.tags}
                    selectedTag={filter.selectedTag}
                    sortBy={filter.sortBy}
                    sortOrder={filter.sortOrder}
                    onTagChange={(tag) => {
                        filter.setSelectedTag(tag)
                        void fetchPostsByTag(tag)
                    }}
                    onSortByChange={filter.setSortBy}
                    onSortOrderChange={filter.setSortOrder}
                />
            </div>

            {/* 테이블 */}
            {loading ? (
                <div className="flex justify-center p-4">로딩 중...</div>
            ) : (
                <PostTable
                    posts={posts}
                    highlightQuery={search.query}
                    selectedTag={filter.selectedTag}
                    onTagClick={(tag) => {
                        filter.setSelectedTag(tag)
                        void fetchPostsByTag(tag)
                    }}
                    onAuthorClick={onClickAuthor}
                    onOpenDetail={onClickDetail}
                    onEdit={onClickEdit}
                    onDelete={onClickDelete}
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
    )
}
