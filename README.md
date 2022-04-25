# HTML Template Tag

Simple utility for generating safe HTML.

Automatically escapes strings which helps prevent code injection.

```ts
html`<h1>${"Family & Friends"}</h1>`.toString();
```

Result:

```html
<h1>Family &amp; Friends</h1>
```

Renders `null` and `undefined` as empty strings.

```ts
html`<h1>${null}</h1>`.toString();
```

Result:

```html
<h1></h1>
```

```ts
html`<h1>${undefined}</h1>`.toString();
```

Result:

```html
<h1></h1>
```

Renders arrays by rendering each of their elements. This also works on deep arrays.

```ts
html`<h1>${["zero", 1, 2, null, ["a", "b"], "Last"]}</h1>`.toString();
```

Result:

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

Result:

```html
<p>me &amp; the boys at 2am looking for <strong>beans</strong></p>
```
