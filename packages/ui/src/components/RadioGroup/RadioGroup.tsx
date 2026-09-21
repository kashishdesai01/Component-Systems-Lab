'use client';
import { useId, useRef, useEffect, type FieldsetHTMLAttributes } from 'react';
import { useControllable } from '../../foundations/useControllable';
import styles from './RadioGroup.module.css';
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'onChange' | 'defaultValue'
> {
  label: string;
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
}
export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue = '',
  onValueChange,
  required,
  className = '',
  ...props
}: RadioGroupProps) {
  const id = useId();
  const [selected, setSelected] = useControllable(value, defaultValue, onValueChange);
  const fieldset = useRef<HTMLFieldSetElement>(null);
  const latest = useRef({ value, defaultValue, setSelected });
  latest.current = { value, defaultValue, setSelected };
  useEffect(() => {
    const form = fieldset.current?.closest('form');
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (event.defaultPrevented || !fieldset.current) return;
        const current = latest.current;
        if (current.value === undefined) current.setSelected(current.defaultValue);
        // Native reset mutates checked state even on controlled inputs. Restore
        // the owner's value after the browser's reset default action completes.
        fieldset.current
          ?.querySelectorAll<HTMLInputElement>('input[type=radio]')
          .forEach((input) => {
            input.checked = input.value === (current.value ?? current.defaultValue);
          });
      });
    };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  });
  if (new Set(options.map((option) => option.value)).size !== options.length)
    throw new Error('RadioGroup values must be unique');
  return (
    <fieldset {...props} ref={fieldset} className={`${styles.group} ${className}`}>
      <legend className={styles.legend}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </legend>
      {options.map((option, index) => (
        <label key={option.value} className={styles.option} htmlFor={`${id}-${index}`}>
          <input
            type="radio"
            id={`${id}-${index}`}
            name={name}
            value={option.value}
            checked={selected === option.value}
            disabled={props.disabled || option.disabled}
            required={required}
            onChange={() => setSelected(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
