'use client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import {
  makeOrderStore,
  orderActions,
  selectOrder,
  type OrderStore,
  type OrderStatus,
} from '../lib/order';
import { Button, TextField, Checkbox, RadioGroup, Accordion } from '@csl/ui';
function CheckoutForm() {
  const order = useSelector(selectOrder);
  const dispatch = useDispatch<OrderStore['dispatch']>();
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});
  const [announcement, setAnnouncement] = useState('');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null),
    nameRef = useRef<HTMLInputElement>(null),
    successRef = useRef<HTMLHeadingElement>(null);
  const pending = order.status === 'pending';
  const submitLock = useRef(false);
  const submissionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousStatus = useRef<OrderStatus>(order.status);
  useEffect(
    () => () => {
      if (submissionTimer.current !== null) clearTimeout(submissionTimer.current);
      submitLock.current = false;
    },
    [],
  );
  useEffect(() => {
    if (order.status === 'success' && previousStatus.current !== 'success')
      successRef.current?.focus();
    if (order.status === 'editing' && previousStatus.current === 'success')
      emailRef.current?.focus();
    previousStatus.current = order.status;
  }, [order.status]);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || !['editing', 'failed'].includes(order.status)) return;
    const next = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)
        ? undefined
        : 'Enter a valid email address.',
      name: order.name.trim() ? undefined : 'Enter your name for pickup.',
    };
    setErrors(next);
    if (next.email || next.name) {
      setAnnouncement('Please check the highlighted fields before placing your order.');
      (next.email ? emailRef : nameRef).current?.focus();
      return;
    }
    submitLock.current = true;
    dispatch(orderActions.submissionStarted());
    setAnnouncement('Placing your simulated order.');
    submissionTimer.current = setTimeout(() => {
      submissionTimer.current = null;
      submitLock.current = false;
      if (simulateFailure) {
        dispatch(orderActions.submissionFailed());
        setAnnouncement(
          'The simulated order could not be placed. Your details are saved. Turn off the failure scenario and try again.',
        );
      } else {
        dispatch(orderActions.submissionSucceeded());
        setAnnouncement('Your simulated order is confirmed.');
      }
    }, 700);
  }
  return (
    <div className="checkout-layout">
      <section className="order-details">
        <div className="eyebrow">FIELDWORK CAFÉ / PICKUP</div>
        <h1>
          Your morning,
          <br />
          <em>made a little better.</em>
        </h1>
        <p className="lede">Thoughtful coffee. A warm pastry. Ready when you are.</p>
        <div className="product-card">
          <div className="product-illustration" aria-hidden="true">
            ☕
          </div>
          <div>
            <span className="tag">THE DAILY RITUAL</span>
            <h2>Flat white & almond croissant</h2>
            <p>Double espresso, silky oat milk, and a freshly baked almond croissant.</p>
            <span className="price">$9.50</span>
          </div>
        </div>
        <Accordion defaultValue={[]}>
          <Accordion.Item value="ingredients">
            <Accordion.Header>Ingredients & allergens</Accordion.Header>
            <Accordion.Panel>
              Contains wheat, almonds, and oats. This fictional café is a reference interface; no
              food or payment is provided.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <div className="order-total">
          <span>Order total</span>
          <strong>$9.50</strong>
        </div>
        <p className="muted">Local pickup · Payment simulated · No data leaves this page</p>
      </section>
      <section className="checkout-panel" aria-labelledby="checkout-heading">
        <div className="eyebrow">A FEW DETAILS</div>
        <h2 id="checkout-heading">Make it yours.</h2>
        <p className="muted">All fields marked required are needed for pickup.</p>
        <div role="status" aria-live="polite" className="form-announcement">
          {announcement}
        </div>
        {order.status === 'success' ? (
          <div className="success-card">
            <span className="success-symbol" aria-hidden="true">
              ✓
            </span>
            <h3 ref={successRef} tabIndex={-1}>
              Order confirmed
            </h3>
            <p>
              Thanks, {order.name.trim()}. Your simulated order is ready{' '}
              {order.pickup === 'soon' ? 'in about 15 minutes' : 'at 10:30 AM'}.
            </p>
            <p className="muted">No payment was taken and no confirmation email was sent.</p>
            <Button
              onClick={() => {
                dispatch(orderActions.restarted());
                setAnnouncement('Start a new simulated order.');
                setErrors({});
              }}
            >
              Start another order
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} data-testid="checkout-form">
            <TextField
              ref={emailRef}
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={order.email}
              error={errors.email}
              disabled={pending}
              onChange={(event) => {
                dispatch(orderActions.emailChanged(event.target.value));
                if (errors.email) setErrors((previous) => ({ ...previous, email: undefined }));
              }}
              hint="For your fictional order receipt."
            />
            <TextField
              ref={nameRef}
              label="Pickup name"
              name="name"
              autoComplete="given-name"
              required
              value={order.name}
              error={errors.name}
              disabled={pending}
              onChange={(event) => {
                dispatch(orderActions.nameChanged(event.target.value));
                if (errors.name) setErrors((previous) => ({ ...previous, name: undefined }));
              }}
            />
            <RadioGroup
              label="Pickup time"
              name="pickup"
              value={order.pickup}
              disabled={pending}
              onValueChange={(value) =>
                dispatch(orderActions.pickupChanged(value === 'later' ? 'later' : 'soon'))
              }
              options={[
                { value: 'soon', label: 'As soon as possible · about 15 minutes' },
                { value: 'later', label: 'Later this morning · 10:30 AM' },
              ]}
            />
            <Checkbox
              label="I'll bring a reusable cup"
              hint="A small habit that makes a difference."
              name="reusable"
              checked={order.reusable}
              disabled={pending}
              onChange={(event) => dispatch(orderActions.reusableChanged(event.target.checked))}
            />
            <Button type="submit" disabled={pending}>
              {pending ? 'Placing order…' : 'Place simulated order'}
            </Button>
            <p className="muted fine-print">
              This is a demo. No account, payment, or actual order is created.
            </p>
            <details className="scenario">
              <summary>Try an error scenario</summary>
              <Checkbox
                label="Simulate an order failure"
                checked={simulateFailure}
                disabled={pending}
                onChange={(event) => setSimulateFailure(event.target.checked)}
              />
            </details>
          </form>
        )}
      </section>
    </div>
  );
}
export function Checkout() {
  const [store] = useState(makeOrderStore);
  return (
    <Provider store={store}>
      <CheckoutForm />
    </Provider>
  );
}
