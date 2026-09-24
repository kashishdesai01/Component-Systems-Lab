import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import {
  Button,
  IconButton,
  TextField,
  Checkbox,
  RadioGroup,
  Tabs,
  Accordion,
  Menu,
  Dialog,
} from './index';

describe('native controls', () => {
  it('uses the latest controlled radio value when the form owner handles reset', async () => {
    function Owner() {
      const [value, setValue] = useState('b');
      return (
        <form onReset={() => setValue('a')}>
          <RadioGroup
            label="Choices"
            name="choices"
            value={value}
            onValueChange={setValue}
            options={[
              { value: 'a', label: 'Alpha' },
              { value: 'b', label: 'Beta' },
            ]}
          />
          <Button type="reset">Reset</Button>
        </form>
      );
    }
    const user = userEvent.setup();
    render(<Owner />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('radio', { name: 'Alpha' })).toBeChecked();
  });
  it('does not submit a form unless explicitly requested', async () => {
    const submit = vi.fn((event) => event.preventDefault());
    const user = userEvent.setup();
    render(
      <form onSubmit={submit}>
        <Button>Action</Button>
        <Button type="submit">Submit</Button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Action' }));
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(submit).toHaveBeenCalledOnce();
  });
  it('blocks focusable disabled activation from click, Enter and Space', async () => {
    const action = vi.fn();
    const user = userEvent.setup();
    render(
      <Button aria-disabled onClick={action}>
        Unavailable
      </Button>,
    );
    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter} ');
    await user.click(button);
    expect(action).not.toHaveBeenCalled();
    expect(button).toHaveFocus();
  });
  it('rejects an empty icon label', () => {
    expect(() => render(<IconButton aria-label=" ">+</IconButton>)).toThrow(/nonempty/);
  });
  it('associates label, hint, error and consumer description', () => {
    render(
      <>
        <span id="custom">Additional detail</span>
        <TextField
          label="Email"
          hint="Receipt"
          error="Invalid address"
          required
          aria-describedby="custom"
        />
      </>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Receipt Invalid address Additional detail');
  });
  it('uses unique IDs for multiple instances', () => {
    render(
      <>
        <TextField label="First" />
        <TextField label="Second" />
      </>,
    );
    expect(screen.getByLabelText('First').id).not.toBe(screen.getByLabelText('Second').id);
  });
  it('retains native checkbox keyboard and form-reset behavior', async () => {
    const user = userEvent.setup();
    render(
      <form>
        <Checkbox label="Consent" name="consent" defaultChecked />
        <Button type="reset">Reset</Button>
      </form>,
    );
    const input = screen.getByRole('checkbox');
    input.focus();
    await user.keyboard(' ');
    expect(input).not.toBeChecked();
    await user.click(screen.getByRole('button'));
    expect(input).toBeChecked();
  });
  it('submits native radio values and resets uncontrolled selection', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <RadioGroup
          label="Delivery"
          name="delivery"
          defaultValue="email"
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
          ]}
        />
        <Button type="reset">Reset</Button>
      </form>,
    );
    await user.click(screen.getByRole('radio', { name: 'SMS' }));
    expect(new FormData(container.querySelector('form')!).get('delivery')).toBe('sms');
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
  });
  it('does not alter controlled selection until the consumer changes it', async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    render(
      <RadioGroup
        label="Delivery"
        name="delivery"
        value="email"
        onValueChange={change}
        options={[
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
        ]}
      />,
    );
    await user.click(screen.getByRole('radio', { name: 'SMS' }));
    expect(change).toHaveBeenCalledWith('sms');
    expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
  });
  it('respects canceled reset and preserves controlled selection on native reset', async () => {
    const user = userEvent.setup();
    const options = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ];
    const { unmount } = render(
      <form onReset={(event) => event.preventDefault()}>
        <RadioGroup label="Choices" name="choices" defaultValue="a" options={options} />
        <Button type="reset">Reset</Button>
      </form>,
    );
    await user.click(screen.getByRole('radio', { name: 'Beta' }));
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('radio', { name: 'Beta' })).toBeChecked();
    unmount();
    render(
      <form>
        <RadioGroup label="Choices" name="choices" value="b" options={options} />
        <Button type="reset">Reset</Button>
      </form>,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('radio', { name: 'Beta' })).toBeChecked();
  });
});
const tabFixture = (activationMode: 'manual' | 'automatic') => (
  <Tabs defaultValue="a" activationMode={activationMode}>
    <Tabs.List aria-label="Sections">
      <Tabs.Tab value="a">Alpha</Tabs.Tab>
      <Tabs.Tab value="b" disabled>
        Disabled
      </Tabs.Tab>
      <Tabs.Tab value="c">Charlie</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="a">First</Tabs.Panel>
    <Tabs.Panel value="b">Second</Tabs.Panel>
    <Tabs.Panel value="c">Third</Tabs.Panel>
  </Tabs>
);
describe('Tabs', () => {
  it('skips disabled tabs, wraps and activates manually with Space', async () => {
    const user = userEvent.setup();
    render(tabFixture('manual'));
    screen.getByRole('tab', { name: 'Alpha' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Charlie' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard(' ');
    expect(screen.getByRole('tab', { name: 'Charlie' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
  });
  it('automatically activates, and Tab reaches the active panel', async () => {
    const user = userEvent.setup();
    render(tabFixture('automatic'));
    screen.getByRole('tab', { name: 'Alpha' }).focus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Charlie' })).toHaveAttribute('aria-selected', 'true');
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });
});
describe('Accordion', () => {
  it('exposes expanded state and hides collapsed content', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <Accordion.Item value="a">
          <Accordion.Header>Details</Accordion.Header>
          <Accordion.Panel>Hidden content</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );
    const header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Hidden content')).not.toBeVisible();
    header.focus();
    await user.keyboard('{Enter}');
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hidden content')).toBeVisible();
  });
});
function MenuFixture() {
  return (
    <Menu>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content aria-label="Actions">
        <Menu.Item>Alpha</Menu.Item>
        <Menu.Item disabled>Beta</Menu.Item>
        <Menu.Item>Charlie</Menu.Item>
      </Menu.Content>
    </Menu>
  );
}
describe('Menu', () => {
  it('blocks ArrowDown and ArrowUp on a focusable disabled trigger', async () => {
    const user = userEvent.setup();
    render(
      <Menu>
        <Menu.Trigger aria-disabled>Unavailable actions</Menu.Trigger>
        <Menu.Content aria-label="Actions">
          <Menu.Item>Alpha</Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    screen.getByRole('button').focus();
    await user.keyboard('{ArrowDown}{ArrowUp}{Enter} ');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('supports last-item entry, typeahead, disabled inspection and Escape restore', async () => {
    const user = userEvent.setup();
    render(<MenuFixture />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Charlie' })).toHaveFocus();
    await user.keyboard('b');
    expect(screen.getByRole('menuitem', { name: 'Beta' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveFocus();
  });
  it('does not activate disabled items', async () => {
    const select = vi.fn();
    const user = userEvent.setup();
    render(
      <Menu>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content aria-label="Actions">
          <Menu.Item disabled onSelect={select}>
            Disabled
          </Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    expect(select).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeVisible();
  });
  it('honors consumer cancellation of trigger activation', async () => {
    const user = userEvent.setup();
    render(
      <Menu>
        <Menu.Trigger onClick={(event) => event.preventDefault()}>Actions</Menu.Trigger>
        <Menu.Content aria-label="Actions">
          <Menu.Item>Alpha</Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
describe('Dialog lifecycle (native containment is browser-tested)', () => {
  it('names the dialog and restores focus and scroll after Escape cancellation', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>Simple description</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveAccessibleDescription('Simple description');
    expect(screen.getByRole('heading')).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
  });
  it('omits aria-describedby without a simple description', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Details</Dialog.Title>
          <ul>
            <li>Structured content</li>
          </ul>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
  });
});
describe('axe DOM checks (layout and contrast excluded in jsdom)', () => {
  it.each([
    ['Button', <Button>Save</Button>],
    ['TextField', <TextField label="Name" error="Required" />],
    ['Checkbox', <Checkbox label="Consent" />],
    [
      'RadioGroup',
      <RadioGroup label="Delivery" name="delivery" options={[{ value: 'a', label: 'Email' }]} />,
    ],
    ['Tabs', tabFixture('manual')],
    [
      'Accordion',
      <Accordion>
        <Accordion.Item value="a">
          <Accordion.Header>Details</Accordion.Header>
          <Accordion.Panel>Content</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    ],
    [
      'Menu open',
      <Menu defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content aria-label="Actions">
          <Menu.Item>Alpha</Menu.Item>
        </Menu.Content>
      </Menu>,
    ],
    [
      'Dialog open',
      <Dialog defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    ],
  ])('%s has no detected component-level DOM violations', async (_name, fixture) => {
    const { container } = render(fixture);
    const result = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    expect(result.violations).toEqual([]);
  });
});
