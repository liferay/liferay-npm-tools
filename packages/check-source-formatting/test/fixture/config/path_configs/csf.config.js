/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

module.exports = {
	flags: {
		quiet: true
	},

	'path:**/foo.css': {
		flags: {
			quiet: false
		}
	},

	'path:**/foo.js': {
		flags: {
			quiet: true
		}
	}
};
