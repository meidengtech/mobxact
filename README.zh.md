# Mobxact, 不会 rerender 的 react，为 mobx 设计

## 实验阶段警告

- **本项目目前处于实验阶段。用于生产项目请慎重考虑。**
- **本项目不是 React 的又一个实现，无法像 infernojs 等库那样直接用于替换 react** 请参考 [它不是 React！](#它不是-react)
  - 如果你有在 React 下做组件级更新的需求，可以试试 [yurijs](https://github.com/meidengtech/yurijs)
- 如果你在尝试中遇到问题，可以加 QQ 群[799934276](https://jq.qq.com/?_wv=1027&k=zLdnGrOH)

## 为什么搞这么个玩意

- React 依靠 rerender 刷新组件状态，这意味着我们编写大组件会遇到性能问题，意味着我们即使在 react 中使用 mobx，也得不到真正的 mvvm 双向绑定。
  - 我们之前在 [yurijs](https://github.com/meidengtech/yurijs)中尝试了组件级更新，但是有一定的额外开销和代价（children 的值无法被直接取到和处理，这影响了一部分功能组件如 Select 的使用），也无法实现属性级的绑定。
  - 与之不同，mobxact 不依靠 rerender 刷新状态，因此你可以自由的编写巨大的组件而无需担心 rerender 性能问题。
- React 太重了，让我们经常问自己，有必要吗……
  - mobxact 的 UMD 版本仅 7.65KB，es 版本更小。并且它还未在体积角度进行足够优化，未来有希望做到更小……
- React 的 Hooks 带来方便，也带来很多的误用、滥用。另一方面，被淘汰的 class 仍有许多人在使用，带来各类性能问题。
  - mobxact 几乎没有复杂的概念，开销，同样的范式下性能也远超 react，不论是否发生了 rerender

## 它不是 React！

- Mobxact 不是 React，无法直接替换现有代码。
- Mobx+React 通常通过 observer 触发组件的 rerender 以更新组件状态。而 Mobxact 截然不同：
  - 组件仅在 mount 的时候 render，因此大部分时候无需关心 rerender
    - 小心，这也意味着如果你在 computed value 中返回 JSX 主动导致其 rerender，其 DOM 会每次重新生成并挂载。
  - 仅有数组、文本内容、DOM 属性会被 update，主要依靠 mobx 的 observable/computed 来提供新的内容，没有 DOMDiff 阶段
  - 列表渲染时没有了 key 机制。依靠 Element 实例的对应关系来确定列表渲染的顺序变化。
  - 组件没有了绝大部分生命周期，因此也没有了 hook 机制。
- 当然，很多概念的移除不意味着很多功能无法实现，相反，因为没有 rerender 的担忧，大部分功能通过更简单直接的方法进行实现。
  - 请参阅 [为什么 mobxact 下你不再需要 hooks](#为什么-mobxact-下你不再需要-hooks)

## 使用说明

通常建议结合 typescript 使用，在项目的 tsconfig.json 中添加如下配置项：

```json
{
  // ...
  "jsx": "react",
  "jsxFactory": "jsx"
}
```

随后便可以尝试在主程序中渲染一段 jsx：

```tsx
import { jsx, html } from 'mobxact';

const rootEl = document.createElement('div');
document.body.appendChild(rootEl);
html.render(<div>Hello, world!</div>, rootEl);
```

当然，你还可以实现一个 FC(Function Component)，并渲染它：

```tsx
import { jsx, html } from 'mobxact';

function App() {
  return <div>Hello, world!</div>;
}

const rootEl = document.createElement('div');
document.body.appendChild(rootEl);
html.render(<App />, rootEl);
```

到目前为止，一切看起来都和 react 一样。

### 传递 Children 给组件

传递 Children 给组件的方式与 React 标准的方式有所不同，Children 将作为 props 之后的额外参数传递，而非 props 参数的属性

```jsx
function SomeComponent(props: PropTypes, ...children: Children) {
  return <div>{...children}</div>;
}
```

你可以给 children 指定任何其它的类型约束，但目前 TypeScript 并不能很好的检查 Mobxact 中 Children 的类型约束。

> 警告：由于TypeScript的兼容问题，这个语法可能会在将来改变。

### 数据状态

mobx 本身就是一个非常好的状态管理，因此当你需要管理一个状态时，你可以直接创建一个 observable

```tsx
export function Counter() {
  const state = observable.box(0);

  return (
    <div>
      Current Value: {state}
      <input
        disabled
        value={computed(() => state.get().toString())}
        oninput={action((ev) => {
          state.set(Number(ev.currentTarget.value));
        })}
      />
      <button
        onclick={action(() => {
          state.set(state.get() + 1);
        })}
      >
        inc
      </button>
      <button
        onclick={action(() => {
          state.set(state.get() - 1);
        })}
      >
        dec
      </button>
    </div>
  );
}
```

你可以直接在 jsx 中渲染一个 observable，如果它其中包含的类型本来可以正常的被 jsx 渲染。当然，你也可以在需要的时候使用 computed。更多关于 mobx 的说明请移步 [mobx 文档](https://cn.mobx.js.org/)

同样，你还可以在 DOM 属性中使用 observable/computed value，他们会被单独监听以绑定到对象上，如上面例子中的 input 组件。

### 条件渲染

要根据条件来决定一个 DOM 是否显示，你可以创建一个 computed，根据情况返回不同的 jsx。

```tsx
function App() {
    const switch = observable.box(false);
    return (
        <div>
            <input
                type="checkbox"
                checked={switch}
                onchange={action((ev) => {
                    switch.set(ev.currentTarget.checked);
                })}
            />
            {computed(() => switch.get() ? <div>ON</div> : <div>OFF</div>)}
        </div>
    );
}
```

请记住状态切换后导致的 jsx 变化会触发整个的重新挂载，Mobxact 没有任何的元素或属性比对机制。如果你不希望整个元素重新挂载，请将 observable/computed 绑定到具体的属性或文本上。

如果你依赖的不是一个 boolean 而是一个条件语句，你可能会在条件结果没有发生变化时触发 computed 的重计算，这会导致组件被重新挂载。为了解决这个问题，可以使用`mobx-utils`的`expr()`方法，或用`computed().get()`来实现相同的功能

```tsx
function App() {
  const counter = observable.box(0);
  return (
    <div>
      {computed(
        () => computed(() => counter.get() > 100).get() && <SomeComponent />
      )}
      {computed(() => expr(() => counter.get() > 100) && <SomeComponent />)}
    </div>
  );
}
```

另一种解决方案是将 Element 渲染好，并传递给另一个组件进行条件渲染，这样可以确保 Element 实例不变

```tsx
export function If({
  test,
  children,
}: {
  test: IBoxedValue<boolean>;
  children: Children;
}) {
  return computed(() => (test.get() ? children : null));
}

function App() {
  const counter = observable.box(0);
  return (
    <div>
      <If test={computed(() => counter.get > 100)}>
        <SomeComponent />
      </If>
    </div>
  );
}
```

### 列表渲染

Mobxact 支持动态的列表渲染，但必须满足两个条件：

- 你的数组是一个 `IObservableArray` ，或者是一个 `IComputedValue<Array>`，以供 Mobxact 监听
- 当数组的内容发生变化时，希望维持不变的组件应当总是返回相同的 Element。你可以通过 computedMapperFn 做到这一点。
  - 如果你需要调整元素渲染的顺序，确保 Element 实例不变，同时调整输出数组中 Element 实例的顺序，就会调整对应 DOM 节点的顺序。

```jsx
export function List<T>({
  data,
  renderItem,
}: {
  data: T[],
  renderItem: (v: T) => Element,
}): IComputedValue<Children> {
  renderItem = computedMapperFn(renderItem);
  return computed(() => {
    return data.map((v) => renderItem(v));
  });
}
```

更详细的例子请参考 [TODO Example](https://github.com/meidengtech/mobxact/blob/main/example/src/widgets/todo/index.tsx)

### Ref

你可以为 DOM 元素提供两种 Reference 目标：

- 一种是`IObservable<T|null>`，它会在 DOM 对象挂载和卸载的时候设置，你可以使用`createRef`来创建实例。
- 你还可以提供一个函数，接受一个参数，这个函数会在 DOM 对象挂载和卸载的时候分别调用一次。

你可以为其它函数组件提供 ref 属性，但对方的组件必须自己处理 ref 属性，如将 ref 挂载到一个 DOM 元素上，或手动设置 ref 的内容。

```js
function Switch({ $ref }) {
  const state = observable.box(false);
  // TODO: 还缺少一个在组件卸载时自动清理 ref 的最佳实践。
  $ref.set({
    switch() {
      state.set(!state.get());
    },
  });
}
```

### Reconciler

和 React 一样，mobxact 支持用于非 HTML 的场合，类似`react-native`、`react-umg`等，你只需要申明对应的 ReconcilerHost，实现一系列用于创建 DOM、维护 DOM 树、更新属性、文本的 API。

### 为什么 mobxact 下你不再需要 hooks

- useMemo/useCallback/useRef: FC 函数仅在挂载的时候执行一次，因此你无需使用这些 API 就能保证相应资源只创建一次。如果你需要带有依赖的 useMemo，你可以使用 mobx 的`computed`来实现相同的作用。
- useState/useReducer: 你可以直接使用 mobx 管理状态，并且创建状态的代码只会执行一次。
- useEffect: render 函数就是 mount 生命周期，如果你需要监听 unmount，可以使用 [observeUmount 方法](#observeunmountel-callback)
- useContext: 通常建议通过模块、全局、单例等方法管理全局 store。我们后续也有可能会提供 context 的替代方法。
- useImperativeHandle: 可以直接普通的处理 ref 属性。我们后续可能会提供易用性包装。
- useLayoutEffect: 可以用 DOM 节点上的 ref 属性来监听它实际被创建和销毁的时机。对于实际挂载完成，可以考虑用 setImmediate 方法延迟完成。我们后续可能会提供易用性包装。

## API Reference

### new Reconciler(host: ReconcilerHost)

详细的使用，请参考 TypeScript 定义文件。

### Reconciler.prototype.render(el, parent, before?): IDisposeable

渲染一个 JSX，指定渲染的容器。不同于 react，该容器不要求为空，并且你可以指定挂载的相对位置。

返回的对象有一个 dispose 方法，可以删除渲染出的元素并清理所有 mobx 订阅。

## html: Reconciler

用于渲染 HTML 元素的 Reconciler

## svg: Reconciler

用于渲染 SVG 元素的 Reconciler

### jsx(type, props, ...children): Element

类似`React.createElement`，用来兼容 TypeScript/Babel 的 JSX 语法。

### createRef()

等价于 `observable.box<T | null>(null)`，主要是提供类型和习惯上的方便。

### isElement(v): v is Element

判断一个对象是否 Mobxact JSX Element

### observeUnmount(el, callback): Child

可以在组件返回值使用，用于监听 Mobxact 组件被 unmount 的时机。

## computedMapperFn(fn): Function

功能类似`mobx-utils`中的`computedFn`函数，返回的函数在有订阅时将对相同的参数返回相同的结果。但是本函数限定传入的函数只能接受一个参数，这可以取得比`computedFn`更好的性能，从而满足大列表等场景需求。
