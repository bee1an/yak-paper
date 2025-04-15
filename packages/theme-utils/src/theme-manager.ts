import { kebabcase, type IncludeString } from '@yak-paper/utils'

export class ThemeManager<
	T extends IncludeString<'light' | 'dark'> = IncludeString<'light' | 'dark'>,
	ThemeValue extends Record<string, any> = Record<string, any>
> {
	/**
	 * @description 主题变量映射
	 */
	private themeMap: Record<T, ThemeValue> = {} as Record<T, ThemeValue>

	constructor(
		/** @description 最后生成的css变量前缀 */
		private _prefix: string = 'y'
	) {}

	/**
	 * @description 添加一个变量映射关系
	 */
	add(theme: T, value: ThemeValue) {
		for (const key in value) {
			if (!this.themeMap[theme]) {
				this.themeMap[theme] = {} as ThemeValue
			}
			this.themeMap[theme][key] = value[key]
		}
	}

	/**
	 * @description 获取主题变量
	 */
	get(theme: T) {
		return this.themeMap[theme]
	}

	/**
	 * @description 定义获取主题的语法糖, 通常在定义组件级主题时会用到
	 * @example
	 * - 常规定义主题变量的方式
	 * 比如我现在要定义一个dark主题变量, 并且会使用大量的公用变量
	 * const instance = new ThemeManager()
	 * ... 省略定义公共变量的代码
	 * const darkCommon = instance.get('dark')
	 * const dark = {
	 *	width: darkCommon.width,
	 * 	...
	 * }
	 * - 使用fastTheme可以简化代码
	 * const dark = instance.fastTheme('dark', function () {
	 * 	return {
	 * 		width: this.width, // 这里的this会自动指向对应的公共变量
	 * 		...
	 * 	}
	 * })
	 */
	fastTheme(theme: T, fun: (this: (typeof this.themeMap)[T]) => ThemeValue) {
		return fun.call(this.get(theme))
	}

	/**
	 * @description 生成css变量
	 * @example
	 * {value: 1,helloWorld: 2} -> ['--y-value: 1', '--y-hello-world: 2']
	 * y: 实例化这个组件时传递的前缀
	 */
	createCssVar(value: ThemeValue) {
		return Object.entries(value).map(
			([key, value]) => `--${this._prefix}-${kebabcase(key)}: ${value};`
		)
	}

	/**
	 * @description 挂载主题变量到全局
	 */
	mountToRoot(theme: T) {
		if (Object.keys(this.themeMap[theme]).length === 0) return

		if (typeof document === 'undefined') return

		const dataSetId = `${this._prefix}-root-theme`

		const mounted = document.querySelector(`[data-id="${dataSetId}"]`)

		if (mounted) {
			mounted.innerHTML = document.createTextNode(`
				:root {${Object.entries(this.themeMap[theme])
					.map(([key, value]) => `--${this._prefix}-${kebabcase(key)}: ${value};`)
					.join('')}
					}`).textContent!
			return
		}

		const head = document.head || document.getElementsByTagName('head')[0]
		const style = document.createElement('style')
		// TODO: 找一个替代方案
		style.type = 'text/css'

		style.dataset.id = `${this._prefix}-root-theme`

		head.appendChild(style)

		style.appendChild(
			document.createTextNode(`
			:root {${this.createCssVar(this.themeMap[theme]).join('')}}
			`)
		)
	}
}
