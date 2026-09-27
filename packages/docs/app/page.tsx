import Link from 'next/link';
const families = [
  'Button',
  'TextField',
  'Checkbox',
  'RadioGroup',
  'Tabs',
  'Accordion',
  'Menu',
  'Dialog',
];
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="eyebrow text-text-muted">A SMALL SYSTEM. A HIGH STANDARD.</div>
        <h1>
          Good interfaces
          <br />
          start with
          <br />
          <em>good foundations.</em>
        </h1>
        <p className="lede">
          Eight component families. Explicit interaction contracts. One complete experience to put
          them to work.
        </p>
        <div className="hero-actions">
          <Link className="link-button primary" href="/checkout/">
            Try the reference checkout <span aria-hidden="true">↗</span>
          </Link>
          <Link className="text-link" href="/lab/">
            Explore the interaction lab →
          </Link>
        </div>
        <div className="hero-note">
          <span className="status-dot" /> Native controls first · Keyboard paths specified ·
          Evidence documented
        </div>
      </section>
      <section className="section foundations">
        <div>
          <div className="eyebrow">THE FOUNDATION</div>
          <h2>
            Small by design.
            <br />
            Deep by contract.
          </h2>
          <p>
            Every component has a defined keyboard model, an accessible naming contract, and a
            documented boundary. Explore an API, then try its behavior.
          </p>
        </div>
        <div className="component-grid">
          {families.map((name, index) => (
            <Link key={name} href={`/components/${name.toLowerCase()}/`}>
              <span className="component-number">0{index + 1}</span>
              <span>{name}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section reference">
        <div>
          <div className="eyebrow">FROM PRIMITIVES TO PRODUCT</div>
          <h2>
            A morning ritual,
            <br />
            thoughtfully assembled.
          </h2>
          <p>
            The fictional Fieldwork Café checkout combines forms, validation, focus management, and
            a simulated order into a responsive user journey.
          </p>
          <Link className="link-button primary" href="/checkout/">
            Visit Fieldwork Café ↗
          </Link>
        </div>
        <div className="cafe-preview" aria-hidden="true">
          <span className="preview-sun">✳</span>
          <span className="preview-wordmark">fieldwork</span>
          <span className="preview-caption">COFFEE & THE EVERYDAY</span>
          <div className="preview-cup">☕</div>
          <span className="preview-small">A better start, one cup at a time.</span>
        </div>
      </section>
      <section className="section evidence">
        <div className="eyebrow">EVIDENCE, NOT ASSUMPTIONS</div>
        <h2>Accessibility is a process.</h2>
        <div className="evidence-grid">
          <article>
            <span>01 / CONTRACTS</span>
            <h3>Behavior you can inspect</h3>
            <p>
              Keyboard interactions, naming requirements, and unsupported cases documented beside
              each component.
            </p>
          </article>
          <article>
            <span>02 / AUTOMATION</span>
            <h3>Checks with clear limits</h3>
            <p>
              Semantic contrast pairs, rendered-state axe scans, and browser keyboard assertions.
              Automation is one layer of evidence.
            </p>
          </article>
          <article>
            <span>03 / MANUAL AUDIT</span>
            <h3>Human observations matter</h3>
            <p>
              Screen-reader and zoom checks require a recorded manual run. Unperformed checks remain
              explicitly unverified.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
