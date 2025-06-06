import { EventEmitter } from '@yak-paper/utils'
import { BlobHandler } from './blob-handler'
import { EnterHandler } from './enter-handler'
import type { SelectionManager } from '../../selection-manager'
import { DeleteHandler } from './delete-handler'

export type KeydownEvents = {
	newLine: [KeyboardEvent]
}

export class KeydownManager extends EventEmitter<KeydownEvents> {
	private _blobHandler: BlobHandler

	private _enterHandler: EnterHandler

	private _deleteHandler: DeleteHandler

	/**
	 * @param inject 依赖注入
	 */
	constructor(inject: { selectionManager: SelectionManager }) {
		super()

		this._blobHandler = new BlobHandler()

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this
		// 使用代理确保依赖统一
		this._enterHandler = new EnterHandler(
			new Proxy(
				{},
				{
					get(_, key) {
						return that[key as keyof typeof that] || inject[key as keyof typeof inject] || undefined
					}
				}
			) as KeydownManager & typeof inject
		)

		this._deleteHandler = new DeleteHandler()

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
