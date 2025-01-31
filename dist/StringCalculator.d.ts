import { StringCalculatorOptions, IStringCalculator } from './types';
export declare class StringCalculator implements IStringCalculator {
    private options;
    private numberFormatter;
    private expressionParser;
    constructor(options?: StringCalculatorOptions);
    format(value: number): string;
    parse(value: string): number;
    calculate(string: string): number;
    private formatResult;
}
export declare function calculate(expression: string, options?: StringCalculatorOptions): number;
