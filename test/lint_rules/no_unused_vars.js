var path = require('path');

var lint = require('../../lib/lint');

var linter = lint.linter;
var RuleTester = lint.eslint.RuleTester;

var ruleTester = new RuleTester();

var options = [{'jsp': true}];

ruleTester.run(
	path.basename(__filename, '.js'),
	require('../../lib/lint_rules/' + path.basename(__filename)),
	{
		valid: [
			'var _PN_xyz = 1;',
			{
				code: '(function(){ var _PN_xyz = function(){}; });',
				options: options
			},
			{
				code: '(function(){ function _PN_xyz(){} })',
				options: options
			},
		],

		invalid: [
			{
				code: '(function(){ var _PN_xyz = 1; });',
				errors: [ { message: '"_PN_xyz" is defined but never used' } ],
				options: options
			}
		]
	}
);