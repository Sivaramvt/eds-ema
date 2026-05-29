export default function decorate(block) {
  const rows = [...block.children];
  const nav = document.createElement('nav');
  nav.className = 'icon-nav-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const labelCell = cells[1];
    const hrefCell = cells[2];

    if (!labelCell || !hrefCell) return;

    const href = hrefCell.textContent.trim();
    const label = labelCell.textContent.trim();

    const a = document.createElement('a');
    a.href = href;
    a.className = 'icon-nav-item';

    const iconWrapper = document.createElement('span');
    iconWrapper.className = 'icon-nav-icon';

    const img = iconCell.querySelector('img');
    const picture = iconCell.querySelector('picture');

    if (picture) {
      const cloned = picture.cloneNode(true);
      const imgEl = cloned.querySelector('img');
      if (imgEl) imgEl.setAttribute('loading', 'lazy');
      iconWrapper.appendChild(cloned);
    } else if (img) {
      const pic = document.createElement('picture');
      const clonedImg = img.cloneNode(true);
      clonedImg.setAttribute('loading', 'lazy');
      pic.appendChild(clonedImg);
      iconWrapper.appendChild(pic);
    } else {
      iconWrapper.textContent = iconCell.textContent.trim();
    }

    const labelEl = document.createElement('span');
    labelEl.className = 'icon-nav-label';
    labelEl.textContent = label;

    a.appendChild(iconWrapper);
    a.appendChild(labelEl);
    nav.appendChild(a);
  });

  block.textContent = '';
  block.appendChild(nav);
}
