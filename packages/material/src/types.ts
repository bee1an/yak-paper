import type { ListBlock, ListBlockOption, TextBlock, TextBlockOption } from '@yak-paper/material'

export type TypeName = 'text' | 'list'

export type TypeToBlockMap = {
	text: TextBlock
	list: ListBlock
}

export type TypeToBlockOption = {
	text: TextBlockOption
	list: ListBlockOption
}
