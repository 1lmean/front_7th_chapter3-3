export type User = {
    id: number
    username: string
    image: string

    // 상세보기에서 사용
    firstName: string
    lastName: string
    age: number
    email: string
    phone: string

    address: UserAddress
    company: UserCompany
}

export type UserAddress = {
    address: string
    city: string
    state: string
}

export type UserCompany = {
    name: string
    title: string
}

export type UserListApiResponse = {
    users: User[]
    total: number
    skip: number
    limit: number
}

export type UserApiErrorCode =
    | "USER_NOT_FOUND"
    | "USER_FETCH_FAILED"
    | "UNKNOWN"

export type UserApiErrorResponse = {
    code: UserApiErrorCode
    message?: string
}
