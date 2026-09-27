import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Demo } from '../../../components/demos';
import ButtonAudit from '../../../../ui/src/components/Button/Button.a11y.md';
import TextFieldAudit from '../../../../ui/src/components/TextField/TextField.a11y.md';
import CheckboxAudit from '../../../../ui/src/components/Checkbox/Checkbox.a11y.md';
import RadioGroupAudit from '../../../../ui/src/components/RadioGroup/RadioGroup.a11y.md';
import TabsAudit from '../../../../ui/src/components/Tabs/Tabs.a11y.md';
import AccordionAudit from '../../../../ui/src/components/Accordion/Accordion.a11y.md';
import MenuAudit from '../../../../ui/src/components/Menu/Menu.a11y.md';
import DialogAudit from '../../../../ui/src/components/Dialog/Dialog.a11y.md';
const components = {
  button: {
    name: 'Button',
    description:
      'Native buttons for actions, with a required accessible name for the icon-only variant.',
    example:
      '<Button type="submit">Save changes</Button>\n<IconButton aria-label="Add item">+</IconButton>',
    Audit: ButtonAudit,
  },
  textfield: {
    name: 'TextField',
    description:
      'A native input with stable label, hint, and error relationships. The surrounding form owns error announcements.',
    example:
      '<TextField label="Email address" type="email"\n  name="email" required error={errors.email} />',
    Audit: TextFieldAudit,
  },
  checkbox: {
    name: 'Checkbox',
    description:
      'A native checkbox with its own associated label. Preserve browser form and keyboard behavior.',
    example: '<Checkbox label="Receive updates" name="updates" />',
    Audit: CheckboxAudit,
  },
  radiogroup: {
    name: 'RadioGroup',
    description:
      'A native radio group with a shared name and visible group label. Let the platform handle keyboard selection.',
    example:
      '<RadioGroup label="Delivery" name="delivery"\n  options={[{ value: "email", label: "Email" }]} />',
    Audit: RadioGroupAudit,
  },
  tabs: {
    name: 'Tabs',
    description:
      'A set of panels with automatic or manual activation. Each tab has one stable associated panel.',
    example:
      '<Tabs defaultValue="overview" activationMode="manual">\n  <Tabs.List aria-label="Project sections">\n    <Tabs.Tab value="overview">Overview</Tabs.Tab>\n  </Tabs.List>\n  <Tabs.Panel value="overview">Project overview</Tabs.Panel>\n</Tabs>',
    Audit: TabsAudit,
  },
  accordion: {
    name: 'Accordion',
    description:
      'Independently expandable sections with heading buttons and explicit expanded state.',
    example:
      '<Accordion>\n  <Accordion.Item value="delivery">\n    <Accordion.Header>Delivery details</Accordion.Header>\n    <Accordion.Panel>Local pickup only.</Accordion.Panel>\n  </Accordion.Item>\n</Accordion>',
    Audit: AccordionAudit,
  },
  menu: {
    name: 'Menu',
    description:
      'A bounded action menu with roving focus and typeahead. Tab exits the menu; submenu support is outside v1.',
    example:
      '<Menu>\n  <Menu.Trigger>Actions</Menu.Trigger>\n  <Menu.Content aria-label="Item actions">\n    <Menu.Item onSelect={duplicate}>Duplicate</Menu.Item>\n  </Menu.Content>\n</Menu>',
    Audit: MenuAudit,
  },
  dialog: {
    name: 'Dialog',
    description:
      'A native modal dialog with explicit initial focus and restoration. One modal at a time is the supported boundary.',
    example:
      '<Dialog>\n  <Dialog.Trigger>Edit profile</Dialog.Trigger>\n  <Dialog.Content initialFocusRef={nameRef}>\n    <Dialog.Title>Edit profile</Dialog.Title>\n    <TextField ref={nameRef} label="Name" />\n    <Dialog.Close>Close dialog</Dialog.Close>\n  </Dialog.Content>\n</Dialog>',
    Audit: DialogAudit,
  },
};
type Slug = keyof typeof components;
export function generateStaticParams() {
  return Object.keys(components).map((component) => ({ component }));
}
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;
  return { title: components[component as Slug]?.name ?? 'Component' };
}
export default async function Page({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;
  if (!(component in components)) notFound();
  const entry = components[component as Slug];
  const Audit = entry.Audit;
  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        <div className="eyebrow">COMPONENTS / 08</div>
        <nav aria-label="Component navigation">
          {Object.entries(components).map(([slug, item]) => (
            <Link
              key={slug}
              href={`/components/${slug}/`}
              aria-current={slug === component ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="docs-content">
        <div className="eyebrow">API & INTERACTION CONTRACT</div>
        <h1>{entry.name}</h1>
        <p className="lede">{entry.description}</p>
        <h2>Try it</h2>
        <div className="demo-surface">
          <Demo name={component} />
        </div>
        <h2>Usage</h2>
        <pre>
          <code>{entry.example}</code>
        </pre>
        <p>
          Import components from <code>@csl/ui</code>, tokens from <code>@csl/tokens/css</code>, and
          component styles from <code>@csl/ui/styles.css</code>. Native input props and refs are
          supported by form controls. See the source types for the complete API.
        </p>
        <div className="contract">
          <Audit />
        </div>
      </article>
    </div>
  );
}
