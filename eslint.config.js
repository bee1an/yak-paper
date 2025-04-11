import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts,vue}'] },
	{ files: ['**/*.{js,mjs,cjs,ts,vue}'], languageOptions: { globals: globals.browser } },
	{ files: ['build/**/*.{js,mjs,cjs,ts,vue}'], languageOptions: { globals: globals.node } },
	{ files: ['**/*.{js,mjs,cjs,ts,vue}'], plugins: { js }, extends: ['js/recommended'] },
	tseslint.configs.recommended,
	pluginVue.configs['flat/essential'],
	{ files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
	{
		rules: {
			'vue/multi-word-component-names': 0,
			'vue/no-reserved-component-names': 0,
			'@typescript-eslint/no-unused-vars': 1,
			'@typescript-eslint/no-unused-expressions': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'no-debugger': 0,
			'@typescript-eslint/no-empty-object-type': 0
		}
	},
	globalIgnores([
		'**/node_modules/**',
		'**/dist/**',
		'*.css',
		'*.jpg',
		'*.jpeg',
		'*.png',
		'*.gif',
		'*.d.ts'
	])
])
