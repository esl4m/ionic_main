export interface AuthResponse {
    user: {
        id: number,
        name: string,
        email: string,
        role: string,
        access_token: string,
        expires_in: number
    }
}
