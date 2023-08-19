import { IBoxedValue, JSXNode, Ref } from './common';
import * as CSS from 'csstype';

export type AttributeValue<T> = T extends (...args: any) => any
  ? T
  : T extends undefined
  ? T
  : T | IBoxedValue<T>;

export type Booleanish = boolean | 'true' | 'false';

export type AttributeRecord<P> = { [K in keyof P]?: AttributeValue<P[K]> };

export interface AriaAttributes {
  /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
  'aria-activedescendant'?: string | undefined;
  /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
  'aria-atomic'?: Booleanish | undefined;
  /**
   * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
   * presented if they are made.
   */
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
  /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
  'aria-busy'?: Booleanish | undefined;
  /**
   * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
   * @see aria-pressed @see aria-selected.
   */
  'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
  /**
   * Defines the total number of columns in a table, grid, or treegrid.
   * @see aria-colindex.
   */
  'aria-colcount'?: number | undefined;
  /**
   * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
   * @see aria-colcount @see aria-colspan.
   */
  'aria-colindex'?: number | undefined;
  /**
   * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-colindex @see aria-rowspan.
   */
  'aria-colspan'?: number | undefined;
  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   * @see aria-owns.
   */
  'aria-controls'?: string | undefined;
  /** Indicates the element that represents the current item within a container or set of related elements. */
  'aria-current'?:
    | boolean
    | 'false'
    | 'true'
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
    | undefined;
  /**
   * Identifies the element (or elements) that describes the object.
   * @see aria-labelledby
   */
  'aria-describedby'?: string | undefined;
  /**
   * Identifies the element that provides a detailed, extended description for the object.
   * @see aria-describedby.
   */
  'aria-details'?: string | undefined;
  /**
   * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
   * @see aria-hidden @see aria-readonly.
   */
  'aria-disabled'?: Booleanish | undefined;
  /**
   * Indicates what functions can be performed when a dragged object is released on the drop target.
   * @deprecated in ARIA 1.1
   */
  'aria-dropeffect'?:
    | 'none'
    | 'copy'
    | 'execute'
    | 'link'
    | 'move'
    | 'popup'
    | undefined;
  /**
   * Identifies the element that provides an error message for the object.
   * @see aria-invalid @see aria-describedby.
   */
  'aria-errormessage'?: string | undefined;
  /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
  'aria-expanded'?: Booleanish | undefined;
  /**
   * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
   * allows assistive technology to override the general default of reading in document source order.
   */
  'aria-flowto'?: string | undefined;
  /**
   * Indicates an element's "grabbed" state in a drag-and-drop operation.
   * @deprecated in ARIA 1.1
   */
  'aria-grabbed'?: Booleanish | undefined;
  /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
  'aria-haspopup'?:
    | boolean
    | 'false'
    | 'true'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog'
    | undefined;
  /**
   * Indicates whether the element is exposed to an accessibility API.
   * @see aria-disabled.
   */
  'aria-hidden'?: Booleanish | undefined;
  /**
   * Indicates the entered value does not conform to the format expected by the application.
   * @see aria-errormessage.
   */
  'aria-invalid'?:
    | boolean
    | 'false'
    | 'true'
    | 'grammar'
    | 'spelling'
    | undefined;
  /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
  'aria-keyshortcuts'?: string | undefined;
  /**
   * Defines a string value that labels the current element.
   * @see aria-labelledby.
   */
  'aria-label'?: string | undefined;
  /**
   * Identifies the element (or elements) that labels the current element.
   * @see aria-describedby.
   */
  'aria-labelledby'?: string | undefined;
  /** Defines the hierarchical level of an element within a structure. */
  'aria-level'?: number | undefined;
  /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
  'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
  /** Indicates whether an element is modal when displayed. */
  'aria-modal'?: Booleanish | undefined;
  /** Indicates whether a text box accepts multiple lines of input or only a single line. */
  'aria-multiline'?: Booleanish | undefined;
  /** Indicates that the user may select more than one item from the current selectable descendants. */
  'aria-multiselectable'?: Booleanish | undefined;
  /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
  'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
  /**
   * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
   * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
   * @see aria-controls.
   */
  'aria-owns'?: string | undefined;
  /**
   * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
   * A hint could be a sample value or a brief description of the expected format.
   */
  'aria-placeholder'?: string | undefined;
  /**
   * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-setsize.
   */
  'aria-posinset'?: number | undefined;
  /**
   * Indicates the current "pressed" state of toggle buttons.
   * @see aria-checked @see aria-selected.
   */
  'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
  /**
   * Indicates that the element is not editable, but is otherwise operable.
   * @see aria-disabled.
   */
  'aria-readonly'?: Booleanish | undefined;
  /**
   * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
   * @see aria-atomic.
   */
  'aria-relevant'?:
    | 'additions'
    | 'additions removals'
    | 'additions text'
    | 'all'
    | 'removals'
    | 'removals additions'
    | 'removals text'
    | 'text'
    | 'text additions'
    | 'text removals'
    | undefined;
  /** Indicates that user input is required on the element before a form may be submitted. */
  'aria-required'?: Booleanish | undefined;
  /** Defines a human-readable, author-localized description for the role of an element. */
  'aria-roledescription'?: string | undefined;
  /**
   * Defines the total number of rows in a table, grid, or treegrid.
   * @see aria-rowindex.
   */
  'aria-rowcount'?: number | undefined;
  /**
   * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @see aria-rowcount @see aria-rowspan.
   */
  'aria-rowindex'?: number | undefined;
  /**
   * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
   * @see aria-rowindex @see aria-colspan.
   */
  'aria-rowspan'?: number | undefined;
  /**
   * Indicates the current "selected" state of various widgets.
   * @see aria-checked @see aria-pressed.
   */
  'aria-selected'?: Booleanish | undefined;
  /**
   * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see aria-posinset.
   */
  'aria-setsize'?: number | undefined;
  /** Indicates if items in a table or grid are sorted in ascending or descending order. */
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
  /** Defines the maximum allowed value for a range widget. */
  'aria-valuemax'?: number | undefined;
  /** Defines the minimum allowed value for a range widget. */
  'aria-valuemin'?: number | undefined;
  /**
   * Defines the current value for a range widget.
   * @see aria-valuetext.
   */
  'aria-valuenow'?: number | undefined;
  /** Defines the human readable text alternative of aria-valuenow for a range widget. */
  'aria-valuetext'?: string | undefined;
}

