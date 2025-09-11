import {
  GroupResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  toGroupResponse,
  SearchGroupRequest,
} from "../model/group-model";
import { Validation } from "../validation/validation";
import { GroupValidation } from "../validation/group-validation";
import { Group } from "@prisma/client";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

export class GroupService {
  static async create(request: CreateGroupRequest): Promise<GroupResponse> {
    const createRequest = Validation.validate(GroupValidation.CREATE, request);

    const isNameExist = await prismaClient.group.findFirst({
      where: {
        name: createRequest.name,
      },
    });

    if (isNameExist) {
      throw new ResponseError(400, "Name already exists");
    }

    const group = await prismaClient.group.create({
      data: createRequest,
    });

    return toGroupResponse(group);
  }

  static async update(
    id: number,
    request: UpdateGroupRequest
  ): Promise<GroupResponse> {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const idISValid = await prismaClient.group.findUnique({
      where: {
        id: id,
      },
    });

    if (!idISValid) {
      throw new ResponseError(404, "Group not found");
    }

    const updateRequest = Validation.validate(GroupValidation.UPDATE, request);

    const isNameExist = await prismaClient.group.findFirst({
      where: {
        name: updateRequest.name,
        NOT: {
          id: id,
        },
      },
    });

    if (isNameExist) {
      throw new ResponseError(400, "Name already exists");
    }

    const group = await prismaClient.group.update({
      where: {
        id: id,
      },
      data: updateRequest,
    });

    return toGroupResponse(group);
  }

  static async get(
    request: SearchGroupRequest
  ): Promise<Pageable<GroupResponse>> {
    const searchRequest = Validation.validate(GroupValidation.SEARCH, request);

    const filters: any[] = [];

    if (searchRequest.keyword) {
      filters.push({
        OR: [
          {
            name: {
              contains: searchRequest.keyword,
            },
          },
        ],
      });
    }

    const whereClause = filters.length > 0 ? { AND: filters } : {};

    // Default pagination values if not provided
    const page = searchRequest.page || 1;
    const limit = searchRequest.limit || 10;

    const skip = (page - 1) * limit;

    const [groups, total] = await Promise.all([
      prismaClient.group.findMany({
        where: whereClause,
        ...(searchRequest.paginate ? { take: limit, skip } : {}),
      }),
      prismaClient.group.count({
        where: whereClause,
      }),
    ]);

    const pagination = searchRequest.paginate
      ? {
          curr_page: page,
          total_page: Math.ceil(total / limit),
          limit: limit,
          total: total,
        }
      : undefined;

    return {
      data: groups.map(toGroupResponse),
      ...(pagination ? { pagination } : {}),
    };
  }

  static async show(id: number) {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const group = await prismaClient.group.findUnique({
      where: {
        id: id,
      },
    });

    if (!group) {
      throw new ResponseError(404, "Group not found");
    }

    return toGroupResponse(group);
  }

  static async remove(id: number) {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const idISValid = await prismaClient.group.findUnique({
      where: {
        id: id,
      },
    });

    if (!idISValid) {
      throw new ResponseError(404, "Group not found");
    }

    await prismaClient.group.delete({
      where: {
        id: id,
      },
    });
  }
}
