/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

const launcher = require('chrome-launcher');
const lh = require('lighthouse');
const path = require('path');

/**
 * Wrapper for the Lighthouse performance auditing command-line tool.
 *
 * @see https://developers.google.com/web/tools/lighthouse
 */
async function lighthouse() {
	const chromeFlags = ['--headless'];
	const chromePath = process.env.CHROME_PATH
		? path.resolve(process.env.CHROME_PATH)
		: undefined;

	const logLevel = process.env.DEBUG ? 'verbose' : 'error';

	const launcherOptions = {
		chromeFlags,
		chromePath,
		logLevel
	};

	const chrome = await launcher.launch(launcherOptions);

	const url = process.env.PORTAL_URL || 'http://localhost:8080/';

	const lighthouseOptions = {
		logLevel,
		onlyCategories: ['performance'],
		port: chrome.port
	};

	const config = undefined;

	const results = await lh(url, lighthouseOptions, config);

	await chrome.kill();

	/* eslint-disable no-console */
	console.log(results.lhr); // "JS-consumable output"
	console.log(results.report); // "HTML/JSON/CSV as a string"
	console.log(results.artifacts); // "trace/screenshots/other"
}

module.exports = lighthouse;
