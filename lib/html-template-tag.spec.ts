import { html } from "./html-template-tag";

describe("foo", () => {
  it("works", () => {
    console.log(
      html`<html>
        <head>
          <style>
            body {
              background-color: aliceblue;
            }
          </style>
        </head>
        <body>
          <h1>Test page.</h1>
          ${html`<p>Supports nesting</p>`}
          ${html.join(["a", "b", html`<p>c</p>`], html`<br />`)}
          ${"Escapes strings. & < > \" ' `"}<br />
          Null: ${null}<br />
          undefined: ${undefined}
        </body>
      </html>`.toHtmlDoc()
    );
  });
});
