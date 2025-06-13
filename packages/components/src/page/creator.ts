import type { Paper } from '@yak-paper/core'
import { BlockAdapter, type Store } from '../../store'
import { createId } from '@yak-paper/utils'
import { nextTick } from 'vue'

export class Creator {
	private static _instance: Creator | null = null
	static getInstance(paper: Paper, store: Store) {
		if (!Creator._instance) {
			Creator._instance = new Creator(paper, store)
		}
		return Creator._instance
	}

	constructor(
		private _paper: Paper,
		private _store: Store
	) {}

	// TODO: 不放这里
	_blur() {
		this._store.data.forEach((item) => item.block?.blur?.())
	}

	addBlockToStoreByIndex(index: number): BlockAdapter
	addBlockToStoreByIndex(index: number) {
		const block = new BlockAdapter(createId(), 'text', {})

		this._store.addByIndex(block, index)
		return block
	}

	async createNewLineByIndex(index: number) {
		const blockAdapter = this.addBlockToStoreByIndex(index)

		this._blur()

		await nextTick()

		const block = blockAdapter.block!

		block.focus?.(this._paper.selectionManager)

		// block.bus.on('click', () => {
		// 	everyBlur()
		// })
	}
}
