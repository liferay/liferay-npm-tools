/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

const parser = require('@babel/parser');
const findUp = require('find-up');
const fs = require('fs');
const globby = require('globby');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const INSIGHTS = [require('./insights/dependencies')];

let report;

if (argv.json) {
	report = require('./reporters/json');
} else if (argv.airtable) {
	report = require('./reporters/airtable');
} else {
	report = require('./reporters/table');
}

/**
 * Parses the contents of a file and returns the corresponding AST
 */
async function parse(path) {
	const content = await readFile(path, 'utf8');

	return parser.parse(content, {
		plugins: ['classProperties', 'jsx'],
		sourceType: 'module'
	});
}

async function getModuleMeta(modulePath) {
	// Resolves current modulePath base directory
	const cwd = path.dirname(path.resolve(modulePath));

	// Finds the closer package.json file to the modulePath
	const pkg = await findUp('package.json', {cwd});

	// Take app from the `name` field in package.json
	const app = JSON.parse(await readFile(pkg, 'utf8')).name;

	const name = path.basename(modulePath);

	// Finds the root git folder
	const gitRoot = await findUp('.git', {
		cwd,
		type: 'directory'
	});

	const url = `https://github.com/liferay/liferay-portal/blob/master/${path.relative(
		path.join(gitRoot, '..'),
		path.resolve(modulePath)
	)}`;

	return {
		app,
		name,
		url
	};
}

/**
 * Considers the first non-namespaced param as the entry glob. For example:
 *
 * 	`npx liferay-js-insights --json modules/private/apps`
 * 	`npx liferay-js-insights --airtable src/*.es.js`
 */
(async () => {
	const data = [];

	// eslint-disable-next-line no-for-of-loops/no-for-of-loops
	for await (const modulePath of globby.stream(argv._[0])) {
		const ast = await parse(modulePath);

		const moduleMeta = await getModuleMeta(modulePath);
		const moduleInfo = await INSIGHTS[0](ast, moduleMeta);

		data.push(moduleInfo);
	}

	report(data, argv);
})();