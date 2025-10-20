import { ManualPurchaseOrder } from "@prisma/client";

export type ManualPurchaseOrderResponse = {
  id: number;
  po_number: string;
  pr_number: string;
  kanban_code?: string | null;
  kanban_specification?: string | null;
  kanban_description?: string | null;
  date: Date;
  quantity: number;
  remark: string | null;
};

export type CreateManualPurchaseOrderRequest = {
  po_number: string;
  pr_number: string;
  kanban_code: string;
  date: Date;
  quantity: number;
  remark?: string | null;
};

export type SearchManualPurchaseOrderRequest = {
  keyword?: string;
  po_number?: string;
  pr_number?: string;
  kanban_code?: string;
  page: number;
  limit: number;
  paginate?: boolean;
  start_date?: Date;
  end_date?: Date;
};

export function toManualPurchaseOrderResponse(
  mpo: ManualPurchaseOrder & {
    kanban?: {
      specification: string | null;
      description: string | null;
    } | null;
  }
): ManualPurchaseOrderResponse {
  return {
    id: mpo.id,
    po_number: mpo.po_number,
    pr_number: mpo.pr_number,
    kanban_code: mpo.kanban_code,
    kanban_specification: mpo.kanban?.specification,
    kanban_description: mpo.kanban?.description,
    date: mpo.date,
    quantity: mpo.quantity,
    remark: mpo.remark ?? null,
  };
}
