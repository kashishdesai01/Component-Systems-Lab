'use client';
import { useId, type ComponentPropsWithRef } from 'react';
import styles from './Checkbox.module.css';
export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label: string;
  hint?: string;
}
export function Checkbox({
  label,
  hint,
  id: suppliedId,
  className = '',
  'aria-describedby': describedBy,
  ...props
}: CheckboxProps) {
  const generated = useId();
  const id = suppliedId ?? generated;
  return (
    <div className={`${styles.control} ${className}`}>
      <label className={styles.label} htmlFor={id}>
        <input
          {...props}
          id={id}
          type="checkbox"
          className={styles.input}
          aria-describedby={
            [hint && `${id}-hint`, describedBy].filter(Boolean).join(' ') || undefined
          }
        />
        <span>{label}</span>
      </label>
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
