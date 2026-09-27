'use client';
import { useRef, useState } from 'react';
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
} from '@csl/ui';
export function Demo({ name }: { name: string }) {
  const [selected, setSelected] = useState('');
  const initialFocus = useRef<HTMLInputElement>(null);
  if (name === 'button')
    return (
      <div className="demo-row">
        <Button onClick={() => setSelected('Primary action activated')}>Primary action</Button>
        <Button variant="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
        <IconButton aria-label="Add item" onClick={() => setSelected('Item added')}>
          +
        </IconButton>
        <span role="status">{selected}</span>
      </div>
    );
  if (name === 'textfield')
    return (
      <div className="demo-stack">
        <TextField label="Display name" hint="How you appear to your team." />
        <TextField
          label="Email example with error"
          error="Enter a valid email address."
          defaultValue="not-an-email"
        />
      </div>
    );
  if (name === 'checkbox')
    return <Checkbox label="Send me product updates" hint="Occasional notes from the team." />;
  if (name === 'radiogroup')
    return (
      <RadioGroup
        label="Delivery preference"
        name="delivery"
        defaultValue="email"
        options={[
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'Text message' },
          { value: 'post', label: 'Post (unavailable)', disabled: true },
        ]}
      />
    );
  if (name === 'tabs')
    return (
      <Tabs defaultValue="overview" activationMode="manual">
        <Tabs.List aria-label="Project sections">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="details">Details</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <h3>A thoughtful starting point</h3>
          <p>Use arrow keys to move focus. Press Enter or Space to select a panel.</p>
        </Tabs.Panel>
        <Tabs.Panel value="details">
          <h3>Project details</h3>
          <p>Each panel has a stable relationship with its tab.</p>
        </Tabs.Panel>
        <Tabs.Panel value="activity">
          <h3>Recent activity</h3>
          <p>No activity yet. A useful empty state is part of the experience.</p>
        </Tabs.Panel>
      </Tabs>
    );
  if (name === 'accordion')
    return (
      <Accordion>
        <Accordion.Item value="first">
          <Accordion.Header>What is Component Systems Lab?</Accordion.Header>
          <Accordion.Panel>
            A bounded component library with explicit interaction contracts.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="second">
          <Accordion.Header>What does verification cover?</Accordion.Header>
          <Accordion.Panel>
            Automated assertions cover defined states; manual screen-reader and zoom checks remain a
            separate layer.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  if (name === 'menu')
    return (
      <div className="demo-stack">
        <div className="demo-row">
          <Menu>
            <Menu.Trigger>Actions</Menu.Trigger>
            <Menu.Content aria-label="Profile actions">
              <Menu.Item onSelect={() => setSelected('Edit profile selected')}>
                Edit profile
              </Menu.Item>
              <Menu.Item onSelect={() => setSelected('Duplicate selected')}>Duplicate</Menu.Item>
              <Menu.Item disabled>Delete (unavailable)</Menu.Item>
            </Menu.Content>
          </Menu>
          <Button variant="secondary">After menu</Button>
        </div>
        <p role="status">{selected}</p>
      </div>
    );
  return (
    <Dialog>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Content initialFocusRef={initialFocus}>
        <Dialog.Title>Edit your profile</Dialog.Title>
        <Dialog.Description>
          Update your display name. This example does not save data.
        </Dialog.Description>
        <TextField ref={initialFocus} label="Name" defaultValue="Alex Morgan" />
        <Dialog.Close>Close dialog</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}
export function InteractionLab() {
  return (
    <div className="page-shell">
      <div className="eyebrow">TRY THE CONTRACTS</div>
      <h1>Interaction lab.</h1>
      <p className="lede">
        An intentionally compact fixture for keyboard navigation, naming, and focus behavior.
      </p>
      {['tabs', 'menu', 'dialog', 'accordion', 'textfield', 'checkbox', 'radiogroup', 'button'].map(
        (name) => (
          <section className="lab-section" key={name} aria-labelledby={`lab-${name}`}>
            <h2 id={`lab-${name}`}>
              {name === 'textfield'
                ? 'TextField'
                : name === 'radiogroup'
                  ? 'RadioGroup'
                  : name[0]!.toUpperCase() + name.slice(1)}
            </h2>
            <div className="demo-surface">
              <Demo name={name} />
            </div>
          </section>
        ),
      )}
    </div>
  );
}
