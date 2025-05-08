import { PurchaseOrder } from "@prisma/client";

export type PurchaseOrderResponse = {
    id: number;
    department: string | null;
    supplier: string | null;
    po_number: string | null;
    po_date: Date | null;
    pr_date: Date | null;
    createdAt: Date;
    updatedAt: Date;
}


export type PurchaseOrderRawEntry = {
    [key: string]: any;
    "Dept."?: any;
    Supplier?: any;
    "PO No."?: any;
    "PO Date"?: any;
    "SOB/PR Date"?: any;

}

export type CreatePurchaseOrderRequest = {
    department: string | null;
    supplier: string | null;
    po_number: string | null;
    po_date: Date | null;
    pr_date: Date | null;

}

export type SearchPurchaseOrderRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
}

export function toPurchaseOrderResponse(PurchaseOrder: PurchaseOrder): PurchaseOrderResponse {
    return {
        id: PurchaseOrder.id,
        department: PurchaseOrder.department,
        supplier: PurchaseOrder.supplier,
        po_number: PurchaseOrder.po_number,
        po_date: PurchaseOrder.po_date,
        pr_date: PurchaseOrder.pr_date,
        createdAt: PurchaseOrder.createdAt,
        updatedAt: PurchaseOrder.updatedAt
    }
}
