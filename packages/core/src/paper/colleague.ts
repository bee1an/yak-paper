import type { InputManager, KeydownManager } from '../event-manager'
import type { SelectionManager } from '../selection-manager'

export type InputManagerNotifyEvents = {
	cmdUpdate(event: InputEvent): any
	cmdRecordRange(): any
}

export type KeydownManagerNotifyEvents = {}

export type PublicNotifyEvent = {
	'public:findEditableElement'(): ReturnType<SelectionManager['findEditableElement']>
	'public:getSelectionManager'(): SelectionManager
	'public:getRange'(): Range | null
	'public:getInputCompositionState'(): boolean
	'public:cmdBoardIsActive'(): boolean
	'public:setCmdBoardActive'(): void
}

export interface PaperMediator {
	notify<T extends InputManager, K extends keyof InputManagerNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<InputManagerNotifyEvents[K]>
	): ReturnType<InputManagerNotifyEvents[K]>
	notify<T extends KeydownManager, K extends keyof KeydownManagerNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<KeydownManagerNotifyEvents[K]>
	): ReturnType<KeydownManagerNotifyEvents[K]>

	notify<T, K extends keyof PublicNotifyEvent>(
		s: T,
		event: K,
		...args: Parameters<PublicNotifyEvent[K]>
	): ReturnType<PublicNotifyEvent[K]>
}

export abstract class Colleague {
	protected _mediator!: PaperMediator

	constructor(_mediator?: PaperMediator) {
		_mediator && this.setMediator(_mediator)
	}

	setMediator(mediator: PaperMediator) {
		this._mediator = mediator
	}
}
