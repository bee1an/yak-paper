import { EditableKeydownBlobHandler } from './editable-keydown-blob-handler'
import { EditableKeydownEnterHandler } from './editable-keydown-enter-handler'

const blobHandler = new EditableKeydownBlobHandler()
const enterHandler = new EditableKeydownEnterHandler()

blobHandler.setNext(enterHandler)

export const editableWhenKeydown = (event: KeyboardEvent) => {
	blobHandler.handle(event)
}
