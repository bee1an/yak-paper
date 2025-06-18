import { Section, type SectionOption } from '@yak-paper/core'
import { createId } from '@yak-paper/utils'
import { nextTick } from 'vue'
import { Colleague } from '../paper/colleague'

export interface AbstractCreator {
	addSectionToStoreByIndex(index: number, option?: Partial<SectionOption>): void

	createNewLineByIndex(index: number, option?: Partial<SectionOption>): void
}

export class Creator extends Colleague implements AbstractCreator {
	addSectionToStoreByIndex(index: number, option?: Partial<SectionOption>) {
		const block = new Section(Object.assign({ id: createId(), type: 'text' }, option))

		this._mediator.notify('public:sections:addByIndex', block, index)
		return block
	}

	async createNewLineByIndex(index: number, option?: Partial<SectionOption>) {
		const blockAdapter = this.addSectionToStoreByIndex(index, option)

		this._mediator.notify('public:sections:blurAll')

		await nextTick()

		const block = blockAdapter.block!

		blockAdapter.tryFocus()

		block.bus.on('click', () => this._mediator.notify('public:sections:blurAll'))
	}
}
