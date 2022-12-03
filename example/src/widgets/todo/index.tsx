import {
  action,
  computed,
  IComputedValue,
  IObservableArray,
  observable,
  runInAction,
} from 'mobx';
import {
  Children,
  jsx,
  Element,
  computedMapperFn,
  createRef,
  observeUmount,
} from 'mobxact';

export function List<T>({
  data,
  renderItem,
}: {
  data: T[];
  renderItem: (v: T) => Element;
}): IComputedValue<Children> {
  renderItem = computedMapperFn(renderItem);
  return computed(() => {
    return data.map((v) => renderItem(v));
  });
}

export function Item({
  item,
  state,
}: {
  item: TodoItem;
  state: IObservableArray<TodoItem>;
}) {
  return observeUmount(
    <div>
      <input
        type="checkbox"
        checked={computed(() => item.checked)}
        onchange={action((ev) => {
          item.checked = ev.currentTarget.checked;
        })}
      />
      <input
        disabled={computed(() => item.checked)}
        value={computed(() => item.value)}
        oninput={action((ev) => {
          item.value = ev.currentTarget.value;
        })}
      />
      <button
        onclick={() => {
          const start = Date.now();
          runInAction(() => {
            state.remove(item);
            console.log(item.value, 'removed');
          });
          console.log('cost: ', Date.now() - start);
        }}
      >
        delete
      </button>
      <button
        onclick={() => {
          const start = Date.now();
          runInAction(() => {
            const idx = state.indexOf(item);
            state.splice(idx, 0, { value: 'New TODO', checked: false });
          });
          console.log('cost: ', Date.now() - start);
        }}
      >
        insertBefore
      </button>
    </div>,
    () => {
      console.log('Unmounted callback.');
    }
  );
}

export interface TodoItem {
  value: string;
  checked: boolean;
}

export function Todo() {
  const state = observable([] as TodoItem[]);
  const refDiv = createRef<HTMLDivElement>();

  return (
    <div ref={refDiv}>
      <List
        data={state}
        renderItem={(item) => <Item item={item} state={state} />}
      ></List>
      <button
        onclick={() => {
          runInAction(() => {
            const start = Date.now();
            state.push(
              observable.object({
                value: 'Todo' + state.length,
                checked: false,
              })
            );
            console.log('cost: ', Date.now() - start);
          });
        }}
      >
        Create
      </button>
    </div>
  );
}
