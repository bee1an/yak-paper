import type { AnyFn } from '@yak-paper/utils'

interface DocumentKeydownBindOption {
	/**
	 * @description 触发条件
	 */
	when: (event: KeyboardEvent) => boolean
	/**
	 * @description 事件处理函数
	 */
	action: AnyFn
}

export class DocumentKeydownManager {
	private static instance: DocumentKeydownManager | null = null

	/**
	 * @description 获取 DocumentKeydownManager 类的单例实例
	 *
	 * 实现单例模式的核心方法，当实例不存在时创建新实例，
	 * 保证整个应用生命周期中只存在一个实例对象
	 *
	 * @static
	 * @returns {DocumentKeydownManager} 返回 DocumentKeydownManager 类的单例实例
	 */
	static getInstance(): DocumentKeydownManager {
		// 单例检查：当实例不存在时初始化新实例
		if (!this.instance) {
			this.instance = new DocumentKeydownManager()
		}
		return this.instance
	}

	private _keySet: Set<DocumentKeydownBindOption> = new Set()

	private _boundHandler: ((e: KeyboardEvent) => void) | null = null

	private constructor() {
		this._bindDocumentKeydown()
	}

	private _bindDocumentKeydown() {
		this._boundHandler = this._whenDocumentKeydown.bind(this)
		document.addEventListener('keydown', this._boundHandler)
	}

	/**
	 * @description 处理文档全局键盘事件的核心逻辑
	 *
	 * @param e - 键盘事件对象，包含按键信息、修饰键状态等元数据。
	 *
	 * @remarks
	 * 实现机制：
	 * 1. 遍历预注册的键盘事件处理器集合（_keyMap）
	 * 2. 对每个处理器执行条件判断（when() 方法）
	 * 3. 首个满足条件的处理器将触发对应动作（action() 方法）
	 * 4. 采用短路逻辑，匹配成功后立即终止后续处理
	 */
	private _whenDocumentKeydown(e: KeyboardEvent) {
		// 顺序遍历所有注册的键盘事件处理器
		for (const element of this._keySet) {
			// 执行条件判断，检测当前按键组合是否匹配
			if (element.when(e)) {
				// 触发匹配成功的处理器动作，并传递原始事件对象
				try {
					element.action(e)
				} catch (error) {
					console.error('[DocumentKeydownManager] Action execution failed:', error)
				}
				// 短路逻辑：首个匹配成功后终止后续处理
				break
			}
		}
	}

	/**
	 *@description  绑定选项到键映射集合，支持按优先级插入
	 *
	 * @param option - 需要绑定的键盘配置选项对象（BindOption 类型）
	 * @param HighPrior - 是否高优先级插入（默认false）
	 */
	bind(option: DocumentKeydownBindOption, HighPrior = false) {
		// 处理高优先级插入逻辑：创建新集合并将当前选项置于最前
		if (HighPrior) {
			this._keySet = new Set([option, ...this._keySet])
		}

		// 常规插入逻辑：将选项追加到集合末尾
		else {
			this._keySet.add(option)
		}
	}

	/**
	 * @description 从键映射中移除指定的绑定配置
	 *
	 * @param option - 需要解除绑定的配置选项对象，该对象应包含绑定相关的元数据信息，
	 */
	unbind(option: DocumentKeydownBindOption) {
		this._keySet.delete(option)
	}

	/**
	 * @description 销毁当前实例并清理相关资源
	 *
	 * 1. 移除键盘事件监听防止内存泄漏
	 * 2. 重置按键映射集合
	 * 3. 清除单例实例引用
	 */
	destroy() {
		if (this._boundHandler) {
			document.removeEventListener('keydown', this._boundHandler)
			this._boundHandler = null
		}

		this._keySet = new Set()

		DocumentKeydownManager.instance = null
	}
}
