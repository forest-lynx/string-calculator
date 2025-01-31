import { IExpressionParser, StringCalculatorOptions } from './types';
export declare class ExpressionParser implements IExpressionParser {
    private options;
    private numberFormatter;
    constructor(options?: StringCalculatorOptions);
    processString(str: string): number;
    private processPercent;
    private evaluate;
    private infixToPostfix;
    private evaluatePostfix;
}
