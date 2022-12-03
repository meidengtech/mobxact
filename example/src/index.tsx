import { jsx, render } from 'mobxact';
import { Counter } from './widgets/counter';
import { Todo } from './widgets/todo';

const rootEl = document.createElement('div');
document.body.appendChild(rootEl);

const start = Date.now();
render(<Counter />, rootEl);
// render(<Todo />, rootEl);

console.log(Date.now() - start);
