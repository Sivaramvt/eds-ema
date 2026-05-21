export default function decorate(block) {
  // Block rows: row[0] = image cell, row[1] = text content cell
  const rows = [...block.children];

  // Build promo image wrapper from first row
  const imageRow = rows[0];
  const imageCell = imageRow?.firstElementChild;
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'promo-image-wrapper';

  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.loading = 'lazy';
      }
      imageWrapper.append(picture);
    }
  }

  // Build promo text overlay from second row
  const textRow = rows[1];
  const textCell = textRow?.firstElementChild;
  const textOverlay = document.createElement('div');
  textOverlay.className = 'promo-text-overlay';

  if (textCell) {
    while (textCell.firstElementChild) {
      const child = textCell.firstElementChild;
      // Style anchor tags as CTA buttons
      if (child.tagName === 'P') {
        const anchor = child.querySelector('a');
        if (anchor && child.children.length === 1 && child.textContent.trim() === anchor.textContent.trim()) {
          anchor.classList.add('promo-cta', 'button');
        }
      }
      textOverlay.append(child);
    }
  }

  // Clear block and rebuild with overlay structure
  block.replaceChildren();
  block.append(imageWrapper);
  block.append(textOverlay);
}
