const valueParser = require('postcss-value-parser');
const MagicString = require('magic-string');
const Color = require('color');


var visited = Symbol('visited');

module.exports = function(opts) {
	opts = opts || {};
	var type = opts.type;
	var properties = opts.properties;
	return {
		postcssPlugin: 'postcss-grayscale',
		Declaration(decl, { Declaration, AtRule }) {
			// ignore nodes we already visited
			if (decl[visited]) {
				return;
			}
			if (properties) {
				if (!properties.includes(decl.prop)) {
					return;
				}
			}
			var changed = false;
			var value = valueParser(decl.value);
			var magicString = new MagicString(decl.value);
			walkTree(value, {
				enter(node, parent) {
					// console.log(node);
					var value = node.value;
					try {
						switch (node.type) {
							case 'string':
								if (/^(#[0-9a-fA-F]{8})$/.test(value)) {
									node.value = node.quote + grayscale(type, Color(value)).hexa() + node.quote;
									magicString.overwrite(node.sourceIndex, node.sourceEndIndex, node.value);
									changed = true;
								} else {
									node.value = node.quote + grayscale(type, Color(value)).hex() + node.quote;
									magicString.overwrite(node.sourceIndex, node.sourceEndIndex, node.value);
									changed = true;
								}
								return true;
							case 'word':
								var arr = value.match(/=(#[0-9a-fA-F]{8})$/);
								if (arr) {
									node.value = value.replace(/=(#[0-9a-fA-F]{8})$/, '=' + grayscale(type, Color(arr[1])).hexa());
									magicString.overwrite(node.sourceIndex, node.sourceEndIndex, node.value);
									changed = true;
								} else {
									node.value = grayscale(type, Color(value)).hex();
									magicString.overwrite(node.sourceIndex, node.sourceEndIndex, node.value);
									changed = true;
								}
								return true;
							case 'function':
								switch (value) {
									case 'rgb':
										node.value = grayscale(type, Color(decl.value.substring(node.sourceIndex, node.sourceEndIndex))).hex();
										magicString.overwrite(node.sourceIndex, node.sourceEndIndex, node.value);
										changed = true;
										return false;
									case 'rgba':
										let color = Color(decl.value.substring(node.sourceIndex, node.sourceEndIndex));
										node.value = grayscale(type, color).alpha(color.alpha()).toString();
										magicString.overwrite(node.sourceIndex, node.sourceEndIndex, node.value);
										changed = true;
										return false;
								}
						}
					} catch (e) {}
					return true;
				}
			});
			if (changed) {
				decl[visited] = true;
				decl.value = magicString.toString();
			}
		}
	};
};
module.exports.postcss = true;

function grayscale(type, color) {
	switch (type) {
		case "HSI":
			return lightnessToColor((color.red() + color.green() + color.blue()) / 3);
		case "HSL":
			return lightnessToColor(color.lightness());
		case "Lab":
		case "Lch":
			return lightnessToColor(color.l());
		case 'BT.601':
		case 'BT601':
		case 'YUV':
			return color.grayscale();
		case 'BT.2100':
		case 'BT2100':
			return lightnessToColor(0.2627 * color.red() + 0.6780 * color.green() + 0.0593 * color.blue());
		case 'BT.709':
		case 'BT709':
		default:
			return lightnessToColor(color.luminosity());
	}
}

function lightnessToColor(l) {
	return Color.rgb(l * 255, l * 255, l * 255);
}


function walkTree(node, walker, parent) {
	var enter = walker.enter;
	if (enter) {
		if (enter(node, parent) === false) return;
	}
	var nodes = node.nodes;
	if (nodes && nodes.length) {
		var arr = Array.from(nodes);
		arr.forEach((child) => {
			walkTree(child, walker, node);
		});
	}
	var leave = walker.leave;
	if (leave) {
		if (leave(node, this) === false) return;
	}
}
