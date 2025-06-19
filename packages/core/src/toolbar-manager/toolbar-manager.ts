import { reactive, ref } from 'vue'
import { Colleague } from '../paper/colleague'
import { formatType, type FormatType } from '../formater'

export class ToolbarManager extends Colleague {
	private _visible = ref(false)
	get visible() {
		return this._visible.value
	}
	set visible(value: boolean) {
		this._visible.value = value
	}

	triggerSite: { x: number; y: number } = reactive({ x: 0, y: 0 })

	tryShow() {
		const range = this._mediator.notify('public:selection:getRange')

		if (!range || range.collapsed) {
			this.visible = false
			return
		}

		const { x, y } = range.getBoundingClientRect()

		Object.assign(this.triggerSite, { x, y })
		this.visible = true
	}

	itemClickHandle(type: FormatType) {
		if (formatType.includes(type)) {
			this._mediator.notify('public:formater:formatSelect', type)
		}
	}
}
