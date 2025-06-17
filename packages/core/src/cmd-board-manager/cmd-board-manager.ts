import { h, ref } from 'vue'
import { Colleague } from '../paper/colleague'
import type { MenuOption } from '@yyui/yy-ui'
import Text from './icons/Text.vue'
import List from './icons/List.vue'
import type { TypeName } from '@yak-paper/material'
import { isText } from 'yak-paper'
interface SugguestOption extends MenuOption {
	value: string[]
}

export const TRIGGER_COMMAND_MODE_CHAR = '/'

export class CmdBoardManager extends Colleague {
	static readonly suggestList: SugguestOption[] = [
		{
			key: 'text',
			value: ['text'],
			label: '文本',
			icon: () => h(Text)
		},
		{
			key: 'list',
			value: ['list'],
			label: '列表',
			icon: () => h(List)
		}
	]

	private _active = ref(false)
	get active() {
		return this._active.value
	}
	set active(value: boolean) {
		this._active.value = value
	}

	_suggestions = ref<SugguestOption[]>([])
	get suggestions() {
		return this._suggestions.value
	}
	set suggestions(value: SugguestOption[]) {
		this._suggestions.value = value
	}

	private _rangeOption: {
		container: Node
		offset: number
		data: string
		cursorSite: { x: number; y: number }
	} | null = null
	get rangeOption() {
		return this._rangeOption
	}
	recordRangeOption() {
		const range = this._mediator.notify('public:selection:getRange')

		if (!range) return

		let text

		/**
		 * 如果当前焦点不在文本节点中，则插入一个占位符，用于获取光标位置
		 *
		 * 因为当焦点不在文本中时不能通过getBoundingClientRect获取到正确的光标位置
		 */
		if (!isText(range.startContainer)) {
			text = document.createTextNode('\u200b')
			range.insertNode(text)
		}

		const { x, y, height } = range.getBoundingClientRect()

		text?.remove()

		this._rangeOption = {
			container: range.startContainer!,
			offset: range.startOffset,
			data: range.startContainer.textContent!,
			cursorSite: { x, y: y + height + 5 }
		}
	}

	noSuggestTimes = 0
	handle() {
		const focusNode = this._mediator.notify('public:selection:findEditableElement')!

		const text = focusNode.textContent!

		const { offset } = this._rangeOption!

		if (text.length <= offset) {
			this.exit()
			return
		}

		const command = text.slice(offset, text.length).replace('/', '')

		if (command === '') {
			this.suggestions = [...CmdBoardManager.suggestList]
		} else {
			this.suggestions = CmdBoardManager.suggestList.filter((item) => {
				const { value } = item
				return value.find((str) => str.startsWith(command))
			})
		}

		// 无建议超过指定次数则退出
		if (this.noSuggestTimes > 5) {
			this.exit()
		}

		// 当前输入没有建议的话则记录一次
		if (this.suggestions.length === 0) {
			this.noSuggestTimes++
		} else {
			this.noSuggestTimes = 0
		}
	}

	async itemClickHandle(type: TypeName) {
		const id = this._mediator.notify('public:selection:findFocusedBlockId')!

		const section = this._mediator.notify('public:sections:findById', id)!

		const blockRaw = section.block!.toRaw()

		const { container, data } = this._rangeOption!
		container.textContent = data

		if (
			section.block!.isEmpty ||
			(blockRaw.formate!.length === 1 && blockRaw.formate![0].content === TRIGGER_COMMAND_MODE_CHAR)
		) {
			// 转换逻辑
			section.transformTo(type)
			this.exit()
			section.tryFocus()
			return
		}

		// 在下一行创建一个元素
		this._mediator.notify(
			'public:sections.creator:createNewLineByIndex',
			this._mediator.notify('public:sections:findIndexById', id) + 1,
			{ type }
		)
		this.exit()
	}

	exit() {
		this.active = false
		this._rangeOption = null
		this.noSuggestTimes = 0
		this.suggestions = []
	}
}
