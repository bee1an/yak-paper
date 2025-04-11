export interface BaseVar extends Record<string, any> {}

export class defineTheme<T extends BaseVar> {
	baseValue: T

	constructor(baseValue: T) {
		this.baseValue = { ...baseValue }
	}
}
