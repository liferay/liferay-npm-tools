> :warning: [The `liferay-npm-bundler-preset-liferay-dev` package](https://npmjs.com/package/liferay-npm-bundler-preset-liferay-dev) will be deprecated and this repo archived (ie. switched to read-only mode). Development will continue in [the `@liferay/npm-bundler-preset-liferay-dev` package](https://npmjs.com/package/@liferay/npm-bundler-preset-liferay-dev) and [in `liferay/liferay-frontend-projects` monorepo](https://github.com/liferay/liferay-frontend-projects/tree/master/projects/npm-tools/npm-bundler-preset-liferay-dev).

---

# liferay-npm-bundler-preset-liferay-dev

> Liferay NPM Bundler preset for npm modules inside liferay-portal.

## Install

```sh
npm install --save-dev liferay-npm-bundler-preset-liferay-dev
```

## Usage

Add the following to your `.npmbundlerrc` file:

```json
{
	"preset": "liferay-npm-bundler-preset-liferay-dev"
}
```

## Technical Details

This preset includes the following Babel presets:

1. [babel-preset-liferay-standard](https://github.com/izaera/liferay-npm-build-tools/tree/master/packages/babel-preset-liferay-standard)

And the following Liferay NPM Bundler plugins:

1. [liferay-npm-bundler-plugin-replace-browser-modules](https://github.com/izaera/liferay-npm-build-tools/tree/master/packages/liferay-npm-bundler-plugin-replace-browser-modules)
