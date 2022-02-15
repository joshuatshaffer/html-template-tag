# HTML Template Tag

Simple utility for generating safe HTML.

Automatically escapes strings.

```ts
html`<h1>${"Family & Friends"}</h1>`.toString();
// returns: <h1>Family &amp; Friends</h1>
```

Prevents code injection.

```ts
html`
  <p>${'Maniacal laugher. <script src="evil.js"></script>'}</p>
`.toString();
// returns: <p>Maniacal laugher. &lt;script src=&quot;evil.js&quot;&gt;&lt;/script&gt;</p>`
```

Use inline styles with the css helper.

```ts
const style = css`
  color: red;
  border: 1px solid black;
`;

html`<div style="${style}">Red text in a box.</div>`;
```

Supports nested templates and higher order templates.

```ts
const color = (c, x) => html`<div style="color: ${c}">${x}</div>`;

const red = (x) => color("red", x);
const blue = (x) => color("blue", x);
const one = (x) => html`<div>${x}</div>`;
const two = (x) => html`<div>${x} ${x}</div>`;

const fish = "<º)))><";

output = html`
  <div style="background: lightblue">
    ${[one(fish), two(fish), red(fish), blue(fish)]}
  </div>
`;
```
