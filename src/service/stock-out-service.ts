import {
  StockOutResponse,
  CreateStockOutRequest,
  toStockOutResponse,
  SearchStockOutRequest,
  UpdateStockOutRequest,
} from "../model/stock-out-model";
import { Validation } from "../validation/validation";
import { StockOutValidation } from "../validation/stock-out-validation";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";
import { Workbook } from "exceljs";
import path from "path";
import { convertToReadableDate } from "../helper/readable-date-helper";
import { sendNotification } from "../application/websocket";

export class StockOutService {
  static async create(
    request: CreateStockOutRequest,
    operatorId?: number | null
  ): Promise<StockOutResponse> {
    if (!operatorId) {
      throw new ResponseError(401, "Unauthorized");
    }

    const isOperatorExist = await prismaClient.operator.findFirst({
      where: { id: operatorId },
    });

    if (!isOperatorExist) {
      throw new ResponseError(404, "Operator not found");
    }

    const createRequest = Validation.validate(
      StockOutValidation.CREATE,
      request
    );

    return await prismaClient.$transaction(async (prisma) => {
      const kanbanRows = await prisma.$queryRaw<
        Array<{ id: string; balance: number; deleted_at: Date }>
      >`SELECT id, balance, deleted_at FROM kanbans WHERE code = ${createRequest.kanban_code} FOR UPDATE`;

      if (kanbanRows.length === 0) {
        throw new ResponseError(404, "Kanban Code not found");
      }

      const kanban = kanbanRows[0];

      if (kanban.deleted_at) {
        throw new ResponseError(400, "Kanban is not found");
      }

      if (kanban.balance < createRequest.quantity) {
        throw new ResponseError(400, "Kanban stock is not enough");
      }

      // Update kanban balance
      const newKanban = await prisma.kanban.update({
        where: { id: Number(kanban.id) },
        data: {
          balance: { decrement: createRequest.quantity },
        },
      });

      const subMachine = await prisma.subMachine.findUnique({
        where: { id: createRequest.sub_machine_id },
      });

      if (!subMachine) {
        throw new ResponseError(404, "Sub Machine not found");
      }

      const machineArea = await prisma.machineArea.findUnique({
        where: { id: createRequest.machine_area_id },
      });

      if (!machineArea) {
        throw new ResponseError(404, "Machine Area not found");
      }

      // Create stock out record
      const stockOut = await prisma.stockOut.create({
        data: {
          ...createRequest,
          operator_id: operatorId,
          machine_id: subMachine.machine_id,
          balance_before: kanban.balance,
          balance_after: kanban.balance - createRequest.quantity,
        },
        include: {
          machine_area: true,
          machine: true,
          sub_machine: true,
          operator: true,
          requester: true,
          kanban: {
            include: {
              rack: true,
            },
          },
        },
      });

      if (
        newKanban.min_quantity &&
        newKanban.balance < newKanban.min_quantity
      ) {
        logger.info(
          `Kanban ${newKanban.code} stock is less than ${newKanban.min_quantity} ${newKanban.uom}`
        );
        sendNotification(
          `Kanban ${newKanban.code} stock is less than ${newKanban.min_quantity} ${newKanban.uom}`
        );
        await prisma.kanban.update({
          where: { id: Number(newKanban.id) },
          data: {
            reminded_at: new Date(),
          },
        });
      }

      return toStockOutResponse(stockOut);
    });
  }

