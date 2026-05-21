/**
 * Contact Bar Block
 *
 * Renders a collapsible utility bar matching the Wells Fargo "How can we help?" panel.
 *
 * Authoring table (two columns, two rows):
 * Row 1 — Location search: label | placeholder text
 * Row 2 — Appointment + Quick Help: appointment link cell | quick help links cell
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
  input.placeholder = placeholder || 'City, State or ZIP';
  input.setAttribute('aria-label', placeholder || 'City, State or ZIP');

  const searchBtn = document.createElement('button');
  searchBtn.className = 'contact-bar-search-btn';
  searchBtn.textContent = 'Go';
  searchBtn.setAttribute('aria-label', 'Search for branch location');

  content.appendChild(input);
  content.appendChild(searchBtn);
  wrapper.appendChild(content);
  return wrapper;
}

function buildAppointmentSection(apptCell, quickHelpCell, sectionId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'contact-bar-section contact-bar-appointment';

  const content = document.createElement('div');
  content.className = 'contact-bar-content';
  content.id = sectionId;
  content.setAttribute('aria-hidden', 'true');

  // Extract appointment link from cell 0
  if (apptCell) {
    const existingAnchor = apptCell.querySelector('a');
    if (existingAnchor) {
      const apptLink = document.createElement('a');
      apptLink.className = 'contact-bar-appointment-link';
      apptLink.href = existingAnchor.href;
      apptLink.textContent = existingAnchor.textContent.trim();
      content.appendChild(apptLink);
    } else {
      const text = apptCell.textContent.trim();
      if (text) {
        const apptLink = document.createElement('a');
        apptLink.className = 'contact-bar-appointment-link';
        apptLink.href = '#';
        apptLink.textContent = text;
        content.appendChild(apptLink);
      }
    }
  }

  // Build quick help section from cell 1
  const quickHelp = document.createElement('div');
  quickHelp.className = 'contact-bar-quickhelp';

  const quickHelpLabel = document.createElement('strong');
  quickHelpLabel.textContent = 'Quick help';
  quickHelp.appendChild(quickHelpLabel);

  const ul = document.createElement('ul');

  if (quickHelpCell) {
    // Gather all anchors and paragraphs from the quick help cell
    const anchors = [...quickHelpCell.querySelectorAll('a')];
    const paragraphs = [...quickHelpCell.querySelectorAll('p, li')];

    if (anchors.length > 0) {
      anchors.forEach((a) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.textContent.trim();
        li.appendChild(link);
        ul.appendChild(li);
      });
    } else if (paragraphs.length > 0) {
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text) {
          const li = document.createElement('li');
          li.textContent = text;
          ul.appendChild(li);
        }
      });
    }
  }

  quickHelp.appendChild(ul);
  content.appendChild(quickHelp);
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
  if (rows.length < 1) return;

  // Parse row cells
  const [locRow, apptRow] = rows;
  const locCells = locRow ? [...locRow.querySelectorAll(':scope > div')] : [];
  const apptCells = apptRow ? [...apptRow.querySelectorAll(':scope > div')] : [];

  const locLabel = locCells[0] ? locCells[0].textContent.trim() : 'How can we help?';
  const locPlaceholder = locCells[1] ? locCells[1].textContent.trim() : 'City, State or ZIP';

  const apptCell = apptCells[0] || null;
  const quickHelpCell = apptCells[1] || null;

  // Clear block and rebuild
  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'contact-bar-inner';

  const locSection = buildLocationSection(locLabel, locPlaceholder, 'contact-bar-location-content');
  inner.appendChild(locSection);

  if (apptRow) {
    const apptSection = buildAppointmentSection(apptCell, quickHelpCell, 'contact-bar-appointment-content');
    inner.appendChild(apptSection);
    wireToggle(apptSection);
  }

  block.appendChild(inner);

  // Wire up toggle interactions
  wireToggle(locSection);

  // Auto-expand the first section (Find a location) on load
  const firstToggle = locSection.querySelector('.contact-bar-toggle');
  const firstContent = locSection.querySelector('.contact-bar-content');
  if (firstToggle && firstContent) {
    firstToggle.setAttribute('aria-expanded', 'true');
    firstContent.removeAttribute('aria-hidden');
    locSection.classList.add('is-open');
  }
}
