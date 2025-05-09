
export type StockOutResponse = {
    id: number;
    code: string | null;
    quantity: number | null;
    machine: string | null;
    machine_area: string | null;
    created_at: Date;
}

export type CreateStockOutRequest = {
    code: string;
    machine_id: number;
    machine_area_id: number;
    quantity: number;
}


export type SearchStockOutRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
}


export function toStockOutResponse(stock_id: any): StockOutResponse {
    return {
        id: stock_id.id,
        code: stock_id.kanban_code,
        machine: stock_id.Machine.code,
        machine_area: stock_id.MachineArea.name,
        quantity: stock_id.quantity,
        created_at: stock_id.created_at

    }
}
