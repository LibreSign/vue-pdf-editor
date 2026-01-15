module.exports = {
	root: true,
	env: {
		'node': true,
		'browser': true,
		'es2021': true
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended'
	],
	parserOptions: {
		'parser': '@babel/eslint-parser'
	},
	rules: {
		'no-debugger': 'off',
		'no-console': 'off',
	}
}
