export type RegisterRequest = { userName: string; password: string; email: string };

export type RegisterResponse = string;

export type LoginRequest = Omit<RegisterRequest, 'userName'>;

export type LoginResponse = string;
