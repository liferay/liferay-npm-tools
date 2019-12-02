/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

const path = require('path');

const webpack = require('../../src/scripts/webpack');
const spawnSync = require('../../src/utils/spawnSync');

jest.mock('../../src/utils/spawnSync');

const FIXTURES = path.resolve(
	__dirname,
	'../../__fixtures__/scripts/webpack/sample'
);

describe('scripts/webpack.js', () => {
	let cwd;

	beforeEach(() => {
		cwd = process.cwd();
		jest.resetAllMocks();
	});

	afterEach(() => {
		jest.resetModules();
		process.chdir(cwd);
	});

	it('invokes webpack', () => {
		webpack();

		expect(spawnSync.mock.calls).toHaveLength(1);
		expect(spawnSync.mock.calls[0]).toHaveLength(2);
		expect(spawnSync.mock.calls[0][0]).toBe('webpack');
		expect(spawnSync.mock.calls[0][1]).toHaveLength(2);
		expect(spawnSync.mock.calls[0][1][0]).toBe('--config');
		expect(spawnSync.mock.calls[0][1][1]).toMatch(/webpack.config.js$/);
	});

	it('passes arguments to webpack', () => {
		webpack('--verbose');

		expect(spawnSync.mock.calls).toHaveLength(1);
		expect(spawnSync.mock.calls[0]).toHaveLength(2);
		expect(spawnSync.mock.calls[0][0]).toBe('webpack');
		expect(spawnSync.mock.calls[0][1]).toHaveLength(3);
		expect(spawnSync.mock.calls[0][1][0]).toBe('--config');
		expect(spawnSync.mock.calls[0][1][1]).toMatch(/webpack.config.js$/);
		expect(spawnSync.mock.calls[0][1][2]).toMatch('--verbose');
	});

	it('executes wepback-dev-server when "--watch" is passed', () => {
		process.chdir(FIXTURES);

		webpack('--watch');

		expect(spawnSync.mock.calls).toHaveLength(1);
		expect(spawnSync.mock.calls[0]).toHaveLength(2);
		expect(spawnSync.mock.calls[0][0]).toBe('webpack-dev-server');
		expect(spawnSync.mock.calls[0][1]).toHaveLength(2);
		expect(spawnSync.mock.calls[0][1][0]).toBe('--config');
		expect(spawnSync.mock.calls[0][1][1]).toMatch(/webpack.config.dev.js$/);
	});

	it('passes arguments to wepback-dev-server', () => {
		process.chdir(FIXTURES);
		webpack('--watch', '--lazy');

		expect(spawnSync.mock.calls).toHaveLength(1);
		expect(spawnSync.mock.calls[0]).toHaveLength(2);
		expect(spawnSync.mock.calls[0][0]).toBe('webpack-dev-server');
		expect(spawnSync.mock.calls[0][1]).toHaveLength(3);
		expect(spawnSync.mock.calls[0][1][0]).toBe('--config');
		expect(spawnSync.mock.calls[0][1][1]).toMatch(/webpack.config.dev.js$/);
		expect(spawnSync.mock.calls[0][1][2]).toBe('--lazy');
	});

	it('complains when "--watch" is passed without appropriate config', () => {
		expect(() => webpack('--watch')).toThrow(
			/--watch supplied but "webpack.config.dev.js" not found/
		);
	});
});
