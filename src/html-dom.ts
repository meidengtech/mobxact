import { Ref, JSXNode, IBoxedValue } from './common';
import { Reconciler } from './reconciler';
import { svg } from './svg-dom';

interface HTMLIntrisicElements<Type extends HTMLElement = HTMLElement> {
  ref?: Ref<Type>;
  children?: JSXNode;
  className?: string;

  onclick?: (ev: MouseEvent & { currentTarget: HTMLElement }) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: HTMLIntrisicElements<HTMLDivElement> & {};
      a: HTMLIntrisicElements<HTMLAnchorElement> & {
        href: string;
        target?: string;
      };
      span: HTMLIntrisicElements<HTMLSpanElement> & {};
      input: HTMLIntrisicElements<HTMLInputElement> & {
        type?: string | IBoxedValue<string>;
        checked?: boolean | IBoxedValue<boolean>;
        disabled?: boolean | IBoxedValue<boolean>;
        value?: string | IBoxedValue<string>;

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
    if (typeof v === 'function' || key == 'value' || key === 'className') {
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
