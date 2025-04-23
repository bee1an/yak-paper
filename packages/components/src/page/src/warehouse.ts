import type { DataAgreer } from '@yak-paper/core'
import { reactive } from 'vue'

export class Warehouse {
	private static _instance: Warehouse

	private constructor() {}

	static get instance() {
		if (!this._instance) {
			this._instance = new Warehouse()
		}
		return this._instance
	}

	private _blocks: DataAgreer[] = reactive([{ type: 'text' }])
	get blocks() {
		return this._blocks
	}

	addBlock(hyper: DataAgreer) {
		this._blocks.push(hyper)
	}
}
