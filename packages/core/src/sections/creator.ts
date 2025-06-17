import { Section, type Paper, type SectionOption, type Sections } from '@yak-paper/core'
import { createId } from '@yak-paper/utils'
import { nextTick } from 'vue'

export interface AbstractCreator {
	createNewLineByIndex(index: number, option?: Partial<SectionOption>): void
}

export class Creator implements AbstractCreator {
	private static _instance: Creator | null = null
	static getInstance(paper: Paper) {
		if (!Creator._instance) {
			Creator._instance = new Creator(paper, paper.sections)
		}
		return Creator._instance
	}

	constructor(
		private _paper: Paper,
		private _sections: Sections
	) {}

	private _addBlockToStoreByIndex(index: number, option: SectionOption) {
		const block = new Section(option)

		this._sections.addByIndex(block, index)
		return block
	}

	async createNewLineByIndex(index: number, option?: Partial<SectionOption>) {
		const blockAdapter = this._addBlockToStoreByIndex(
			index,
			Object.assign({ id: createId(), type: 'text' }, option)
		)

		this._sections.blurAll()

		await nextTick()

		const block = blockAdapter.block!

		blockAdapter.tryFocus()

		block.bus.on('click', () => this._sections.blurAll())
	}
}
