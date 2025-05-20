import { ReceivingReport } from "@prisma/client";

export type ReceivingReportResponse = {
    id: number;
    kanban_code: string | null;
    receiving_quantity: number | null;

}


export type ReceivingReportRawEntry = {
    [key: string]: any;
    "Product Code"?: any;
    Received?: any;



}

export type CreateReceivingReportRequest = {
    kanban_code: string;
    received_quantity: number;
}

export type SearchReceivingReportRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
    start_date?: Date;
    end_date?: Date;
}

export function toReceivingReportResponse(ReceivingReport: any): ReceivingReportResponse {
    return {
        id: ReceivingReport.id,
        kanban_code: ReceivingReport.kanban_code,
        receiving_quantity: ReceivingReport.receiving_quantity

    };
}
