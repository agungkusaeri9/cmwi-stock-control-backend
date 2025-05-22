import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";
import { ReminderResponse, toReminderResponse, SearchReminderRequest } from "../model/reminder-model";
import { Validation } from "../validation/validation";
import { ReminderValidation } from "../validation/reminder-validation";


export class ReminderService {

    static async get(request: SearchReminderRequest): Promise<Pageable<ReminderResponse>> {

        const searchRequest = Validation.validate(ReminderValidation.SEARCH, request);

        const filters: any[] = [];

        if (searchRequest.keyword) {
            filters.push({
                OR: [
                    {
                        code: {
                            contains: searchRequest.keyword
                        }
                    },
                ]
            });
        }

        filters.push({
            balance: {
                lt: prismaClient.kanban.fields.min_quantity
            }
        })

        const whereClause = filters.length > 0 ? { AND: filters } : {};

        const page = searchRequest.page || 1;
        const limit = searchRequest.limit || 10;

        const skip = (page - 1) * limit;

        const [reminders, total] = await Promise.all([
            prismaClient.kanban.findMany({
                where: whereClause,
                ...(searchRequest.paginate ? { take: limit, skip } : {}),
                include: {
                    purchase_request_detail: {
                        include: {
                            purchase_request: true
                        }
                    },
                    purchase_order_detail: {
                        include: {
                            purchase_order: true
                        }
                    }
                }
            }),
            prismaClient.kanban.count({
                where: whereClause,
            })
        ]);

        const data = reminders.map((kanban) => {
            const hasPR = kanban.purchase_request_detail.length > 0;
            const hasPO = kanban.purchase_order_detail.length > 0;

            const prDate = hasPR ? kanban.purchase_request_detail[0]?.purchase_request?.date ?? null : null;
            const poDate = hasPO ? kanban.purchase_order_detail[0]?.purchase_order?.po_date ?? null : null;

            const reminderResponse: ReminderResponse = {
                code: kanban.code,
                pr_status: hasPR ? true : false,
                pr_date: prDate,
                po_status: hasPO ? true : false,
                po_date: poDate
            };

            return reminderResponse;
        });




        const pagination = searchRequest.paginate
            ? {
                curr_page: page,
                total_page: Math.ceil(total / limit),
                limit: limit,
                total: total
            }
            : undefined;


        return {
            data: data.map(toReminderResponse),
            ...(pagination ? { pagination } : {})

        };
    }
}

