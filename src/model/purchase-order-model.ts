import { PurchaseOrder } from "@prisma/client";

export type PurchaseOrderResponse = {
    id: number;
    department: string | null;
    supplier: string | null;
    po_number: string | null;
    po_date: Date | null;
    pr_number: string | null;
    pr_date: Date | null;
    description: string | null;
    specification: string | null;
    quantity: number | null;
    unit: string | null;
    status: string | null;
    remark: string | null;
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
    "SOB/PR No."?: any;
    Description?: any;
    specification?: any;
    Quantity?: any;
    unit?: any;
    Status?: any;
    Remark?: any;
}

export type CreatePurchaseOrderRequest = {
    department: string | null;
    supplier: string | null;
    po_number: string | null;
    po_date: Date | null;
    pr_number: string | null;
    pr_date: Date | null;
    description: string | null;
    specification: string | null;
    quantity: number | null;
    unit: string | null;
    status: string | null;
    remark: string | null;
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
        pr_number: PurchaseOrder.pr_number,
        pr_date: PurchaseOrder.pr_date,
        description: PurchaseOrder.description,
        specification: PurchaseOrder.specification,
        quantity: PurchaseOrder.quantity,
        unit: PurchaseOrder.unit,
        status: PurchaseOrder.status,
        remark: PurchaseOrder.remark,
        createdAt: PurchaseOrder.createdAt,
        updatedAt: PurchaseOrder.updatedAt
    }
}
