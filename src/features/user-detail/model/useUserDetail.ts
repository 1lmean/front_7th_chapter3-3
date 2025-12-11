import { useState } from "react"
import { getUserDetail, type User } from "@/entities/user"

export function useUserDetail() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const open = async (userId: number) => {
        setIsLoading(true)
        try {
            const detail = await getUserDetail(userId)
            setUser(detail)
            setIsOpen(true)
        } finally {
            setIsLoading(false)
        }
    }

    const close = () => setIsOpen(false)

    return {
        user,
        isLoading,
        isOpen,
        open,
        close
    }
}
