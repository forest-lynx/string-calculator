import { describe, it, expect, beforeEach } from 'vitest';
import {StringCalculator} from '../src/StringCalculator';

describe("StringCalculator", () => {
    let calculator: StringCalculator;
    let calculatorRu: StringCalculator;
    
    beforeEach(() => {
        calculator = new StringCalculator({
            decimalSeparator: ".",
            thousandsSeparator: ",",
            fractionDigits: 2,
            min: -100,
            max: 500,
        });
        calculatorRu = new StringCalculator({
            decimalSeparator: ",",
            thousandsSeparator: " ",
            fractionDigits: 2,
            min: -100,
            max: 500,
        });
    });

    describe('Basic Operations', () => {
        it('should correctly evaluate simple arithmetic', () => {
            expect(calculator.calculate('2 + 2')).toBe(4);
            expect(calculator.calculate('10 - 5')).toBe(5);
            expect(calculator.calculate('4 * 3')).toBe(12);
            expect(calculator.calculate('15 / 3')).toBe(5);
            expect(calculator.calculate("2+3")).toBe(5);
            expect(calculator.calculate('5 -- 3')).toBe(8);
        });

        it('should handle decimal numbers', () => {
            expect(calculator.calculate('2.5 + 2.5')).toBe(5);
            expect(calculator.calculate('3.3 * 2')).toBe(6.6);
        });

        it("should handle percentages", () => {
            expect(calculator.calculate("10 + 20%")).toBe(12);
            expect(calculator.calculate("100 - 20%")).toBe(80);
            expect(calculator.calculate("10 * 20%")).toBe(2);
            expect(calculator.calculate("100 / 20%")).toBe(500);
        });

        it("should exponentiation",() => {
            expect(calculator.calculate("2 ^ 3")).toBe(8);
            expect(calculator.calculate("2 ** 3")).toBe(8);
            expect(calculator.calculate("4 ^ 0.5")).toBe(2);
        })
    });

    describe('Complex Expressions', () => {
        it("processing parentheses", () => {
            expect(calculator.calculate("(2 + 3) * 4")).toBe(20);
            expect(calculator.calculate("2 * (3 + 4)")).toBe(14);
            expect(calculator.calculate("(2 + 3) * (4 + 5)")).toBe(45);
            expect(calculatorRu.calculate("1 052,34 - (3 * (123,25 + 71.23))")).toBe(468.9);
        });

        it('should respect operator precedence', () => {
            expect(calculator.calculate('2 + 3 * 4')).toBe(14);
            expect(calculator.calculate('10 - 2 * 3')).toBe(4);
        });
        it('should handle multiple percentages in sequence', () => {
            expect(calculator.calculate('100 + 10% + 10% + 10%')).toBe(133.1);
            expect(calculator.calculate('500 - 10% - 10%')).toBe(405);
        });

        it('should handle mixed operations with parentheses and percentages', () => {
            expect(calculator.calculate('(100 + 20%) * 2')).toBe(240);
            expect(calculator.calculate('(200 - 10%) * (1 + 50%)')).toBe(270);
            expect(calculator.calculate('((50 + 10%) * 2) - 25%')).toBe(82.5);
        });

        it('should handle complex nested expressions', () => {
            expect(calculator.calculate('(2 + 3 * (4 - 1)) ^ 2')).toBe(121);
            expect(calculator.calculate('(10 + 5) * 2 - (8 / 2) ^ 2')).toBe(14);
            expect(calculator.calculate('(100 / (2 + 3)) * (7 - 2)')).toBe(100);
        });

        it('should handle whitespace variations', () => {
            expect(calculator.calculate('  2  +  2  ')).toBe(4);
            expect(calculator.calculate('\t3\n*\t2')).toBe(6);
            expect(calculator.calculate('   (  5  +  5  )   *   2   ')).toBe(20);
        });

        it('should handle very long expressions', () => {
            expect(calculator.calculate('1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10')).toBe(55);
            expect(calculator.calculate('((((1 + 2) * 3 - 4) / 5 + 6) * 7)')).toBe(49);
        });
    });
    
    describe('Value Constraints', () => {
        it('should respect min/max constraints', () => {
            expect(calculator.calculate('1000')).toBe(500);
            expect(calculator.calculate('-200')).toBe(-100);
            expect(calculator.calculate('250 * 3')).toBe(500);
            expect(calculator.calculate('-50 * 3')).toBe(-100);
        });

        it('should handle edge cases near constraints', () => {
            expect(calculator.calculate('499.99')).toBe(499.99);
            expect(calculator.calculate('-99.99')).toBe(-99.99);
        });
    });

    describe('Number Formatting', () => {
        it('should format numbers according to locale settings', () => {
            expect(calculator.format(1234.567)).toBe('1,234.57');
            expect(calculatorRu.format(1234.567)).toBe('1 234,57');
        });

        it('should format value correctly', () => {
            expect(calculator.format(12345.6789)).toBe('12,345.68');
            expect(calculator.format(0.1234)).toBe('0.12');
        });
        
        it('should parse formatted numbers correctly', () => {
            expect(calculator.parse('1,234.56')).toBe(1234.56);
            expect(calculatorRu.parse('1 234,56')).toBe(1234.56);
        });
         
        it("should handle negative numbers", () => {
            expect(calculator.parse('-1,234.56')).toBe(-1234.56);
            expect(calculatorRu.parse('-1 234,56')).toBe(-1234.56);
        });
    });

    describe('Error Handling', () => {
        it('should handle empty expression', () => {
            expect(() => calculator.calculate('')).toThrow('Empty expression');
        });

        it('should handle invalid expressions', () => {
            expect(() => calculator.calculate('2 +')).toThrow('Invalid expression');
            expect(() => calculator.calculate('* 2')).toThrow('Invalid expression');
        });

        it('should handle repeated operators', () => {
            expect(() => calculator.calculate('2 ++ 3')).toThrow('Invalid expression');
            expect(() => calculator.calculate('4 ** * 2')).toThrow('Invalid expression');
        });

        it('should handle division by zero', () => {
            expect(() => calculator.calculate('5 / 0')).toThrow('Division by zero');
            expect(() => calculator.calculate('(10 + 5) / (2 - 2)')).toThrow('Division by zero');
        });

        it('should handle unbalanced parentheses', () => {
            expect(() => calculator.calculate('(2 + 3')).toThrow('Unbalanced parentheses in expression');
            expect(() => calculator.calculate('2 + 3)')).toThrow('Unbalanced parentheses in expression');
            expect(() => calculator.calculate('((2 + 3)')).toThrow('Unbalanced parentheses in expression');
        });

        it('should handle invalid number formats', () => {
            expect(() => calculator.parse('abc')).toThrow('Invalid characters in a string');
            expect(() => calculator.parse('2+3x')).toThrow('Invalid characters in a string');
        });
    });
});