import { computed, IObservableArray, observable } from 'mobx';
import { jsx, Element } from 'mobxact';

interface Circle {
  cx: number;
  cy: number;
  r: number;
  stroke: string;
  fill: string;
}

export function SvgTest() {
  const circles: IObservableArray<Element> = observable([]);

  function randomColor() {
    return (
      '#' +
      ('000000' + Math.floor(Math.random() * (1 << 24)).toString(16)).slice(-6)
    );
  }

  function newCircle() {
    circles.push(
      <circle
        cx={Math.random() * 480}
        cy={Math.random() * 640}
        r={Math.random() * 100}
        stroke={randomColor()}
        fill={randomColor()}
        stroke-width="3"
      />
    );
  }

  function clear() {
    circles.length = 0;
  }

  return (
    <div>
      <div>
        <button onclick={newCircle}>Add Circle</button>
        <button onclick={clear}>Clear</button>
      </div>
      <div>
        <svg height="640" width="480">
          {circles}
        </svg>
      </div>
    </div>
  );
}
