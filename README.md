# Rename Custom Elements Webpack Plugin
This webpack plugin will rename all custom elements in a project, adding a suffix, a prefix, or both.

> Note: This plugin will only work on custom elements with a string literal definition (e.g. `customElements.define('my-element, MyElement)`)

## What does it rename

Any reference to the custom element found in the webpack chunks (js, css, html).

The plugin was tested in a Lit-Element project.

## Options

| Option name | Value type | Default value | Description |
|-------------|------------|---------------|-------------|
| `prefix` | `String` | `''` | Adds this prefix to all custom elements in the project |
| `sufix` | `String` | `Date.now().toString(36)` | Adds this sufix to all custom elements in project |
| `index` | `String` | `index.html` | Specifies an index.html that is also parsed for custom elements |

## Example

Let's say you project has the following custom element:

```js
class MyCustomElement extends HTMLElement {
    ...
}

customElements.define('my-custom-element', MyCustomElement);
```

If we run webpack with the `RenameCustomElementsWebpackPlugin` using the following options:

```js
const RenameCustomElementsWebpackPlugin = require('rename-custom-elements-webpack-plugin');

...
plugins: [
    new RenameCustomElementsWebpackPlugin({
        prefix: 'org',
        sufix: '000'
    })
],
...
```

Then the output will looks like this

```html
<body>
    <org-my-custom-element-000>
        ...some other content
    </org-my-custom-element-000>
    ...
</body>
```