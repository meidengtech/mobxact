import { Ref, JSXNode, IBoxedValue } from './common';
import { Reconciler } from './reconciler';
import { svg } from './svg-dom';

interface HTMLIntrisicElements<Type extends HTMLElement = HTMLElement> {
  ref?: Ref<Type>;
  children?: JSXNode;
  className?: string | IBoxedValue<string>;

  onClick?: (ev: MouseEvent & { currentTarget: Type }) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: HTMLIntrisicElements<HTMLDivElement> & {};
      a: HTMLIntrisicElements<HTMLAnchorElement> & {
        href: string | IBoxedValue<string>;
        target?: string | IBoxedValue<string>;
      };
      span: HTMLIntrisicElements<HTMLSpanElement> & {};
      input: HTMLIntrisicElements<HTMLInputElement> & {
        type?: string | IBoxedValue<string>;
        checked?: boolean | IBoxedValue<boolean>;
        disabled?: boolean | IBoxedValue<boolean>;
        value?: string | IBoxedValue<string>;
        placeholder?: string | IBoxedValue<string>;
        autoFocus?: boolean | IBoxedValue<boolean>;

        onChange?: (ev: Event & { currentTarget: HTMLInputElement }) => void;
        onFocus?: (ev: Event & { currentTarget: HTMLInputElement }) => void;
        onBlur?: (ev: Event & { currentTarget: HTMLInputElement }) => void;
        onKeyDown?: (
          ev: KeyboardEvent & { currentTarget: HTMLInputElement }
        ) => void;
        onInput?: (
          ev: InputEvent & { currentTarget: HTMLInputElement }
        ) => void;
      };
      textarea: HTMLIntrisicElements<HTMLTextAreaElement> & {
        type?: string | IBoxedValue<string>;
        checked?: boolean | IBoxedValue<boolean>;
        disabled?: boolean | IBoxedValue<boolean>;
        value?: string | IBoxedValue<string>;
        placeholder?: string | IBoxedValue<string>;
        autoFocus?: boolean | IBoxedValue<boolean>;

        onChange?: (ev: Event & { currentTarget: HTMLTextAreaElement }) => void;
        onInput?: (
          ev: InputEvent & { currentTarget: HTMLTextAreaElement }
        ) => void;
      };
      button: HTMLIntrisicElements<HTMLButtonElement> & {
        children?: JSXNode;
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

const directProperties: { [key: string]: string } = {
  // direct properties.
  value: 'value',
  className: 'className',
  autoFocus: 'autofocus',
  placeholder: 'placeholder',

  // events.
  onKeyDown: 'onkeydown',
  onChange: 'onchange',
  onClick: 'onclick',
  onInput: 'oninput',
  onFocus: 'onfocus',
  onBlur: 'onblur',
};

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
    if (typeof v === 'function' || directProperties[key]) {
      (dom as any)[directProperties[key]] = v;
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
