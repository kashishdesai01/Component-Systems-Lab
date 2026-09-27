import { tokens, themeNames, type TokenName } from '@csl/tokens';
import { contrastContracts, contrastRatio } from '@csl/tokens/contrast';
export const metadata = { title: 'Tokens and contrast' };
export default function TokensPage() {
  return (
    <article className="page-shell docs-content">
      <div className="eyebrow">THE SHARED CONTRACT</div>
      <h1>Tokens & contrast.</h1>
      <p className="lede">
        Three themes, one semantic vocabulary. Ratios apply to these opaque foreground/background
        combinations. Rendered compositions still need browser inspection.
      </p>
      {themeNames.map((theme) => (
        <section key={theme}>
          <h2>{theme}</h2>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <caption>Allowed color combinations in the {theme} theme</caption>
              <thead>
                <tr>
                  <th scope="col">Purpose</th>
                  <th scope="col">Pair</th>
                  <th scope="col">Preview</th>
                  <th scope="col">Ratio / minimum</th>
                </tr>
              </thead>
              <tbody>
                {contrastContracts.map((pair) => (
                  <tr key={`${pair.foreground}-${pair.background}`}>
                    <td>{pair.purpose}</td>
                    <td>
                      <code>
                        {pair.foreground} / {pair.background}
                      </code>
                    </td>
                    <td>
                      <span
                        style={{
                          color: tokens[theme][pair.foreground as TokenName],
                          background: tokens[theme][pair.background as TokenName],
                          padding: '.4rem .6rem',
                          display: 'inline-block',
                        }}
                      >
                        {pair.minimum >= 4.5 ? (
                          'Aa'
                        ) : (
                          <span
                            role="img"
                            aria-label="Non-text boundary sample"
                            style={{
                              display: 'inline-block',
                              width: 24,
                              height: 24,
                              border: '2px solid currentColor',
                            }}
                          />
                        )}
                      </span>
                    </td>
                    <td>
                      {contrastRatio(
                        tokens[theme][pair.foreground as TokenName],
                        tokens[theme][pair.background as TokenName],
                      ).toFixed(2)}
                      :1 / {pair.minimum}:1
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </article>
  );
}