  static async createMany(
    requests: CreateStockOutRequest[],
    operatorId?: number | null
  ): Promise<{ successMessages: string; errorMessages: string }> {
    if (!operatorId) {
      throw new ResponseError(401, "Unauthorized");
    }

    const isOperatorExist = await prismaClient.operator.findFirst({
      where: { id: operatorId },
    });

    if (!isOperatorExist) {
      throw new ResponseError(404, "Operator not found");
    }

    const createRequests = Validation.validate(
      StockOutValidation.CREATE_MANY,
      requests
    );

    const successKanbans: string[] = [];
    const failedKanbans: string[] = [];

    for (const req of createRequests) {
      try {
        // transaksi per item (partial success)
        await prismaClient.$transaction(async (prisma) => {
          const kanbanRows = await prisma.$queryRaw<
            Array<{ id: string; balance: number }>
          >`SELECT id, balance FROM kanbans WHERE code = ${req.kanban_code} FOR UPDATE`;

          if (kanbanRows.length === 0) {
            throw new Error("Kanban not found");
          }

          const kanban = kanbanRows[0];

          if (kanban.balance < req.quantity) {
            throw new Error("Stock is not enough");
          }

          const newKanban = await prisma.kanban.update({
            where: { id: Number(kanban.id) },
            data: {
              balance: { decrement: req.quantity },
            },
          });

          const subMachine = await prisma.subMachine.findUnique({
            where: { id: req.sub_machine_id },
          });
          if (!subMachine) {
            throw new Error("Sub Machine not found");
          }

          const machineArea = await prisma.machineArea.findUnique({
            where: { id: req.machine_area_id },
          });
          if (!machineArea) {
            throw new Error("Machine Area not found");
          }

          await prisma.stockOut.create({
            data: {
              ...req,
              operator_id: operatorId,
              machine_id: subMachine.machine_id,
              balance_before: kanban.balance,
              balance_after: kanban.balance - req.quantity,
            },
          });

          if (
            newKanban.min_quantity &&
            newKanban.balance < newKanban.min_quantity
          ) {
            logger.info(
              `Kanban ${newKanban.code} stock is less than ${newKanban.min_quantity} ${newKanban.uom}`
            );
            sendNotification(
              `Kanban ${newKanban.code} stock is less than ${newKanban.min_quantity} ${newKanban.uom}`
            );
          }
        });

        successKanbans.push(req.kanban_code);
      } catch (err) {
        failedKanbans.push(`${req.kanban_code} (${(err as Error).message})`);
      }
    }

    const successMessages =
      successKanbans.length > 0 ? `${successKanbans.join(", ")}` : "";

    const errorMessages =
      failedKanbans.length > 0 ? `${failedKanbans.join(", ")}.` : "";

    return { successMessages, errorMessages };
  }

  static async update(
    id: number,
    request: UpdateStockOutRequest
  ): Promise<StockOutResponse> {
    const updateRequest = Validation.validate(
      StockOutValidation.UPDATE,
      request
    );

    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    return await prismaClient.$transaction(async (tx) => {
      const existingStockOut = await tx.stockOut.findUnique({
        where: { id },
      });

      if (!existingStockOut) {
        throw new ResponseError(404, "Stock Out not found");
      }

      if (!existingStockOut.kanban_code) {
        throw new ResponseError(
          400,
          "Kanban code not found. Cannot update stock out."
        );
      }

      const existingQuantity = existingStockOut.quantity;

      const updatedStockOut = await tx.stockOut.update({
        where: { id },
        data: { ...updateRequest },
        include: {
          machine_area: true,
          sub_machine: true,
          machine: true,
          operator: true,
          requester: true,
          kanban: {
            include: {
              rack: true,
            },
          },
        },
      });

      if (updateRequest.quantity > existingQuantity) {
        throw new ResponseError(400, "Quantity cannot be increased");
      }

      // Jika quantity berubah, update juga kanban.balance
      if (existingQuantity !== updateRequest.quantity) {
        const kanban = await tx.kanban.findUnique({
          where: { code: existingStockOut.kanban_code },
        });

        if (!kanban) {
          throw new ResponseError(404, "Kanban not found");
        }

        const quantityDiff = updateRequest.quantity - existingQuantity;

        if (quantityDiff > 0 && kanban.balance < quantityDiff) {
          throw new ResponseError(400, "Kanban stock is not enough");
        }

        if (quantityDiff !== 0) {
          await tx.kanban.update({
            where: { code: existingStockOut.kanban_code },
            data: {
              balance: {
                increment: -quantityDiff,
              },
            },
          });

          await tx.stockOutChangeLog.create({
            data: {
              stock_out_id: id,
              quantity_before: existingQuantity,
              quantity_after: updateRequest.quantity,
            },
          });
        }
      }

      return toStockOutResponse(updatedStockOut);
    });
  }

