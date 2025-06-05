export interface CRUD<T = unknown> {
	readonly data: T[]
	add(data: T): number
	delete(data: T): boolean
}

export function createCRUD<T>() {
	class CRUDImpl implements CRUD<T> {
		_data: T[] = []

		get data() {
			return this._data
		}

		add(data: T) {
			this.data.push(data)
			return this.data.length
		}

		delete(data: T) {
			const index = this.data.indexOf(data)
			if (index === -1) return false
			this.data.splice(index, 1)
			return true
		}
	}

	return new CRUDImpl()
}
