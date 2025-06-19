/**
 * @description 发布订阅
 */

export class EventEmitter<T extends Record<string | symbol, any[]>> {
	protected _eventMap: Record<keyof T, Set<(...args: any[]) => void>> = {} as any

	/** 添加对应事件的监听函数 */
	on<K extends keyof T>(eventName: K, listener: (...args: T[K]) => void) {
		if (!this._eventMap[eventName]) {
			this._eventMap[eventName] = new Set()
		}
		this._eventMap[eventName].add(listener)
		return this
	}

	/** 监听函数在执行一次后不再执行 */
	once<K extends keyof T>(eventName: K, listener: (...args: T[K]) => void) {
		const fn = (...args: T[K]) => {
			listener(...args)
			this.off(eventName, fn)
		}
		this.on(eventName, fn)

		return this
	}

	/** 触发事件 */
	emit<K extends keyof T>(eventName: K, ...args: T[K]) {
		const listeners = this._eventMap[eventName]
		if (!listeners || listeners.size === 0) {
			return false
		}

		// 浅拷贝，防止在执行监听函数时，监听函数被删除导致foreach循环不到位
		Array.from(listeners).forEach((listener) => {
			listener(...args)
		})
		return true
	}

	/** 取消对应事件的监听 */
	off<K extends keyof T>(eventName: K, listener: (...args: T[K]) => void) {
		const listeners = this._eventMap[eventName]
		if (listeners && listeners.size > 0) {
			listeners.delete(listener)
		}
		return this
	}
}
