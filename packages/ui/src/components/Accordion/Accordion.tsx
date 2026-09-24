'use client';
import {
  createContext,
  useContext,
  useId,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';
import { useControllable } from '../../foundations/useControllable';
import styles from './Accordion.module.css';
interface State {
  value: string[];
  toggle: (value: string) => void;
}
const Context = createContext<State | null>(null);
const ItemContext = createContext<{ value: string; id: string } | null>(null);
function useItem() {
  const root = useContext(Context);
  const item = useContext(ItemContext);
  if (!root || !item) throw new Error('Accordion parts require Accordion.Item');
  return { id: item.id, key: item.value, ...root };
}
export interface AccordionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}
function Root({ value, defaultValue = [], onValueChange, children, ...props }: AccordionProps) {
  const [selected, select] = useControllable(value, defaultValue, onValueChange);
  const toggle = (key: string) =>
    select(selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key]);
  return (
    <Context.Provider value={{ value: selected, toggle }}>
      <div {...props}>{children}</div>
    </Context.Provider>
  );
}
function Item({ value, children, ...props }: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const id = useId();
  return (
    <ItemContext.Provider value={{ value, id }}>
      <div {...props} className={`${styles.item} ${props.className ?? ''}`}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}
function Header({
  children,
  onClick,
  headingLevel = 3,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { headingLevel?: 2 | 3 | 4 | 5 | 6 }) {
  const state = useItem();
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const open = state.value.includes(state.key);
  return (
    <Heading className={styles.heading}>
      <button
        {...props}
        type="button"
        id={`${state.id}-header`}
        aria-controls={`${state.id}-panel`}
        aria-expanded={open}
        className={`${styles.header} ${props.className ?? ''}`}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) state.toggle(state.key);
        }}
      >
        {children}
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
    </Heading>
  );
}
function Panel({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const state = useItem();
  return (
    <div
      {...props}
      id={`${state.id}-panel`}
      hidden={!state.value.includes(state.key)}
      className={`${styles.panel} ${props.className ?? ''}`}
    >
      {children}
    </div>
  );
}
export const Accordion = /* @__PURE__ */ Object.assign(Root, { Item, Header, Panel });
