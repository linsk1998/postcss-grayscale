# PostCSS Grayscale <img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">

[PostCSS](https://github.com/postcss/postcss) PostCSS plugin to transform color to grayscale.

## Example
```js
const postcssGrayscale = require('postcss-grayscale');
postcss([
	postcssGrayscale()
])
```

```css
/* Input example */
.red {
	color: #ff0000;
}
.green {
	color: #00ff00;
}
.blue {
	color: #0000ff;
}
```

```css
/* Output example */
.red {
	color: #363636;
}
.green {
	color: #B6B6B6;
}
.blue {
	color: #121212;
}
```

## options

### type

```js
const postcssGrayscale = require('postcss-grayscale');
postcss([
	postcssGrayscale({
		type: 'Lab'// HSL/HSI/YUV
	})
])
```

### properties

```js
const postcssGrayscale = require('postcss-grayscale');
postcss([
	postcssGrayscale({
		properties: ['color', 'background', 'background-color']
	})
])
```
