import apiClient from '../api/client';

const TOKEN_KEY = 'bp_member_token';

interface SignupPayload {
    username: string;
    email: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string };
}

export async function signup(payload: SignupPayload): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/auth/signup', payload);
    return data;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    return data;
}

export async function resendConfirmation(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/auth/resend-confirmation', { email });
    return data;
}

export function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getMemberToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}