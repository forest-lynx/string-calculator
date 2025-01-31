var d = Object.defineProperty;
var m = (l, t, r) => t in l ? d(l, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : l[t] = r;
var c = (l, t, r) => m(l, typeof t != "symbol" ? t + "" : t, r);
class p {
  constructor(t = {}) {
    c(this, "options");
    this.options = {
      decimalSeparator: t.decimalSeparator ?? ".",
      thousandsSeparator: t.thousandsSeparator ?? "",
      fractionDigits: t.fractionDigits ?? 0,
      min: t.min ?? -1 / 0,
      max: t.max ?? 1 / 0
    };
  }
  format(t) {
    const { decimalSeparator: r, thousandsSeparator: e, fractionDigits: a } = this.options, s = t.toFixed(a).split(".");
    return s[0] = s[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      e ?? ""
    ), s.join(r);
  }
  parse(t) {
    if (this.isValidNumber(t))
      return parseFloat(t);
    const { decimalSeparator: r, thousandsSeparator: e } = this.options, a = t.trim();
    if (!new RegExp(
      `^[-]?[\\d${r}${e}]*$`,
      "g"
    ).test(a))
      throw new Error("Invalid characters in a string");
    const s = a.replace(e, "").replace(r, ".");
    if (s === "")
      throw new Error("Empty input string");
    const o = parseFloat(s);
    if (isNaN(o))
      throw new Error("Invalid number format");
    return o;
  }
  isValidNumber(t) {
    if (!t || typeof t != "string" || (t = t.trim(), t.includes(","))) return !1;
    const r = /^-?\d*\.?\d+$/;
    return t = t.replace(/\s/g, ""), r.test(t);
  }
}
class g {
  constructor(t = {}) {
    c(this, "options");
    c(this, "numberFormatter");
    this.options = {
      decimalSeparator: t.decimalSeparator ?? ".",
      thousandsSeparator: t.thousandsSeparator ?? "",
      fractionDigits: t.fractionDigits ?? 0,
      min: t.min ?? -1 / 0,
      max: t.max ?? 1 / 0
    }, this.numberFormatter = new p(this.options);
  }
  processString(t) {
    const r = (t.match(/\(/g) || []).length, e = (t.match(/\)/g) || []).length;
    if (r !== e)
      throw new Error("Unbalanced parentheses in expression");
    let a = t;
    if (/\(/.test(t)) {
      let n = 0, s = -1, o = 0;
      for (; o < t.length; ) {
        const h = t[o];
        if (h === "(")
          s === -1 && (s = o), n++;
        else if (h === ")" && (n--, n === 0)) {
          const i = t.slice(s + 1, o), u = this.processString(i).toString();
          a = a.replace(`(${i})`, u), s = -1;
        }
        o++;
      }
    }
    return this.evaluate(this.processPercent(a)) ?? 0;
  }
  processPercent(t) {
    const r = /^(.*?)([+\-])(\d+(?:[.,]\d+)?%(?!\d))/;
    let e = t;
    for (; r.test(e); ) {
      const a = r.exec(e);
      if (!a)
        break;
      const [n, s] = a;
      /^-?\d+(?:[.,]\d+)?$/.test(s) ? e = e.replace(n, this.evaluate(n).toString()) : (e = e.replace(s, this.evaluate(s).toString()), e = this.processPercent(e));
    }
    return e;
  }
  evaluate(t) {
    return t = t.replace(/\*\*/g, "^"), t = t.replace(
      /(^-?\d+(?:[.,]\d+)?)%(\d+(?:[.,]\d+)?)/g,
      "($1*0.01*$2)"
    ), t = t.replace(
      /(^-?\d+(?:[.,]\d+)?)([+\-])(\d+(?:[.,]\d+)?)%/g,
      "($1$2($1*$3*0.01))"
    ), t = t.replace(
      /(^-?\d+(?:[.,]\d+)?)(\/)(\d+(?:[.,]\d+)?)%/g,
      "$1$2($3*0.01)"
    ), t = t.replace(/(\d+(?:[.,]\d+)?)%/g, "($1*0.01)"), t = t.replace(/%/g, "*0.01"), this.evaluatePostfix(this.infixToPostfix(t));
  }
  infixToPostfix(t) {
    const r = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 }, e = [], a = [];
    let n = [], s = null;
    const o = () => {
      n.length && (a.push(n.join("")), n = []);
    }, h = (i) => {
      if (o(), i === "(")
        e.push(i), s = null;
      else if (i === ")") {
        for (; e.length && e[e.length - 1] !== "("; )
          a.push(e.pop());
        e.length && e.pop();
      } else if (i === "-" && (s === null || s === "(" || s in r))
        n.push(i);
      else {
        for (; e.length && r[i] <= r[e[e.length - 1]]; )
          a.push(e.pop());
        e.push(i);
      }
      s = i;
    };
    for (const i of t)
      /[\d\.\,]/.test(i) ? (n.push(i), s = i) : (i in r || i === "(" || i === ")") && h(i);
    for (o(); e.length; )
      a.push(e.pop());
    return a;
  }
  evaluatePostfix(t) {
    let r = [];
    if (t.forEach((e) => {
      if (/^-?\d+(?:[.,]\d+)?$/.test(e))
        r.push(this.numberFormatter.parse(e));
      else {
        if (r.length < 2)
          throw new Error("Invalid expression");
        const a = r.pop(), n = r.pop();
        switch (e) {
          case "+":
            r.push(n + a);
            break;
          case "-":
            r.push(n - a);
            break;
          case "*":
            r.push(n * a);
            break;
          case "/":
            if (a === 0)
              throw new Error("Division by zero");
            r.push(n / a);
            break;
          case "^":
            r.push(n ** a);
            break;
        }
      }
    }), r.length !== 1)
      throw new Error("Invalid expression");
    return r.pop();
  }
}
class f {
  constructor(t = {}) {
    c(this, "options");
    c(this, "numberFormatter");
    c(this, "expressionParser");
    this.options = {
      decimalSeparator: t.decimalSeparator ?? ".",
      thousandsSeparator: t.thousandsSeparator ?? "",
      fractionDigits: t.fractionDigits ?? 0,
      min: t.min ?? -1 / 0,
      max: t.max ?? 1 / 0
    }, this.numberFormatter = new p(this.options), this.expressionParser = new g(this.options);
  }
  format(t) {
    return this.numberFormatter.format(t);
  }
  parse(t) {
    return this.numberFormatter.parse(t);
  }
  calculate(t) {
    const r = t.replace(/\s/g, "").toString();
    if (!(r != null && r.trim()))
      throw new Error("Empty expression");
    try {
      const e = this.expressionParser.processString(r);
      return this.formatResult(e);
    } catch (e) {
      throw e instanceof Error ? e : new Error("Invalid expression");
    }
  }
  formatResult(t) {
    return Math.min(
      Math.max(
        parseFloat(t.toFixed(this.options.fractionDigits)),
        this.options.min
      ),
      this.options.max
    );
  }
}
function S(l, t = {}) {
  return new f(t).calculate(l);
}
window.StringCalculator = f.StringCalculator;
export {
  f as StringCalculator,
  S as calculate
};
