export default function decorate(block) {
  // Determine layout variant: text-left (default) or text-right
  const isTextRight = block.classList.contains('text-right');

  // Block rows: row[0] = image cell, row[1] = text content cell
  const rows = [...block.children];

  // Build promo image container from first row
  const imageRow = rows[0];
  const imageCell = imageRow?.firstElementChild;
  const imageContainer = document.createElement('div');
  imageContainer.className = 'promo-image';

  if (imageCell) {
    // Ensure picture has lazy loading
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.loading = 'lazy';
      }
      imageContainer.append(picture);
    }
  }

  // Build promo text container from second row
  const textRow = rows[1];
  const textCell = textRow?.firstElementChild;
  const textContainer = document.createElement('div');
  textContainer.className = 'promo-text';

  if (textCell) {
    // Move all text content children into the text container
    while (textCell.firstElementChild) {
      const child = textCell.firstElementChild;
      // Style anchor tags as CTA buttons
      if (child.tagName === 'P') {
        const anchor = child.querySelector('a');
        if (anchor && child.children.length === 1 && child.textContent.trim() === anchor.textContent.trim()) {
          anchor.className = 'promo-cta button';
          child.className = 'promo-cta-wrapper';
        }
      }
      textContainer.append(child);
    }
  }

  // Clear block and rebuild with semantic structure
  block.replaceChildren();

  const inner = document.createElement('div');
  inner.className = 'promo-inner';

  if (isTextRight) {
    // text-right: image left, text right
    inner.append(imageContainer);
    inner.append(textContainer);
  } else {
    // text-left (default): text left, image right
    inner.append(textContainer);
    inner.append(imageContainer);
  }

  block.append(inner);
}
