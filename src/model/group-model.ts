import { Group } from "@prisma/client";

export type GroupResponse = {
  id: number;
  description: string | null;
  name: string;
};

export type CreateGroupRequest = {
  description: string | null;
  name: string;
};

export type UpdateGroupRequest = {
  name?: string;
  description?: string | null;
};

export type SearchGroupRequest = {
  keyword?: string;
  page: number;
  limit: number;
  paginate?: boolean;
};

export function toGroupResponse(group: Group): GroupResponse {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
  };
}
