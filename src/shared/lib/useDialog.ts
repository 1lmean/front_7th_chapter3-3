import { useState } from "react"

export function useDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const openDialog = () => setIsOpen(true)
    const closeDialog = () => setIsOpen(false)
    const toggleDialog = () => setIsOpen((prev) => !prev)
    return {
        isOpen,
        openDialog,
        closeDialog,
        toggleDialog
    }
}
