import {
  computed,
  IObservableValue,
  IReactionDisposer,
  isBoxedObservable,
  isComputed,
  isObservableArray,
  observable,
  observe,
  onBecomeUnobserved,
  reaction,
} from 'mobx';
import { BitSet } from './bitset';
import { calcKeepList } from './lis';
export * from './computedMapperFn';

export interface IBoxedValue<T> {
  get(): T;
}

export type RefObject<T> = IObservableValue<T | null>;
export type RefFunction<T> = (instance: T | null) => void;
export type Ref<T> = RefObject<T> | RefFunction<T>;

export function createRef<T>() {
  return observable.box<T | null>(null);
}

export type Child =
  | ValueOrObservable<
      Element | string | boolean | number | null | undefined | Children
    >
  | IBoxedValue<Child>;
export type Children = Child[];
export type JSXNode = Child | Children;

export type ComponentType<PropType = {}> = (
  props: PropType
) => Child | Children;

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

export type ElementType<PropType extends {} = any> =
  | ComponentType<PropType>
  | keyof JSX.IntrinsicElements;

const elementSymbol = Symbol('element');

type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? undefined
  : ((...b: T) => void) extends (a: any, ...b: infer I) => void
  ? I
  : [];

export type ElementPropType<Type extends ElementType> =
  Type extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[Type]
    : Type extends ComponentType
    ? Parameters<Type>[0]
    : unknown;

export type ElementChildrenType<Type extends ElementType> =
  Type extends keyof JSX.IntrinsicElements
    ? Children
    : Type extends ComponentType
    ? RemoveFirstFromTuple<Parameters<Type>>
    : unknown;

export type ValueOrObservable<T> = T | IBoxedValue<T>;

export interface Element<Type extends ElementType = ElementType> {
  [elementSymbol]: true;
  type: Type;
  props: ElementPropType<Type>;
}

export interface IMountPoint {
  // the only or the first dom or this mount point. (used for insertBefore)
  mountIndex: number;

  // insert dom at specfic place.
  mount(parent: HTMLElement, before: () => Node | null): void;

  // unmount self, do not unmoutn children.
  unmount(): void;

  // dispose(and unmount) self and all children.
  dispose(): void;
}

export interface IDisposeable {
  dispose(): void;
}

function setAttribute(dom: any, key: string, v: unknown) {
  if (typeof v === 'function' || key == 'value') {
    dom[key] = v;
  } else if (key === 'checked' || key === 'disabled') {
    if (v) {
      dom.setAttribute(key, key);
    } else {
      dom.removeAttribute(key);
    }
  } else {
    dom.setAttribute(key, v);
  }
}

class DOMMountPoint implements IMountPoint {
  readonly _dom: HTMLElement;
  readonly _ref?: RefObject<HTMLElement>;

  mountIndex = -1;

  constructor(
    tag: string,
    props: any,
    readonly onMountedDomChanged: (v: Node | null) => void
  ) {
    const dom = (this._dom = document.createElement(tag));

    if (props) {
      for (const key of Object.keys(props)) {
        const value = props[key];
        if (key === 'ref') {
          this._ref = value;
        }
        if (isBoxedObservable(value) || isComputed(value)) {
          this.disposes.push(
            reaction(
              () => value.get(),
              (v) => {
                setAttribute(dom, key, v);
              },
              {
                fireImmediately: true,
              }
            )
          );
        } else {
          setAttribute(dom, key, value);
        }
      }
    }
    if (props.children) {
      const mp = new ListMountPoint(props.children, () => {});
      mp.mount(dom, () => null);
    }
    this.updateRef(dom);
  }
  disposes: IReactionDisposer[] = [];

  children?: IMountPoint;

  mount(parent: HTMLElement, before: () => Node | null) {
    this.onMountedDomChanged(this._dom);
    parent.insertBefore(this._dom, before());
  }
  unmount() {
    this.onMountedDomChanged(null);
    this._dom.parentElement!.removeChild(this._dom);
  }
  dispose() {
    for (const item of this.disposes) {
      item();
    }
    this.updateRef(null);
    if (this.children) {
      this.children.dispose();
    }
  }

  updateRef(ins: HTMLElement | null) {
    const v = this._ref;
    if (v) {
      if (typeof v === 'function') {
        (v as RefFunction<unknown>)(ins);
      } else {
        (v as RefObject<unknown>).set(ins);
      }
    }
  }
}

