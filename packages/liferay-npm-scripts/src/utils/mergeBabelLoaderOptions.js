/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

const getMergedConfig = require('./getMergedConfig');

const BABEL_CONFIG = getMergedConfig('babel');
const NPM_SCRIPTS_CONFIG = getMergedConfig('npmscripts');

function updateWebpackRules(baseConfig, babelConfig) {
	const clonedConfig = {...baseConfig};

	clonedConfig.module = {
		...clonedConfig.module,
		rules: clonedConfig.module.rules.map((rule) => {
			let {use} = rule;

			if (!use) {
				return rule;
			}

			if (!Array.isArray(use)) {
				use = [use];
			}

			return {
				...rule,
				use: use.map((useEntry, i) => {
					if (typeof useEntry === 'string') {
						return {
							loader: useEntry,
							options: {...babelConfig},
						};
					} else {
						return {
							...useEntry,
							options: {...babelConfig, ...useEntry.options},
						};
					}
				}),
			};
		}),
	};

	return clonedConfig;
}

/**
 * Modify all babel-loader options so that they include our defaults.
 *
 * @param {object} webpackConfig
 * the object which has been exported from the webpack.config.js file
 */
function mergeBabelLoaderOptions(webpackConfig) {
	if (!webpackConfig.module) {
		return webpackConfig;
	}

	if (!webpackConfig.module.rules) {
		return webpackConfig;
	}

	if (NPM_SCRIPTS_CONFIG.dualBuild) {
		const modernBabelConfig = {
			...BABEL_CONFIG,
			presets: BABEL_CONFIG.presets.map((preset) => {
				if (
					preset === '@babel/preset-env' ||
					preset[0] === '@babel/preset-env'
				) {
					return [
						'@babel/preset-env',
						{
							targets: {
								browsers: [
									'Edge >= 16',
									'Firefox >= 60',
									'Chrome >= 61',
									'Safari >= 11',
									'Opera >= 48',
								],
							},
						},
					];
				}

				return preset;
			}),
		};

		const baseConfig = updateWebpackRules(webpackConfig, BABEL_CONFIG);
		const modernConfig = updateWebpackRules(
			webpackConfig,
			modernBabelConfig
		);

		webpackConfig = [
			baseConfig,
			{
				...modernConfig,
				output: {
					...modernConfig.output,
					filename: `${modernConfig.output.filename}_modern`,
				},
			},
		];
	} else {
		webpackConfig = updateWebpackRules(webpackConfig, BABEL_CONFIG);
	}

	return webpackConfig;
}

module.exports = mergeBabelLoaderOptions;
