/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

var _ = require('lodash');
var sub = require('string-sub');

var base = require('../base');
var utils = require('../rule_utils');

module.exports = {
	meta: {
		docs: {
			description: '<%= description %>',
			category: 'Fill me in',
			recommended: false
		},
		fixable: null, // or "code" or "whitespace"
		schema: [
			// fill in your schema
		]
	},

	create(context) {
		return {
			// ReturnStatement: function(node) {
			// ....
			// }
		};
	}
};
