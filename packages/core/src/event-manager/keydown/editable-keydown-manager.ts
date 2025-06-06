import { EventEmitter } from '@yak-paper/utils'
import { EditableKeydownBlobHandler } from './editable-keydown-blob-handler'
import { EditableKeydownEnterHandler } from './editable-keydown-enter-handler'
import type { SelectionManager } from '../../selection-manager'
import { EditableKeydownDeleteHandler } from './editable-keydown-delete-handler'

export type EditableKeydownEvents = {
	newLine: [KeyboardEvent]
}

export class EditableKeydownManager extends EventEmitter<EditableKeydownEvents> {
	private _blobHandler: EditableKeydownBlobHandler

	private _enterHandler: EditableKeydownEnterHandler

	private _deleteHandler: EditableKeydownDeleteHandler

	/**
	 * @param inject 依赖注入
	 */
	constructor(inject: { selectionManager: SelectionManager }) {
		super()

		this._blobHandler = new EditableKeydownBlobHandler()

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this
		// 使用代理确保依赖统一
		this._enterHandler = new EditableKeydownEnterHandler(
			new Proxy(
				{},
				{
					get(_, key) {
						return that[key as keyof typeof that] || inject[key as keyof typeof inject] || undefined
					}
				}
			) as EditableKeydownManager & typeof inject
		)

		this._deleteHandler = new EditableKeydownDeleteHandler()

		this._setChain()
	}

	private _setChain() {
		this._blobHandler.setNext(this._enterHandler).setNext(this._deleteHandler)
		this.handle = this.handle.bind(this)
	}

	handle(event: KeyboardEvent) {
		this._blobHandler.handle(event)
	}
}
