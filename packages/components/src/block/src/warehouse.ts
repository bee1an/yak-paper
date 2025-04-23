import type { HyperAgreer } from '@yak-paper/core'
import { reactive } from 'vue'

export class BlockWarehouse {
	private static _instance: BlockWarehouse

	private constructor() {}

	static get instance() {
		if (!this._instance) {
			this._instance = new BlockWarehouse()
		}
		return this._instance
	}

	private _hypers: HyperAgreer[] = reactive([])

	get hypers() {
		return this._hypers
	}

	addHyper(hyper: HyperAgreer) {
		this._hypers.push(hyper)
	}

	removeHyper(hyper: HyperAgreer) {
		this._hypers.splice(this._hypers.indexOf(hyper), 1)
	}
}
