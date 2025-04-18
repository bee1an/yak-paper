import { EditableKeydownEnterHandler } from './editable-keydown-enter-handler'

const enterHandler = new EditableKeydownEnterHandler()

export const editableWhenKeydown = (event: KeyboardEvent) => {
	enterHandler.handle(event)
}
