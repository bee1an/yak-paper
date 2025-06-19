export interface CRUD<T = unknown> {
	readonly data: T[]
	getLength(): number
	add(data: T): number
	addByIndex(data: T, index: number): number
	delete(data: T): boolean
	deleteByIndex(index: number): void
	getByIndex(index: number): T | undefined
}

export function createCRUD<T>() {
	class CRUDImpl implements CRUD<T> {
		_data: T[] = []

		get data() {
			return this._data
		}

		getLength() {
			return this.data.length
		}

		getByIndex(index: number) {
			return this.data[index]
		}

		add(data: T) {
			this.data.push(data)
			return this.data.length
		}

		addByIndex(data: T, index: number) {
			this.data.splice(index, 0, data)
			return this.data.length
		}

		delete(data: T) {
			const index = this.data.indexOf(data)
			if (index === -1) return false
			this.data.splice(index, 1)
			return true
		}

		deleteByIndex(index: number) {
			this.data.splice(index, 1)
		}
	}

	return new CRUDImpl()
}
