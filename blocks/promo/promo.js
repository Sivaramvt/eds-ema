export default function decorate(block) {
  // EDS wraps all cells in one parent div: block > div > div (rows)
  const rows = [...block.children[0].children];
  const imageRow = rows[0];
  const contentRow = rows[1];

  const bg = document.createElement('div');
  bg.className = 'promo-bg';
  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) img.loading = 'lazy';
    bg.append(picture);
  }

  const content = document.createElement('div');
  content.className = 'promo-content';
  if (contentRow) {
    content.append(...contentRow.children);
  }

  // Style CTA link as button
  content.querySelectorAll('p > a').forEach((a) => a.classList.add('promo-cta'));

  block.textContent = '';
  block.append(bg, content);
}