  static async get(
    request: SearchStockOutRequest
  ): Promise<Pageable<StockOutResponse>> {
    const searchRequest = Validation.validate(
      StockOutValidation.SEARCH,
      request
    );

    const filters: any[] = [];

    if (searchRequest.keyword) {
      const keyword = searchRequest.keyword.replace(/\\/g, "\\\\");
      filters.push({
        OR: [
          {
            kanban_code: {
              contains: keyword,
            },
          },
          {
            kanban: {
              specification: {
                contains: keyword,
              },
            },
          },
          {
            kanban: {
              description: {
                contains: keyword,
              },
            },
          },
        ],
      });
    }

    if (searchRequest.machine_area_id) {
      filters.push({
        machine_area_id: searchRequest.machine_area_id,
      });
    }

    if (searchRequest.machine_id) {
      filters.push({
        machine_id: searchRequest.machine_id,
      });
    }

    if (searchRequest.sub_machine_id) {
      filters.push({
        sub_machine_id: searchRequest.sub_machine_id,
      });
    }

    if (searchRequest.start_date) {
      filters.push({
        created_at: {
          gte: searchRequest.start_date,
        },
      });
    }

    if (searchRequest.end_date) {
      filters.push({
        created_at: {
          lte: searchRequest.end_date,
        },
      });
    }

    const whereClause = filters.length > 0 ? { AND: filters } : {};

    // Default pagination values if not provided
    const page = searchRequest.page || 1;
    const limit = searchRequest.limit || 10;

    const skip = (page - 1) * limit;

    const [stockOuts, total] = await Promise.all([
      prismaClient.stockOut.findMany({
        where: whereClause,
        orderBy: {
          created_at: "desc",
        },
        ...(searchRequest.paginate ? { take: limit, skip } : {}),
        include: {
          machine_area: true,
          sub_machine: true,
          machine: true,
          operator: true,
          requester: true,
          kanban: {
            include: {
              rack: true,
            },
          },
        },
      }),
      prismaClient.stockOut.count({
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
      data: stockOuts.map(toStockOutResponse),
      ...(pagination ? { pagination } : {}),
    };
  }

  static async show(id: number): Promise<StockOutResponse> {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const stockOut = await prismaClient.stockOut.findUnique({
      where: {
        id: id,
      },
      include: {
        machine_area: true,
        machine: true,
        sub_machine: true,
        operator: true,
        requester: true,
        kanban: true,
        stock_out_change_log: true,
      },
    });

    if (!stockOut) {
      throw new ResponseError(404, "StockOut not found");
    }

    return toStockOutResponse(stockOut);
  }

  static async exportExcel(request: SearchStockOutRequest): Promise<any> {
    const searchRequest = Validation.validate(
      StockOutValidation.SEARCH,
      request
    );

    const filters: any[] = [];

    if (searchRequest.keyword) {
      const keyword = searchRequest.keyword.replace(/\\/g, "\\\\");
      filters.push({
        OR: [
          {
            kanban_code: {
              contains: keyword,
            },
          },
        ],
      });
    }

    if (searchRequest.machine_area_id) {
      filters.push({
        machine_area_id: searchRequest.machine_area_id,
      });
    }

    if (searchRequest.machine_id) {
      filters.push({
        machine_id: searchRequest.machine_id,
      });
    }

    if (searchRequest.sub_machine_id) {
      filters.push({
        sub_machine_id: searchRequest.sub_machine_id,
      });
    }

    if (searchRequest.start_date) {
      filters.push({
        created_at: {
          gte: searchRequest.start_date,
        },
      });
    }

    if (searchRequest.end_date) {
      const endDate = new Date(searchRequest.end_date);
      endDate.setHours(23, 59, 59, 999);
      filters.push({
        created_at: {
          lte: endDate,
        },
      });
    }

    const whereClause = filters.length > 0 ? { AND: filters } : {};

    const stockOuts = await prismaClient.stockOut.findMany({
      where: whereClause,
      include: {
        machine_area: true,
        sub_machine: true,
        requester: true,
        machine: true,
        operator: true,
      },
    });

    const workbook = new Workbook();
    const templatePath = path.resolve(
      __dirname,
      "../../template_file/StockOutExportTemplate.xlsx"
    );

    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) throw new Error("Worksheet tidak ditemukan.");

    const startDate =
      searchRequest.start_date?.toISOString().split("T")[0] ?? "-";
    const endDate = searchRequest.end_date?.toISOString().split("T")[0] ?? "-";

    const row4 = worksheet.getRow(4);
    row4.getCell(1).value = (row4.getCell(1).value as string)?.replace(
      "{{start_date}}",
      startDate
    );
    row4.commit();

    const row5 = worksheet.getRow(5);
    row5.getCell(1).value = (row5.getCell(1).value as string)?.replace(
      "{{end_date}}",
      endDate
    );
    row5.commit();

    let rowIndex = 8;
    let number = 1;

    for (const stock of stockOuts) {
      const row = worksheet.getRow(rowIndex++);

      row.getCell(1).value = number++;
      row.getCell(2).value = 75;
      row.getCell(3).value = stock.kanban_code ?? "-";
      row.getCell(4).value = stock.requester?.name ?? "-";
      row.getCell(5).value = stock.machine_area?.name ?? "-";
      row.getCell(6).value = stock.sub_machine?.code
        ? stock.sub_machine.code
        : stock.machine?.code ?? "-";
      row.getCell(7).value = stock.quantity;

      // Human-readable date format
      row.getCell(8).value = convertToReadableDate(stock.created_at.toString());
      row.commit();
    }

    await workbook.xlsx.writeFile(`StockOutExport_${Date.now()}.xlsx`);
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
