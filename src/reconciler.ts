import { Child, IDisposeable, ValueOrObservable } from './common';
import { VirtualMountPoint } from './vdom';

export interface ReconcilerHost<
  NodeType = unknown,
  ElementType extends NodeType = NodeType,
  TextNodeType extends NodeType = NodeType
> {
  createElement(tag: string): ElementType;
  createTextNode(text: string): TextNodeType;

  getChildHostContext?(
    parentContext: Reconciler,
    tag: string
  ): Reconciler<NodeType> | null;
  insertBefore(
    parent: ElementType,
    child: NodeType,
    before: NodeType | null
  ): void;
  removeChild(parent: ElementType, child: NodeType): void;

  setProperty(node: ElementType, key: string, value: unknown): void;
  setTextContent(node: TextNodeType, text: string): void;
}

export class Reconciler<
  NodeType = unknown,
  ElementType extends NodeType = NodeType,
  TextNodeType extends NodeType = NodeType
> {
  constructor(
    readonly host: ReconcilerHost<NodeType, ElementType, TextNodeType>
  ) {}

  render(
    el: ValueOrObservable<Child>,
    parent: ElementType,
    before: NodeType | null = null
  ): IDisposeable {
    const ret = new VirtualMountPoint<NodeType, ElementType, TextNodeType>(
      this,
      el,
      () => {}
    );
    ret.mount(parent, () => before);
    return {
      dispose: () => {
        ret.unmount();
        ret.dispose();
      },
    };
  }
}
