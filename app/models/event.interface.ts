export interface Event {
    id: string;
    type: string;
    title: string;
    month: string;
    dogs: string[];
    location?: string;
    date: Date;
    uid: string;
}
