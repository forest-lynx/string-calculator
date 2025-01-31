import { StringCalculatorOptions, IStringCalculator } from './types';
import { NumberFormatter } from './NumberFormatter';
import { ExpressionParser } from './ExpressionParser';

export class StringCalculator implements IStringCalculator {
  private options: StringCalculatorOptions;
  private numberFormatter: NumberFormatter;
  private expressionParser: ExpressionParser;

  constructor(options: StringCalculatorOptions = {}) {
    this.options = {
      decimalSeparator: options.decimalSeparator ?? ".",
      thousandsSeparator: options.thousandsSeparator ?? "",
      fractionDigits: options.fractionDigits ?? 0,
      min: options.min ?? -Infinity,
      max: options.max ?? Infinity,
    };
    
    this.numberFormatter = new NumberFormatter(this.options);
    this.expressionParser = new ExpressionParser(this.options);
  }

  format(value: number): string {
    return this.numberFormatter.format(value);
  }

  parse(value: string): number {
    return this.numberFormatter.parse(value);
  }

  calculate(string: string): number {
    const input = string
      .replace(/\s/g, "").toString()
      //.replace(/,/g, (this.options.decimalSeparator ?? ".").toString());
    
    if (!input?.trim()) {
      throw new Error("Empty expression");
    }
    try {
      const result = this.expressionParser.processString(input);      
      return this.formatResult(result);
    } catch (error) {
        throw (error instanceof Error) 
            ? error 
            : new Error("Invalid expression");
    }
  }

  private formatResult(value: number): number {
    return Math.min(
      Math.max(
        parseFloat(value.toFixed(this.options.fractionDigits)),
        this.options.min!
      ),
      this.options.max!
    );
  }
}

export function calculate(expression: string,options: StringCalculatorOptions = {}): number {
    const calculator = new StringCalculator(options);
    return calculator.calculate(expression);
} 