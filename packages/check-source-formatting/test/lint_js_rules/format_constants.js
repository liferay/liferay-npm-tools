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
		valid: ["var FOO1 = '';\n\nvar FOO2 = '';"],

		invalid: [
			{
				code: "var FOO1 = '';\nvar FOO2 = '';",
				errors: [
					{
						message:
							'Constants should be separated by a single new line'
					}
				]
			},
			{
				code: "var FOO1 = '';var FOO2 = '';",
				errors: [
					{
						message:
							'Constants should be separated by a single new line'
					}
				]
			}
		]
	}
);
