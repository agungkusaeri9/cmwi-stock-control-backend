import { Rack } from "@prisma/client";

export type RackResponse = {
    id: number;
    code: string;
    name: string;
}

export type CreateRackRequest = {
    code: string;
    name: string;
}

export type UpdateRackRequest = {
    name?: string;
    code?: string;
}

export type SearchRackRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
}

export function toRackResponse(rack: Rack): RackResponse {
    return {
        id: rack.id,
        name: rack.name,
        code: rack.code
    }
}