class MountPoint implements IMountPoint {
  constructor(
    el: ValueOrObservable<Child | Children>,
    readonly onMountedDomChanged: (v: Node | null) => void
  ) {
    if (isBoxedObservable(el) || isComputed(el)) {
      this.disposeReaction = reaction(
        () => (el as IBoxedValue<Child>).get(),
        (ch) => {
          this.update(ch);
        },
        { fireImmediately: true }
      );
    } else {
      this.update(el as Child);
    }
  }

  mountIndex = -1;

  childMountPoint?: IMountPoint;
  textDom?: Node;
  disposeReaction?: IReactionDisposer;

  parent?: HTMLElement;
  before?: () => Node | null;

  private update(ch: Child | Children) {
    if (this.textDom && (typeof ch === 'string' || typeof ch === 'number')) {
      // quick update textDOM
      this.textDom.textContent = ch.toString();
      return;
    }
    if (
      this.childMountPoint instanceof ListMountPoint &&
      (Array.isArray(ch) || isObservableArray(ch))
    ) {
      (this.childMountPoint as ListMountPoint).update(ch);
      return;
    }
    this.unmountChildren();
    this.disposeChildren();
    if (isElement(ch)) {
      if (typeof ch.type === 'string') {
        this.childMountPoint = new DOMMountPoint(
          ch.type,
          ch.props,
          this.onMountedDomChanged
        );
      } else {
        this.childMountPoint = new MountPoint(
          (ch.type as ComponentType)(ch.props),
          this.onMountedDomChanged
        );
      }
    } else if (typeof ch === 'string' || typeof ch === 'number') {
      this.textDom = document.createTextNode(ch.toString());
    } else if (Array.isArray(ch) || isObservableArray(ch)) {
      this.childMountPoint = new ListMountPoint(ch, this.onMountedDomChanged);
    } else if (isBoxedObservable(ch) || isComputed(ch)) {
      this.childMountPoint = new MountPoint(ch, this.onMountedDomChanged);
    }

    if (this.parent) {
      if (this.textDom) {
        this.onMountedDomChanged(this.textDom);
        this.parent.insertBefore(this.textDom, this.before!());
      }
      if (this.childMountPoint) {
        this.childMountPoint.mount(this.parent, this.before!);
      }
    }
  }

  mount(parent: HTMLElement, before: () => Node | null) {
    this.parent = parent;
    this.before = before;
    if (this.textDom) {
      this.onMountedDomChanged(this.textDom);
      parent.insertBefore(this.textDom, before());
    }
    if (this.childMountPoint) {
      this.childMountPoint.mount(parent, before);
    }
  }

  disposeChildren() {
    if (this.childMountPoint) {
      this.childMountPoint.dispose();
      delete this.childMountPoint;
    }
    if (this.textDom) {
      this.textDom.parentElement?.removeChild(this.textDom);
      this.onMountedDomChanged(null);
      delete this.textDom;
    }
  }

  unmountChildren() {
    if (this.childMountPoint) {
      this.childMountPoint.unmount();
    }
    if (this.textDom) {
      this.onMountedDomChanged(null);
      this.textDom.parentElement?.removeChild(this.textDom);
    }
  }

  unmount() {
    delete this.parent;
    delete this.before;
    this.unmountChildren();
  }

  dispose() {
    this.disposeChildren();
    if (this.disposeReaction) {
      this.disposeReaction();
      delete this.disposeReaction;
    }
  }
}

class ListMountPoint implements IMountPoint {
  children: IMountPoint[] = [];
  doms: (Node | null)[] = [];
  el: Children;

  mountIndex = -1;

  parent?: HTMLElement;
  before?: () => Node | null;

  firstDom: Node | null = null;

  updating = false;
  bitset: BitSet | null = null; // when batch updating, it should be null.

  constructor(
    el: Children,
    readonly onMountedDomChanged: (v: Node | null) => void
  ) {
    let idx = 0;
    this.updating = true;
    for (const item of el) {
      let mp: MountPoint;
      mp = new MountPoint(item, (v) => this.onChildMountedDomChanged(mp, v));
      mp.mountIndex = idx++;
      this.children.push(mp);
    }
    this.updating = false;
    this.el = el;

    if (isObservableArray(el)) {
      // should copy & record current list.
      this.el = [...el];
      this.disposeReaction = observe(el, () => {
        this.update([...el]);
      });
    }
  }

