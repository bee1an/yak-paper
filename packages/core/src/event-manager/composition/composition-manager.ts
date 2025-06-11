import { Colleague } from '../../paper/colleague'

export class CompositionManager extends Colleague {
	inputting = false

	onStart() {
		this.inputting = true
	}

	onEnd() {
		this.inputting = false
	}

	handle() {}
}
