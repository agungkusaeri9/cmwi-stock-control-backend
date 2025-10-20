import { Pageable } from "../model/page";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Validation } from "../validation/validation";
import { ManualPurchaseOrderValidation } from "../validation/manual-purchase-order-validation";
import {
  CreateManualPurchaseOrderRequest,
  ManualPurchaseOrderResponse,
  SearchManualPurchaseOrderRequest,
  toManualPurchaseOrderResponse,
} from "../model/manual-purchase-order-model";

export class ManualPurchaseOrderService {
  static async create(
    request: CreateManualPurchaseOrderRequest
  ): Promise<ManualPurchaseOrderResponse> {
    const createRequest = Validation.validate(
      ManualPurchaseOrderValidation.CREATE,
      request
    );

    const mpo = await prismaClient.$transaction(async (tx) => {
      const kanban = await tx.kanban.findUnique({
        where: {
          code: createRequest.kanban_code,
        },
      });

      if (!kanban) {
        throw new ResponseError(404, "Kanban not found");
      }

      await tx.kanban.update({
        where: {
          code: createRequest.kanban_code,
        },
        data: {
          incoming_order_stock: {
            increment: createRequest.quantity,
          },
        },
      });

      const created = await tx.manualPurchaseOrder.create({
        data: {
          po_number: createRequest.po_number,
          pr_number: createRequest.pr_number,
          kanban_code: createRequest.kanban_code ?? null,
          date: createRequest.date,
          quantity: createRequest.quantity,
          remark: createRequest.remark ?? null,
        },
      });

      return created;
    });

    return toManualPurchaseOrderResponse(mpo);
  }

  static async get(
    request: SearchManualPurchaseOrderRequest
  ): Promise<Pageable<ManualPurchaseOrderResponse>> {
    const searchRequest = Validation.validate(
      ManualPurchaseOrderValidation.SEARCH,
      request
    );

    const filters: any[] = [];

    if (searchRequest.keyword) {
      const keyword = searchRequest.keyword.replace(/\\/g, "\\\\");
      filters.push({
        OR: [{ remark: { contains: keyword } }],
      });
    }

    if (searchRequest.pr_number) {
      const pr = searchRequest.pr_number.replace(/\\/g, "\\\\");
      filters.push({ pr_number: { contains: pr } });
    }

    if (searchRequest.po_number) {
      const po = searchRequest.po_number.replace(/\\/g, "\\\\");
      filters.push({ po_number: { contains: po } });
    }

    if (searchRequest.kanban_code) {
      const kc = searchRequest.kanban_code.replace(/\\/g, "\\\\");
      filters.push({ kanban_code: { contains: kc } });
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

    const page = searchRequest.page || 1;
    const limit = searchRequest.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prismaClient.manualPurchaseOrder.findMany({
        where: whereClause,
        orderBy: { created_at: "desc" },
        ...(searchRequest.paginate ? { take: limit, skip } : {}),
      }),
      prismaClient.manualPurchaseOrder.count({ where: whereClause }),
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
      data: items.map(toManualPurchaseOrderResponse),
      ...(pagination ? { pagination } : {}),
    };
  }

  static async show(id: number): Promise<ManualPurchaseOrderResponse> {
    if (isNaN(id)) {
      throw new ResponseError(400, "Invalid id");
    }

    const mpo = await prismaClient.manualPurchaseOrder.findUnique({
      where: { id },
    });

    if (!mpo) {
      throw new ResponseError(404, "ManualPurchaseOrder not found");
    }

    return toManualPurchaseOrderResponse(mpo);
  }
}
