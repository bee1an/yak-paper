# 数据转换

反序列化: json -> BlockData(渲染数据) -> dom(VNode)

序列化: dom -> json

## 原则

物料的包装容器**始终不变**, 可定制的是 `children`

所以我们只需要可定制的内容

## 反序列化

### 1. json -> BlockData

基于物料包装容器始终不变原则, 每个物料都可以定义一个渲染器

比如文字物料的渲染器 `TextBlock`

```ts
export class TextBlock implements BlockAgreer {
	readonly type = 'text'

	readonly tagName = 'div'

	// ...

	children: BlockAgreer['children'] = []

	constructor(private _rawData?: TextBlockAgreer) {
		// ...
	}
}
```

实例化这个渲染器时可以传递 `json`, 然后内部通过 `jsonDeserializer` 反序列化方法将 `json` 转换成 `BlockData`, 并保存这个渲染数据到 `children`. (遵循children可定制)

### 2. BlockData -> dom

这一步非常简单, `createVNode` 函数内部使用了 `Vue` 的 `h` 函数, 在将得到的 `VNode` 交予 `Vue` 进行渲染

## 序列化

### dom -> 基础数据

通过 `editableSerializer` 方法将 `editable`元素 转换成 `json`
