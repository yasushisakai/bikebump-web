export type Response = {
    [questionId: string]: {
        [respondId: string]: {
            dingId: string;
            questionId: string;
            uid: string;
            value: number;
        }
    }
};
