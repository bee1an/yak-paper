import { onUnmounted, reactive } from 'vue'
import { createCRUD, type CRUD } from '@yak-paper/utils'
import type { BlockAgreer } from '@yak-paper/core'

interface AdapterType {
	id: string
	type: string
	block?: BlockAgreer
}

export class BlockAdapter implements AdapterType {
	private _block?: BlockAgreer
	get block(): BlockAgreer | undefined {
		return this._block
	}

	constructor(
		public id: string,
		public type: string
	) {}

	install(block: BlockAgreer) {
		this._block = block
		onUnmounted(() => this.uninstall())
	}

	uninstall() {
		store.delete(this)
	}
}

type StoreType = CRUD<BlockAdapter>

const _store = reactive(createCRUD<BlockAdapter>()) as StoreType

class StoreProxy {
	constructor(public store: StoreType) {}

	findById(id: string) {
		return this.store.data.find((item) => item.id === id)
	}

	findIndexById(id: string) {
		return this.store.data.findIndex((item) => item.id === id)
	}
}

export const store = new Proxy<StoreProxy>(new StoreProxy(_store), {
	get(target, key) {
		if (key in target.store) {
			return Reflect.get(target.store, key)
		}

		return Reflect.get(target, key)
	}
}) as StoreProxy & typeof _store
