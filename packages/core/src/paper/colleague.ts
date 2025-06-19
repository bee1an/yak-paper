import type { TypeName } from '@yak-paper/material'
import type { BeforeinputManager, InputManager, KeydownManager } from '../event-manager'
import type { Section, SectionOption } from '../sections'
import type { InputNotifyEvents } from './input-notify-handler'
import type { KeydownNotifyEvents } from './keydown-notify-handler'
import type { BeforeinputNotifyEvents } from './beforeinput-notify-handler'
import type { FormatType } from '../formater'

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
	/** 获取当前焦点所在元素 */
	'public:selection:findEditableElement'(): HTMLElement | null
	/** 获取range对象 */
	'public:selection:getRange'(): Range | null

	/** 根据id获取段落 */
	'public:sections:findById'(id: string): Section<TypeName> | undefined
	/** 根据id获取行索引 */
	'public:sections:findIndexById'(id: string): number
	/** 找到当前聚焦的section */
	'public:sections:findByFocused'(): Section<TypeName> | undefined
	/** 根据id删除section */
	'public:sections:deleteByIndex'(index: number): void
	/** 获取sections长度 */
	'public:sections:getLength'(): number
	/** 根据id获取section */
	'public:sections:getByIndex'(index: number): Section<TypeName> | undefined
	/** 根据id添加 */
	'public:sections:addByIndex'(
		section: Section<TypeName>,
		index: number
	): Section<TypeName> | undefined
	/** 失焦所有 */
	'public:sections:blurAll'(): void

	/** 根据id创建新的一行 */
	'public:creator:createNewLineByIndex'(
		index: number,
		option?: Partial<SectionOption>
	): Promise<void>

	/** 格式化选中的元素 */
	'public:formater:formatSelect'(type: FormatType): void
}

export interface PaperMediator {
	notify<T extends InputManager, K extends keyof InputNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<InputNotifyEvents[K]>
	): ReturnType<InputNotifyEvents[K]>

	notify<T extends KeydownManager, K extends keyof KeydownNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<KeydownNotifyEvents[K]>
	): ReturnType<KeydownNotifyEvents[K]>

	notify<T extends BeforeinputManager, K extends keyof BeforeinputNotifyEvents>(
		s: T,
		event: K,
		...args: Parameters<BeforeinputNotifyEvents[K]>
	): ReturnType<BeforeinputNotifyEvents[K]>

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
