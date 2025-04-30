import type { BlockAgreer } from '@yak-paper/core'
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

	private _blocks: BlockAgreer[] = reactive([])

	get blocks() {
		return this._blocks
	}

	addBlock(block: BlockAgreer) {
		this._blocks.push(block)
	}

	removeBlock(block: BlockAgreer) {
		this._blocks.splice(this._blocks.indexOf(block), 1)
	}
}
