import {
  RequesterResponse,
  CreateRequesterRequest,
  UpdateRequesterRequest,
  toRequesterResponse,
  SearchRequesterRequest,
} from "../model/requester-model";
import { Validation } from "../validation/validation";
import { RequesterValidation } from "../validation/requester-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

export class RequesterService {
  static async create(
    request: CreateRequesterRequest
  ): Promise<RequesterResponse> {
    const createRequest = Validation.validate(
      RequesterValidation.CREATE,
      request
    );

    const isGroupExist = await prismaClient.group.findUnique({
      where: {
        id: createRequest.group_id ?? undefined,
      },
    });

    if (!isGroupExist) {
      throw new ResponseError(404, "Group not found");
    }

    const requester = await prismaClient.requester.create({
      data: createRequest,
      include: {
        group: true,
      },
    });

    return toRequesterResponse(requester);
  }

  static async update(
    id: number,
    request: UpdateRequesterRequest
  ): Promise<RequesterResponse> {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const idISValid = await prismaClient.requester.findUnique({
      where: {
        id: id,
      },
    });

    if (!idISValid) {
      throw new ResponseError(404, "Requester not found");
    }

    const updateRequest = Validation.validate(
      RequesterValidation.UPDATE,
      request
    );

    const isGroupExist = await prismaClient.group.findUnique({
      where: {
        id: updateRequest.group_id ?? undefined,
      },
    });

    if (!isGroupExist) {
      throw new ResponseError(404, "Group not found");
    }

    const requester = await prismaClient.requester.update({
      where: {
        id: id,
      },
      data: updateRequest,
      include: {
        group: true,
      },
    });

    return toRequesterResponse(requester);
  }

  static async get(
    request: SearchRequesterRequest
  ): Promise<Pageable<RequesterResponse>> {
    const searchRequest = Validation.validate(
      RequesterValidation.SEARCH,
      request
    );

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

    if (searchRequest.group_id) {
      filters.push({
        group_id: searchRequest.group_id,
      });
    }

    const whereClause = filters.length > 0 ? { AND: filters } : {};

    // Default pagination values if not provided
    const page = searchRequest.page || 1;
    const limit = searchRequest.limit || 10;

    const skip = (page - 1) * limit;

    const [requesters, total] = await Promise.all([
      prismaClient.requester.findMany({
        where: whereClause,
        ...(searchRequest.paginate ? { take: limit, skip } : {}),
        include: {
          group: true,
        },
      }),
      prismaClient.requester.count({
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
      data: requesters.map(toRequesterResponse),
      ...(pagination ? { pagination } : {}),
    };
  }

  static async show(id: number) {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const requester = await prismaClient.requester.findUnique({
      where: {
        id: id,
      },
      include: {
        group: true,
      },
    });

    if (!requester) {
      throw new ResponseError(404, "Requester not found");
    }

    return toRequesterResponse(requester);
  }

  static async remove(id: number) {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const idISValid = await prismaClient.requester.findUnique({
      where: {
        id: id,
      },
    });

    if (!idISValid) {
      throw new ResponseError(404, "Requester not found");
    }

    await prismaClient.requester.delete({
      where: {
        id: id,
      },
    });
  }

  static async getByGroupId(group_id: number): Promise<RequesterResponse[]> {
    if (isNaN(group_id)) {
      throw new ResponseError(400, "Invalid group_id");
    }

    const requesters = await prismaClient.requester.findMany({
      where: {
        group_id: group_id,
      },
      include: {
        group: true,
      },
    });

    return requesters.map(toRequesterResponse);
  }
}
