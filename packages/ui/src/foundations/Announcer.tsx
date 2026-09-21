'use client';
import type { HTMLAttributes } from 'react';
import styles from './foundations.module.css';
export function VisuallyHidden(props: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={`${styles.hidden} ${props.className ?? ''}`} />;
}
/** Mount once before updating its content; the application owns announcement timing. */
export function Announcer({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={styles.hidden} role="status" aria-live="polite" aria-atomic="true">
      {children}
    </div>
  );
}
