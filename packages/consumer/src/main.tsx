import React, { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Dialog, TextField, RadioGroup } from '@csl/ui';
import '@csl/ui/styles.css';
import '@csl/tokens/css';

function App() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [strictModal, setStrictModal] = useState(false);
  return (
    <main>
      <h1>Packed package consumer</h1>
      <p>This application imports the built tarball with its declared exports.</p>
      <TextField label="Your name" value={name} onChange={(event) => setName(event.target.value)} />
      <p aria-live="polite">
        {name ? `Hello, ${name}` : 'Enter a name to check controlled input behavior.'}
      </p>
      <Dialog>
        <Dialog.Trigger>Open consumer dialog</Dialog.Trigger>
        <Dialog.Content initialFocusRef={nameRef}>
          <Dialog.Title>Consumer dialog</Dialog.Title>
          <Dialog.Description>A modal imported through the packed package.</Dialog.Description>
          <TextField ref={nameRef} label="Dialog name" />
          <Dialog.Close>Close consumer dialog</Dialog.Close>
        </Dialog.Content>
      </Dialog>
      <Button onClick={() => setName('')}>Reset name</Button>
      <Dialog>
        <Dialog.Trigger>Open radio dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Radio boundary</Dialog.Title>
          <RadioGroup
            label="First group"
            name="first"
            defaultValue="b"
            options={[
              { value: 'a', label: 'First Alpha' },
              { value: 'b', label: 'First Beta' },
            ]}
          />
          <Dialog.Close>Close radio dialog</Dialog.Close>
          <RadioGroup
            label="Last group"
            name="last"
            defaultValue="b"
            options={[
              { value: 'a', label: 'Last Alpha' },
              { value: 'b', label: 'Last Beta' },
            ]}
          />
        </Dialog.Content>
      </Dialog>
      <Dialog>
        <Dialog.Trigger>Open unselected radio dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Unselected radio boundary</Dialog.Title>
          <RadioGroup
            label="Empty first group"
            name="empty-first"
            options={[
              { value: 'a', label: 'Empty First Alpha' },
              { value: 'b', label: 'Empty First Beta' },
            ]}
          />
          <Dialog.Close>Close unselected radio dialog</Dialog.Close>
          <RadioGroup
            label="Empty last group"
            name="empty-last"
            options={[
              { value: 'a', label: 'Empty Last Alpha' },
              { value: 'b', label: 'Empty Last Beta' },
            ]}
          />
        </Dialog.Content>
      </Dialog>
      <Dialog>
        <Dialog.Trigger>Open editable dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Editable boundary</Dialog.Title>
          <Dialog.Close>Close editable dialog</Dialog.Close>
          <div
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Editable note"
          >
            Edit this note
          </div>
        </Dialog.Content>
      </Dialog>
      <Button onClick={() => setStrictModal(true)}>Mount StrictMode dialog</Button>
      {strictModal && (
        <StrictMode>
          <Dialog defaultOpen>
            <Dialog.Content>
              <Dialog.Title>StrictMode lifecycle</Dialog.Title>
              <Dialog.Close>Close StrictMode dialog</Dialog.Close>
            </Dialog.Content>
          </Dialog>
        </StrictMode>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