export type EventHandler<T, E = Event> = (
  event: E & { currentTarget: T }
) => void;

type ClipboardEventHandler<T = Element> = EventHandler<T, ClipboardEvent>;
type CompositionEventHandler<T = Element> = EventHandler<T, CompositionEvent>;
type DragEventHandler<T = Element> = EventHandler<T, DragEvent>;
type FocusEventHandler<T = Element> = EventHandler<T, FocusEvent>;
type FormEventHandler<T = Element> = EventHandler<T, Event>;
type KeyboardEventHandler<T = Element> = EventHandler<T, KeyboardEvent>;
type MouseEventHandler<T = Element> = EventHandler<T, MouseEvent>;
type TouchEventHandler<T = Element> = EventHandler<T, TouchEvent>;
type PointerEventHandler<T = Element> = EventHandler<T, PointerEvent>;
type UIEventHandler<T = Element> = EventHandler<T, UIEvent>;
type WheelEventHandler<T = Element> = EventHandler<T, WheelEvent>;
type AnimationEventHandler<T = Element> = EventHandler<T, AnimationEvent>;
type TransitionEventHandler<T = Element> = EventHandler<T, TransitionEvent>;

export interface DOMAttributes<T> {
  ref?: Ref<T>;

  children?: JSXNode | undefined;
  dangerouslySetInnerHTML?:
    | {
        __html: string;
      }
    | undefined;

  // Clipboard Events
  onCopy?: ClipboardEventHandler<T> | undefined;
  onCopyCapture?: ClipboardEventHandler<T> | undefined;
  onCut?: ClipboardEventHandler<T> | undefined;
  onCutCapture?: ClipboardEventHandler<T> | undefined;
  onPaste?: ClipboardEventHandler<T> | undefined;
  onPasteCapture?: ClipboardEventHandler<T> | undefined;

  // Composition Events
  onCompositionEnd?: CompositionEventHandler<T> | undefined;
  onCompositionEndCapture?: CompositionEventHandler<T> | undefined;
  onCompositionStart?: CompositionEventHandler<T> | undefined;
  onCompositionStartCapture?: CompositionEventHandler<T> | undefined;
  onCompositionUpdate?: CompositionEventHandler<T> | undefined;
  onCompositionUpdateCapture?: CompositionEventHandler<T> | undefined;

  // Focus Events
  onFocus?: FocusEventHandler<T> | undefined;
  onFocusCapture?: FocusEventHandler<T> | undefined;
  onBlur?: FocusEventHandler<T> | undefined;
  onBlurCapture?: FocusEventHandler<T> | undefined;

  // Form Events
  onChange?: FormEventHandler<T> | undefined;
  onChangeCapture?: FormEventHandler<T> | undefined;
  onBeforeInput?: FormEventHandler<T> | undefined;
  onBeforeInputCapture?: FormEventHandler<T> | undefined;
  onInput?: FormEventHandler<T> | undefined;
  onInputCapture?: FormEventHandler<T> | undefined;
  onReset?: FormEventHandler<T> | undefined;
  onResetCapture?: FormEventHandler<T> | undefined;
  onSubmit?: FormEventHandler<T> | undefined;
  onSubmitCapture?: FormEventHandler<T> | undefined;
  onInvalid?: FormEventHandler<T> | undefined;
  onInvalidCapture?: FormEventHandler<T> | undefined;

