import { EventEmitter } from '@yak-paper/utils'
import { BlobHandler } from './blob-handler'
import { EnterHandler } from './enter-handler'
import { DeleteHandler } from './delete-handler'
import { Colleague, type PaperMediator } from '../../paper/colleague'

export type KeydownEvents = {
	newLine: [blockId: string, KeyboardEvent]
}

export class KeydownManager extends Colleague {
	private _blobHandler: BlobHandler

	private _enterHandler: EnterHandler

	private _deleteHandler: DeleteHandler

	bus = new EventEmitter<KeydownEvents>()

	on(...rest: Parameters<EventEmitter<KeydownEvents>['on']>) {
		return this.bus.on.bind(this.bus)(...rest)
	}

	constructor(_?: PaperMediator) {
		super(_)

		this._blobHandler = new BlobHandler()

		const _emit = this.bus.emit.bind(this.bus)

		this._enterHandler = new EnterHandler(_emit)

		this._deleteHandler = new DeleteHandler()

		this._blobHandler.setNext(this._enterHandler).setNext(this._deleteHandler)

		this.handle = this.handle.bind(this)
	}

	setMediator(mediator: PaperMediator) {
		super.setMediator(mediator)
		this._enterHandler.setNotify((eventName: any, ...args: any[]) =>
			mediator.notify(this, eventName, ...args)
		)
	}

	handle(event: KeyboardEvent) {
		this._blobHandler.handle(event)
	}
}
