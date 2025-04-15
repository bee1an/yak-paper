import { describe, expect, it } from 'vitest'
import { ThemeManager } from '../src/theme-manager'

describe('theme-manager.ts', () => {
	it('add', () => {
		const themeManager = new ThemeManager()
		const theme = 'light'

		// 测试当主题为空时是否正确添加
		const value = { color: 'white' }
		themeManager.add(theme, value)
		expect(themeManager.get(theme)).toEqual(value)

		// 测试当主题存在时是否正确添加
		const value2 = { background: 'black' }
		themeManager.add(theme, value2)
		expect(themeManager.get(theme)).toEqual({ color: 'white', background: 'black' })

		// 测试添加空对象时是否正确
		const value3 = {}
		themeManager.add(theme, value3)
		expect(themeManager.get(theme)).toEqual({ color: 'white', background: 'black' })

		// 测试覆盖是否正确
		const value4 = { color: 'blue' }
		themeManager.add(theme, value4)
		expect(themeManager.get(theme)).toEqual({ color: 'blue', background: 'black' })
	})

	it('fastTheme', () => {
		const themeManager = new ThemeManager()
		const theme = 'light'
		const value = { color: 'white', background: 'black' }
		themeManager.add(theme, value)

		expect(
			themeManager.fastTheme(theme, function () {
				// 测试this指向是否正确
				expect(this).toEqual({ color: 'white', background: 'black' })
				return { color: this.color, background: 'cyan' }
			})
			// 测试返回值是否正确
		).toEqual({ color: 'white', background: 'cyan' })
	})

	it('createCssVar', () => {
		const themeManager = new ThemeManager()
		expect(themeManager.createCssVar({ color: 'white' })).toEqual(['--y-color: white;'])

		const themeManager2 = new ThemeManager('p')
		expect(themeManager2.createCssVar({ color: 'white' })).toEqual(['--p-color: white;'])
	})
})