  // Image Events
  onLoad?: EventHandler<T> | undefined;
  onLoadCapture?: EventHandler<T> | undefined;
  onError?: EventHandler<T> | undefined; // also a Media Event
  onErrorCapture?: EventHandler<T> | undefined; // also a Media Event

  // Keyboard Events
  onKeyDown?: KeyboardEventHandler<T> | undefined;
  onKeyDownCapture?: KeyboardEventHandler<T> | undefined;
  /** @deprecated */
  onKeyPress?: KeyboardEventHandler<T> | undefined;
  /** @deprecated */
  onKeyPressCapture?: KeyboardEventHandler<T> | undefined;
  onKeyUp?: KeyboardEventHandler<T> | undefined;
  onKeyUpCapture?: KeyboardEventHandler<T> | undefined;

  // Media Events
  onAbort?: EventHandler<T> | undefined;
  onAbortCapture?: EventHandler<T> | undefined;
  onCanPlay?: EventHandler<T> | undefined;
  onCanPlayCapture?: EventHandler<T> | undefined;
  onCanPlayThrough?: EventHandler<T> | undefined;
  onCanPlayThroughCapture?: EventHandler<T> | undefined;
  onDurationChange?: EventHandler<T> | undefined;
  onDurationChangeCapture?: EventHandler<T> | undefined;
  onEmptied?: EventHandler<T> | undefined;
  onEmptiedCapture?: EventHandler<T> | undefined;
  onEncrypted?: EventHandler<T> | undefined;
  onEncryptedCapture?: EventHandler<T> | undefined;
  onEnded?: EventHandler<T> | undefined;
  onEndedCapture?: EventHandler<T> | undefined;
  onLoadedData?: EventHandler<T> | undefined;
  onLoadedDataCapture?: EventHandler<T> | undefined;
  onLoadedMetadata?: EventHandler<T> | undefined;
  onLoadedMetadataCapture?: EventHandler<T> | undefined;
  onLoadStart?: EventHandler<T> | undefined;
  onLoadStartCapture?: EventHandler<T> | undefined;
  onPause?: EventHandler<T> | undefined;
  onPauseCapture?: EventHandler<T> | undefined;
  onPlay?: EventHandler<T> | undefined;
  onPlayCapture?: EventHandler<T> | undefined;
  onPlaying?: EventHandler<T> | undefined;
  onPlayingCapture?: EventHandler<T> | undefined;
  onProgress?: EventHandler<T> | undefined;
  onProgressCapture?: EventHandler<T> | undefined;
  onRateChange?: EventHandler<T> | undefined;
  onRateChangeCapture?: EventHandler<T> | undefined;
  onResize?: EventHandler<T> | undefined;
  onResizeCapture?: EventHandler<T> | undefined;
  onSeeked?: EventHandler<T> | undefined;
  onSeekedCapture?: EventHandler<T> | undefined;
  onSeeking?: EventHandler<T> | undefined;
  onSeekingCapture?: EventHandler<T> | undefined;
  onStalled?: EventHandler<T> | undefined;
  onStalledCapture?: EventHandler<T> | undefined;
  onSuspend?: EventHandler<T> | undefined;
  onSuspendCapture?: EventHandler<T> | undefined;
  onTimeUpdate?: EventHandler<T> | undefined;
  onTimeUpdateCapture?: EventHandler<T> | undefined;
  onVolumeChange?: EventHandler<T> | undefined;
  onVolumeChangeCapture?: EventHandler<T> | undefined;
  onWaiting?: EventHandler<T> | undefined;
  onWaitingCapture?: EventHandler<T> | undefined;

