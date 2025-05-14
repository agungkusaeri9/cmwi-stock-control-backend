export type ReminderResponse = {
    code: string | null;
    pr_status: string | null;
    pr_date: Date | null;
    po_status: string | null;
    po_date: Date | null;
}


export type SearchReminderRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
}

export function toReminderResponse(operator: any): ReminderResponse {
    return {
        code: operator.code,
        pr_status: operator.pr_status ?? null,
        pr_date: operator.pr_date ?? null,
        po_status: operator.po_status ?? null,
        po_date: operator.po_date ?? null
    }
}
