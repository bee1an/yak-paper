import { onUnmounted, reactive } from 'vue'
import { createCRUD, type CRUD } from '@yak-paper/utils'
import { type TypeName, type TypeToBlockMap, type TypeToBlockOption } from '@yak-paper/material'
import { Colleague } from '../paper/colleague'
import { type AbstractCreator } from './creator'

const _sections = reactive(createCRUD<Section>()) as unknown as CRUD<Section>

class SectionsProxy extends Colleague {
	creator!: AbstractCreator
	setCreator(creator: AbstractCreator) {
		this.creator = creator
	}

	constructor(public store: CRUD<Section>) {
		super()
	}

	blurAll() {
		this.store.data.forEach((item) => item.block?.blur?.())
	}

	findById(id: string): Section<TypeName> | undefined {
		return this.store.data.find((item) => item.id === id)
	}

	findIndexById(id: string): number {
		return this.store.data.findIndex((item) => item.id === id)
	}
}

export type Sections = SectionsProxy & typeof _sections

export const sections = new Proxy<SectionsProxy>(new SectionsProxy(_sections), {
	get(target, key) {
		if (key in target.store) {
			return Reflect.get(target.store, key)
		}

		return Reflect.get(target, key)
	}
}) as SectionsProxy & typeof _sections

export type SectionOption<T extends TypeName = TypeName> = TypeToBlockOption[T] & {
	id: string
} & {
	type: T
}

type AbstractSection<T extends TypeName> = {
	id: string
	type: string
	blockOption: SectionOption<T>
	block?: TypeToBlockMap[T]
}

export class Section<T extends TypeName = TypeName> implements AbstractSection<T> {
	typeEqualTo<K extends TypeName>(expectType: K): this is Section<K> {
		return this.type === (expectType as TypeName)
	}

	private _block?: TypeToBlockMap[T]
	get block(): TypeToBlockMap[T] | undefined {
		return this._block
	}

	get blockOption(): SectionOption<T> {
		return this._sectionOption
	}

	id: string

	type: T

	constructor(private _sectionOption: SectionOption<T>) {
		this.id = _sectionOption.id
		this.type = _sectionOption.type
	}

	install(block: TypeToBlockMap[TypeName]) {
		this._block = block as TypeToBlockMap[T]
		onUnmounted(() => this.uninstall())
	}

	uninstall() {
		sections.delete(this)
	}
}
