import { EventEmitter } from '@yak-paper/utils'
import { EditableKeydownBlobHandler } from './editable-keydown-blob-handler'
import { EditableKeydownEnterHandler } from './editable-keydown-enter-handler'

export type EditableKeydownEvents = {
	enter: [KeyboardEvent]
}

export class EditableWhenKeydown {
	private static _instance: EditableWhenKeydown

	eventBus = new EventEmitter<EditableKeydownEvents>()

	private _blobHandler: EditableKeydownBlobHandler

	private _enterHandler: EditableKeydownEnterHandler

	private constructor() {
		this._blobHandler = new EditableKeydownBlobHandler(this.eventBus)
		this._enterHandler = new EditableKeydownEnterHandler(this.eventBus)

		this._blobHandler.setNext(this._enterHandler)

		this.handle = this.handle.bind(this)
	}

	static get instance() {
		if (!this._instance) {
			this._instance = new EditableWhenKeydown()
		}
		return this._instance
	}

	handle(event: KeyboardEvent) {
		this._blobHandler.handle(event)
	}
}
