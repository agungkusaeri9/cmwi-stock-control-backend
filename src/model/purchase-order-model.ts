import { PurchaseOrder } from "@prisma/client";
import { PurchaseOrderDetailResponse } from "./purchase-order-detail-model";

export type PurchaseOrderResponse = {
    id: number;
    department: string | null;
    supplier: string | null;
    po_number: string | null;
    purchase_order_details: PurchaseOrderDetailResponse[];
}


export type PurchaseOrderRawEntry = {
    [key: string]: any;
    "Dept."?: any;
    Supplier?: any;
    "PO No."?: any;


}

export type CreatePurchaseOrderRequest = {
    department: string | null;
    supplier: string | null;
    po_number: string;


}

export type SearchPurchaseOrderRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
    start_date?: Date;
    end_date?: Date;
}

export function toPurchaseOrderResponse(PurchaseOrder: any): PurchaseOrderResponse {
    return {
        id: PurchaseOrder.id,
        department: PurchaseOrder.department,
        supplier: PurchaseOrder.supplier,
        po_number: PurchaseOrder.po_number,
        purchase_order_details: PurchaseOrder.purchase_order_detail,
    };
}
