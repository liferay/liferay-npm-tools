/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

const clay = require('./dependencies/clay');
const liferay = require('./dependencies/liferay');
const metal = require('./dependencies/metal');

const CHECK_AND_FIX_GLOBS = [
	'/*.{js,json}',
	'/{src,test}/**/*.{js,scss}',
	'/src/**/*.{jsp,jspf}',
];

module.exports = {
	build: {
		// Passed to:
		// - `metalsoy` executable (via `generateSoyDependencies()`).

		dependencies: [...clay, ...liferay, ...metal],

		// Passed to:
		// - `babel` executable (via `runBabel()`).
		// - `jest` executable (via resolver.js).
		// - `metalsoy` executable (via `buildSoy()`).

		input: 'src/main/resources/META-INF/resources',

		// Passed to:
		// - `babel` executable (via `runBabel()`).
		// - `jest` executable (via resolver.js).
		// - `translateSoy()`.

		output: 'build/node/packageRunBuild/resources',

		// Used in various places to keep intermediate artefacts out of Gradle's
		// way (see `buildSoy()`, `withTempFile()`, etc).

		temp: 'build/npmscripts',
	},
	check: CHECK_AND_FIX_GLOBS,
	dualBuild: false,
	fix: CHECK_AND_FIX_GLOBS,
	rules: {
		'blacklisted-dependency-patterns': ['^liferay-npm-bundler-loader-.+'],
	},
	storybook: {
		languagePaths: ['src/main/resources/content/Language.properties'],
		port: '9000',
		portalURL: 'http://0.0.0.0:8080',
	},
};
