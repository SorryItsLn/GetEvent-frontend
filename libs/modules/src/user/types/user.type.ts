export type UserRole = 'Admin' | 'User' | 'Creator';

export type User = { id: string; userName: string; email: string; roles: UserRole[] };

export type GetUserByIdResponse = User;

export type GetMeResponse = User;
