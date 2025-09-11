import { Group } from "@prisma/client";

export type RequesterResponse = {
  id: number;
  nik: string;
  name: string;
  group: Group | null;
};

export type CreateRequesterRequest = {
  nik: string;
  name: string;
  group_id: number | null;
};

export type UpdateRequesterRequest = {
  name?: string;
  nik?: string;
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
    nik: requester.nik,
    group: requester.group || null,
  };
}
