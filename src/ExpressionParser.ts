import { IExpressionParser, StringCalculatorOptions } from './types';
import { NumberFormatter } from './NumberFormatter';
export class ExpressionParser implements IExpressionParser {
    private options: StringCalculatorOptions;
    private numberFormatter: NumberFormatter;
    constructor(options: StringCalculatorOptions = {}) {
        this.options = {
            decimalSeparator: options.decimalSeparator ?? ".",
            thousandsSeparator: options.thousandsSeparator ?? "",
            fractionDigits: options.fractionDigits ?? 0,
            min: options.min ?? -Infinity,
            max: options.max ?? Infinity,
        };

        this.numberFormatter = new NumberFormatter(this.options);
    }
    processString(str: string): number {
        const openBrackets = (str.match(/\(/g) || []).length;
        const closeBrackets = (str.match(/\)/g) || []).length;
        if (openBrackets !== closeBrackets) {
            throw new Error("Unbalanced parentheses in expression");
        }
        let result = str;
        if (/\(/.test(str)) {
        let parenthesesLevel = 0;
        let start = -1;
        let i = 0;

        while (i < str.length) {
            const char = str[i];

            if (char === "(") {
                if (start === -1) {
                    start = i;
                }
                parenthesesLevel++;
            } else if (char === ")") {
                parenthesesLevel--;
                if (parenthesesLevel === 0) {
                    const contents = str.slice(start + 1, i);
                    const evaluatedContents = this.processString(contents).toString();
                    result = result.replace(`(${contents})`, evaluatedContents);
                    start = -1;
                }
            }
            i++;
        }
        }
        return this.evaluate(this.processPercent(result)) ?? 0;
    }

    private processPercent(str: string): string {
        const regex = /^(.*?)([+\-])(\d+(?:[.,]\d+)?%(?!\d))/;
        let result = str;
        while (regex.test(result)) {
            const match = regex.exec(result);
            if (!match) {
                break;
            }
            const [fullMatch, expr] = match;
            if (/^-?\d+(?:[.,]\d+)?$/.test(expr)) {
                result = result.replace(fullMatch, this.evaluate(fullMatch).toString());
            } else {
                result = result.replace(expr, this.evaluate(expr).toString());
                result = this.processPercent(result);
            }
        }
        return result;
    }

    private evaluate(expression: string): number {
        
        expression = expression.replace(/\*\*/g, "^");
        expression = expression.replace(
            /(^-?\d+(?:[.,]\d+)?)%(\d+(?:[.,]\d+)?)/g,
            "($1*0.01*$2)"
        );
        expression = expression.replace(
            /(^-?\d+(?:[.,]\d+)?)([+\-])(\d+(?:[.,]\d+)?)%/g,
            "($1$2($1*$3*0.01))"
        );

        expression = expression.replace(
            /(^-?\d+(?:[.,]\d+)?)(\/)(\d+(?:[.,]\d+)?)%/g,
            "$1$2($3*0.01)"
        );
        expression = expression.replace(/(\d+(?:[.,]\d+)?)%/g, "($1*0.01)");
        expression = expression.replace(/%/g, "*0.01");
        
        return this.evaluatePostfix(this.infixToPostfix(expression));
    }

    private infixToPostfix(infix: string): string[] {
        const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
        const stack: string[] = [];
        const postfix: string[] = [];
        let numberBuffer: string[] = [];
        let prevOperator: string | null = null;
        const flushNumberBuffer = () => {
            if (numberBuffer.length) {
                postfix.push(numberBuffer.join("")!);
                numberBuffer = [];
            }
        };

        const handleOperator = (char: string) => {
            flushNumberBuffer();
            if (char === "(") {
                stack.push(char);
                prevOperator = null;
            } else if (char === ")") {
                while (stack.length && stack[stack.length - 1] !== "(") {
                    postfix.push(stack.pop()!);
                }
                if (stack.length) {
                    stack.pop();
                }
            } else {
                const isUnaryMinus = char === "-" 
                    && (prevOperator === null 
                        || prevOperator === "(" 
                        || prevOperator in precedence);
                if (isUnaryMinus) {
                    numberBuffer.push(char);
                } else {
                    while (
                        stack.length &&
                        precedence[char as keyof typeof precedence] <=
                        precedence[stack[stack.length - 1] as keyof typeof precedence]
                    ) {
                        postfix.push(stack.pop()!);
                    }
                    stack.push(char);
                }
            }
            prevOperator = char;
        };

        for (const char of infix) {
            if (/[\d\.\,]/.test(char)) {
                numberBuffer.push(char);
                prevOperator = char;
            } else if (char in precedence || char === "(" || char === ")") {
                handleOperator(char);
            }
        }

        flushNumberBuffer();
        while (stack.length) {
            postfix.push(stack.pop()!);
        }
        return postfix;
    }


    private evaluatePostfix(postfix: string[]): number {
        let stack: number[] = [];
        postfix.forEach((token) => {
            if (/^-?\d+(?:[.,]\d+)?$/.test(token)) {
                stack.push(this.numberFormatter.parse(token));
            } else {
                if (stack.length < 2) {
                    throw new Error("Invalid expression");
                }
                const right = stack.pop()!;
                const left = stack.pop()!;
                
                switch (token) {
                    case "+":
                        stack.push(left + right);
                        break;
                    case "-":
                        stack.push(left - right);
                        break;
                    case "*":
                        stack.push(left * right);
                        break;
                    case "/":
                        if (right === 0) {
                            throw new Error("Division by zero");
                        }
                        stack.push(left / right);
                        break;
                    case "^":
                        stack.push(left ** right);
                        break;
                }
            }
        });

        if (stack.length !== 1) {
            throw new Error("Invalid expression");
        }

        return stack.pop()!;
    }
}