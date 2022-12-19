var fs = require('fs');
var postcss = require('postcss');
var expect = require('chai').expect;

var plugin = require('../index');

var read = function(path) {
	return fs.readFileSync(path, 'utf-8');
};
var testString = function(input, output, opts) {
	var result = postcss(plugin(opts)).process(input).css;
	// console.log(result);
	expect(result.replace(/\s/g, "")).to.eql(output.replace(/\s/g, ""));
};
var test = function(name, opts) {
	var input = read('test/fixtures/' + name + '.css');
	var output = read('test/fixtures/' + name + '.out.css');
	testString(input, output, opts);
};
describe('postcss-grayscale', function() {
	it('BT.709', function() {
		test('BT.709');
	});
	it('HSL', function() {
		test('HSL', { type: 'HSL' });
	});
	it('HSI', function() {
		test('HSI', { type: 'HSI' });
	});
	it('Lab', function() {
		test('Lab', { type: 'Lab' });
	});
	it('gamma=2.2', function() {
		test('gamma', { type: 'gamma=2.2' });
	});
	it('ie', function() {
		test('ie');
	});
	it('rbg', function() {
		test('rbg');
	});
});
