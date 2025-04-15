import type { PropType } from 'vue'

export const useThemeProps = () => {
	return {
		theme: {
			type: String as PropType<'light' | 'dark'>,
			default: 'light'
		},
		themeOverWrite: {
			type: Object as PropType<Record<string, any>>
		}
	}
}