  onChildMountedDomChanged(mp: MountPoint, dom: Node | null) {
    this.doms[mp.mountIndex] = dom;

    if (this.bitset) {
      if (dom) {
        this.bitset.set(mp.mountIndex);
      } else {
        this.bitset.unset(mp.mountIndex);
      }
    }
    if (!this.updating) {
      this.updateFirstDom();
    }
  }

  buildBitset() {
    this.bitset = new BitSet(this.children.length, this.doms);
  }

  updateFirstDom() {
    if (!this.bitset) {
      return;
    }
    const q = this.bitset.query();
    return q >= 0 ? this.doms[q] : null;
  }

  update(el: Children) {
    const oldChildren = this.children;
    const map = new Map<any, number>();
    this.bitset = null;
    this.updating = true;

    // TODO: try to keep as many as possible with preprocess + LIS.
    for (let i = 0; i < this.el.length; i++) {
      map.set(this.el[i], i);
    }
    const order: number[] = [];
    for (let i = 0; i < el.length; i++) {
      if (map.has(el[i])) {
        order.push(map.get(el[i])!);
      }
    }
    const keep = calcKeepList(order, oldChildren.length);

    for (let i = 0; i < this.el.length; i++) {
      if (this.parent && !keep[i]) {
        this.children[i].unmount();
      }
    }
    const oldDoms = this.doms;
    this.doms = [];
    this.children = [];
    const willMount = [];
    for (let i = 0; i < el.length; i++) {
      if (map.has(el[i])) {
        const oldIdx = map.get(el[i])!;
        const mp = oldChildren[oldIdx];
        mp.mountIndex = i;
        map.delete(el[i]);
        this.children.push(mp);
        if (!keep[oldIdx]) {
          willMount.push(mp);
        } else {
          this.doms[i] = oldDoms[oldIdx];
        }
      } else {
        let mp: MountPoint;
        mp = new MountPoint(el[i], (v) => this.onChildMountedDomChanged(mp, v));
        this.children.push(mp);
        mp.mountIndex = i;
        willMount.push(mp);
      }
    }
    this.buildBitset();
    if (this.parent) {
      for (const mp of willMount) {
        mp.mount(this.parent, () => this.getMountBefore(mp));
      }
    }
    for (const value of Array.from(map.values())) {
      oldChildren[value].dispose();
    }
    this.el = el;
    this.updating = false;
    this.updateFirstDom();
  }

  disposeReaction?: () => void;

  mount(parent: HTMLElement, before: () => Node | null) {
    this.parent = parent;
    this.before = before;
    this.bitset = null;
    for (const item of this.children) {
      item.mount(this.parent, () => this.getMountBefore(item));
    }
    this.buildBitset();
    this.updateFirstDom();
  }

  getMountBefore(mp: IMountPoint) {
    if (!this.bitset) {
      // always push to end.
      return this.before!();
    }
    let idx = this.bitset.query(mp.mountIndex + 1);
    if (idx >= 0) {
      return this.doms[idx];
    }

    return this.before!();
  }

  unmount() {
    delete this.parent;
    delete this.before;
    for (const item of this.children) {
      item.unmount();
    }
  }

  dispose() {
    this.unmount();
    for (const item of this.children) {
      item.dispose();
    }
    this.children = [];
    if (this.disposeReaction) {
      this.disposeReaction();
      delete this.disposeReaction;
    }
  }
}

export function render(
  el: ValueOrObservable<Child>,
  parent: HTMLElement,
  before: Node | null = null
): IDisposeable {
  const ret = new MountPoint(el, () => {});
  ret.mount(parent, () => before);
  return ret;
}

export function jsx<Type extends ElementType>(
  type: Type,
  props: ElementPropType<Type>,
  ...children: ElementChildrenType<Type>
): Element<Type>;
export function jsx(
  type: string | ComponentType,
  props: any,
  ...children: any
): Element<any> {
  return {
    [elementSymbol]: true,
    type: type,
    props:
      children.length > 0
        ? {
            ...props,
            children,
          }
        : props,
  };
}

export function isElement(v: unknown): v is Element {
  return !!v && typeof v == 'object' && elementSymbol in v;
}

export function observeUmount(el: Child, callback: () => void): Child {
  const ret = computed(() => {
    if (isBoxedObservable(el) || isComputed(el)) {
      return (el as IBoxedValue<Child>).get();
    }
    return el as Child;
  });
  onBecomeUnobserved(ret, callback);
  return ret;
}
