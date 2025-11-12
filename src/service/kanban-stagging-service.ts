import { Pageable } from "../model/page";
import { prismaClient } from "../application/database";
import { Validation } from "../validation/validation";
import { KanbanStaggingValidation } from "../validation/kanban-stagging-validation";
import {
  KanbanStaggingResponse,
  SearchKanbanStaggingRequest,
  toKanbanStaggingResponse,
  AssignToParentRequest,
  ForwardToMasterRequest,
} from "../model/kanban-stagging-model";
import { ResponseError } from "../error/response-error";
import { KanbanResponse, toKanbanResponse } from "../model/kanban-model";

export class KanbanStaggingService {
  static async get(
    request: SearchKanbanStaggingRequest
  ): Promise<Pageable<KanbanStaggingResponse>> {
    const searchRequest = Validation.validate(
      KanbanStaggingValidation.SEARCH,
      request
    );

    const filters: any[] = [];

    if (searchRequest.keyword) {
      const keyword = searchRequest.keyword.replace(/\\/g, "\\\\");
      filters.push({
        OR: [
          { kanban_code: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      });
    }

    if (searchRequest.start_date) {
      filters.push({ created_at: { gte: searchRequest.start_date } });
    }

    if (searchRequest.end_date) {
      filters.push({ created_at: { lte: searchRequest.end_date } });
    }

    filters.push({ is_active: true });

    const whereClause = filters.length > 0 ? { AND: filters } : {};

    const page = searchRequest.page || 1;
    const limit = searchRequest.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prismaClient.kanbanStagging.findMany({
        where: whereClause,
        orderBy: { created_at: "desc" },
        ...(searchRequest.paginate ? { take: limit, skip } : {}),
      }),
      prismaClient.kanbanStagging.count({ where: whereClause }),
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
      data: items.map(toKanbanStaggingResponse),
      ...(pagination ? { pagination } : {}),
    };
  }

  static async show(id: number): Promise<KanbanStaggingResponse> {
    const item = await prismaClient.kanbanStagging.findUnique({
      where: { id },
    });
    if (!item) {
      throw new ResponseError(404, "Kanban staging not found");
    }

    return toKanbanStaggingResponse(item);
  }

  static async assignToParent(
    request: AssignToParentRequest
  ): Promise<KanbanResponse> {
    const assignRequest = Validation.validate(
      KanbanStaggingValidation.ASSIGN_TO_PARENT,
      request
    ) as AssignToParentRequest;

    return await prismaClient.$transaction(async (tx) => {
      const staging = await tx.kanbanStagging.findUnique({
        where: { id: assignRequest.kanban_stagging_id },
      });
      if (!staging || !staging.is_active) {
        throw new ResponseError(404, "Kanban staging not found or inactive");
      }

      const parentKanban = await tx.kanban.findUnique({
        where: { code: assignRequest.parent_kanban_code },
        include: {
          rack: true,
          machine_area: true,
          machine: true,
          supplier: true,
          maker: true,
        },
      });
      if (!parentKanban) {
        throw new ResponseError(404, "Parent kanban not found");
      }

      let parentId = parentKanban.kanban_parent_id ?? null;
      if (!parentId) {
        const createdParent = await tx.kanbanParent.create({
          data: { original_code: parentKanban.code },
        });
        await tx.kanban.update({
          where: { id: parentKanban.id },
          data: { kanban_parent_id: createdParent.id },
        });
        parentId = createdParent.id;
      }

      const newKanban = await tx.kanban.create({
        data: {
          code: staging.kanban_code,
          description: staging.description ?? parentKanban.description ?? null,
          specification: parentKanban.specification ?? null,
          min_quantity: parentKanban.min_quantity ?? null,
          max_quantity: parentKanban.max_quantity ?? null,
          balance: parentKanban.balance ?? 0,
          uom: parentKanban.uom ?? null,
          lead_time: parentKanban.lead_time ?? null,
          safety_stock: parentKanban.safety_stock ?? null,
          currency: parentKanban.currency ?? null,
          price: parentKanban.price ?? null,
          rank: parentKanban.rank ?? null,
          order_point: parentKanban.order_point ?? null,
          rack: parentKanban.rack
            ? { connect: { id: parentKanban.rack.id } }
            : undefined,
          machine_area: parentKanban.machine_area
            ? { connect: { id: parentKanban.machine_area.id } }
            : undefined,
          machine: parentKanban.machine
            ? { connect: { id: parentKanban.machine.id } }
            : undefined,
          supplier:
            parentKanban.supplier && parentKanban.supplier.length > 0
              ? { connect: parentKanban.supplier.map((s) => ({ id: s.id })) }
              : undefined,
          maker: parentKanban.maker
            ? { connect: { id: parentKanban.maker.id } }
            : undefined,
          incoming_order_stock:
            (parentKanban.incoming_order_stock ?? 0) +
            (staging.incoming_order_stock ?? 0),
          kanban_parent: { connect: { id: parentId } },
        },
        include: {
          rack: true,
          machine_area: true,
          machine: true,
          supplier: true,
          maker: true,
        },
      });

      await tx.kanban.update({
        where: { id: parentKanban.id },
        data: { is_active: false },
      });
      await tx.kanbanStagging.update({
        where: { id: staging.id },
        data: { is_active: false },
      });

      const poDetailStaggings = await tx.purchaseOrderDetailStagging.findMany({
        where: { kanban_code: staging.kanban_code, is_active: true },
      });

      if (poDetailStaggings.length > 0) {
        const uniquePoNumbers = poDetailStaggings
          .map((s) => s.po_number)
          .filter((v, i, a) => a.indexOf(v) === i);

        const existingPo = await tx.purchaseOrder.findMany({
          where: {
            po_number: {
              in: uniquePoNumbers,
            },
          },
        });

        const existingPoNumbers = existingPo.map((p) => p.po_number);

        const poStaggings = await tx.purchaseOrderStagging.findMany({
          where: {
            po_number: {
              in: uniquePoNumbers,
            },
          },
        });

        const poToCreate = poStaggings.filter(
          (s) => !existingPoNumbers.includes(s.po_number)
        );

        await tx.purchaseOrder.createMany({
          data: poToCreate.map((s) => ({
            po_number: s.po_number,
            department: s.department,
            supplier_id: s.supplier_id,
            po_date: s.po_date,
            pr_date: s.pr_date,
          })),
        });

        await tx.purchaseOrderDetail.createMany({
          data: poDetailStaggings.map((s) => ({
            po_number: s.po_number,
            pr_number: s.pr_number,
            pr_requested: s.pr_requested,
            kanban_code: newKanban.code,
            description: s.description,
            specification: s.specification,
            quantity: s.quantity,
            unit: s.unit,
            remark: s.remark,
            status: s.status,
          })),
        });

        await tx.stockOrderKanban.createMany({
          data: poDetailStaggings.map((s) => ({
            po_number: s.po_number,
            kanban_code: newKanban.code,
            last_stock: s.quantity ?? 0,
          })),
        });

        await tx.purchaseOrderStagging.updateMany({
          where: { id: { in: poStaggings.map((s) => s.id) } },
          data: { is_active: false },
        });

        await tx.purchaseOrderDetailStagging.updateMany({
          where: { id: { in: poDetailStaggings.map((s) => s.id) } },
          data: { is_active: false },
        });
      }

      return toKanbanResponse(newKanban);
    });
  }

  static async forwardToMaster(
    request: ForwardToMasterRequest
  ): Promise<KanbanResponse> {
    const forwardRequest = Validation.validate(
      KanbanStaggingValidation.FORWARD_TO_MASTER,
      request
    ) as ForwardToMasterRequest;

    const isCodeExist = await prismaClient.kanban.findUnique({
      where: { code: forwardRequest.code },
    });
    if (isCodeExist) throw new ResponseError(400, "Code already exist");

    const rack = await prismaClient.rack.findUnique({
      where: { id: forwardRequest.rack_id },
    });
    if (!rack) throw new ResponseError(404, "Rack not found");

    if (forwardRequest.machine_area_id) {
      const area = await prismaClient.machineArea.findUnique({
        where: { id: forwardRequest.machine_area_id },
      });
      if (!area) throw new ResponseError(404, "Machine Area not found");
    }
    if (forwardRequest.machine_id) {
      const machine = await prismaClient.machine.findUnique({
        where: { id: forwardRequest.machine_id },
      });
      if (!machine) throw new ResponseError(404, "Machine not found");
    }

    return await prismaClient.$transaction(async (tx) => {
      const kanbanParent = await tx.kanbanParent.create({
        data: { original_code: forwardRequest.code },
      });

      const newKanban = await tx.kanban.create({
        data: {
          code: forwardRequest.code,
          description: forwardRequest.description,
          specification: forwardRequest.specification,
          min_quantity: forwardRequest.min_quantity,
          max_quantity: forwardRequest.max_quantity,
          balance: forwardRequest.balance,
          uom: forwardRequest.uom,
          lead_time: forwardRequest.lead_time,
          rack: { connect: { id: forwardRequest.rack_id } },
          machine_area: forwardRequest.machine_area_id
            ? { connect: { id: forwardRequest.machine_area_id } }
            : undefined,
          machine: forwardRequest.machine_id
            ? { connect: { id: forwardRequest.machine_id } }
            : undefined,
          supplier: forwardRequest.supplier_id
            ? { connect: { id: forwardRequest.supplier_id } }
            : undefined,
          maker: forwardRequest.maker_id
            ? { connect: { id: forwardRequest.maker_id } }
            : undefined,
          rank: forwardRequest.rank,
          order_point: forwardRequest.order_point,
          currency: forwardRequest.currency,
          price: forwardRequest.price,
          safety_stock: forwardRequest.safety_stock,
          incoming_order_stock: 0,
          kanban_parent: { connect: { id: kanbanParent.id } },
        },
        include: {
          rack: true,
          machine_area: true,
          machine: true,
          supplier: true,
          maker: true,
        },
      });

      const staging = await tx.kanbanStagging.update({
        where: { id: forwardRequest.kanban_stagging_id },
        data: { is_active: false },
      });

      const poDetailStaggings = await tx.purchaseOrderDetailStagging.findMany({
        where: { kanban_code: staging.kanban_code, is_active: true },
      });

      if (poDetailStaggings.length > 0) {
        const uniquePoNumbers = poDetailStaggings
          .map((s) => s.po_number)
          .filter((v, i, a) => a.indexOf(v) === i);

        const existingPo = await tx.purchaseOrder.findMany({
          where: {
            po_number: {
              in: uniquePoNumbers,
            },
          },
        });

        const existingPoNumbers = existingPo.map((p) => p.po_number);

        const poStaggings = await tx.purchaseOrderStagging.findMany({
          where: {
            po_number: {
              in: uniquePoNumbers,
            },
          },
        });

        const poToCreate = poStaggings.filter(
          (s) => !existingPoNumbers.includes(s.po_number)
        );

        await tx.purchaseOrder.createMany({
          data: poToCreate.map((s) => ({
            po_number: s.po_number,
            department: s.department,
            supplier_id: s.supplier_id,
            po_date: s.po_date,
            pr_date: s.pr_date,
          })),
        });

        await tx.purchaseOrderDetail.createMany({
          data: poDetailStaggings.map((s) => ({
            po_number: s.po_number,
            pr_number: s.pr_number,
            pr_requested: s.pr_requested,
            kanban_code: newKanban.code,
            description: s.description,
            specification: s.specification,
            quantity: s.quantity,
            unit: s.unit,
            remark: s.remark,
            status: s.status,
          })),
        });

        await tx.stockOrderKanban.createMany({
          data: poDetailStaggings.map((s) => ({
            po_number: s.po_number,
            kanban_code: newKanban.code,
            last_stock: s.quantity ?? 0,
          })),
        });

        await tx.purchaseOrderStagging.updateMany({
          where: { id: { in: poStaggings.map((s) => s.id) } },
          data: { is_active: false },
        });

        await tx.purchaseOrderDetailStagging.updateMany({
          where: { id: { in: poDetailStaggings.map((s) => s.id) } },
          data: { is_active: false },
        });
      }

      return toKanbanResponse(newKanban);
    });
  }
}
