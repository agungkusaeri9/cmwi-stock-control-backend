import xlsx from 'xlsx';
import { PurchaseOrderResponse, CreatePurchaseOrderRequest, PurchaseOrderRawEntry, toPurchaseOrderResponse, SearchPurchaseOrderRequest } from "../model/purchase-order-model";
import { PurchaseOrderDetailRawEntry, CreatePurchaseOrderDetailRequest } from "../model/purchase-order-detail-model";
import { Validation } from "../validation/validation";
import { PurchaseOrderValidation } from "../validation/purchase-order-validation";
import { PurchaseOrderDetailValidation } from "../validation/purchase-order-detail-validation";
import { prismaClient } from "../application/database";
import { logger } from "../application/logging";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";
import { convertShortDate } from "../helper/convert-date-short-helper";

export class PurchaseOrderService {

    static async create(filePath: string) {

        const workbook: xlsx.WorkBook = xlsx.readFile(filePath);

        // Ambil sheet (pastikan nama sheet sesuai)
        const sheet: xlsx.WorkSheet = workbook.Sheets["Sheet1"];

        // Konversi sheet ke JSON
        const data: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
        });


        const headers: string[] = data[5] as string[];
        headers[10] = "Unit";


        const importantHeaders: string[] = [
            "No.",
            "Dept.",
            "Supplier",
            "PO No.",
            "PO Date",
            "SOB/PR Date",
        ];


        const missingHeaders: string[] = importantHeaders.filter((h) => !headers.includes(h));
        if (missingHeaders.length > 0) {
            logger.error(`Missing important headers: ${missingHeaders.join(", ")}`);
            return;
        }

        const purchaseOrders: PurchaseOrderRawEntry[] = [];
        const purchaseOrderDetails: PurchaseOrderDetailRawEntry[] = [];


        for (let i = 6; i < data.length - 1; i++) {
            if (data[i].length === 0) continue;

            const purchaseOrderTemp: PurchaseOrderRawEntry = {};
            const purchaseOrderDetailTemp: PurchaseOrderDetailRawEntry = {};

            for (let j = 0; j < headers.length; j++) {
                purchaseOrderTemp[headers[j]] = data[i][j];
                purchaseOrderDetailTemp[headers[j]] = data[i][j];
            }

            const isDescriptionOnly: boolean =
                data[i].filter(Boolean).length === 1 && Boolean(purchaseOrderDetailTemp["Description"]);

            if (isDescriptionOnly && purchaseOrderDetails.length > 0) {
                purchaseOrderDetails[purchaseOrderDetails.length - 1]["Description"] += ` ${purchaseOrderDetailTemp["Description"]}`;
                continue;
            }

            const isContinuationRow: boolean = importantHeaders.every((header) => !purchaseOrderTemp[header]);

            if (isContinuationRow && purchaseOrders.length > 0) {
                purchaseOrderDetailTemp["PO No."] = purchaseOrders[purchaseOrders.length - 1]["PO No."];
                purchaseOrderDetails.push(purchaseOrderDetailTemp);
            } else {
                purchaseOrders.push(purchaseOrderTemp);
            }

        }


        for (const entry of purchaseOrderDetails) {
            const parts = entry["Description"].split(", ");
            const pr = entry["SOB/PR No."].split("|");

            if (parts.length > 1) {
                const [description, ...rest] = parts;
                entry["Description"] = description;
                entry["specification"] = rest.join(", ");
            }

            if (pr.length > 1) {
                const [prNumber, ...rest] = pr;
                entry["SOB/PR No."] = prNumber;
                entry["pr_requested"] = rest.join("|");

            }
        }

        const parseNumber = (val: string | undefined): number | null =>
            val && val !== "-" ? Number(val) : null;

        const parseString = (val: string | undefined): string | null =>
            val && val !== "-" ? val.toString() : null;

        const parseDate = (val: string | undefined): Date | null =>
            val && val !== "-" ? convertShortDate(val) : null;


        const purrchaseOrderFormattedResult: CreatePurchaseOrderRequest[] = purchaseOrders.map((entry: PurchaseOrderRawEntry) => {

            return {
                department: parseString(entry["Dept."]),
                supplier: parseString(entry.Supplier),
                po_number: parseString(entry["PO No."]),
                po_date: parseDate(entry["PO Date"]),
                pr_date: parseDate(entry["SOB/PR Date"]),
            };
        });

        const purrchaseOrderDetailFormattedResult: CreatePurchaseOrderDetailRequest[] = purchaseOrderDetails.map((entry: PurchaseOrderDetailRawEntry) => {

            return {
                po_number: parseString(entry["PO No."]),
                pr_number: parseString(entry["SOB/PR No."]),
                pr_requested: parseString(entry.pr_requested),
                product_code: parseString(entry["Product Code"]),
                description: parseString(entry.Description),
                specification: parseString(entry.specification),
                quantity: parseNumber(entry.Quantity),
                unit: parseString(entry.Unit),
                status: parseString(entry.Status),
                remark: parseString(entry.Remark),
            }
        })

        try {

            const createRequest = Validation.validate(PurchaseOrderValidation.CREATE, purrchaseOrderFormattedResult);
            const createRequestDetail = Validation.validate(PurchaseOrderDetailValidation.CREATE, purrchaseOrderDetailFormattedResult);

            await prismaClient.$transaction([
                prismaClient.purchaseOrder.createMany({ data: createRequest }),
                prismaClient.purchaseOrderDetail.createMany({ data: createRequestDetail }),
            ]);

            logger.info("Purchase order and details created successfully");
            return true;
        } catch (error) {
            logger.error(`Error while creating purchase order and details: ${error}`);
            return false;
        }

    }


    static async get(request: SearchPurchaseOrderRequest): Promise<Pageable<PurchaseOrderResponse>> {


        const searchRequest = Validation.validate(PurchaseOrderValidation.SEARCH, request);

        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        name: {
                            contains: searchRequest.keyword

                        }
                    },
                ]
            });
        }

        const whereClause = filters.length > 0 ? { AND: filters } : {};

        // Default pagination values if not provided
        const page = searchRequest.page || 1;
        const limit = searchRequest.limit || 10;

        const skip = (page - 1) * limit;

        const [purchaseOrderss, total] = await Promise.all([
            prismaClient.purchaseOrder.findMany({
                where: whereClause,
                ...(searchRequest.paginate ? { take: limit, skip } : {}),
            }),
            prismaClient.purchaseOrder.count({
                where: whereClause,
            })
        ]);



        const pagination = searchRequest.paginate
            ? {
                curr_page: page,
                total_page: Math.ceil(total / limit),
                limit: limit,
                total: total
            }
            : undefined;


        return {
            data: purchaseOrderss.map(toPurchaseOrderResponse),
            ...(pagination ? { pagination } : {})

        };
    }

    static async show(id: number): Promise<PurchaseOrderResponse> {

        if (isNaN(id)) {
            throw new ResponseError(400, "Invalid id");
        }

        const PurchaseOrder = await prismaClient.purchaseOrder.findUnique({
            where: {
                id: id
            }
        });

        if (!PurchaseOrder) {
            throw new ResponseError(404, "PurchaseOrder not found");
        }

        return toPurchaseOrderResponse(PurchaseOrder);
    }



}


