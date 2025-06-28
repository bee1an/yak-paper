import type { ImageBlock, ImageBlockOption } from './image'
import type { ListBlock, ListBlockOption } from './list'
import type { TextBlock, TextBlockOption } from './text'

export type TypeName = 'text' | 'list' | 'image'

export type TypeToBlockMap = {
	text: TextBlock
	list: ListBlock
	image: ImageBlock
}

export type TypeToBlockOption = {
	text: TextBlockOption
	list: ListBlockOption
	image: ImageBlockOption
}
