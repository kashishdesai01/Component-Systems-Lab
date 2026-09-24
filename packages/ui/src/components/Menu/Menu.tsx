'use client';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type RefObject,
} from 'react';
import { useControllable } from '../../foundations/useControllable';
import { Button } from '../Button/Button';
import styles from './Menu.module.css';
interface State {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
  trigger: RefObject<HTMLButtonElement | null>;
  content: RefObject<HTMLDivElement | null>;
  edge: RefObject<'first' | 'last'>;
}
const Context = createContext<State | null>(null);
function useMenu() {
  const state = useContext(Context);
  if (!state) throw new Error('Menu parts require Menu');
  return state;
}
export interface MenuProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
function Root({ open, defaultOpen = false, onOpenChange, children, ...props }: MenuProps) {
  const [visible, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const edge = useRef<'first' | 'last'>('first');
  const current = useRef(setOpen);
  current.current = setOpen;
  useEffect(() => {
    if (!visible) return;
    const items = content.current?.querySelectorAll<HTMLButtonElement>('[role=menuitem]');
    (edge.current === 'last' ? items?.[items.length - 1] : items?.[0])?.focus();
    const outside = (event: PointerEvent) => {
      if (
        !content.current?.contains(event.target as Node) &&
        !trigger.current?.contains(event.target as Node)
      )
        current.current(false);
    };
    const focusOutside = (event: FocusEvent) => {
      if (
        !content.current?.contains(event.target as Node) &&
        !trigger.current?.contains(event.target as Node)
      )
        current.current(false);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', focusOutside);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', focusOutside);
    };
  }, [visible]);
  return (
    <Context.Provider value={{ open: visible, setOpen, id, trigger, content, edge }}>
      <div {...props} className={`${styles.root} ${props.className ?? ''}`}>
        {children}
      </div>
    </Context.Provider>
  );
}
function Trigger({ onClick, onKeyDown, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const state = useMenu();
  return (
    <Button
      {...props}
      ref={state.trigger}
      variant="secondary"
      aria-haspopup="menu"
      aria-expanded={state.open}
      aria-controls={state.open ? state.id : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          state.edge.current = 'first';
          state.setOpen(!state.open);
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (
            props.disabled ||
            props['aria-disabled'] === true ||
            props['aria-disabled'] === 'true'
          )
            return;
          state.edge.current = event.key === 'ArrowUp' ? 'last' : 'first';
          state.setOpen(true);
        }
      }}
    />
  );
}
function Content({
  children,
  onKeyDown,
  ...props
}: HTMLAttributes<HTMLDivElement> & { 'aria-label': string }) {
  const state = useMenu();
  const buffer = useRef('');
  const lastKey = useRef(0);
  if (!state.open) return null;
  return (
    <div
      {...props}
      ref={state.content}
      id={state.id}
      role="menu"
      tabIndex={-1}
      className={`${styles.content} ${props.className ?? ''}`}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const items = [
          ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=menuitem]'),
        ];
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        let next: number | undefined;
        if (event.key === 'ArrowDown') next = (index + 1) % items.length;
        if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = items.length - 1;
        if (event.key === 'Escape') {
          event.preventDefault();
          state.setOpen(false);
          state.trigger.current?.focus();
          return;
        }
        if (event.key === 'Tab') {
          // Exit from the trigger's position in the document, not the popup DOM.
          // Native Tab continues after this handler; no modal trap is installed.
          state.trigger.current?.focus();
          state.setOpen(false);
          return;
        }
        if (next !== undefined) {
          event.preventDefault();
          items[next]?.focus();
          return;
        }
        if (
          event.key.length === 1 &&
          event.key !== ' ' &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          const now = Date.now();
          buffer.current =
            now - lastKey.current > 700
              ? event.key.toLocaleLowerCase()
              : buffer.current + event.key.toLocaleLowerCase();
          lastKey.current = now;
          const query = /^(.)(\1)*$/.test(buffer.current) ? buffer.current[0]! : buffer.current;
          const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
          ordered
            .find((item) => item.textContent?.trim().toLocaleLowerCase().startsWith(query))
            ?.focus();
          event.preventDefault();
        }
      }}
    >
      {children}
    </div>
  );
}
interface ItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  onSelect?: () => void;
}
function Item({ disabled, onSelect, onClick, ...props }: ItemProps) {
  const state = useMenu();
  return (
    <button
      {...props}
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      className={`${styles.item} ${props.className ?? ''}`}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
        if (!event.defaultPrevented) {
          state.setOpen(false);
          state.trigger.current?.focus();
          onSelect?.();
        }
      }}
    />
  );
}
export const Menu = /* @__PURE__ */ Object.assign(Root, { Trigger, Content, Item });
