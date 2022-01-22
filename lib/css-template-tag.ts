class CssThing {
  constructor(private readonly content: string) {}

  toString() {
    return this.content;
  }
}

type Interpolation =
  | boolean
  | null
  | undefined
  | { toString(): string }
  | readonly Interpolation[]
  | (() => Interpolation);

function toCss(value: Interpolation): string {
  if (value === null || value === undefined || typeof value === "boolean") {
    return "";
  }

  if (typeof value === "function") {
    return toCss(value());
  }

  if (value instanceof Array) {
    return value.map(toCss).join("");
  }

  return "" + value;
}

export function css(strings: TemplateStringsArray, ...values: Interpolation[]) {
  let output = strings[0];

  for (let i = 1; i < strings.length; ++i) {
    const value = values[i - 1];

    output += toCss(value) + strings[i];
  }

  return new CssThing(output);
}
