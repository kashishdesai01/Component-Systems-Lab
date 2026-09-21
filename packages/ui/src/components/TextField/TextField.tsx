'use client';
import { useId, type ComponentPropsWithRef } from 'react';
import styles from './TextField.module.css';
export interface TextFieldProps extends ComponentPropsWithRef<'input'> {
  label: string;
  hint?: string;
  error?: string;
}
export function TextField({
  label,
  hint,
  error,
  id: providedId,
  className = '',
  'aria-describedby': describedBy,
  ...props
}: TextFieldProps) {
  const generated = useId();
  const id = providedId ?? generated;
  const description =
    [hint && `${id}-hint`, error && `${id}-error`, describedBy].filter(Boolean).join(' ') ||
    undefined;
  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        {...props}
        id={id}
        className={styles.input}
        aria-describedby={description}
        aria-invalid={error ? true : props['aria-invalid']}
      />
      {hint && (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