  // MouseEvents
  onAuxClick?: MouseEventHandler<T> | undefined;
  onAuxClickCapture?: MouseEventHandler<T> | undefined;
  onClick?: MouseEventHandler<T> | undefined;
  onClickCapture?: MouseEventHandler<T> | undefined;
  onContextMenu?: MouseEventHandler<T> | undefined;
  onContextMenuCapture?: MouseEventHandler<T> | undefined;
  onDoubleClick?: MouseEventHandler<T> | undefined;
  onDoubleClickCapture?: MouseEventHandler<T> | undefined;
  onDrag?: DragEventHandler<T> | undefined;
  onDragCapture?: DragEventHandler<T> | undefined;
  onDragEnd?: DragEventHandler<T> | undefined;
  onDragEndCapture?: DragEventHandler<T> | undefined;
  onDragEnter?: DragEventHandler<T> | undefined;
  onDragEnterCapture?: DragEventHandler<T> | undefined;
  onDragExit?: DragEventHandler<T> | undefined;
  onDragExitCapture?: DragEventHandler<T> | undefined;
  onDragLeave?: DragEventHandler<T> | undefined;
  onDragLeaveCapture?: DragEventHandler<T> | undefined;
  onDragOver?: DragEventHandler<T> | undefined;
  onDragOverCapture?: DragEventHandler<T> | undefined;
  onDragStart?: DragEventHandler<T> | undefined;
  onDragStartCapture?: DragEventHandler<T> | undefined;
  onDrop?: DragEventHandler<T> | undefined;
  onDropCapture?: DragEventHandler<T> | undefined;
  onMouseDown?: MouseEventHandler<T> | undefined;
  onMouseDownCapture?: MouseEventHandler<T> | undefined;
  onMouseEnter?: MouseEventHandler<T> | undefined;
  onMouseLeave?: MouseEventHandler<T> | undefined;
  onMouseMove?: MouseEventHandler<T> | undefined;
  onMouseMoveCapture?: MouseEventHandler<T> | undefined;
  onMouseOut?: MouseEventHandler<T> | undefined;
  onMouseOutCapture?: MouseEventHandler<T> | undefined;
  onMouseOver?: MouseEventHandler<T> | undefined;
  onMouseOverCapture?: MouseEventHandler<T> | undefined;
  onMouseUp?: MouseEventHandler<T> | undefined;
  onMouseUpCapture?: MouseEventHandler<T> | undefined;

  // Selection Events
  onSelect?: EventHandler<T> | undefined;
  onSelectCapture?: EventHandler<T> | undefined;

  // Touch Events
  onTouchCancel?: TouchEventHandler<T> | undefined;
  onTouchCancelCapture?: TouchEventHandler<T> | undefined;
  onTouchEnd?: TouchEventHandler<T> | undefined;
  onTouchEndCapture?: TouchEventHandler<T> | undefined;
  onTouchMove?: TouchEventHandler<T> | undefined;
  onTouchMoveCapture?: TouchEventHandler<T> | undefined;
  onTouchStart?: TouchEventHandler<T> | undefined;
  onTouchStartCapture?: TouchEventHandler<T> | undefined;

  // Pointer Events
  onPointerDown?: PointerEventHandler<T> | undefined;
  onPointerDownCapture?: PointerEventHandler<T> | undefined;
  onPointerMove?: PointerEventHandler<T> | undefined;
  onPointerMoveCapture?: PointerEventHandler<T> | undefined;
  onPointerUp?: PointerEventHandler<T> | undefined;
  onPointerUpCapture?: PointerEventHandler<T> | undefined;
  onPointerCancel?: PointerEventHandler<T> | undefined;
  onPointerCancelCapture?: PointerEventHandler<T> | undefined;
  onPointerEnter?: PointerEventHandler<T> | undefined;
  onPointerEnterCapture?: PointerEventHandler<T> | undefined;
  onPointerLeave?: PointerEventHandler<T> | undefined;
  onPointerLeaveCapture?: PointerEventHandler<T> | undefined;
  onPointerOver?: PointerEventHandler<T> | undefined;
  onPointerOverCapture?: PointerEventHandler<T> | undefined;
  onPointerOut?: PointerEventHandler<T> | undefined;
  onPointerOutCapture?: PointerEventHandler<T> | undefined;
  onGotPointerCapture?: PointerEventHandler<T> | undefined;
  onGotPointerCaptureCapture?: PointerEventHandler<T> | undefined;
  onLostPointerCapture?: PointerEventHandler<T> | undefined;
  onLostPointerCaptureCapture?: PointerEventHandler<T> | undefined;

  // UI Events
  onScroll?: UIEventHandler<T> | undefined;
  onScrollCapture?: UIEventHandler<T> | undefined;

  // Wheel Events
  onWheel?: WheelEventHandler<T> | undefined;
  onWheelCapture?: WheelEventHandler<T> | undefined;

  // Animation Events
  onAnimationStart?: AnimationEventHandler<T> | undefined;
  onAnimationStartCapture?: AnimationEventHandler<T> | undefined;
  onAnimationEnd?: AnimationEventHandler<T> | undefined;
  onAnimationEndCapture?: AnimationEventHandler<T> | undefined;
  onAnimationIteration?: AnimationEventHandler<T> | undefined;
  onAnimationIterationCapture?: AnimationEventHandler<T> | undefined;

  // Transition Events
  onTransitionEnd?: TransitionEventHandler<T> | undefined;
  onTransitionEndCapture?: TransitionEventHandler<T> | undefined;
}

export type AriaRole =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem'
  | (string & {});

declare global {
  interface HTMLWebViewElement extends HTMLElement {}
}

export interface CSSProperties extends CSS.Properties<string | number> {}
