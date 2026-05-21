/**
 * Contact Bar Block
 *
 * Renders a sticky collapsible utility bar with two sections:
 *   Row 1 — Location search: label + input placeholder text
 *   Row 2 — Call section:    label + phone number link
 *
 * Authoring table (two columns, two rows):
 * | Location | Find a branch near you |
 * | Call us  | tel:1-800-869-3557     |
 */

function createToggleButton(label, sectionId) {
  const btn = document.createElement('button');
  btn.className = 'contact-bar-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', sectionId);
  btn.textContent = label;
  return btn;
}

function buildLocationSection(label, placeholder, sectionId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'contact-bar-section contact-bar-location';

  const toggle = createToggleButton(label, sectionId);
  wrapper.appendChild(toggle);

  const content = document.createElement('div');
  content.className = 'contact-bar-content';
  content.id = sectionId;
  content.setAttribute('aria-hidden', 'true');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'contact-bar-input';
  input.placeholder = placeholder || 'Enter ZIP code or city';
  input.setAttribute('aria-label', placeholder || 'Enter ZIP code or city');

  const searchBtn = document.createElement('button');
  searchBtn.className = 'contact-bar-search-btn';
  searchBtn.textContent = 'Search';
  searchBtn.setAttribute('aria-label', 'Search for branch location');

  content.appendChild(input);
  content.appendChild(searchBtn);
  wrapper.appendChild(content);
  return wrapper;
}

function buildCallSection(label, phoneRaw, sectionId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'contact-bar-section contact-bar-call';

  const toggle = createToggleButton(label, sectionId);
  wrapper.appendChild(toggle);

  const content = document.createElement('div');
  content.className = 'contact-bar-content';
  content.id = sectionId;
  content.setAttribute('aria-hidden', 'true');

  // phoneRaw may already be an anchor element or plain text
  let phoneLink;
  const existingAnchor = typeof phoneRaw === 'string' ? null : phoneRaw.querySelector('a');
  if (existingAnchor) {
    phoneLink = existingAnchor.cloneNode(true);
    phoneLink.className = 'contact-bar-phone';
  } else {
    const phoneText = typeof phoneRaw === 'string' ? phoneRaw.trim() : phoneRaw.textContent.trim();
    phoneLink = document.createElement('a');
    // Normalise: strip any leading "tel:" so we can rebuild it
    const digits = phoneText.replace(/^tel:/i, '').trim();
    phoneLink.href = `tel:${digits.replace(/\s/g, '')}`;
    phoneLink.className = 'contact-bar-phone';
    phoneLink.textContent = digits;
  }

  content.appendChild(phoneLink);
  wrapper.appendChild(content);
  return wrapper;
}

function wireToggle(section) {
  const btn = section.querySelector('.contact-bar-toggle');
  const content = section.querySelector('.contact-bar-content');
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isExpanded));
    content.setAttribute('aria-hidden', String(isExpanded));
    section.classList.toggle('is-open', !isExpanded);
  });
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length < 2) return;

  // Parse row cells
  const [locRow, callRow] = rows;
  const locCells = [...locRow.querySelectorAll(':scope > div')];
  const callCells = [...callRow.querySelectorAll(':scope > div')];

  const locLabel = locCells[0] ? locCells[0].textContent.trim() : 'Find a Location';
  const locPlaceholder = locCells[1] ? locCells[1].textContent.trim() : 'Enter ZIP code or city';

  const callLabel = callCells[0] ? callCells[0].textContent.trim() : 'Call Us';
  const callPhoneSource = callCells[1] || 'tel:1-800-869-3557';

  // Clear block and rebuild
  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'contact-bar-inner';

  const locSection = buildLocationSection(locLabel, locPlaceholder, 'contact-bar-location-content');
  const callSection = buildCallSection(callLabel, callPhoneSource, 'contact-bar-call-content');

  inner.appendChild(locSection);
  inner.appendChild(callSection);
  block.appendChild(inner);

  // Wire up toggle interactions
  wireToggle(locSection);
  wireToggle(callSection);
}
