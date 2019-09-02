/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

module.exports = {
	globals: {
		$: true,
		_: true,
		A: true
	},

	rules: {
		'block-scoped-var': 0,
		'csf-dot-notation': 2,
		'csf-no-undef': [2, {}],
		'csf-no-unused-vars': [
			2,
			{
				jsp: true
			}
		],
		indent: [0, 'tab'],
		'dot-notation': 0,
		'no-trailing-spaces': 0,
		'no-undef': 0,
		'no-unused-vars': 0,
		'no-use-before-define': 0,
		'lines-around-comment': 0
	}
};
