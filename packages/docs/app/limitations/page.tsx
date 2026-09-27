export const metadata = { title: 'Evidence and limitations' };
export default function Limitations() {
  return (
    <article className="page-shell docs-content">
      <div className="eyebrow">EVIDENCE BOUNDARIES</div>
      <h1>Known limitations.</h1>
      <p className="lede">
        This component system has a deliberately small support surface. Automated assertions cover
        defined states, not every accessibility requirement.
      </p>
      <h2>Supported scope</h2>
      <p>
        Eight component families; IconButton is a Button variant. Native inputs, horizontal tabs
        with stable values, action menus without submenus, and one native modal dialog at a time.
        Checkout is a local simulation with no payment or backend.
      </p>
      <h2>Manual checks not yet performed</h2>
      <ul>
        <li>VoiceOver/Safari announcements and reading order.</li>
        <li>NVDA/Firefox or other screen-reader pairs.</li>
        <li>Actual browser zoom and text-only resizing.</li>
        <li>Operating-system forced-colors inspection and inclusive user testing.</li>
      </ul>
      <p>
        Reduced-motion and forced-colors browser emulation are useful automated checks; they do not
        substitute for operating-system or assistive-technology observations.
      </p>
      <h2>What the suite cannot establish</h2>
      <p>
        An empty axe violations array does not establish WCAG conformance. Token contrast applies to
        opaque sRGB pairs; gradients, transparency, consumer overrides, and arbitrary content need
        separate assessment. A focus outline assertion does not establish visual usability in every
        environment.
      </p>
      <h2>Deferred work</h2>
      <p>
        Toast timing, comboboxes, tooltips, sortable tables, nested overlays, dynamic tab deletion,
        iframe and shadow-root modal focus navigation, a second screen-reader platform, public
        package publication, and production adoption.
      </p>
    </article>
  );
}
