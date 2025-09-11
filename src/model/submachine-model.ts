import { Machine } from "@prisma/client";

export type SubMachineResponse = {
  id: number;
  code: string;
  machine: Machine | null;
};

export type CreateSubMachineRequest = {
  code: string;
  machine_id: number | null;
};

export type UpdateSubMachineRequest = {
  code?: string;
  machine_id?: number | null;
};

export type SearchSubMachineRequest = {
  keyword?: string;
  page: number;
  limit: number;
  paginate?: boolean;
  machine_id?: number;
};

export function toSubMachineResponse(rack: any): SubMachineResponse {
  return {
    id: rack.id,
    code: rack.code,
    machine: rack.machine || null,
  };
}
