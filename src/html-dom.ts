import { Reconciler } from './reconciler';
import { svg } from './svg-dom';
import {
  AriaAttributes,
  AttributeRecord,
  Booleanish,
  CSSProperties,
  DOMAttributes,
  EventHandler,
} from './types';

interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
  // TODO: support style.
  style?: AttributeRecord<CSSProperties> | undefined;

  // Standard HTML Attributes
  accessKey?: string | undefined;
  className?: string | undefined;
  contentEditable?: Booleanish | 'inherit' | undefined;
  contextMenu?: string | undefined;
  dir?: string | undefined;
  draggable?: Booleanish | undefined;
  hidden?: boolean | undefined;
  id?: string | undefined;
  lang?: string | undefined;
  nonce?: string | undefined;
  placeholder?: string | undefined;
  slot?: string | undefined;
  spellCheck?: Booleanish | undefined;
  tabIndex?: number | undefined;
  title?: string | undefined;
  translate?: 'yes' | 'no' | undefined;

  // Living Standard
  /**
   * Hints at the type of data that might be entered by the user while editing the element or its contents
   * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
   */
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
    | undefined;

  /**
   * Specify that a standard HTML element should behave like a defined custom built-in element
   * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
   */
  is?: string | undefined;
}

type HTMLAttributeReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

type HTMLAttributeAnchorTarget =
  | '_self'
  | '_blank'
  | '_parent'
  | '_top'
  | (string & {});

interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
  autoPlay?: boolean | undefined;
  controls?: boolean | undefined;
  controlsList?: string | undefined;
  crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
  loop?: boolean | undefined;
  mediaGroup?: string | undefined;
  muted?: boolean | undefined;
  playsInline?: boolean | undefined;
  preload?: string | undefined;
  src?: string | undefined;
}

interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
  download?: any;
  href?: string | undefined;
  hrefLang?: string | undefined;
  media?: string | undefined;
  ping?: string | undefined;
  rel?: string | undefined;
  target?: HTMLAttributeAnchorTarget | undefined;
  type?: string | undefined;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
}

interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
  alt?: string | undefined;
  coords?: string | undefined;
  download?: any;
  href?: string | undefined;
  hrefLang?: string | undefined;
  media?: string | undefined;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  rel?: string | undefined;
  shape?: string | undefined;
  target?: string | undefined;
}

interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
  href?: string | undefined;
  target?: string | undefined;
}

interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string | undefined;
}

interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
  autoFocus?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  formAction?: string | undefined;
  formEncType?: string | undefined;
  formMethod?: string | undefined;
  formNoValidate?: boolean | undefined;
  formTarget?: string | undefined;
  name?: string | undefined;
  type?: 'submit' | 'reset' | 'button' | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string | undefined;
  width?: number | string | undefined;
}

interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
  span?: number | undefined;
  width?: number | string | undefined;
}

interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
  span?: number | undefined;
}

interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number | undefined;
}

interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
  open?: boolean | undefined;
  onToggle?: EventHandler<T> | undefined;
}

interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string | undefined;
  dateTime?: string | undefined;
}

interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
  onCancel?: EventHandler<T>;
  onClose?: EventHandler<T>;
  open?: boolean | undefined;
}

interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string | undefined;
  src?: string | undefined;
  type?: string | undefined;
  width?: number | string | undefined;
}

interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean | undefined;
  form?: string | undefined;
  name?: string | undefined;
}

interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
  acceptCharset?: string | undefined;
  action?: string | undefined;
  autoComplete?: string | undefined;
  encType?: string | undefined;
  method?: string | undefined;
  name?: string | undefined;
  noValidate?: boolean | undefined;
  target?: string | undefined;
  rel?: string | undefined;
}

interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
  manifest?: string | undefined;
}

interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
  allow?: string | undefined;
  allowFullScreen?: boolean | undefined;
  allowTransparency?: boolean | undefined;
  /** @deprecated */
  frameBorder?: number | string | undefined;
  height?: number | string | undefined;
  loading?: 'eager' | 'lazy' | undefined;
  /** @deprecated */
  marginHeight?: number | undefined;
  /** @deprecated */
  marginWidth?: number | undefined;
  name?: string | undefined;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  sandbox?: string | undefined;
  /** @deprecated */
  scrolling?: string | undefined;
  seamless?: boolean | undefined;
  src?: string | undefined;
  srcDoc?: string | undefined;
  width?: number | string | undefined;
}

interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
  alt?: string | undefined;
  crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
  decoding?: 'async' | 'auto' | 'sync' | undefined;
  height?: number | string | undefined;
  loading?: 'eager' | 'lazy' | undefined;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  sizes?: string | undefined;
  src?: string | undefined;
  srcSet?: string | undefined;
  useMap?: string | undefined;
  width?: number | string | undefined;
}

interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string | undefined;
  dateTime?: string | undefined;
}

type HTMLInputTypeAttribute =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'
  | (string & {});

interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
  accept?: string | undefined;
  alt?: string | undefined;
  autoComplete?: string | undefined;
  autoFocus?: boolean | undefined;
  capture?: boolean | 'user' | 'environment' | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
  checked?: boolean | undefined;
  crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
  disabled?: boolean | undefined;
  enterKeyHint?:
    | 'enter'
    | 'done'
    | 'go'
    | 'next'
    | 'previous'
    | 'search'
    | 'send'
    | undefined;
  form?: string | undefined;
  formAction?: string | undefined;
  formEncType?: string | undefined;
  formMethod?: string | undefined;
  formNoValidate?: boolean | undefined;
  formTarget?: string | undefined;
  height?: number | string | undefined;
  list?: string | undefined;
  max?: number | string | undefined;
  maxLength?: number | undefined;
  min?: number | string | undefined;
  minLength?: number | undefined;
  multiple?: boolean | undefined;
  name?: string | undefined;
  pattern?: string | undefined;
  placeholder?: string | undefined;
  readOnly?: boolean | undefined;
  required?: boolean | undefined;
  size?: number | undefined;
  src?: string | undefined;
  step?: number | string | undefined;
  type?: HTMLInputTypeAttribute | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  width?: number | string | undefined;

  onChange?: EventHandler<T> | undefined;
}

interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
  autoFocus?: boolean | undefined;
  challenge?: string | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  keyType?: string | undefined;
  keyParams?: string | undefined;
  name?: string | undefined;
}

interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string | undefined;
  htmlFor?: string | undefined;
}

interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number | undefined;
}

interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
  as?: string | undefined;
  crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
  href?: string | undefined;
  hrefLang?: string | undefined;
  integrity?: string | undefined;
  media?: string | undefined;
  imageSrcSet?: string | undefined;
  imageSizes?: string | undefined;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  rel?: string | undefined;
  sizes?: string | undefined;
  type?: string | undefined;
  charSet?: string | undefined;
}

interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string | undefined;
}

interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
  type?: string | undefined;
}

interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
  charSet?: string | undefined;
  content?: string | undefined;
  httpEquiv?: string | undefined;
  name?: string | undefined;
  media?: string | undefined;
}

interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string | undefined;
  high?: number | undefined;
  low?: number | undefined;
  max?: number | string | undefined;
  min?: number | string | undefined;
  optimum?: number | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
  cite?: string | undefined;
}

interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
  classID?: string | undefined;
  data?: string | undefined;
  form?: string | undefined;
  height?: number | string | undefined;
  name?: string | undefined;
  type?: string | undefined;
  useMap?: string | undefined;
  width?: number | string | undefined;
  wmode?: string | undefined;
}

interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
  reversed?: boolean | undefined;
  start?: number | undefined;
  type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
}

interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean | undefined;
  label?: string | undefined;
}

interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
  disabled?: boolean | undefined;
  label?: string | undefined;
  selected?: boolean | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
  form?: string | undefined;
  htmlFor?: string | undefined;
  name?: string | undefined;
}

interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
  max?: number | string | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
}

interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
  name?: string | undefined;
}

interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
  async?: boolean | undefined;
  /** @deprecated */
  charSet?: string | undefined;
  crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
  defer?: boolean | undefined;
  integrity?: string | undefined;
  noModule?: boolean | undefined;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  src?: string | undefined;
  type?: string | undefined;
}

interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
  autoComplete?: string | undefined;
  autoFocus?: boolean | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  multiple?: boolean | undefined;
  name?: string | undefined;
  required?: boolean | undefined;
  size?: number | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  onChange?: EventHandler<T> | undefined;
}

interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
  height?: number | string | undefined;
  media?: string | undefined;
  sizes?: string | undefined;
  src?: string | undefined;
  srcSet?: string | undefined;
  type?: string | undefined;
  width?: number | string | undefined;
}

interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
  media?: string | undefined;
  scoped?: boolean | undefined;
  type?: string | undefined;
}

interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
  align?: 'left' | 'center' | 'right' | undefined;
  bgcolor?: string | undefined;
  border?: number | undefined;
  cellPadding?: number | string | undefined;
  cellSpacing?: number | string | undefined;
  frame?: boolean | undefined;
  rules?: 'none' | 'groups' | 'rows' | 'columns' | 'all' | undefined;
  summary?: string | undefined;
  width?: number | string | undefined;
}

interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
  autoComplete?: string | undefined;
  autoFocus?: boolean | undefined;
  cols?: number | undefined;
  dirName?: string | undefined;
  disabled?: boolean | undefined;
  form?: string | undefined;
  maxLength?: number | undefined;
  minLength?: number | undefined;
  name?: string | undefined;
  placeholder?: string | undefined;
  readOnly?: boolean | undefined;
  required?: boolean | undefined;
  rows?: number | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  wrap?: string | undefined;

  onChange?: EventHandler<T> | undefined;
}

interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
  colSpan?: number | undefined;
  headers?: string | undefined;
  rowSpan?: number | undefined;
  scope?: string | undefined;
  abbr?: string | undefined;
  height?: number | string | undefined;
  width?: number | string | undefined;
  valign?: 'top' | 'middle' | 'bottom' | 'baseline' | undefined;
}

interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char' | undefined;
  colSpan?: number | undefined;
  headers?: string | undefined;
  rowSpan?: number | undefined;
  scope?: string | undefined;
  abbr?: string | undefined;
}

interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
  dateTime?: string | undefined;
}

interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
  default?: boolean | undefined;
  kind?: string | undefined;
  label?: string | undefined;
  src?: string | undefined;
  srcLang?: string | undefined;
}

interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
  height?: number | string | undefined;
  playsInline?: boolean | undefined;
  poster?: string | undefined;
  width?: number | string | undefined;
  disablePictureInPicture?: boolean | undefined;
  disableRemotePlayback?: boolean | undefined;
}

interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
  allowFullScreen?: boolean | undefined;
  allowpopups?: boolean | undefined;
  autoFocus?: boolean | undefined;
  autosize?: boolean | undefined;
  blinkfeatures?: string | undefined;
  disableblinkfeatures?: string | undefined;
  disableguestresize?: boolean | undefined;
  disablewebsecurity?: boolean | undefined;
  guestinstance?: string | undefined;
  httpreferrer?: string | undefined;
  nodeintegration?: boolean | undefined;
  partition?: string | undefined;
  plugins?: boolean | undefined;
  preload?: string | undefined;
  src?: string | undefined;
  useragent?: string | undefined;
  webpreferences?: string | undefined;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // HTML
      a: AttributeRecord<AnchorHTMLAttributes<HTMLAnchorElement>>;
      abbr: AttributeRecord<HTMLAttributes<HTMLElement>>;
      address: AttributeRecord<HTMLAttributes<HTMLElement>>;
      area: AttributeRecord<AreaHTMLAttributes<HTMLAreaElement>>;
      article: AttributeRecord<HTMLAttributes<HTMLElement>>;
      aside: AttributeRecord<HTMLAttributes<HTMLElement>>;
      audio: AttributeRecord<AudioHTMLAttributes<HTMLAudioElement>>;
      b: AttributeRecord<HTMLAttributes<HTMLElement>>;
      base: AttributeRecord<BaseHTMLAttributes<HTMLBaseElement>>;
      bdi: AttributeRecord<HTMLAttributes<HTMLElement>>;
      bdo: AttributeRecord<HTMLAttributes<HTMLElement>>;
      big: AttributeRecord<HTMLAttributes<HTMLElement>>;
      blockquote: AttributeRecord<BlockquoteHTMLAttributes<HTMLQuoteElement>>;
      body: AttributeRecord<HTMLAttributes<HTMLBodyElement>>;
      br: AttributeRecord<HTMLAttributes<HTMLBRElement>>;
      button: AttributeRecord<ButtonHTMLAttributes<HTMLButtonElement>>;
      canvas: AttributeRecord<CanvasHTMLAttributes<HTMLCanvasElement>>;
      caption: AttributeRecord<HTMLAttributes<HTMLElement>>;
      center: AttributeRecord<HTMLAttributes<HTMLElement>>;
      cite: AttributeRecord<HTMLAttributes<HTMLElement>>;
      code: AttributeRecord<HTMLAttributes<HTMLElement>>;
      col: AttributeRecord<ColHTMLAttributes<HTMLTableColElement>>;
      colgroup: AttributeRecord<ColgroupHTMLAttributes<HTMLTableColElement>>;
      data: AttributeRecord<DataHTMLAttributes<HTMLDataElement>>;
      datalist: AttributeRecord<HTMLAttributes<HTMLDataListElement>>;
      dd: AttributeRecord<HTMLAttributes<HTMLElement>>;
      del: AttributeRecord<DelHTMLAttributes<HTMLModElement>>;
      details: AttributeRecord<DetailsHTMLAttributes<HTMLDetailsElement>>;
      dfn: AttributeRecord<HTMLAttributes<HTMLElement>>;
      dialog: AttributeRecord<DialogHTMLAttributes<HTMLDialogElement>>;
      div: AttributeRecord<HTMLAttributes<HTMLDivElement>>;
      dl: AttributeRecord<HTMLAttributes<HTMLDListElement>>;
      dt: AttributeRecord<HTMLAttributes<HTMLElement>>;
      em: AttributeRecord<HTMLAttributes<HTMLElement>>;
      embed: AttributeRecord<EmbedHTMLAttributes<HTMLEmbedElement>>;
      fieldset: AttributeRecord<FieldsetHTMLAttributes<HTMLFieldSetElement>>;
      figcaption: AttributeRecord<HTMLAttributes<HTMLElement>>;
      figure: AttributeRecord<HTMLAttributes<HTMLElement>>;
      footer: AttributeRecord<HTMLAttributes<HTMLElement>>;
      form: AttributeRecord<FormHTMLAttributes<HTMLFormElement>>;
      h1: AttributeRecord<HTMLAttributes<HTMLHeadingElement>>;
      h2: AttributeRecord<HTMLAttributes<HTMLHeadingElement>>;
      h3: AttributeRecord<HTMLAttributes<HTMLHeadingElement>>;
      h4: AttributeRecord<HTMLAttributes<HTMLHeadingElement>>;
      h5: AttributeRecord<HTMLAttributes<HTMLHeadingElement>>;
      h6: AttributeRecord<HTMLAttributes<HTMLHeadingElement>>;
      head: AttributeRecord<HTMLAttributes<HTMLHeadElement>>;
      header: AttributeRecord<HTMLAttributes<HTMLElement>>;
      hgroup: AttributeRecord<HTMLAttributes<HTMLElement>>;
      hr: AttributeRecord<HTMLAttributes<HTMLHRElement>>;
      html: AttributeRecord<HtmlHTMLAttributes<HTMLHtmlElement>>;
      i: AttributeRecord<HTMLAttributes<HTMLElement>>;
      iframe: AttributeRecord<IframeHTMLAttributes<HTMLIFrameElement>>;
      img: AttributeRecord<ImgHTMLAttributes<HTMLImageElement>>;
      input: AttributeRecord<InputHTMLAttributes<HTMLInputElement>>;
      ins: AttributeRecord<InsHTMLAttributes<HTMLModElement>>;
      kbd: AttributeRecord<HTMLAttributes<HTMLElement>>;
      keygen: AttributeRecord<KeygenHTMLAttributes<HTMLElement>>;
      label: AttributeRecord<LabelHTMLAttributes<HTMLLabelElement>>;
      legend: AttributeRecord<HTMLAttributes<HTMLLegendElement>>;
      li: AttributeRecord<LiHTMLAttributes<HTMLLIElement>>;
      link: AttributeRecord<LinkHTMLAttributes<HTMLLinkElement>>;
      main: AttributeRecord<HTMLAttributes<HTMLElement>>;
      map: AttributeRecord<MapHTMLAttributes<HTMLMapElement>>;
      mark: AttributeRecord<HTMLAttributes<HTMLElement>>;
      menu: AttributeRecord<MenuHTMLAttributes<HTMLElement>>;
      menuitem: AttributeRecord<HTMLAttributes<HTMLElement>>;
      meta: AttributeRecord<MetaHTMLAttributes<HTMLMetaElement>>;
      meter: AttributeRecord<MeterHTMLAttributes<HTMLMeterElement>>;
      nav: AttributeRecord<HTMLAttributes<HTMLElement>>;
      noindex: AttributeRecord<HTMLAttributes<HTMLElement>>;
      noscript: AttributeRecord<HTMLAttributes<HTMLElement>>;
      object: AttributeRecord<ObjectHTMLAttributes<HTMLObjectElement>>;
      ol: AttributeRecord<OlHTMLAttributes<HTMLOListElement>>;
      optgroup: AttributeRecord<OptgroupHTMLAttributes<HTMLOptGroupElement>>;
      option: AttributeRecord<OptionHTMLAttributes<HTMLOptionElement>>;
      output: AttributeRecord<OutputHTMLAttributes<HTMLOutputElement>>;
      p: AttributeRecord<HTMLAttributes<HTMLParagraphElement>>;
      param: AttributeRecord<ParamHTMLAttributes<HTMLParamElement>>;
      picture: AttributeRecord<HTMLAttributes<HTMLElement>>;
      pre: AttributeRecord<HTMLAttributes<HTMLPreElement>>;
      progress: AttributeRecord<ProgressHTMLAttributes<HTMLProgressElement>>;
      q: AttributeRecord<QuoteHTMLAttributes<HTMLQuoteElement>>;
      rp: AttributeRecord<HTMLAttributes<HTMLElement>>;
      rt: AttributeRecord<HTMLAttributes<HTMLElement>>;
      ruby: AttributeRecord<HTMLAttributes<HTMLElement>>;
      s: AttributeRecord<HTMLAttributes<HTMLElement>>;
      samp: AttributeRecord<HTMLAttributes<HTMLElement>>;
      slot: AttributeRecord<SlotHTMLAttributes<HTMLSlotElement>>;
      script: AttributeRecord<ScriptHTMLAttributes<HTMLScriptElement>>;
      section: AttributeRecord<HTMLAttributes<HTMLElement>>;
      select: AttributeRecord<SelectHTMLAttributes<HTMLSelectElement>>;
      small: AttributeRecord<HTMLAttributes<HTMLElement>>;
      source: AttributeRecord<SourceHTMLAttributes<HTMLSourceElement>>;
      span: AttributeRecord<HTMLAttributes<HTMLSpanElement>>;
      strong: AttributeRecord<HTMLAttributes<HTMLElement>>;
      style: AttributeRecord<StyleHTMLAttributes<HTMLStyleElement>>;
      sub: AttributeRecord<HTMLAttributes<HTMLElement>>;
      summary: AttributeRecord<HTMLAttributes<HTMLElement>>;
      sup: AttributeRecord<HTMLAttributes<HTMLElement>>;
      table: AttributeRecord<TableHTMLAttributes<HTMLTableElement>>;
      template: AttributeRecord<HTMLAttributes<HTMLTemplateElement>>;
      tbody: AttributeRecord<HTMLAttributes<HTMLTableSectionElement>>;
      td: AttributeRecord<TdHTMLAttributes<HTMLTableDataCellElement>>;
      textarea: AttributeRecord<TextareaHTMLAttributes<HTMLTextAreaElement>>;
      tfoot: AttributeRecord<HTMLAttributes<HTMLTableSectionElement>>;
      th: AttributeRecord<ThHTMLAttributes<HTMLTableHeaderCellElement>>;
      thead: AttributeRecord<HTMLAttributes<HTMLTableSectionElement>>;
      time: AttributeRecord<TimeHTMLAttributes<HTMLTimeElement>>;
      title: AttributeRecord<HTMLAttributes<HTMLTitleElement>>;
      tr: AttributeRecord<HTMLAttributes<HTMLTableRowElement>>;
      track: AttributeRecord<TrackHTMLAttributes<HTMLTrackElement>>;
      u: AttributeRecord<HTMLAttributes<HTMLElement>>;
      ul: AttributeRecord<HTMLAttributes<HTMLUListElement>>;
      var: AttributeRecord<HTMLAttributes<HTMLElement>>;
      video: AttributeRecord<VideoHTMLAttributes<HTMLVideoElement>>;
      wbr: AttributeRecord<HTMLAttributes<HTMLElement>>;
      webview: AttributeRecord<WebViewHTMLAttributes<HTMLWebViewElement>>;
    }
  }
}

const directProperties: { [key: string]: string } = {
  // direct properties.
  value: 'value',
  className: 'className',
  autoFocus: 'autofocus',
  placeholder: 'placeholder',
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
    if (typeof v === 'function') {
      (dom as any)[key.toLowerCase()] = v;
    } else if (directProperties[key]) {
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
  setCSSProperty(dom: HTMLElement, key: string, v: unknown): void {
    (dom.style as any)[key] = v;
  },

  setTextContent(node: Text, text: string): void {
    node.textContent = text;
  },
});
