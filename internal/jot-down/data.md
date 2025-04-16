# 数据协议

构建物料数据(DataAgreer)

## DataAgreer.type

数据类型, 可以判断是否是内置物料

<!-- ## DataAgreer.renderer?

渲染器, 当物料是外置的时候, 需要渲染器, 不传递则会使用内置渲染器 -->

## 示例

```ts
/**
 * @description 数据协议, 所有物料需要实现这个协议
 */

export interface DataAgreer {
	/**
	 * @description 物料类型
	 */
	type: string
}
```
