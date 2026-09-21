'use client';
import type { ComponentPropsWithRef } from 'react';
import styles from './Button.module.css';
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}
export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={(event) => {
        if (props['aria-disabled'] === true || props['aria-disabled'] === 'true') {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      }}
    />
  );
}
export interface IconButtonProps extends Omit<ButtonProps, 'aria-label' | 'aria-labelledby'> {
  'aria-label': string;
}
export function IconButton(props: IconButtonProps) {
  if (!props['aria-label'].trim()) throw new Error('IconButton requires a nonempty aria-label');
  return <Button {...props} className={`${styles.icon} ${props.className ?? ''}`} />;
}
