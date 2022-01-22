import { html } from "./html-template-tag";
import { css } from "./css-template-tag";

describe("foo", () => {
  it("works", () => {
    console.log(
      html`<html>
        <head>
          <style>
            ${html.raw(css`
              body {
                background-color: aliceblue;
              }
            `)}
          </style>
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
