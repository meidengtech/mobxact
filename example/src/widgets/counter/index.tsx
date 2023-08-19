import { action, computed, observable } from 'mobx';
import { jsx } from 'mobxact';

export function Counter() {
  const state = observable.box(0);
  console.log('Counter is rendering...');

  return (
    <div>
      Current Value:
      <input
        value={computed(() => state.get().toString())}
        onInput={action((ev) => {
          state.set(Number(ev.currentTarget.value));
        })}
      />
      <button
        onClick={action(() => {
          console.log('inc clicked.');
          state.set(state.get() + 1);
        })}
      >
        inc
      </button>
      <button
        onClick={action(() => {
          console.log('dec clicked.');
          state.set(state.get() - 1);
        })}
      >
        dec
      </button>
    </div>
  );
}
