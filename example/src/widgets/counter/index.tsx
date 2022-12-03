import { action, computed, observable } from 'mobx';
import { IBoxedValue, jsx } from 'mobxact';

const ComponentTest = (prop: {}, value: IBoxedValue<number>) => {
  return computed(() => (
    <span>
      {value.get()}
      {value.get() > 0 ? 'YES' : ''}
      {value.get() < 0 ? 'NO' : ''}
    </span>
  ));
};

export function Counter() {
  const state = observable.box(0);
  console.log('Counter is rendering...');

  return (
    <div>
      Current Value:
      <input
        disabled
        value={computed(() => state.get().toString())}
        oninput={action((ev) => {
          state.set(Number(ev.currentTarget.value));
        })}
      />
      <ComponentTest>{state}</ComponentTest>
      <button
        onclick={action(() => {
          console.log('inc clicked.');
          state.set(state.get() + 1);
        })}
      >
        inc
      </button>
      <button
        onclick={action(() => {
          console.log('dec clicked.');
          state.set(state.get() - 1);
        })}
      >
        dec
      </button>
    </div>
  );
}
