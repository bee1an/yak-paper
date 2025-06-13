import type { TypeName } from '@yak-paper/material'
import type { InputManager, KeydownManager } from '../event-manager'
import type { Section, SectionOption } from '../sections'

export type InputManagerNotifyEvents = {
	/** 跟新命令面板 */
	cmdUpdate(event: InputEvent): any
	/** 记录当前range信息 */
	cmdRecordRange(): any
}

export type KeydownManagerNotifyEvents = {}

/**
 * @description 暴露给外部的公共notify事件
 *
 * 命名规则
 * '$1:$2:$3'
 * $1: 统一前缀
 * [$2]: 模块名称, 如果有manager后缀则去掉manager
 * 	如果是模块内的聚合模块则使用.分开
 * $3: 事件名称
 *
 * 当这个事件是模块内事件时, 则$3需要跟模块内事件名一致且$2不能忽略
 */
export type PublicNotifyEvent = {
	/** 获取当前焦点所在元素 */
	'public:selection:findEditableElement'(): HTMLElement | null
	/** 获取range对象 */
	'public:selection:getRange'(): Range | null
	/** 获取输入法状态 */
	'public:getInputCompositionState'(): boolean
	/** 获取命令面板状态 */
	'public:cmdBoardIsActive'(): boolean
	/** 设置命令面板状态 */
	'public:setCmdBoardActive'(): void
	/** 获取当前焦点所在块元素 */
	'public:selection:findFocusedBlock'(): HTMLElement | null
	/** 获取当前焦点所在块元素id */
	'public:selection:findFocusedBlockId'(): string | null | undefined
	/** 根据id获取段落 */
	'public:sections:findById'(id: string): Section<TypeName> | undefined
	/** 根据id创建新的一行 */
	'public:sections.creator:createNewLineByIndex'(
		index: number,
		option?: Partial<SectionOption>
	): Promise<void>
	/** 根据id获取行索引 */
	'public:sections:findIndexById'(id: string): number
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

	notify<K extends keyof PublicNotifyEvent>(
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
