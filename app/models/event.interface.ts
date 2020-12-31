export interface Event {
    id: string;
    type: string;
    title: string;
    month: string;
    dogs: string[];
    location?: string;
    date: any;
    uid: string;
    colors?: string[];
    chips?: any[];
    thisYear: boolean;
}
