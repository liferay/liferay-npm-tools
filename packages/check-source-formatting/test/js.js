/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

var _ = require('lodash');
var chai = require('chai');
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');

var Formatter = require('../lib/formatter');
var Logger = require('../lib/logger');

chai.use(require('chai-string'));

var assert = chai.assert;

var getErrorMsgByLine = function(lineNum, errors) {
	var whereLine = {
		line: lineNum
	};

	return _.result(_.find(errors, whereLine), 'msg') || '';
};

describe('Formatter.JS', function() {
	'use strict';

	beforeEach(function() {
		sinon.createSandbox();
	});

	afterEach(function() {
		sinon.restore();
	});

	var testFilePath = path.join(__dirname, 'fixture', 'test.js');

	var jsLogger = new Logger.constructor();
	var jsFormatter = new Formatter.JS(testFilePath, jsLogger);
	var source = fs.readFileSync(testFilePath, 'utf-8');

	jsFormatter.format(source, false);

	var jsErrors = jsLogger.getErrors(testFilePath);

	it('should ignore values in comments', function() {
		assert.equal(getErrorMsgByLine(1, jsErrors), '');
	});

	it('should recognize an invalid conditional', function() {
		assert.startsWith(
			getErrorMsgByLine(5, jsErrors),
			'Needs a space between ")" and "{":'
		);
	});

	it('should recognize an invalid argument format', function() {
		assert.startsWith(
			getErrorMsgByLine(11, jsErrors),
			'These arguments should each be on their own line:'
		);
	});

	it('should recognize an invalid function format', function() {
		assert.startsWith(
			getErrorMsgByLine(16, jsErrors),
			'Anonymous function expressions should be formatted as function(:'
		);
	});

	it('should recognize variable line spacing', function() {
		assert.startsWith(
			getErrorMsgByLine(23, jsErrors),
			'Variable declaration needs a new line after it:'
		);
	});

	it('should print code as source', function() {
		var srcCode = 'var foo = 1';

		assert.equal(jsFormatter._printAsSource(srcCode), '1 ' + srcCode);
	});

	it('should use a custom lint log filter', function() {
		var jsLoggerFilter = new Logger.constructor();
		var jsFormatterFilter = new Formatter.JS(testFilePath, jsLoggerFilter);

		var lintLogFilter = sinon.stub().returnsArg(0);

		jsFormatterFilter.lintLogFilter = lintLogFilter;

		jsFormatterFilter.format('var _PN_var = 1;');

		assert.isTrue(lintLogFilter.called);
	});

	it('should parse JS syntax', function() {
		var jsLoggerParse = new Logger.constructor();
		var jsFormatterParse = new Formatter.JS(testFilePath, jsLoggerParse);
		var processed = false;

		jsFormatterParse.processor.VariableDeclaration = function(
			node,
			parent
		) {
			assert.isObject(node);
			assert.isObject(parent);

			assert.equal(node.type, 'VariableDeclaration');
			assert.isArray(node.declarations);
			assert.equal(node.declarations[0].id.name, 'x');

			processed = true;
		};

		jsFormatterParse._processSyntax('var x = 123;');

		assert.isTrue(processed, 'JS was not processed');

		jsFormatterParse._processSyntax('var x = ;');

		var parseErrors = jsLoggerParse.getErrors(testFilePath);

		assert.equal(parseErrors.length, 1);
		assert.startsWith(
			parseErrors[0].msg,
			'Could not parse JavaScript: Unexpected token '
		);

		var jsLoggerParseVerbose = new Logger.constructor();
		var jsFormatterParseVerbose = new Formatter.JS(
			testFilePath,
			jsLoggerParseVerbose
		);

		jsFormatterParseVerbose.flags.verbose = true;
		jsFormatterParseVerbose._processSyntax('var x = ;');

		var verboseDetails = jsLoggerParseVerbose.verboseDetails[testFilePath];

		assert.isString(verboseDetails);
		assert.isAbove(verboseDetails.length, 0);
	});

	it('should handle errors during JS parsing', function() {
		var jsLoggerParse = new Logger.constructor();
		var jsFormatterParse = new Formatter.JS(testFilePath, jsLoggerParse);

		jsFormatterParse.processor.VariableDeclaration = function(
			node,
			parent
		) {
			(function() {
				null.indexOf('foo');
			})();
		};

		jsFormatterParse._processSyntax('var x = 1;');

		var parseErrors = jsLoggerParse.getErrors(testFilePath);

		assert.equal(parseErrors.length, 1);

		var parseError = parseErrors[0];

		assert.startsWith(parseError.msg, 'Could not parse JavaScript:');
		assert.equal(parseError.line, 'n/a');
	});
});

