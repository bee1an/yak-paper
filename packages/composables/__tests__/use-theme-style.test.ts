import { reactive } from 'vue'
import { useThemeStyle } from '../src'
import { describe, it, expect } from 'vitest'

describe('use-theme-style.ts', () => {
	const themes = {
		light: { color: 'white', background: 'black' },
		dark: { color: 'black', background: 'white' }
	}

	const createCssVarMap = (theme: Record<string, string>) => {
		return Object.entries(theme).map(([key, value]) => `--${key}: ${value};`)
	}

	/** @description 测试脸色主题是否生成成功 */
	it('should return light theme CSS variables when theme is "light"', () => {
		const props = { theme: 'light' }
		const result = useThemeStyle(themes, props, createCssVarMap)
		expect(result.value).toEqual(['--color: white;', '--background: black;'])
	})

	/** @description 测试暗色主题是否生成成功 */
	it('should return dark theme CSS variables when theme is "dark"', () => {
		const props = { theme: 'dark' }
		const result = useThemeStyle(themes, props, createCssVarMap)
		expect(result.value).toEqual(['--color: black;', '--background: white;'])
	})

	/** @description 测试未知主题是否生成成功 */
	it('should return empty array when theme is not recognized', () => {
		const props = { theme: 'unknown' }
		const result = useThemeStyle(themes, props, createCssVarMap)
		expect(result.value).toEqual([])
	})

	/** @description 测试亮色主题覆盖是否生效 */
	it('should apply themeOverWrite to the selected theme', () => {
		const props = { theme: 'light', themeOverWrite: { color: 'blue' } }
		const result = useThemeStyle(themes, props, createCssVarMap)
		expect(result.value).toEqual(['--color: blue;', '--background: black;'])
	})

	/** @description 测试暗色主题覆盖是否生效 */
	it('should handle empty themeOverWrite gracefully', () => {
		const props = { theme: 'dark', themeOverWrite: {} }
		const result = useThemeStyle(themes, props, createCssVarMap)
		expect(result.value).toEqual(['--color: black;', '--background: white;'])
	})

	/** @description 测试主题切换是否生效 */
	it('should switch between themes when props.theme changes', () => {
		const props = reactive({ theme: 'dark' })
		const result = useThemeStyle(themes, props, createCssVarMap)
		expect(result.value).toEqual(['--color: black;', '--background: white;'])
		props.theme = 'light'
		expect(result.value).toEqual(['--color: white;', '--background: black;'])
	})
})
