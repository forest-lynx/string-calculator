# String Calculator
[![npm](https://img.shields.io/npm/v/@forest-lynx/string-calculator)](https://www.npmjs.com/package/@forest-lynx/string-calculator)
[![npm](https://img.shields.io/npm/dm/@forest-lynx/string-calculator)](https://www.npmjs.com/package/@forest-lynx/string-calculator)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](TypeScript)

Documentation: [EN](./doc/README-EN.md) | [RU](README.md)

Пакет **String Calculator** предоставляет удобный и гибкий инструмент для выполнения математических операций над строками, содержащими числа и арифметические операторы, включая поддержку объединения операций (с использованием круглых скобок) бесконечной вложенности.

## Содержание
* [Установка](#установка)
* [Использование](#использование)
    * [Доступные методы](#доступные-методы)
* [Настройки формата числа](#настройки-формата-числа)
* [Лицензия](#лицензия)

## Установка

```bash
npm install @forest-lynx/string-calculator
```
## Использование

Подключение:
```javascript
import { StringCalculator } from '@forest-lynx/string-calculator';

const calculator = new StringCalculator();
const result = calculator.calculate('1 + 2 * 3');
```
#### Доступные методы:
`calculate(string)` - Вычисляет математическое выражение, переданное в виде строки.
Допустимые символы: `[0-9]`, `+`, `-`, `*`, `/`, `%`, `^`, `.`, `,` , `(`, `)`, `Space`.
Описание некоторых символов:
- `%` - вычисление процента,
- `^` - возведение в степень,
- `.`, `,`, `Space` - разделитель тысячных, десятичных знаков

`format(value)` Форматирует число в строку с учетом заданных [настроек](#настройки-формата-числа).

```javascript
const formattedNumber = calculator.format(1234.567); // Output: 1234.57 

// При настройках: decimalSeparator: ',', thousandsSeparator: ' ', fractionDigits: 2
const formattedNumber = calculator.format(1234.567); // Output: 1 234,57 
```
`parse(value)` - Форматирует строку в число с учетом заданных [настроек](#настройки-формата-числа).

```javascript
// При настройках: decimalSeparator: ',', thousandsSeparator: ' ', fractionDigits: 2
const parsedNumber = calculator.parse('1 234,57');
console.log(parsedNumber); // Output: 1234.57
```

### Использование на HTML-странице
Возможно использование как обычного скрипта, для подключения к странице используйте файл string-calculator.min.js.
```html
<!DOCTYPE html>
<html>
<head>
    <title>String Calculator Example</title>
    <script src="./dist/string-calculator.min.js"></script> 
    <script>
        const calculator = new StringCalculator(options); // or new window.StringCalculator(options);
        const result = calculator.calculate('10 + 20 / 2'); // Output: Result: 20
    </script>
</head>
<body>
</body>
</html>
```

## Настройки формата числа

Вы можете настроить формат числа с помощью следующих параметров:
- `decimalSeparator` (string, по умолчанию "."): Разделитель десятичных знаков.
- `thousandsSeparator` (string, по умолчанию ""): Разделитель тысяч.
- `fractionDigits` (number, по умолчанию 0): Количество знаков после запятой.
- `min` (number, по умолчанию `-Infinity`): Минимальное допустимое значение.
- `max` (number, по умолчанию `Infinity`): Максимальное допустимое значение.


## Лицензия
[Лицензия MIT](./LICENSE).