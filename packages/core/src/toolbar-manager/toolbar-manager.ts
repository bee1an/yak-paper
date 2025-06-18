import { Colleague } from '../paper/colleague'

export class ToolbarManager extends Colleague {
	visible = false

	show() {
		this.visible = true
	}
}
