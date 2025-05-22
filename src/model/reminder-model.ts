export type ReminderResponse = {
    code: string | null;
    pr_status: boolean;
    pr_date: Date | null;
    po_status: boolean;
    po_date: Date | null;
}


export type SearchReminderRequest = {
    keyword?: string;
    page: number;
    limit: number;
    paginate?: boolean;
}

export function toReminderResponse(reminder: any): ReminderResponse {
    return {
        code: reminder.code,
        pr_status: reminder.pr_status ?? null,
        pr_date: reminder.pr_date ?? null,
        po_status: reminder.po_status ?? null,
        po_date: reminder.po_date ?? null
    }
}
