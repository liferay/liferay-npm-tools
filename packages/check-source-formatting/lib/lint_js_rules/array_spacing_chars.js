var sub = require('string-sub');

var REGEX = require('../regex');

var isSingleLine = node => node.loc.start.line === node.loc.end.line;

module.exports = context => ({
	ArrayExpression(node) {
		if (isSingleLine(node)) {
			var source = context.getSource(node);

			var tmpSource = source.replace(/(['"]).*?\1/g, '$1$1');

			if (REGEX.ARRAY_INTERNAL_SPACE.test(tmpSource)) {
				var missingSpaces = [];

				source.replace(
					REGEX.ARRAY_INTERNAL_SPACE,
					(item, index, str) => {
						missingSpaces.push(item.replace('\t', '\\t'));
					}
				);

				var message = sub(
					'Array items should be separated by exactly one space:{0}',
					missingSpaces.join('')
				);

				context.report(node, message);
			}
		}
	}
});
