import type { DataAgreer } from '@yak-paper/core'
import { reactive } from 'vue'

export class PageWarehouse {
	private static _instance: PageWarehouse

	private constructor() {}

	static get instance() {
		if (!this._instance) {
			this._instance = new PageWarehouse()
		}
		return this._instance
	}

	private _blocks: DataAgreer[] = reactive([])
	get blocks() {
		return this._blocks
	}

	addBlock(hyper: DataAgreer) {
		this._blocks.push(hyper)
	}
}
