/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

const authToken = 'default-mocked-auth-token';

/**
 * Event support APIs on the `Liferay` object inherited from `A.Attributes`
 *
 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-web/src/main/resources/META-INF/resources/liferay/events.js#L66
 * https://yuilibrary.com/yui/docs/api/classes/Attribute.html
 */
const events = {
	/**
	 * https://yuilibrary.com/yui/docs/api/files/event-custom_js_event-target.js.html#l372
	 */
	detach: jest.fn(),

	/**
	 * https://yuilibrary.com/yui/docs/api/files/event-custom_js_event-target.js.html#l700
	 */
	fire: jest.fn(),

	/**
	 * https://yuilibrary.com/yui/docs/api/files/event-custom_js_event-target.js.html#l227
	 */
	on: jest.fn(),

	/**
	 * https://yuilibrary.com/yui/docs/api/files/event-custom_js_event-target.js.html#l136
	 */
	once: jest.fn(),
};

/**
 * Contains a fallback/dummy implementation of
 * `Liferay.Language.get`. In practice, this call is rewritten in a
 * ServerFilter, so runtime calls to `Liferay.Language.get` should not
 * be found in production code. A better match for the real behaviour
 * would be a babel plugin to rewrite calls to the API with their
 * "translated" value.
 *
 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-aui-web/src/main/resources/META-INF/resources/liferay/language.js
 */
const Language = {
	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-aui-web/src/main/resources/META-INF/resources/liferay/language.js#L18
	 */
	get: jest.fn((key) => key),
};

/**
 * Portlet keys injected by the common theme, in:
 * https://github.com/liferay/liferay-portal/blob/b36c159f531ba88c4dbff83bbacdfa9d0252f1ae/portal-web/docroot/html/common/themes/top_js.jspf#L135
 */
const PortletKeys = {
	DOCUMENT_LIBRARY: 'DOCUMENT_LIBRARY',
	DYNAMIC_DATA_MAPPING: 'DYNAMIC_DATA_MAPPING',
	ITEM_SELECTOR: 'ITEM_SELECTOR',
};

/**
 * https://github.com/liferay/liferay-portal/blob/a4866af62eb89c69ee00d0e69dbe7ff092b50048/modules/apps/frontend-js/frontend-js-web/src/main/resources/META-INF/resources/liferay/global.es.js#L101-L104
 */
const Session = {
	/**
	 * https://github.com/liferay/liferay-portal/blob/a4866af62eb89c69ee00d0e69dbe7ff092b50048/modules/apps/frontend-js/frontend-js-web/src/main/resources/META-INF/resources/liferay/global.es.js#L102
	 */
	get: jest.fn(() => Promise.resolve({})),

	/**
	 * https://github.com/liferay/liferay-portal/blob/a4866af62eb89c69ee00d0e69dbe7ff092b50048/modules/apps/frontend-js/frontend-js-web/src/main/resources/META-INF/resources/liferay/global.es.js#L103
	 */
	set: jest.fn(() => Promise.resolve({})),
};

/**
 * Contains APIs that provide information about the running context of
 * the portal. The JS ThemeDisplay object is a representation of its
 * Java counterpart simplified for JS access.
 *
 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/portal-web/docroot/html/common/themes/top_js.jspf#L147
 */
const ThemeDisplay = {
	/**
	 * https://github.com/liferay/liferay-portal/blob/a4866af62eb89c69ee00d0e69dbe7ff092b50048/portal-web/docroot/html/common/themes/top_js.jspf#L188
	 */
	getBCP47LanguageId: jest.fn(() => 'en-US'),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/portal-web/docroot/html/common/themes/top_js.jspf#L217
	 */
	getDoAsUserIdEncoded: jest.fn(() => 'default-mocked-do-as-user-id'),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/portal-web/docroot/html/common/themes/top_js.jspf#L164
	 */
	getLayoutRelativeControlPanelURL: jest.fn(
		() => 'layoutRelativeControlPanelURL'
	),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/portal-web/docroot/html/common/themes/top_js.jspf#L168
	 */
	getLayoutRelativeURL: jest.fn(() => 'layoutRelativeURL'),

	/**
	 * https://github.com/liferay/liferay-portal/blob/a4866af62eb89c69ee00d0e69dbe7ff092b50048/portal-web/docroot/html/common/themes/top_js.jspf#L220
	 */
	getLanguageId: jest.fn(() => 'en-US'),

	/**
	 * https://github.com/liferay/liferay-portal/blob/a4866af62eb89c69ee00d0e69dbe7ff092b50048/portal-web/docroot/html/common/themes/top_js.jspf#L226
	 */
	getPathContext: jest.fn(() => '/'),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/portal-web/docroot/html/common/themes/top_js.jspf#L235
	 */
	getPathMain: jest.fn(() => '/c'),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/portal-web/docroot/html/common/themes/top_js.jspf#L238
	 */
	getPathThemeImages: jest.fn(() => ''),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/portal-web/docroot/html/common/themes/top_js.jspf#L247
	 */
	getPortalURL: jest.fn(() => 'http://localhost:8080'),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/portal-web/docroot/html/common/themes/top_js.jspf#L250
	 */
	getScopeGroupId: jest.fn(() => 'scopeGroupId'),
};

/**
 * General utilities on the `Liferay` object. Possible API sources are:
 *
 * - https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-web/src/main/resources/META-INF/resources/liferay/global.es.js
 * - https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-aui-web/src/main/resources/META-INF/resources/liferay/util.js
 */
const Util = {
	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-aui-web/src/main/resources/META-INF/resources/liferay/util.js#L442
	 */
	getGeolocation: jest.fn(),

	/**
	 * https://github.com/liferay/liferay-portal/blob/a4866af62eb89c69ee00d0e69dbe7ff092b50048/modules/apps/frontend-js/frontend-js-web/src/main/resources/META-INF/resources/liferay/global.es.js#L75
	 */
	isEqual: jest.fn((a, b) => a === b),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-web/src/main/resources/META-INF/resources/liferay/util/navigate.es.js
	 */
	navigate: jest.fn(),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-web/test/liferay/util/ns.es.js
	 */
	ns: jest.fn(() => ({})),

	/**
	 * https://github.com/liferay/liferay-portal/blob/31073fb75fb0d3b309f9e0f921cb7a469aa2703d/modules/apps/frontend-js/frontend-js-aui-web/src/main/resources/META-INF/resources/liferay/util.js#L999
	 */
	sub: jest.fn(),
};

module.exports = {
	...events,
	authToken,
	Language,
	PortletKeys,
	Session,
	ThemeDisplay,
	Util,
};
