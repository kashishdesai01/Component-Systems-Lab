import type { ComponentProps } from 'react';
export function useMDXComponents() {
  return { a: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a> };
}
