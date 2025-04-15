import type * as CSS from 'csstype'

export interface CSSProperties
	extends CSS.Properties<string | number>,
		CSS.PropertiesHyphen<string | number> {
	/**
	 * 参考了vue的写法
	 * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
	 */
	[v: `--${string}`]: string | number | undefined
}