describe('Formatter.JS Node', function() {
	'use strict';

	var testFilePath = path.join(__dirname, 'fixture', 'test_node.js');

	var jsLogger = new Logger.constructor();
	var jsFormatter = new Formatter.JS(testFilePath, jsLogger);
	var source = fs.readFileSync(testFilePath, 'utf-8');

	jsFormatter.format(source, false);

	var jsErrors = jsLogger.getErrors(testFilePath);

	it('should not recognize debugging statements', function() {
		assert.equal(getErrorMsgByLine(3, jsErrors), '');
	});
});

describe('Formatter.JS Excludes', function() {
	'use strict';

	it('should ignore excluded files', function() {
		_.forEach(['min', 'soy', 'nocsf'], function(item, index) {
			['-', '_', '.'].forEach(function(n, i) {
				var testFilePath = 'test' + n + item + '.js';
				var jsLogger = new Logger.constructor();
				var jsFormatter = new Formatter.get(testFilePath, jsLogger);

				var jsErrors = jsLogger.getErrors(testFilePath);

				assert.startsWith(
					getErrorMsgByLine('n/a', jsErrors),
					'This file was ignored.'
				);
			});
		});
	});
});

describe('Formatter.JS Lint', function() {
	'use strict';

	beforeEach(function() {
		sinon.createSandbox();
	});

	afterEach(function() {
		sinon.restore();
	});

	var lintConfig = require('../lib/config/eslint');

	var testFilePath = path.join(__dirname, 'fixture', 'test.js');

	var jsLogger = new Logger.constructor();
	var jsFormatter = new Formatter.JS(testFilePath, jsLogger);
	var source = fs.readFileSync(testFilePath, 'utf-8');

	var lint = require('../lib/lint_js');

	it('should find at least one lint error', function() {
		jsFormatter.format(source, true);

		var jsErrors = jsLogger.getErrors(testFilePath);

		var foundLintErrors = _.reduce(
			jsErrors,
			function(res, item, index) {
				if (item.type) {
					res[item.type] = true;
				}

				return res;
			},
			{}
		);

		var hasLintError = _.some(lintConfig.rules, function(item, index) {
			var val = _.isArray(item) ? item[0] : item;

			return val > 0 && foundLintErrors[index];
		});

		assert.isTrue(hasLintError);
	});

	it('should use default configuration properties', function() {
		var eslint = lint.eslint;

		var verify = function(contents, config, file) {
			return {
				line: 1,
				message: '',
				column: 0,
				ruleId: ''
			};
		};

		sinon.stub(eslint.linter, 'verify').callsFake(verify);

		lint.runLinter(source, testFilePath, {});

		var args = eslint.linter.verify.args[0];

		assert.isUndefined(args[1].plugins);
	});

	it('should merge configuration properties', function() {
		var eslint = lint.eslint;

		var verify = function(contents, config, file) {
			return {
				line: 1,
				message: '',
				column: 0,
				ruleId: ''
			};
		};

		sinon.stub(eslint.linter, 'verify').callsFake(verify);

		jsFormatter.format(source, {
			parserOptions: {
				ecmaVersion: 6
			}
		});

		var args = eslint.linter.verify.args[0];

		assert.equal(args[1].parserOptions.ecmaVersion, 6);
		assert.isArray(args[1].plugins);
	});

	it('load a custom eslint plugin', function() {
		var eslint = lint.eslint;

		sinon.spy(eslint.linter, 'verify');

		lint.runLinter(source, testFilePath, {
			fileConfig: {
				_paths: {
					obj: {
						filepath: path.join(__dirname, '../package.json')
					}
				}
			},
			lintConfig: {
				parserOptions: {
					ecmaVersion: 7
				},
				plugins: ['dollar-sign']
			}
		});

		var linterRules = eslint.linter.getRules();

		assert.isTrue(linterRules.has('dollar-sign/dollar-sign'));
	});

	it('load a custom eslint plugin via path', function() {
		var eslint = lint.eslint;

		var linterRulesPrev = eslint.linter.getRules();

		lint.runLinter(source, testFilePath, {
			fileConfig: {
				_paths: {
					obj: {
						filepath: path.join(__dirname, '../package.json')
					}
				}
			},
			lintConfig: {
				parserOptions: {
					ecmaVersion: 7
				},
				plugins: ['./test/fixture/eslint-plugin-custom-lint']
			}
		});

		var linterRules = eslint.linter.getRules();

		assert.isTrue(linterRules.has('custom-lint/foo'));
	});

	it('ignore non-existent rules', function() {
		var eslint = lint.eslint;

		var linterRulesPrev = eslint.linter.getRules();

		lint.runLinter(source, testFilePath, {
			lintConfig: {
				parserOptions: {
					ecmaVersion: 7
				},
				plugins: ['non-existent-plugin', './other-non-existent-plugin']
			}
		});

		var linterRules = eslint.linter.getRules();

		assert.equal(linterRulesPrev.size, linterRules.size);
	});
});
