# 协议

用于渲染数据

## DataAgreer

数据协议

### DataAgreer.type

数据类型

## HyperAgreer

渲染协议

### HyperAgreer.type

渲染类型, 同数据类型

### HyperAgreer.tagName

标签名

### HyperAgreer.tagName

属性

### HyperAgreer.children

子节点

## 示例

```ts
/**
 * 数据协议, 所有物料的数据都需要实现这个协议
 */
export interface DataAgreer {
	/**
	 * 物料类型
	 */
	type: string
}

/**
 * 渲染协议, 所有物料的渲染都需要实现这个协议
 */
export interface HyperAgreer {
	type: string

	tagName: string

	attr: Record<string, any>

	children?: MaybeArray<Pick<HyperAgreer, 'tagName' | 'props' | 'children'> | string | null>
}
```
