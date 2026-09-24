'use client';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type DialogHTMLAttributes,
  type RefObject,
} from 'react';
import { useControllable } from '../../foundations/useControllable';
import { tabStops } from '../../foundations/tabStops';
import { Button } from '../Button/Button';
import styles from './Dialog.module.css';
interface State {
  open: boolean;
  setOpen: (value: boolean) => void;
  id: string;
  trigger: RefObject<HTMLButtonElement | null>;
  hasDescription: boolean;
  setDescription: (value: boolean) => void;
}
const Context = createContext<State | null>(null);
function useDialog() {
  const state = useContext(Context);
  if (!state) throw new Error('Dialog parts require Dialog');
  return state;
}
export interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (value: boolean) => void;
}
function Root({ children, open, defaultOpen = false, onOpenChange }: DialogProps) {
  const [visible, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [hasDescription, setDescription] = useState(false);
  return (
    <Context.Provider
      value={{ open: visible, setOpen, id, trigger, hasDescription, setDescription }}
    >
      {children}
    </Context.Provider>
  );
}
function Trigger({ onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const state = useDialog();
  return (
    <Button
      {...props}
      ref={state.trigger}
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) state.setOpen(true);
      }}
    />
  );
}
export interface DialogContentProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
}
function Content({
  initialFocusRef,
  returnFocusRef,
  children,
  onCancel,
  onClose,
  onKeyDown,
  ...props
}: DialogContentProps) {
  const state = useDialog();
  const dialog = useRef<HTMLDialogElement>(null);
  const closingFromEffect = useRef(false);
  const latest = useRef({ state, initialFocusRef, returnFocusRef });
  latest.current = { state, initialFocusRef, returnFocusRef };
  useEffect(() => {
    const element = dialog.current;
    if (!element || !state.open) return;
    if (document.querySelector('dialog[open]'))
      throw new Error('Nested or simultaneous dialogs are outside the v1 contract');
    const opener =
      latest.current.returnFocusRef?.current ??
      state.trigger.current ??
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    (
      (latest.current.initialFocusRef?.current &&
      element.contains(latest.current.initialFocusRef.current)
        ? latest.current.initialFocusRef.current
        : undefined) ??
      element.querySelector<HTMLElement>('[data-dialog-title]') ??
      element.querySelector<HTMLElement>('button,input,select,textarea,[tabindex="0"]')
    )?.focus();
    return () => {
      closingFromEffect.current = true;
      if (element.open) element.close();
      closingFromEffect.current = false;
      document.body.style.overflow = previousOverflow;
      const target = latest.current.returnFocusRef?.current ?? opener;
      if (target?.isConnected && !target.matches(':disabled')) target.focus();
    };
  }, [state.open]);
  return (
    <dialog
      {...props}
      ref={dialog}
      id={state.id}
      aria-modal="true"
      aria-labelledby={props['aria-label'] ? undefined : `${state.id}-title`}
      aria-describedby={
        props['aria-describedby'] ?? (state.hasDescription ? `${state.id}-description` : undefined)
      }
      className={`${styles.dialog} ${props.className ?? ''}`}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== 'Tab') return;
        // Native modal inertness excludes the background, but browsers may put
        // focus in browser chrome at the edge. Wrap only those Tab boundaries.
        const items = tabStops(event.currentTarget, event.shiftKey);
        const first = items[0];
        const last = items[items.length - 1];
        if (!first) {
          event.preventDefault();
          event.currentTarget.querySelector<HTMLElement>('[data-dialog-title]')?.focus();
          return;
        }
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement?.hasAttribute('data-dialog-title'))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        onCancel?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          state.setOpen(false);
        }
      }}
      onClose={(event) => {
        // close() queues an event. StrictMode can reopen the element before that
        // event arrives; it must not close the new lifecycle.
        if (closingFromEffect.current || event.currentTarget.open) return;
        onClose?.(event);
        if (latest.current.state.open) latest.current.state.setOpen(false);
      }}
    >
      {children}
    </dialog>
  );
}
function Title({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const state = useDialog();
  return (
    <h2
      {...props}
      id={`${state.id}-title`}
      data-dialog-title
      tabIndex={-1}
      className={`${styles.title} ${props.className ?? ''}`}
    >
      {children}
    </h2>
  );
}
function Description(props: HTMLAttributes<HTMLParagraphElement>) {
  const state = useDialog();
  useEffect(() => {
    state.setDescription(true);
    return () => state.setDescription(false);
  }, [state.setDescription]);
  return (
    <p
      {...props}
      id={`${state.id}-description`}
      className={`${styles.description} ${props.className ?? ''}`}
    />
  );
}
function Close({ onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const state = useDialog();
  return (
    <Button
      {...props}
      variant="secondary"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) state.setOpen(false);
      }}
    />
  );
}
export const Dialog = /* @__PURE__ */ Object.assign(Root, {
  Trigger,
  Content,
  Title,
  Description,
  Close,
});
