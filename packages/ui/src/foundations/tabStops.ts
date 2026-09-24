import { isFocusable, tabbable } from 'tabbable';

/** The utility handles browser visibility, editable hosts and native focus order.
 * Normalize a radio group to its active member: sequential navigation leaves
 * the entire group from that member, including reverse entry with no selection.
 */
export function tabStops(container: HTMLElement, backwards = false) {
  const candidates = tabbable(container);
  const active = document.activeElement;
  return candidates.flatMap((item) => {
    if (!(item instanceof HTMLInputElement) || item.type !== 'radio' || !item.name) return [item];
    const group = candidates.filter(
      (candidate): candidate is HTMLInputElement =>
        candidate instanceof HTMLInputElement &&
        candidate.type === 'radio' &&
        candidate.name === item.name &&
        candidate.form === item.form,
    );
    if (item !== group[0]) return [];
    const focused =
      active instanceof HTMLInputElement &&
      active.type === 'radio' &&
      active.name === item.name &&
      active.form === item.form &&
      container.contains(active) &&
      active.tabIndex >= 0 &&
      isFocusable(active)
        ? active
        : undefined;
    return [
      focused ??
        group.find((radio) => radio.checked) ??
        (backwards ? group[group.length - 1]! : item),
    ];
  });
}
