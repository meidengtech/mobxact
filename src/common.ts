import {
  IObservableValue,
  observable,
  computed,
  isBoxedObservable,
  isComputed,
  onBecomeUnobserved,
} from 'mobx';

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

export interface IDisposeable {
  dispose(): void;
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
