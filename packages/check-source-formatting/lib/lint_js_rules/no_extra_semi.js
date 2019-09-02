/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

module.exports = context => ({
	EmptyStatement(node) {
		var afterText = context.getSource(node, 0, 10);

		if (afterText !== ';(function(') {
			context.report(node, 'Unnecessary semicolon.');
		}
	}
});
