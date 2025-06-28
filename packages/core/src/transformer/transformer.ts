import { Colleague } from '../paper/colleague'

export class Tranformer extends Colleague {
	private static _instance: Tranformer | null = null
	static get instance() {
		if (!this._instance) {
			this._instance = new Tranformer()
		}
		return this._instance
	}
	private constructor() {
		super()
	}

	transform(from: any, to: any) {}
}
