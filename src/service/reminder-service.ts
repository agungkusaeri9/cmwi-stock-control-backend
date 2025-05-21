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
                        kanban_code: {
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
            }),
            prismaClient.kanban.count({
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
            data: reminders.map(toReminderResponse),
            ...(pagination ? { pagination } : {})

        };
    }
}

