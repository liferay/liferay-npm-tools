/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

var path = require('path');

var lint = require('../../lib/lint_js');

var linter = lint.linter;
var RuleTester = lint.eslint.RuleTester;

var ruleTester = new RuleTester();

ruleTester.run(
	path.basename(__filename, '.js'),
	require('../../lib/lint_js_rules/' + path.basename(__filename)),
	{
		valid: ['[1, 2, 3]'],

		invalid: [
			{
				code: '[ 1, 2, 3]',
				errors: [{message: 'Remove leading spaces: [ ...'}]
			},
			{
				code: '[1, 2, 3 ]',
				errors: [{message: 'Remove trailing spaces: ... ]'}]
			},
			{
				code: '[ 1, 2, 3 ]',
				errors: [
					{message: 'Remove leading and trailing spaces: [ ... ]'}
				]
			}
		]
	}
);
