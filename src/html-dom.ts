import { Ref, JSXNode, IBoxedValue } from './common';
import { Reconciler } from './reconciler';
import { svg, svgns } from './svg-dom';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: {
        ref?: Ref<HTMLDivElement>;
        children?: JSXNode;
      };
      span: {
        ref?: Ref<HTMLSpanElement>;
        children?: JSXNode;
      };
      input: {
        ref?: Ref<HTMLInputElement>;
        type?: string | IBoxedValue<string>;
        checked?: boolean | IBoxedValue<boolean>;
        disabled?: boolean | IBoxedValue<boolean>;
        value?: string | IBoxedValue<string>;
        children?: JSXNode;

        onchange?: (ev: Event & { currentTarget: HTMLInputElement }) => void;
        oninput?: (
          ev: InputEvent & { currentTarget: HTMLInputElement }
        ) => void;
      };
      button: {
        ref?: Ref<HTMLButtonElement>;
        children?: JSXNode;
        onclick?: (ev: MouseEvent) => void;
      };
    }

    interface IntrinsicElementInstanceType {
      div: HTMLDivElement;
      span: HTMLSpanElement;
      input: HTMLInputElement;
      button: HTMLButtonElement;
    }

    interface ElementChildrenAttribute {
      children: {}; // specify children name to use
    }
  }
}

export const html = new Reconciler<Node, HTMLElement, Text>({
  createElement(tag: string) {
    return document.createElement(tag);
  },
  createTextNode(text: string): Text {
    return document.createTextNode(text);
  },

  getChildHostContext(
    parentContext: Reconciler<Node>,
    tag: string
  ): Reconciler<Node> | null {
    if (tag === 'svg') {
      return svg;
    }
    return parentContext;
  },
  insertBefore(parent: HTMLElement, child: Node, before: Node | null): void {
    parent.insertBefore(child, before);
  },
  removeChild(parent: HTMLElement, child: Node): void {
    parent.removeChild(child);
  },

  setProperty(dom: HTMLElement, key: string, v: unknown): void {
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
