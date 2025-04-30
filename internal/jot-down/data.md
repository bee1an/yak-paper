# 协议

用于渲染数据

## DataAgreer

数据协议

### DataAgreer.type

数据类型

## BlockAgreer

渲染协议

### BlockAgreer.type

渲染类型, 同数据类型

### BlockAgreer.tagName

标签名

### BlockAgreer.tagName

属性

### BlockAgreer.children

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
export interface BlockAgreer {
	type: string

	tagName: string

	attr: Record<string, any>

	children?: MaybeArray<Pick<BlockAgreer, 'tagName' | 'props' | 'children'> | string | null>
}
```
