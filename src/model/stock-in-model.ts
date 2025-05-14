
import { Kanban } from "@prisma/client";

export type StockInResponse = {
    id: number;
    kanban_code: string | null;
    quantity: number | null;
    kanban: Kanban | null;
    created_at: Date;
}

export type CreateStockInRequest = {
    kanban_code: string;
    rack_id: number;
    quantity: number;

}


export type SearchStockInRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
    start_date?: Date;
    end_date?: Date;
}


export function toStockInResponse(stockIn: any): StockInResponse {
    return {
        id: stockIn.id,
        kanban_code: stockIn.kanban_code,
        quantity: stockIn.quantity,
        kanban: stockIn.Kanban,
        created_at: stockIn.created_at

    }
}
