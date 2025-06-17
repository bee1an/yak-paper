import { reactive, nextTick } from 'vue'
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

	/** 失焦所有 */
	blurAll() {
		this.store.data.forEach((item) => item.block?.blur?.())
	}

	/** 根据id查找元素 */
	findById(id: string): Section<TypeName> | undefined {
		return this.store.data.find((item) => item.id === id)
	}

	/** 根据id查找元素索引 */
	findIndexById(id: string): number {
		return this.store.data.findIndex((item) => item.id === id)
	}

	/** 根据当前焦点查找元素 */
	findByFocused(): Section<TypeName> | undefined {
		const id = this._mediator.notify('public:selection:findFocusedBlockId')

		if (!id) return

		return this.findById(id)
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

	updated = false

	constructor(private _sectionOption: SectionOption<T>) {
		this.id = _sectionOption.id
		this.type = _sectionOption.type
	}

	transformTo(toType: TypeName) {
		this.type = toType as any
		this._sectionOption = Object.assign(this._block!.toRaw(), { id: this.id }) as any
		this.updated = false
	}

	async tryFocus() {
		if (!this._block || !this.updated) await nextTick()
		this._block!.focus?.()
	}

	install(block: TypeToBlockMap[TypeName]) {
		this._block = block as TypeToBlockMap[T]
		this.updated = true
	}

	uninstall() {
		sections.delete(this)
	}
}
