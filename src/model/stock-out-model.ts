import {
  Kanban,
  Machine,
  MachineArea,
  Operator,
  StockOutChangeLog,
  SubMachine,
} from "@prisma/client";

export type StockOutResponse = {
  id: number;
  kanban_code: string | null;
  quantity: number | null;
  machine: Machine | null;
  sub_machine: SubMachine | null;
  machine_area: MachineArea | null;
  kanban: Kanban | null;
  operator: Operator | null;
  requester: Operator | null;
  stock_out_change_logs: StockOutChangeLog[] | null;
  created_at: Date;
};

export type CreateStockOutRequest = {
  kanban_code: string;
  sub_machine_id: number;
  machine_area_id: number;
  quantity: number;
  operator_id: number;
  requester_id: number;
};

export type UpdateStockOutRequest = {
  quantity: number;
};

export type SearchStockOutRequest = {
  keyword?: string;
  page: number;
  limit: number;
  paginate?: boolean;
  start_date?: Date;
  end_date?: Date;
  machine_id?: number;
  sub_machine_id?: number;
  machine_area_id?: number;
  requester_id?: number;
};

export function toStockOutResponse(stockOut: any): StockOutResponse {
  return {
    id: stockOut.id,
    kanban_code: stockOut.kanban_code,
    machine: stockOut.machine,
    sub_machine: stockOut.sub_machine,
    machine_area: stockOut.machine_area,
    quantity: stockOut.quantity,
    kanban: stockOut.kanban,
    operator: stockOut.operator,
    requester: stockOut.requester,
    stock_out_change_logs: stockOut.stock_out_change_log,
    created_at: stockOut.created_at,
  };
}
