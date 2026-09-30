import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Checkout } from './checkout';

afterEach(() => vi.useRealTimers());
describe('checkout submission lifetime', () => {
  it('schedules one completion for repeated submit events and cancels it on unmount', () => {
    vi.useFakeTimers();
    const { unmount } = render(<Checkout />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Email address' }), {
      target: { value: 'alex@example.com' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Pickup name' }), {
      target: { value: 'Alex' },
    });
    const form = screen.getByTestId('checkout-form');
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(screen.getByRole('button', { name: 'Placing order…' })).toBeDisabled();
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
