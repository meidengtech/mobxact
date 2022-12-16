import {
  isBoxedObservable,
  isComputed,
  reaction,
  IReactionDisposer,
  isObservableArray,
  observe,
} from 'mobx';
import { BitSet } from './bitset';
import {
  Child,
  Children,
  ComponentType,
  IBoxedValue,
  isElement,
  RefFunction,
  RefObject,
  ValueOrObservable,
} from './common';
import { calcKeepList } from './lis';
import { Reconciler } from './reconciler';

export interface IMountPoint<
  NodeType = unknown,
  ElementType extends NodeType = NodeType,
  TextNodeType extends NodeType = NodeType
> {
  // insert dom at specfic place.
  mount(parent: ElementType, before: () => NodeType | null): void;

  // unmount self, do not unmount children.
  unmount(): void;

  // dispose(and unmount) self and all children.
  dispose(): void;
}

export class DOMMountPoint<
  NodeType = unknown,
  ElementType extends NodeType = NodeType,
  TextNodeType extends NodeType = NodeType
> implements IMountPoint<NodeType, ElementType, TextNodeType>
{
  readonly _dom: ElementType;
  readonly _ref?: RefObject<ElementType>;
  readonly childReconciler: Reconciler<NodeType, ElementType, TextNodeType>;

  mountIndex = -1;

  constructor(
    readonly reconciler: Reconciler<NodeType>,
    tag: string,
    props: any,
    readonly onMountedDomChanged: (v: NodeType | null) => void
  ) {
    this.childReconciler = (reconciler.host.getChildHostContext?.(
      reconciler,
      tag
    ) ?? reconciler) as Reconciler<NodeType, ElementType, TextNodeType>;
    const dom = (this._dom = this.childReconciler.host.createElement(tag));

    if (props) {
      for (const key of Object.keys(props)) {
        const value = props[key];
        if (key === 'ref') {
          this._ref = value;
          continue;
        }
        if (key === 'children') {
          continue;
        }
        if (isBoxedObservable(value) || isComputed(value)) {
          this.disposes.push(
            reaction(
              () => value.get(),
              (v) => {
                this.reconciler.host.setProperty(dom, key, v);
              },
              {
                fireImmediately: true,
              }
            )
          );
        } else {
          this.reconciler.host.setProperty(dom, key, value);
        }
      }
    }
    if (props.children) {
      const mp = new ListMountPoint(
        this.childReconciler,
        props.children,
        () => {}
      );
      mp.mount(dom, () => null);
    }
    this.updateRef(dom);
  }
  disposes: IReactionDisposer[] = [];

  children?: IMountPoint;

  parent?: ElementType;

  mount(parent: ElementType, before: () => NodeType | null) {
    this.parent = parent;
    this.onMountedDomChanged(this._dom);
    this.reconciler.host.insertBefore(parent, this._dom, before());
  }
  unmount() {
    this.onMountedDomChanged(null);
    this.reconciler.host.removeChild(this.parent!, this._dom);
    delete this.parent;
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

  updateRef(ins: ElementType | null) {
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

export class VirtualMountPoint<
  NodeType = unknown,
  ElementType extends NodeType = NodeType,
  TextNodeType extends NodeType = NodeType
> implements IMountPoint<NodeType, ElementType, TextNodeType>
{
  constructor(
    readonly reconciler: Reconciler<NodeType, ElementType, TextNodeType>,
    el: ValueOrObservable<Child | Children>,
    readonly onMountedDomChanged: (v: NodeType | null) => void
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
  textDom?: TextNodeType;
  disposeReaction?: IReactionDisposer;

  parent?: ElementType;
  before?: () => NodeType | null;

  private update(ch: Child | Children) {
    if (this.textDom && (typeof ch === 'string' || typeof ch === 'number')) {
      // quick update textDOM
      this.reconciler.host.setTextContent(this.textDom, ch.toString());
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
        this.childMountPoint = new DOMMountPoint<
          NodeType,
          ElementType,
          TextNodeType
        >(this.reconciler, ch.type, ch.props, this.onMountedDomChanged);
      } else {
        this.childMountPoint = new VirtualMountPoint<
          NodeType,
          ElementType,
          TextNodeType
        >(
          this.reconciler,
          (ch.type as ComponentType)(ch.props),
          this.onMountedDomChanged
        );
      }
    } else if (typeof ch === 'string' || typeof ch === 'number') {
      this.textDom = this.reconciler.host.createTextNode(ch.toString());
    } else if (Array.isArray(ch) || isObservableArray(ch)) {
      this.childMountPoint = new ListMountPoint(
        this.reconciler,
        ch,
        this.onMountedDomChanged
      );
    } else if (isBoxedObservable(ch) || isComputed(ch)) {
      this.childMountPoint = new VirtualMountPoint<
        NodeType,
        ElementType,
        TextNodeType
      >(this.reconciler, ch, this.onMountedDomChanged);
    }

    if (this.parent) {
      this.mountChildren();
    }
  }

  mountChildren() {
    if (this.textDom) {
      this.onMountedDomChanged(this.textDom);
      this.reconciler.host.insertBefore(
        this.parent!,
        this.textDom,
        this.before!()
      );
    }
    if (this.childMountPoint) {
      this.childMountPoint.mount(parent, this.before!);
    }
  }

  mount(parent: ElementType, before: () => NodeType | null) {
    this.parent = parent;
    this.before = before;
    this.mountChildren();
  }

  disposeChildren() {
    if (this.childMountPoint) {
      this.childMountPoint.dispose();
      delete this.childMountPoint;
    }
    if (this.textDom) {
      delete this.textDom;
    }
  }

  unmountChildren() {
    if (this.childMountPoint) {
      this.childMountPoint.unmount();
    }
    if (this.textDom) {
      this.onMountedDomChanged(null);
      this.reconciler.host.removeChild(this.parent!, this.textDom);
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

export class ListMountPoint<
  NodeType = unknown,
  ElementType extends NodeType = NodeType,
  TextNodeType extends NodeType = NodeType
> implements IMountPoint<NodeType, ElementType, TextNodeType>
{
  children: VirtualMountPoint<NodeType, ElementType, TextNodeType>[] = [];
  doms: (NodeType | null)[] = [];
  el: Children;

  mountIndex = -1;

  parent?: ElementType;
  before?: () => NodeType | null;

  firstDom: Node | null = null;

  updating = false;
  bitset: BitSet | null = null; // when batch updating, it should be null.

  constructor(
    readonly reconciler: Reconciler<NodeType, ElementType, TextNodeType>,
    el: Children,
    readonly onMountedDomChanged: (v: NodeType | null) => void
  ) {
    let idx = 0;
    this.updating = true;
    for (const item of el) {
      const mp: VirtualMountPoint<NodeType, ElementType, TextNodeType> =
        new VirtualMountPoint<NodeType, ElementType, TextNodeType>(
          reconciler,
          item,
          (v) => this.onChildMountedDomChanged(mp, v)
        );
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

  onChildMountedDomChanged(
    mp: VirtualMountPoint<NodeType, ElementType, TextNodeType>,
    dom: NodeType | null
  ) {
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
    this.onMountedDomChanged(q >= 0 ? this.doms[q] : null);
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
        const mp: VirtualMountPoint<NodeType, ElementType, TextNodeType> =
          new VirtualMountPoint<NodeType, ElementType, TextNodeType>(
            this.reconciler,
            el[i],
            (v) => this.onChildMountedDomChanged(mp, v)
          );
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

  mount(parent: ElementType, before: () => NodeType | null) {
    this.parent = parent;
    this.before = before;
    this.bitset = null;
    for (const item of this.children) {
      item.mount(this.parent, () => this.getMountBefore(item));
    }
    this.buildBitset();
    this.updateFirstDom();
  }

  getMountBefore(mp: VirtualMountPoint<NodeType, ElementType, TextNodeType>) {
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
