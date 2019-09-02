/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

module.exports = {
	common: require('./engine_rules/common'),
	css: require('./engine_rules/css'),

	html: require('./engine_rules/html'),

	htmlJS: require('./engine_rules/html_js'),
	js: require('./engine_rules/js')
};
