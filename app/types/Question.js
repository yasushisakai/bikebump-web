// @flow
export type Question = {
    questionId: string;
    questionText: string;
    values: Array<QuestionValues>
};

type QuestionValues = {
    background: string;
    color: string;
    label: string;
    value: number;
}
