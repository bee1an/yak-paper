import type { KeyIncludeString, CSSProperties } from '../types'

export function createThemeOption(theme: KeyIncludeString<CSSProperties> = {}) {
	return (other: KeyIncludeString<CSSProperties>) => {
		return { ...theme, ...other }
	}
}
