# 协议

用于渲染数据

## DataAgreer

数据协议

### DataAgreer.type

数据类型

## RenderAgreer

渲染协议

### RenderAgreer.type

渲染类型, 同数据类型

### RenderAgreer.tagName

标签名

### RenderAgreer.tagName

属性

### RenderAgreer.children

子节点

## 示例

```ts
/**
 * @description 数据协议, 所有物料的数据都需要实现这个协议
 */
export interface DataAgreer {
	/**
	 * @description 物料类型
	 */
	type: string
}

/**
 * @description 渲染协议, 所有物料的渲染都需要实现这个协议
 */
export interface RenderAgreer {
	type: string

	tagName: string

	attr: Record<string, any>

	children?: MaybeArray<Omit<RenderAgreer, 'type'> | string | null>
}
```
