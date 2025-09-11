import {
  SubMachineResponse,
  CreateSubMachineRequest,
  UpdateSubMachineRequest,
  toSubMachineResponse,
  SearchSubMachineRequest,
} from "../model/submachine-model";
import { Validation } from "../validation/validation";
import { SubMachineValidation } from "../validation/submachine-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

export class SubMachineService {
  static async create(
    request: CreateSubMachineRequest
  ): Promise<SubMachineResponse> {
    const createRequest = Validation.validate(
      SubMachineValidation.CREATE,
      request
    );

    const isCodeExist = await prismaClient.subMachine.findFirst({
      where: {
        code: createRequest.code,
      },
    });

    if (isCodeExist) {
      throw new ResponseError(400, "Code already exists");
    }

    const machine = await prismaClient.subMachine.create({
      data: createRequest,
      include: {
        machine: true,
      },
    });

    return toSubMachineResponse(machine);
  }

  static async update(
    id: number,
    request: UpdateSubMachineRequest
  ): Promise<SubMachineResponse> {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const idISValid = await prismaClient.subMachine.findUnique({
      where: {
        id: id,
      },
    });

    if (!idISValid) {
      throw new ResponseError(404, "SubMachine not found");
    }

    const updateRequest = Validation.validate(
      SubMachineValidation.UPDATE,
      request
    );

    const isCodeExist = await prismaClient.subMachine.findFirst({
      where: {
        code: updateRequest.code,
        NOT: {
          id: id,
        },
      },
    });

    if (isCodeExist) {
      throw new ResponseError(400, "Code already exists");
    }

    const machine = await prismaClient.subMachine.update({
      where: {
        id: id,
      },
      data: updateRequest,
      include: {
        machine: true,
      },
    });

    return toSubMachineResponse(machine);
  }

  static async get(
    request: SearchSubMachineRequest
  ): Promise<Pageable<SubMachineResponse>> {
    const searchRequest = Validation.validate(
      SubMachineValidation.SEARCH,
      request
    );

    const filters: any[] = [];

    if (searchRequest.keyword) {
      filters.push({
        OR: [
          {
            code: {
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

    const [machines, total] = await Promise.all([
      prismaClient.subMachine.findMany({
        where: whereClause,
        ...(searchRequest.paginate ? { take: limit, skip } : {}),
        orderBy: {
          code: "asc",
        },
        include: {
          machine: true,
        },
      }),
      prismaClient.subMachine.count({
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
      data: machines.map(toSubMachineResponse),
      ...(pagination ? { pagination } : {}),
    };
  }

  static async show(id: number): Promise<SubMachineResponse> {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const machine = await prismaClient.subMachine.findUnique({
      where: {
        id: id,
      },
      include: {
        machine: true,
      },
    });

    if (!machine) {
      throw new ResponseError(404, "SubMachine not found");
    }

    return toSubMachineResponse(machine);
  }

  static async remove(id: number) {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const idISValid = await prismaClient.subMachine.findUnique({
      where: {
        id: id,
      },
    });

    if (!idISValid) {
      throw new ResponseError(404, "SubMachine not found");
    }

    await prismaClient.subMachine.delete({
      where: {
        id: id,
      },
    });
  }
}
