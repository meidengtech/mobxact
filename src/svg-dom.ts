import { JSXNode } from './common';
import { html } from './html-dom';
import { Reconciler } from './reconciler';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      svg: {
        children?: JSXNode;
        width: number | string;
        height: number | string;
      };
      circle: {
        cx: number | string;
        cy: number | string;
        r: number | string;
        stroke: string;
        'stroke-width': number | string;
        fill: string;
      };
    }
  }
}

export const svgns = 'http://www.w3.org/2000/svg';

export const svg = new Reconciler<Node, SVGElement, Text>({
  createElement(tag: string) {
    return document.createElementNS(svgns, tag);
  },
  createTextNode(text: string): Text {
    return document.createTextNode(text);
  },

  getChildHostContext(
    parentContext: Reconciler<Node, SVGElement, Text>,
    tag: string
  ): Reconciler<Node> | null {
    if (tag === 'foreignobject') {
      return html;
    }
    return parentContext;
  },
  insertBefore(parent: SVGElement, child: Node, before: Node | null): void {
    parent.insertBefore(child, before);
  },
  removeChild(parent: SVGElement, child: Node): void {
    parent.removeChild(child);
  },

  setProperty(dom: SVGElement, key: string, v: unknown): void {
    if (typeof v === 'function' || key == 'value') {
      (dom as any)[key] = v;
    } else if (key === 'checked' || key === 'disabled') {
      if (v) {
        dom.setAttribute(key, key);
      } else {
        dom.removeAttribute(key);
      }
    } else if (v == null) {
      dom.removeAttribute(key);
    } else {
      dom.setAttribute(key, v.toString());
    }
  },
  setTextContent(node: Text, text: string): void {
    node.textContent = text;
  },
});
