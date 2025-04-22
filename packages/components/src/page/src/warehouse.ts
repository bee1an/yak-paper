import type { DataAgreer } from '@yak-paper/core'
import { reactive } from 'vue'

export class WareHouse {
	private static _instance: WareHouse

	private constructor() {}

	static get instance() {
		if (!this._instance) {
			this._instance = new WareHouse()
		}
		return this._instance
	}

	private _hypers: DataAgreer[] = reactive([{ type: 'text' }])

	get hypers() {
		return this._hypers
	}

	addHyper(hyper: DataAgreer) {
		this._hypers.push(hyper)
	}
}
