// src/features/post-search/ui/PostSearchBar.tsx
import { Search } from "lucide-react"
import { Input, Button } from "@/shared/ui"

type PostSearchBarProps = {
    query: string
    onQueryChange: (value: string) => void
    onSearch: () => void
    isSearching?: boolean
}

export function PostSearchBar({
    query,
    onQueryChange,
    onSearch,
    isSearching,
}: PostSearchBarProps) {
    return (
        <div className="relative flex gap-2 flex-1">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="게시물 검색..."
                    className="pl-8"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSearch()
                    }}
                />
            </div>
            <Button onClick={onSearch} disabled={isSearching}>
                {isSearching ? "검색 중..." : "검색"}
            </Button>
        </div>
    )
}
