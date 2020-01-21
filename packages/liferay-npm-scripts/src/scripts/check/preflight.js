/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

const path = require('path');

const getMergedConfig = require('../../utils/getMergedConfig');
const getPaths = require('../../utils/getPaths');
const log = require('../../utils/log');
const {SpawnError} = require('../../utils/spawnSync');

const BABEL_CONFIG_FILE_NAME = '.babelrc.js';

const ESLINT_CONFIG_FILE_NAME = '.eslintrc.js';

const PRETTIER_CONFIG_FILE_NAME = '.prettierrc.js';

/* eslint-disable sort-keys */

const DISALLOWED_CONFIG_FILE_NAMES = {
	// https://babeljs.io/docs/en/config-files/
	'.babelrc': BABEL_CONFIG_FILE_NAME,
	'.babelrc.cjs': BABEL_CONFIG_FILE_NAME,
	'.babelrc.json': BABEL_CONFIG_FILE_NAME,
	'.babelrc.mjs': BABEL_CONFIG_FILE_NAME,
	'babel.config.cjs': BABEL_CONFIG_FILE_NAME,
	'babel.config.js': BABEL_CONFIG_FILE_NAME,
	'babel.config.json': BABEL_CONFIG_FILE_NAME,
	'babel.config.mjs': BABEL_CONFIG_FILE_NAME,

	// https://eslint.org/docs/user-guide/configuring
	'.eslintrc': ESLINT_CONFIG_FILE_NAME,
	'.eslintrc.cjs': ESLINT_CONFIG_FILE_NAME,
	'.eslintrc.json': ESLINT_CONFIG_FILE_NAME,
	'.eslintrc.yaml': ESLINT_CONFIG_FILE_NAME,
	'.eslintrc.yml': ESLINT_CONFIG_FILE_NAME,

	// https://prettier.io/docs/en/configuration.html
	'.prettierrc': PRETTIER_CONFIG_FILE_NAME,
	'.prettierrc.json': PRETTIER_CONFIG_FILE_NAME,
	'.prettierrc.toml': PRETTIER_CONFIG_FILE_NAME,
	'.prettierrc.yaml': PRETTIER_CONFIG_FILE_NAME,
	'.prettierrc.yml': PRETTIER_CONFIG_FILE_NAME,
	'prettier.config.js': PRETTIER_CONFIG_FILE_NAME
};

/* eslint-enable sort-keys */

// TODO: Actual rules still to be decided in:
// https://github.com/liferay/liferay-frontend-guidelines/issues/78
const SCSS_FILENAME_DESCRIPTION = 'lower-case kebab-case';
const SCSS_REGEXP = /\/_?([a-z0-9]+-)*[a-z0-9]+\.scss$/;

function preflight() {
	const errors = [...checkConfigFileNames(), ...checkSourceFileNames()];

	if (errors.length) {
		log('Preflight check failed:');

		log(...errors);

		throw new SpawnError();
	}
}

/**
 * Checks that config files use standard names.
 *
 * Returns a (possibly empty) array of error messages.
 */
function checkConfigFileNames() {
	const disallowedConfigs = getPaths(
		Object.keys(DISALLOWED_CONFIG_FILE_NAMES),
		[]
	);

	return disallowedConfigs.map(file => {
		const suggested = DISALLOWED_CONFIG_FILE_NAMES[path.basename(file)];

		return `${file}: BAD - use ${suggested} instead`;
	});
}

/**
 * Checks that source files followed standard naming patterns.
 *
 * Returns a (possibly empty) array of error messages.
 */
function checkSourceFileNames() {
	const globs = getMergedConfig('npmscripts', 'check');

	const sourceFiles = getPaths(globs, ['.scss']);

	return sourceFiles
		.filter(file => {
			return !SCSS_REGEXP.test(file);
		})
		.map(file => {
			return `${file}: BAD - name should be ${SCSS_FILENAME_DESCRIPTION}`;
		});
}

module.exports = preflight;
