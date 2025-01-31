import { StringCalculatorOptions, INumderFormatter } from './types';

export class NumberFormatter implements INumderFormatter {
    private options: StringCalculatorOptions;

    constructor(options: StringCalculatorOptions = {}) {
        this.options = {
            decimalSeparator: options.decimalSeparator ?? ".",
            thousandsSeparator: options.thousandsSeparator ?? "",
            fractionDigits: options.fractionDigits ?? 0,
            min: options.min ?? -Infinity,
            max: options.max ?? Infinity,
        };
    }

    format(value: number): string {
        const { decimalSeparator, thousandsSeparator, fractionDigits } =
        this.options;
        const formattedValue = value.toFixed(fractionDigits);
        const parts = formattedValue.split(".");
        parts[0] = parts[0].replace(
            /\B(?=(\d{3})+(?!\d))/g,
            thousandsSeparator ?? ""
        );
        return parts.join(decimalSeparator);
    }

    parse(input: string): number {
        //const isValidNumber = (str) => !isNaN(str) && !str.includes(',') && Number(str) === Number(str.replace(/\s/g, ''));
        if (this.isValidNumber(input)) {
            return parseFloat(input);
        }
        const { decimalSeparator, thousandsSeparator } = this.options;
        const trimmedInput = input.trim();
        const allowedCharsRegex = new RegExp(
            `^[-]?[\\d${decimalSeparator}${thousandsSeparator}]*$`,
            "g"
        );
        if (!allowedCharsRegex.test(trimmedInput)) {
            throw new Error("Invalid characters in a string");
        }
        const cleanInput = trimmedInput
            .replace(thousandsSeparator!, "")
            .replace(decimalSeparator!, ".");
        if (cleanInput === "") {
            throw new Error("Empty input string");
        }

        const parsedValue = parseFloat(cleanInput);

        if (isNaN(parsedValue)) {
            throw new Error("Invalid number format");
        }
        
        return parsedValue;
    }

    private isValidNumber (str: string): boolean 
    {
        if (!str || typeof str !== 'string') return false;
        str = str.trim();
        if (str.includes(',')) return false;
        const reg = /^-?\d*\.?\d+$/;
        str = str.replace(/\s/g, '');
        
        return reg.test(str);
    }
}
