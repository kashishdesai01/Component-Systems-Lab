import { describe, expect, it } from 'vitest';
import { orderActions as actions, orderReducer as reducer } from './order';

describe('reference checkout lifecycle', () => {
  it('rejects terminal transitions unless a submission is pending', () => {
    const initial = reducer(undefined, { type: 'init' });
    expect(reducer(initial, actions.submissionSucceeded())).toEqual(initial);
    expect(reducer(initial, actions.submissionFailed())).toEqual(initial);
    expect(reducer(initial, actions.restarted())).toEqual(initial);
  });
  it('locks data during submission and preserves it across a recoverable failure', () => {
    let state = reducer(undefined, actions.emailChanged('alex@example.com'));
    state = reducer(state, actions.nameChanged('Alex'));
    state = reducer(state, actions.pickupChanged('later'));
    state = reducer(state, actions.reusableChanged(true));
    state = reducer(state, actions.submissionStarted());
    expect(reducer(state, actions.nameChanged('Changed'))).toEqual(state);
    expect(reducer(state, actions.restarted())).toEqual(state);
    state = reducer(state, actions.submissionFailed());
    expect(state).toMatchObject({
      status: 'failed',
      email: 'alex@example.com',
      name: 'Alex',
      pickup: 'later',
      reusable: true,
    });
    state = reducer(state, actions.nameChanged('Alex Morgan'));
    state = reducer(state, actions.submissionStarted());
    state = reducer(state, actions.submissionSucceeded());
    expect(state.status).toBe('success');
    expect(state.name).toBe('Alex Morgan');
  });
  it('does not restart a confirmed submission or mutate its details until explicitly reset', () => {
    let state = reducer(undefined, actions.nameChanged('Alex'));
    state = reducer(state, actions.submissionStarted());
    state = reducer(state, actions.submissionSucceeded());
    expect(reducer(state, actions.submissionStarted())).toEqual(state);
    expect(reducer(state, actions.submissionFailed())).toEqual(state);
    expect(reducer(state, actions.emailChanged('other@example.com'))).toEqual(state);
    expect(reducer(state, actions.restarted())).toMatchObject({
      status: 'editing',
      name: '',
      email: '',
    });
  });
});
