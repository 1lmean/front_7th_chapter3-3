import type { User, UserListApiResponse, UserApiErrorResponse } from "../types"
import { API_BASE_URL } from "@/shared/api/config";

export async function getUserList() {
    const res = await fetch(`${API_BASE_URL}/users?limit=0&select=username,image`)

    if (!res.ok) {
        const error: UserApiErrorResponse = {
            code: "USER_FETCH_FAILED",
            message: "사용자 목록 가져오기 실패",
        }
        throw error
    }

    const data = (await res.json()) as UserListApiResponse
    return data.users
}

export async function getUserDetail(id: number) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`)

    if (!res.ok) {
        const error: UserApiErrorResponse = {
            code: "USER_NOT_FOUND",
            message: "사용자 정보를 불러오지 못했습니다.",
        }
        throw error
    }

    const data = (await res.json()) as User
    return data
}
