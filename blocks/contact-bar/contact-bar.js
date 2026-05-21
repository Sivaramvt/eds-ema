export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;
  const cells = [...row.children];

  block.innerHTML = '';
  const inner = document.createElement('div');
  inner.className = 'contact-bar-inner';

  cells.forEach((cell, i) => {
    const col = document.createElement('div');

    if (i === 0) {
      col.className = 'contact-bar-heading';
      while (cell.firstChild) col.append(cell.firstChild);
    } else if (i === 1) {
      col.className = 'contact-bar-location';
      const label = document.createElement('p');
      label.innerHTML = '<strong>Find a location</strong>';
      col.append(label);
      const form = document.createElement('form');
      form.action = 'https://locations.wellsfargo.com/search/';
      form.method = 'get';
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'qp';
      input.placeholder = 'City, State or ZIP';
      input.setAttribute('aria-label', 'City, State or ZIP');
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.className = 'contact-bar-search-btn';
      btn.textContent = 'Go';
      form.append(input, btn);
      col.append(form);
    } else {
      col.className = 'contact-bar-help';
      while (cell.firstChild) col.append(cell.firstChild);
    }

    inner.append(col);
  });

  block.append(inner);
}
