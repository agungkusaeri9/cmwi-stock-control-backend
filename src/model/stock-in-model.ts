import { StockIn } from "@prisma/client";

export type StockInResponse = {
    id: number;
    kanban_code: string | null;
    quantity: number | null;
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
}


export function toStockInResponse(stockIn: StockIn): StockInResponse {
    return {
        id: stockIn.id,
        kanban_code: stockIn.kanban_code,
        quantity: stockIn.quantity,
        created_at: stockIn.created_at

    }
}
