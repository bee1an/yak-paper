const NAMESPACE = 'p'

/**
 * @description 创建 BEM 命名空间
 * @param {string} block 块名
 * @example
 * ```js
 * const bem = createBem('button')
 * bem.value // 'p-button'
 * bem.b().value // 'p-button'
 * bem.element('icon').value // 'p-button__icon'
 * bem.modifier('disabled').value // 'p-button--disabled'
 * bem.element('icon').modifier('disabled').value // 'p-button__icon--disabled'
 * ```
 */
export class CreateBem {
	private _prefixName!: string

	static readonly blockSeparator = '-'
	static readonly elementSeparator = '__'
	static readonly modifierSeparator = '--'

	/**
	 * @description 得到 BEM 值, 并重置
	 */
	get value() {
		const value = this._prefixName
		this._reset()
		return value
	}

	constructor(
		private block: string,
		private namespace = NAMESPACE
	) {
		this._reset()
	}

	private _reset() {
		this._prefixName = `${this.namespace}${CreateBem.blockSeparator}${this.block}`
	}

	/**
	 * @description 添加块, 不传递这什么都不会发生
	 * @param blockSuffix 块名
	 */
	b(blockSuffix: string = '') {
		if (blockSuffix) {
			this._prefixName += `${CreateBem.blockSeparator}${blockSuffix}`
		}

		return this
	}

	/**
	 * @description 添加元素, 不传递会返回一个空的字符串
	 * @param element 元素名
	 */
	e(element: string | boolean = '') {
		if (!element) {
			this._prefixName = ''
			return this
		}

		this._prefixName += `${CreateBem.elementSeparator}${element}`
		return this
	}

	/**
	 * @description 添加修饰符, 不传递会返回一个空的字符串
	 * @param modifier 修饰符
	 */
	m(modifier: string | boolean = '') {
		if (!modifier) {
			this._prefixName = ''
			return this
		}

		this._prefixName += `${CreateBem.modifierSeparator}${modifier}`
		return this
	}
}
