import { StringCalculatorOptions, INumderFormatter } from './types';
export declare class NumberFormatter implements INumderFormatter {
    private options;
    constructor(options?: StringCalculatorOptions);
    format(value: number): string;
    parse(input: string): number;
    private isValidNumber;
}
