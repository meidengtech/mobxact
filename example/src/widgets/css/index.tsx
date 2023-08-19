import * as classnames from 'classnames';
import { action, computed, observable } from 'mobx';
import { jsx } from 'mobxact';
import styles from './index.css';

export function CssDemo() {
  const type = observable.box('blue');
  const type1 = observable.box('blue');

  return (
    <div>
      <div
        className={computed(() => classnames(styles.block, styles[type.get()]))}
      >
        <div
          className={styles.inner}
          style={{ backgroundColor: computed(() => type1.get()) }}
        ></div>
      </div>
      <p>
        Outer(className):
        <button onClick={action(() => type.set('red'))}>Red</button>
        <button onClick={action(() => type.set('green'))}>Green</button>
        <button onClick={action(() => type.set('blue'))}>Blue</button>
      </p>
      <p>
        Inner(style):
        <button onClick={action(() => type1.set('red'))}>Red</button>
        <button onClick={action(() => type1.set('green'))}>Green</button>
        <button onClick={action(() => type1.set('blue'))}>Blue</button>
      </p>
    </div>
  );
}
