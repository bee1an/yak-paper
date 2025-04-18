# 键盘事件的处理方式

使用了[责任链模式](https://bee1an.github.io/yak-note/src/design-pattern/chain-of-responsibility-pattern.html)来处理键盘事件

## 可编辑元素的键盘事件处理方式

基本上就是完全使用了责任链模式

通过匹配拦截当前键盘事件是否需要处理

比如当我们按下 `Enter` 时

`EditableKeydownBlobHandler` 类(选中加粗)会拦截到这个请求, 判断这个请求自己是否能处理, 不能处理则交给下一个处理器处理, 直到 `EditableKeydownEnterHandler` 类拦截到了这个请求

## Document 元素的 `keydown` 事件

使用 `DocumentKeydownBinder` 来管理 `keydown` 事件, 单例模式, 确保只会创建一个 `DocumentKeydownBinder` 实例, 因为 `Document` 元素只有一个

### DocumentKeydownBinder.bind(arg1, [arg2])

给`keydown`添加一个处理器

#### arg1

参数中必须包含以下属性

```ts
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
```

并且这里也使用了责任链模式, 当有一个触发条件满足时, 后续将不会执行其他处理程序

#### arg2: boolean

可以将这个处理器插到最前面

所有的处理器都是有序的, 所以当两个处理器的处理条件相同时, 会执行第一个处理器, 第二个处理器则不会执行, 如果想要执行第二个处理器, 则需要将第二个处理器插队到第一个处理器的前面

### DocumentKeydownBinder.unbind(arg1)

解绑一个处理器

### DocumentKeydownBinder.destroy()

销毁这个绑定器, 如果不想在组件声明周期外还触发 `keydown` 事件, 则需要在组件销毁时调用此方法
