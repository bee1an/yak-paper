# 零零散散的内容

这里的内容不好分类, 或者懒得分类

## 怎么显示placeholder

div不支持`placeholder`, 即使将`contenteditable`设置为`true`, 也不支持`placeholder`

使用伪类元素来**模拟**`placeholder`

```html
<div data-placeholder="placeholder"></div>

<style>
	div[data-placeholder]:empty::before {
		/* 通过attr获取自定义属性 */
		content: attr(data-placeholder);
	}
</style>
```

## `contenteditable` 元素输入为空时自动出现 \<br/>

目前的处理方式是监听输入, 当输入为空时, 将内容设置为''

```ts
if (target.textContent === '') {
	// 置空防止出现<br>
	target.textContent = ''
}
```
