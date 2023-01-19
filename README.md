# Simple HTML Template Tag

Simple utility for generating safe HTML. Escapes interpolated values and supports nesting templates.

## Installation

```sh
npm install --save simple-html-template-tag
```

```sh
yarn add simple-html-template-tag
```

```sh
pnpm add simple-html-template-tag
```

```js
import { html } from "simple-html-template-tag";

console.log(html`<p>Hello, ${"world"}!</p>`.toString());
```

## Overview

Automatically escapes strings which helps prevent code injection.

```ts
html`<h1>${"Family & Friends"}</h1>`.toString();
```

```html
<h1>Family &amp; Friends</h1>
```

Renders `null` and `undefined` as empty strings.

```ts
html`<h1>Foo${null}Bar${undefined}Baz</h1>`.toString();
```

```html
<h1>FooBarBaz</h1>
```

Renders arrays by rendering each of their elements. This also works on deep arrays.

```ts
html`<h1>${["zero", 1, 2, null, ["a", "b"], "Last"]}</h1>`.toString();
```

```html
<h1>zero12abLast</h1>
```

The result of an HTML template can be used in another HTML template.

```ts
// This will be escaped because it's a string.
const who = "me & the boys";
// However, this will not be escaped because it uses the html template tag.
const what = html`looking for <strong>beans</strong>`;

html`<p>${who} at 2am ${what}</p>`.toString();
```

```html
<p>me &amp; the boys at 2am looking for <strong>beans</strong></p>
```

Objects can implement the implement their own HTML rendering logic.

```ts
import { html, toHtml } from "simple-html-template-tag";

class Weather {
  constructor(public condition, public tempF) {}

  [toHtml]() {
    return html`<img
        src="/assets/${this.condition}.png"
        alt="${this.condition}"
      />
      ${this.tempF} &deg;F`;
  }
}

html`<div>Today&quot;s forecast: ${new Weather("sunny", 78)}</div>`.toString();
```

```html
<div>
  Today&quot;s forecast: <img src="/assets/sunny.png" alt="sunny" /> 78 &deg;F
</div>
```

## Editor Integrations

This library works with several of the tools built for [lit-html](https://www.npmjs.com/package/lit-html).

[Prettier](https://www.npmjs.com/package/prettier) will automatically format template literals tagged with `html`. No extra config is needed.

The [lit-html plugin for VSCode](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) provides good syntax highting and IntelliSense.
