export interface Reminder {
    id: string;
    type: string;
    title: string;
    month: string;
    dogs: string[];
    completed: boolean;
    repeat?: string;
    date: any;
    uid: string;
    colors?: string[];
    chips?: any[];
    thisYear: boolean;
    overdue?: boolean;
}
