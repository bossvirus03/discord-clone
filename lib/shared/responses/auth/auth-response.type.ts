export interface AuthSignInRes {
    access_token: string,
    refresh_token: string
}

export interface AuthSignUpRes {
    access_token: string,
    refresh_token: string
}

export interface AuthLogoutRes {
    message: string
}

export interface AuthRefreshRes {
    access_token: string,
    refresh_token: string
}