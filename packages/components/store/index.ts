import { onUnmounted, reactive } from 'vue'
import { createCRUD, type CRUD } from '@yak-paper/utils'
import { type TypeName, type TypeToBlockMap, type TypeToBlockOption } from '@yak-paper/material'

type AdapterType<T extends TypeName> = {
	id: string
	type: string
	blockOption: TypeToBlockOption[T]
	block?: TypeToBlockMap[T]
}

export class BlockAdapter<T extends TypeName = TypeName> implements AdapterType<T> {
	typeEqualTo<K extends TypeName>(expectType: K): this is BlockAdapter<K> {
		return this.type === (expectType as TypeName)
	}

	private _block?: TypeToBlockMap[T]
	get block(): TypeToBlockMap[T] | undefined {
		return this._block
	}

	get blockOption(): TypeToBlockOption[T] {
		return this._blockOption
	}

	constructor(
		public id: string,
		public type: T,
		private _blockOption: TypeToBlockOption[T]
	) {}

	install(block: TypeToBlockMap[TypeName]) {
		this._block = block as TypeToBlockMap[T]
		onUnmounted(() => this.uninstall())
	}

	uninstall() {
		store.delete(this)
	}
}

type StoreType = CRUD<BlockAdapter>

const _store = reactive(createCRUD<BlockAdapter>()) as unknown as StoreType

class StoreProxy {
	constructor(public store: StoreType) {}

	findById(id: string) {
		return this.store.data.find((item) => item.id === id)
	}

	findIndexById(id: string) {
		return this.store.data.findIndex((item) => item.id === id)
	}
}

export type Store = StoreProxy & typeof _store

export const store = new Proxy<StoreProxy>(new StoreProxy(_store), {
	get(target, key) {
		if (key in target.store) {
			return Reflect.get(target.store, key)
		}

		return Reflect.get(target, key)
	}
}) as StoreProxy & typeof _store
