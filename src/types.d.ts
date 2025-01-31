export interface StringCalculatorOptions {
    decimalSeparator?: string;
    thousandsSeparator?: string;
    fractionDigits?: number;
    min?: number;
    max?: number;
}

export interface IStringCalculator {
    format(value: number): string;
    parse(value: string): number;
    calculate(string: string): number;
}

export interface INumderFormatter {
    format(value: number): string;
    parse(value: string): number;
}

export interface IExpressionParser {
    processString(str: string): number;
}