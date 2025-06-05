import { onUnmounted, reactive } from 'vue'
import { createCRUD, type TextBlock } from 'yak-paper'

interface AdapterType {
	id: string
	type: string
	block?: TextBlock
}

export class BlockAdapter implements AdapterType {
	private _block?: TextBlock
	get block(): TextBlock | undefined {
		return this._block
	}

	constructor(
		public id: string,
		public type: string
	) {}

	install(block: TextBlock) {
		this._block = block
		onUnmounted(() => this.uninstall())
	}

	uninstall() {
		store.delete(this)
	}
}

const _store = reactive(createCRUD<BlockAdapter>())

class StoreProxy {
	findById(id: string) {
		return _store.data.find((item) => item.id === id)
	}
}

export const _ = new StoreProxy()

export const store = new Proxy(_, {
	get(target, key) {
		if (key in _store) {
			return Reflect.get(_store, key)
		}

		return Reflect.get(target, key)
	}
}) as StoreProxy & typeof _store
