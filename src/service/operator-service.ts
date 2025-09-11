import {
  OperatorResponse,
  CreateOperatorRequest,
  UpdateOperatorRequest,
  toOperatorResponse,
  SearchOperatorRequest,
} from "../model/operator-model";
import { Validation } from "../validation/validation";
import { OperatorValidation } from "../validation/operator-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";
import bcrypt from "bcryptjs";

export class OperatorService {
  static async create(
    request: CreateOperatorRequest
  ): Promise<OperatorResponse> {
    const createRequest = Validation.validate(
      OperatorValidation.CREATE,
      request
    );

    const isNikExist = await prismaClient.operator.findFirst({
      where: {
        nik: createRequest.nik,
      },
    });

    if (isNikExist) {
      throw new ResponseError(400, "Nik already exists");
    }

    const isUsernameExist = await prismaClient.user.findFirst({
      where: {
        username: createRequest.username,
      },
    });

    if (isUsernameExist) {
      throw new ResponseError(400, "Username already exists");
    }

    const operator = await prismaClient.operator.create({
      data: {
        name: createRequest.name,
        nik: createRequest.nik,
        user: {
          create: {
            name: createRequest.name,
            username: createRequest.username,
            password: await bcrypt.hash(createRequest.password, 10),
          },
        },
      },
      include: {
        user: true,
      },
    });

    return toOperatorResponse(operator);
  }

  static async update(
    id: number,
    request: UpdateOperatorRequest
  ): Promise<OperatorResponse> {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const operatorExist = await prismaClient.operator.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!operatorExist) {
      throw new ResponseError(404, "Operator not found");
    }

    const updateRequest = Validation.validate(
      OperatorValidation.UPDATE,
      request
    );

    if (updateRequest.nik) {
      const isNikExist = await prismaClient.operator.findFirst({
        where: {
          nik: updateRequest.nik,
          NOT: { id },
        },
      });

      if (isNikExist) {
        throw new ResponseError(400, "Nik already exists");
      }
    }

    if (updateRequest.username) {
      const isUsernameExist = await prismaClient.user.findFirst({
        where: {
          username: updateRequest.username,
          NOT: { id: operatorExist.user_id ?? undefined },
        },
      });

      if (isUsernameExist) {
        throw new ResponseError(400, "Username already exists");
      }
    }

    // update operator + user sekaligus
    const operator = await prismaClient.operator.update({
      where: { id },
      data: {
        name: updateRequest.name,
        nik: updateRequest.nik,
        user: operatorExist.user
          ? {
              update: {
                name: updateRequest.name,
                username: updateRequest.username,
                ...(updateRequest.password
                  ? {
                      password: await bcrypt.hash(updateRequest.password, 10),
                    }
                  : {}),
              },
            }
          : undefined,
      },
      include: { user: true },
    });

    return toOperatorResponse(operator);
  }

  static async get(
    request: SearchOperatorRequest
  ): Promise<Pageable<OperatorResponse>> {
    const searchRequest = Validation.validate(
      OperatorValidation.SEARCH,
      request
    );

    const filters: any[] = [];

    if (searchRequest.keyword) {
      filters.push({
        OR: [
          { nik: { contains: searchRequest.keyword } },
          { name: { contains: searchRequest.keyword } },
          { user: { username: { contains: searchRequest.keyword } } },
        ],
      });
    }

    const whereClause = filters.length > 0 ? { AND: filters } : {};

    const page = searchRequest.page || 1;
    const limit = searchRequest.limit || 10;
    const skip = (page - 1) * limit;

    const [operators, total] = await Promise.all([
      prismaClient.operator.findMany({
        where: whereClause,
        ...(searchRequest.paginate ? { take: limit, skip } : {}),
        include: { user: true },
      }),
      prismaClient.operator.count({ where: whereClause }),
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
      data: operators.map(toOperatorResponse),
      ...(pagination ? { pagination } : {}),
    };
  }

  static async show(id: number) {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const operator = await prismaClient.operator.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!operator) {
      throw new ResponseError(404, "Operator not found");
    }

    return toOperatorResponse(operator);
  }

  static async remove(id: number) {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const operator = await prismaClient.operator.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!operator) {
      throw new ResponseError(404, "Operator not found");
    }

    if (operator.user) {
      await prismaClient.$transaction([
        prismaClient.operator.delete({ where: { id } }),
        prismaClient.user.delete({ where: { id: operator.user.id } }),
      ]);
    } else {
      await prismaClient.operator.delete({ where: { id } });
    }
  }
}
