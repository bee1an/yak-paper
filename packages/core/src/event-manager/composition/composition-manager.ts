import { Colleague } from '@yak-paper/core/src/paper'

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
