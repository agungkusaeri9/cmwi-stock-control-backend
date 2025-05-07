import xlsx from 'xlsx';
import { PurchaseOrderResponse, CreatePurchaseOrderRequest, PurchaseOrderRawEntry, toPurchaseOrderResponse, SearchPurchaseOrderRequest } from "../model/purchase-order-model";
import { Validation } from "../validation/validation";
import { PurchaseOrderValidation } from "../validation/purchase-order-validation";
import { PurchaseOrder } from "@prisma/client";
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
        headers[10] = "unit";


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



        const res: PurchaseOrderRawEntry[] = [];

        for (let i = 6; i < data.length - 1; i++) {
            if (data[i].length === 0) continue;

            const obj: PurchaseOrderRawEntry = {};
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = data[i][j];
            }

            const isDescriptionOnly: boolean =
                data[i].filter(Boolean).length === 1 && Boolean(obj["Description"]);

            if (isDescriptionOnly && res.length > 0) {
                res[res.length - 1]["Description"] += ` ${obj["Description"]}`;
                continue;
            }

            const isContinuationRow: boolean = importantHeaders.every((header) => !obj[header]);

            if (isContinuationRow && res.length > 0) {
                importantHeaders.forEach((header) => {
                    obj[header] = res[res.length - 1][header];
                });
            }

            if (res.length > 0 && res[res.length - 1]["Description"] === undefined) {
                res.pop();
            }

            res.push(obj);
        }


        for (const entry of res) {
            const parts = entry["Description"].split(", ");

            if (parts.length > 1) {
                const [description, ...rest] = parts;
                entry["Description"] = description;
                entry["Specification"] = rest.join(", ");
            }
        }




        const formattedResult: CreatePurchaseOrderRequest[] = res.map((entry: PurchaseOrderRawEntry) => {
            const parseNumber = (val: string | undefined): number | null =>
                val && val !== "-" ? Number(val) : null;

            const parseString = (val: string | undefined): string | null =>
                val && val !== "-" ? val.toString() : null;

            const parseDate = (val: string | undefined): Date | null =>
                val && val !== "-" ? convertShortDate(val) : null;

            return {
                department: parseString(entry["Dept."]),
                supplier: parseString(entry.Supplier),
                po_number: parseString(entry["PO No."]),
                po_date: parseDate(entry["PO Date"]),
                pr_number: parseString(entry["SOB/PR No."]),
                pr_date: parseDate(entry["SOB/PR Date"]),
                description: parseString(entry.Description),
                specification: parseString(entry.Specification),
                quantity: parseNumber(entry.Quantity),
                unit: parseString(entry.unit),
                status: parseString(entry.Status),
                remark: parseString(entry.Remark),
            };
        });

        try {
            const createRequest = Validation.validate(PurchaseOrderValidation.CREATE, formattedResult);
            await prismaClient.purchaseOrder.createMany({ data: createRequest });
            logger.info("Purchase request created successfully");
            return true;
        } catch (error) {
            logger.error(`Error while creating purchase request: ${error}`);
            return;
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

        const [purchaseOrders, total] = await Promise.all([
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
            data: purchaseOrders.map(toPurchaseOrderResponse),
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


