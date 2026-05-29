/**
 * Accordion block — FAQ-style collapsible question/answer pairs.
 *
 * Authoring format (table with two columns):
 *   | Accordion        |              |
 *   | Question text    | Answer text  |
 *   | Another question | More text    |
 *
 * Each row becomes one accordion item. Clicking the question
 * toggles the answer open or closed independently.
 */

export default function decorate(block) {
  const items = [...block.children];

  // Build the accordion structure
  const dl = document.createElement('dl');

  items.forEach((row) => {
    const [questionCell, answerCell] = [...row.children];
    if (!questionCell) return;

    // --- Question (term / trigger) ---
    const dt = document.createElement('dt');
    const button = document.createElement('button');
    button.className = 'accordion-trigger';
    button.setAttribute('type', 'button');
    button.setAttribute('aria-expanded', 'false');

    // Move question content into the button
    while (questionCell.firstChild) button.append(questionCell.firstChild);

    // Chevron icon (CSS-drawn, no external asset needed)
    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon);

    dt.append(button);
    dl.append(dt);

    // --- Answer (definition / panel) ---
    const dd = document.createElement('dd');
    dd.className = 'accordion-panel';
    dd.setAttribute('hidden', '');

    if (answerCell) {
      while (answerCell.firstChild) dd.append(answerCell.firstChild);
    }

    dl.append(dd);

    // Toggle behaviour
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        button.setAttribute('aria-expanded', 'false');
        dd.setAttribute('hidden', '');
      } else {
        button.setAttribute('aria-expanded', 'true');
        dd.removeAttribute('hidden');
      }
    });

    // Keyboard: allow Enter / Space from dt itself (button already handles it)
  });

  block.replaceChildren(dl);
}
