import { ref } from 'vue'
import { Colleague } from '../paper/colleague'

interface SugguestOption {
	id: string
	value: string[]
}

export class CmdBoardManager extends Colleague {
	static readonly suggestList: SugguestOption[] = [
		{
			id: 'text',
			value: ['text']
		},
		{
			id: 'list',
			value: ['list']
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
	} | null = null
	recordRangeOption() {
		const range = this._mediator.notify(this, 'public:getRange')

		if (!range) return

		this._rangeOption = {
			container: range.startContainer,
			offset: range.startOffset,
			data: range.startContainer.textContent!
		}
	}

	noSuggestTimes = 0
	handle() {
		const focusNode = this._mediator.notify(this, 'public:findEditableElement')!

		const text = focusNode.textContent!

		const { offset, container } = this._rangeOption!

		if (text.length < offset || container !== focusNode) {
			this.exit()
			return
		}

		const command = text.slice(offset, text.length)

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

	exit() {
		this.active = false
		this._rangeOption = null
		this.noSuggestTimes = 0
		this.suggestions = []
	}
}
