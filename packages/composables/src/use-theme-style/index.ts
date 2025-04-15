import { computed, type Reactive } from 'vue'
import type { IncludeString } from '@yak-paper/utils'

/**
 * @description 主题样式组合式函数
 * @param themes 当前组件的默认主题
 * @param props 组件主题 props 必须包含 theme
 * @param createCssVarMap 创建css变量中间件函数
 * @returns 返回一个响应式对象
 */
export const useThemeStyle = (
	themes: {
		light: Record<string, string>
		dark: Record<string, string>
	},
	props: { theme: IncludeString<'light' | 'dark'>; themeOverWrite?: Record<string, any> },
	createCssVarMap: (value: Record<string, any>) => string[]
) => {
	return computed(() => {
		const theme = props.theme
		const themeOverWrite = props.themeOverWrite

		let resolvedTheme: Reactive<Record<string, string>> = {}

		if (theme in themes) {
			resolvedTheme = { ...themes[theme as 'light' | 'dark'] }
		}

		Object.assign(resolvedTheme, themeOverWrite)

		return createCssVarMap(resolvedTheme)
	})
}
