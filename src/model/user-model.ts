import { User } from "@prisma/client";

export type UserResponse = {
  username: string;
  name: string;
  role: string;
  operatorId: number | null;
  token?: string;
};

export type LoginUserRequest = {
  username: string;
  password: string;
};

export type UpdateUserRequest = {
  name?: string;
  password?: string;
};

export function toUserResponse(user: any): UserResponse {
  return {
    name: user.name,
    username: user.username,
    role: user.role,
    operatorId: user.operator?.id || null,
  };
}
