# String Calculator
[![npm](https://img.shields.io/npm/v/@forest-lynx/string-calculator)](https://www.npmjs.com/package/@forest-lynx/string-calculator)
[![npm](https://img.shields.io/npm/dm/@forest-lynx/string-calculator)](https://www.npmjs.com/package/@forest-lynx/string-calculator)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](TypeScript)

Documentation: [EN](./doc/README-EN.md) | [RU](README.md)

The **String Calculator** package provides a convenient and flexible tool for performing mathematical operations on strings containing numbers and arithmetic operators, including support for combining operations (using parentheses) with infinite nesting.

## Содержание
* [Installation](#installation)
* [Using](#using)
    * [Available methods](#available-methods)
* [Number Format Settings](#number-format-settings)
* [License](#license)

## Installation

```bash
npm install @forest-lynx/string-calculator
```
## Using

Connecting:
```javascript
import { StringCalculator } from '@forest-lynx/string-calculator';

const calculator = new StringCalculator();
const result = calculator.calculate('1 + 2 * 3');
```
#### Available methods:
`calculate(string)` - Calculates a mathematical expression passed as a string.
Acceptable symbols: `[0-9]`, `+`, `-`, `*`, `/`, `%`, `^`, `.`, `,` , `(`, `)`, `Space`.
Description of some symbols:
- `%` - calculating the percentage,
- `^` - exponentiation,
- `.`, `,`, `Space` - separator for thousandths and decimals

`format(value)` Formats a number into a string based on the set [settings](#настройки-формата-числа).

```javascript
const formattedNumber = calculator.format(1234.567); // Output: 1234.57 

// Under the settings: decimalSeparator: ',', thousandsSeparator: ' ', fractionDigits: 2
const formattedNumber = calculator.format(1234.567); // Output: 1 234,57 
```
`parse(value)` - Formats a string to a number based on the set [settings](#number-format-settings).

```javascript
// Under the settings: decimalSeparator: ',', thousandsSeparator: ' ', fractionDigits: 2
const parsedNumber = calculator.parse('1 234,57');
console.log(parsedNumber); // Output: 1234.57
```

### Usage on an HTML page
It can be used as a regular script, save the file `dist/string-calculator.min.js` to your project or connect it via cdn: `https://cdn.jsdelivr.net/npm/@forest-lynx/string-calculator@0.2.1/dist/string-calculator.min.js`
```html
<!DOCTYPE html>
<html>
<head>
    <title>String Calculator Example</title>
    <script src="https://cdn.jsdelivr.net/npm/@forest-lynx/string-calculator@0.2.1/dist/string-calculator.min.js"></script> 
    <script>
        const calculator = new StringCalculator(options); // or new window.StringCalculator(options);
        const result = calculator.calculate('10 + 20 / 2'); // Output: Result: 20
    </script>
</head>
<body>
</body>
</html>
```

## Number Format Settings

You can adjust the number format using the following options:
- `decimalSeparator` (string, default "."): Decimal separator.
- `thousandsSeparator` (string, default ""): Thousand Separator.
- `fractionDigits` (number, default 0): Number of decimal places.
- `min` (number, default `-Infinity`): Minimum allowed value.
- `max` (number, default `Infinity`): Maximum allowed value.


## License
[License MIT](./LICENSE).
