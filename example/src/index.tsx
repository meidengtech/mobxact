import { jsx, html } from 'mobxact';
import { Counter } from './widgets/counter';
import { CssDemo } from './widgets/css';
import { SvgTest } from './widgets/svg';
import { Todo } from './widgets/todo';

const rootEl = document.createElement('div');
document.body.appendChild(rootEl);

const start = Date.now();
// html.render(<Counter />, rootEl);
// html.render(<Todo />, rootEl);
html.render(<CssDemo />, rootEl);

console.log(Date.now() - start);
