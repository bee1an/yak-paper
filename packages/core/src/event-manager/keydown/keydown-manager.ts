import { BlobHandler } from './blob-handler'
import { EnterHandler } from './enter-handler'
import { DeleteHandler } from './delete-handler'
import { Colleague, type PaperMediator } from '../../paper/colleague'

export class KeydownManager extends Colleague {
	private _blobHandler: BlobHandler

	private _enterHandler: EnterHandler

	private _deleteHandler: DeleteHandler

	constructor(_?: PaperMediator) {
		super(_)

		this._blobHandler = new BlobHandler()

		this._enterHandler = new EnterHandler()

		this._deleteHandler = new DeleteHandler()

		this._blobHandler.setNext(this._enterHandler).setNext(this._deleteHandler)

		this.handle = this.handle.bind(this)
	}

	setMediator(mediator: PaperMediator) {
		super.setMediator(mediator)
		const notifyHandle = (eventName: any, ...args: any[]) =>
			mediator.notify(this, eventName, ...args)

		this._enterHandler.setNotify(notifyHandle)
		this._deleteHandler.setNotify(notifyHandle)
	}

	handle(event: KeyboardEvent) {
		this._blobHandler.handle(event)
	}
}
