'use client';
import {
  createContext,
  useContext,
  useId,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';
import { useControllable } from '../../foundations/useControllable';
import styles from './Tabs.module.css';
interface State {
  id: string;
  value: string;
  select: (value: string) => void;
  activation: 'automatic' | 'manual';
}
const Context = createContext<State | null>(null);
function useTabs() {
  const state = useContext(Context);
  if (!state) throw new Error('Tabs parts must be inside Tabs');
  return state;
}
export interface TabsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  activationMode?: 'automatic' | 'manual';
}
function Root({
  value,
  defaultValue,
  onValueChange,
  activationMode = 'automatic',
  children,
  ...props
}: TabsProps) {
  const id = useId();
  const [selected, select] = useControllable(value, defaultValue ?? value ?? '', onValueChange);
  if (value === undefined && defaultValue === undefined)
    throw new Error('Tabs requires value or defaultValue');
  return (
    <Context.Provider value={{ id, value: selected, select, activation: activationMode }}>
      <div {...props}>{children}</div>
    </Context.Provider>
  );
}
function List({
  children,
  onKeyDown,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { 'aria-label': string }) {
  const state = useTabs();
  // The tablist delegates sequential focus to its roving tab descendants (APG).
  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      {...props}
      role="tablist"
      aria-orientation="horizontal"
      className={`${styles.list} ${className}`}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const tabs = [
          ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=tab]:not(:disabled)'),
        ];
        const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
        if (index < 0) return;
        let next: number | undefined;
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        if (event.key === 'ArrowRight') next = (index + (rtl ? -1 : 1) + tabs.length) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + (rtl ? 1 : -1) + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          const tab = tabs[next];
          tab?.focus();
          if (state.activation === 'automatic' && tab) state.select(tab.dataset.value!);
        }
      }}
    >
      {children}
    </div>
  );
}
function Tab({
  value,
  className = '',
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const state = useTabs();
  const selected = state.value === value;
  return (
    <button
      {...props}
      type="button"
      role="tab"
      data-value={value}
      id={`${state.id}-tab-${encodeURIComponent(value)}`}
      aria-controls={`${state.id}-panel-${encodeURIComponent(value)}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      className={`${styles.tab} ${className}`}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) state.select(value);
      }}
    />
  );
}
function Panel({
  value,
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const state = useTabs();
  return (
    <div
      {...props}
      role="tabpanel"
      id={`${state.id}-panel-${encodeURIComponent(value)}`}
      aria-labelledby={`${state.id}-tab-${encodeURIComponent(value)}`}
      hidden={state.value !== value}
      tabIndex={0}
      className={`${styles.panel} ${className}`}
    >
      {children}
    </div>
  );
}
export const Tabs = /* @__PURE__ */ Object.assign(Root, { List, Tab, Panel });
