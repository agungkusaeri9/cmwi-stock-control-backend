import { PurchaseRequest } from "@prisma/client";

export type PurchaseRequestResponse = {
    id: number;
    date: Date | null;
    pr_number: string | null;
    department: string | null;
    budget_number: string | null;
    fixed_asset_number: string | null;
    type: string | null;
    transportation: string | null;
    kind_of_request: string | null;
    acc: string | null;
    item_code: string | null;
    item_name: string | null;
    description_of_goods: string | null;
    specification: string | null;
    part: string | null;
    quantity: number | null;
    unit: string | null;
    est_unit_price: number | null;
    est_amount: number | null;
    currency: string | null;
    req_delivery: Date | null;
    supplier: string | null;
    remark: string | null;
    purpose: string | null;
    requested: string | null;
    gen_manager: string | null;
    supervisor: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type PurchaseRequestRawEntry = {
    [key: string]: any;
    Date?: any;
    "PR No."?: any;
    Department?: any;
    "Budget No."?: any;
    "Fixed Asset No"?: any;
    Type?: any;
    Transportation?: any;
    "Kind of Request"?: any;
    Acc?: any;
    "Item Code"?: any;
    "Item Name"?: any;
    "Description of Goods"?: any;
    Specification?: any;
    Part?: any;
    Quantity?: any;
    Unit?: any;
    "Est. Unit Price"?: any;
    "Est. Amount"?: any;
    Currency?: any;
    "Req. Delivery"?: any;
    Supplier?: any;
    Remark?: any;
    Purpose?: any;
    Requested?: any;
    "Gen. Manager"?: any;
    Supervisor?: any;
}


export type CreatePurchaseRequestRequest = {
    date: Date | null;
    pr_number: string | null;
    department: string | null;
    budget_number: string | null;
    fixed_asset_number: string | null;
    type: string | null;
    transportation: string | null;
    kind_of_request: string | null;
    acc: string | null;
    item_code: string | null;
    item_name: string | null;
    description_of_goods: string | null;
    specification: string | null;
    part: string | null;
    quantity: number | null;
    unit: string | null;
    est_unit_price: number | null;
    est_amount: number | null;
    currency: string | null;
    req_delivery: Date | null;
    supplier: string | null;
    remark: string | null;
    purpose: string | null;
    requested: string | null;
    gen_manager: string | null;
    supervisor: string | null;
};


export type SearchPurchaseRequestRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
}

export function toPurchaseRequestResponse(p: PurchaseRequest): PurchaseRequestResponse {
    return {
        id: p.id,
        date: p.date,
        pr_number: p.pr_number,
        department: p.department,
        budget_number: p.budget_number,
        fixed_asset_number: p.fixed_asset_number,
        type: p.type,
        transportation: p.transportation,
        kind_of_request: p.kind_of_request,
        acc: p.acc,
        item_code: p.item_code,
        item_name: p.item_name,
        description_of_goods: p.description_of_goods,
        specification: p.specification,
        part: p.part,
        quantity: p.quantity,
        unit: p.unit,
        est_unit_price: p.est_unit_price,
        est_amount: p.est_amount,
        currency: p.currency,
        req_delivery: p.req_delivery,
        supplier: p.supplier,
        remark: p.remark,
        purpose: p.purpose,
        requested: p.requested,
        gen_manager: p.gen_manager,
        supervisor: p.supervisor,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
}
