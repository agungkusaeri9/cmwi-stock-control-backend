import { Group } from "@prisma/client";

export type RequesterResponse = {
  id: number;
  name: string;
  group: Group | null;
};

export type CreateRequesterRequest = {
  name: string;
  group_id: number | null;
};

export type UpdateRequesterRequest = {
  name?: string;
  group_id?: number | null;
};

export type SearchRequesterRequest = {
  keyword?: string;
  page: number;
  limit: number;
  paginate?: boolean;
};

export function toRequesterResponse(requester: any): RequesterResponse {
  return {
    id: requester.id,
    name: requester.name,
    group: requester.group || null,
  };
}
