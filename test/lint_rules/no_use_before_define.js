var path = require('path');

var lint = require('../../lib/lint');

var linter = lint.linter;
var RuleTester = lint.eslint.RuleTester;

var ruleTester = new RuleTester();

ruleTester.run(
	path.basename(__filename, '.js'),
	require('../../lib/lint_rules/' + path.basename(__filename)),
	{
		valid: [
			"var a=10; alert(a);",
			"function b(a) { alert(a); }",
			"Object.hasOwnProperty.call(a);",
			"function a() { alert(arguments);}",
			{ code: "(() => { var a = 42; alert(a); })();", ecmaFeatures: {arrowFunctions: true} },
			{ code: "a(); function a() { alert(arguments); }", options: ['nofunc'] },
			{ code: "function a() { alert(b); } function b() { alert(arguments); }", options: [null, {'samescope': true}] },
			{ code: "a(); try { throw new Error() } catch (a) {}" },

			// Block level bindings
			{ code: "\"use strict\"; a(); { function a() {} }", ecmaFeatures: { blockBindings: true } },
			{ code: "\"use strict\"; { a(); function a() {} }", options: ["nofunc"], ecmaFeatures: { blockBindings: true } },
			{ code: "switch (foo) { case 1:  { a(); } default: { let a; }}", ecmaFeatures: { blockBindings: true }},
			{ code: "a(); { let a = function () {}; }", ecmaFeatures: { blockBindings: true } },
			{ code: "var b = (a) => { return a + 1; }; var a = 1;", ecmaFeatures: { arrowFunctions: true, blockBindings: true } }

		],
		invalid: [
			{ code: "a++; var a=19;", ecmaFeatures: { modules: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier"}] },
			{ code: "a++; var a=19;", ecmaFeatures: { globalReturn: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier"}] },
			{ code: "a++; var a=19;", errors: [{ message: '"a" was used before it was defined', type: "Identifier"}] },
			{ code: "a(); var a=function() {};", errors: [{ message: '"a" was used before it was defined', type: "Identifier"}] },
			{ code: "alert(a[1]); var a=[1,3];", errors: [{ message: '"a" was used before it was defined', type: "Identifier"}] },
			{ code: "a(); function a() { alert(b); var b=10; a(); }", errors: [{ message: '"a" was used before it was defined', type: "Identifier"}, { message: "\"b\" was used before it was defined", type: "Identifier"}] },
			{ code: "a(); var a=function() {};", options: [ "nofunc"], errors: [{ message: '"a" was used before it was defined', type: "Identifier"}] },
			{ code: "(() => { alert(a); var a = 42; })();", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }] },
			{ code: "(() => a())(); function a() { }", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }] },
			{ code: "\"use strict\"; a(); { function a() {} }", errors: [{ message: '"a" was used before it was defined', type: "Identifier" }] },
			{ code: "a(); try { throw new Error() } catch (foo) {var a;}", errors: [{ message: '"a" was used before it was defined', type: "Identifier" }] },
			{ code: "var f = () => a; var a;", ecmaFeatures: { arrowFunctions: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }] },

			// Block-level bindings
			{ code: "a++; { var a; }", ecmaFeatures: { blockBindings: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }] },
			{ code: "\"use strict\"; { a(); function a() {} }", ecmaFeatures: { blockBindings: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }] },
			{ code: "{a; let a = 1}", ecmaFeatures: { blockBindings: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }]},
			{ code: "switch (foo) { case 1: a();\n default: \n let a;}", ecmaFeatures: { blockBindings: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }]},
			{ code: "var f = () => a; var a;", ecmaFeatures: { arrowFunctions: true, blockBindings: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }] },
			{ code: "if (true) { function foo() { a; } let a;}", ecmaFeatures: { blockBindings: true }, errors: [{ message: '"a" was used before it was defined', type: "Identifier" }]}

			// { code: "a++; var a=19;", errors: [{ message: '"a" was used before it was defined'}] },
			// { code: 'a(); var a=function() {};', errors: [{ message: '"a" was used before it was defined'}] },
			// { code: 'alert(a[1]); var a=[1,3];', errors: [{ message: '"a" was used before it was defined'}] },
			// { code: 'a(); function a() { alert(b); var b=10; a(); }', errors: [{ message: '"a" was used before it was defined'}, { message: '"b" was used before it was defined'}] },
			// { code: "a(); var a=function() {};", options: ["nofunc"], errors: [{ message: '"a" was used before it was defined'}] }
		]
	}
);