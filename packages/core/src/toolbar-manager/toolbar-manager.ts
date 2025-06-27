import { reactive, ref } from 'vue'
import { Colleague } from '../paper/colleague'
import { type FormatType } from '../formater'
import { eachBreakable } from '@yak-paper/utils'

interface TriggerContext {
	/** x位置 */
	x: number
	/** y位置 */
	y: number

	activeTypes: FormatType[]
}

export class ToolbarManager extends Colleague {
	private _visible = ref(false)
	get visible() {
		return this._visible.value
	}
	set visible(value: boolean) {
		this._visible.value = value
	}

	triggerContext: TriggerContext = reactive({ x: 0, y: 0, activeTypes: [] })

	updateTriggerContext(range: Range) {
		const {
			selectedNodes,
			specialRange: { isInNode, node }
		} = this._mediator.notify('public:selection:getRangeSelectContext')!

		if (isInNode) selectedNodes.splice(0, 1, node!)

		let activeTypes: FormatType[] = ['bold', 'italic', 'underline']

		eachBreakable(selectedNodes.flat(3), (node) => {
			const raw = this._mediator.notify('public:formater:node2raw', node)

			if (!raw) return

			if (typeof raw === 'string' || typeof raw.type === 'string') {
				activeTypes = []
				return true
			}

			if (!raw.type.includes('bold'))
				activeTypes = activeTypes.filter((active) => active !== 'bold')
			if (!raw.type.includes('underline'))
				activeTypes = activeTypes.filter((active) => active !== 'underline')
			if (!raw.type.includes('italic'))
				activeTypes = activeTypes.filter((active) => active !== 'italic')
		})

		const { x, y } = range.getBoundingClientRect()

		Object.assign(this.triggerContext, { x, y, activeTypes })
	}

	tryShow() {
		const range = this._mediator.notify('public:selection:getRange')

		if (!range || range.collapsed) {
			this.visible = false
			return
		}

		this.updateTriggerContext(range)

		this.visible = true
	}

	itemClickHandle(type: FormatType, deformat?: boolean) {
		const { cross, contentSelected } = this._mediator.notify('public:selection:lastSelectContext')!

		cross
			? this._mediator.notify('public:formater:crossBlockFormat', type, contentSelected, deformat)
			: this._mediator.notify('public:formater:sameBlockFormat', type, contentSelected, deformat)

		this.updateTriggerContext(this._mediator.notify('public:selection:getRange')!)
	}
}
