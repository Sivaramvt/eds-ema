export default function decorate(block) {
  // Row 0: background image (picture element)
  // Row 1: content (heading + text + links as CTAs)

  const rows = [...block.children];

  // Extract background picture from first row
  const bgRow = rows[0];
  const bgPicture = bgRow && bgRow.querySelector('picture');

  // Extract content from second row
  const contentRow = rows[1];

  // Build the inner structure
  const inner = document.createElement('div');
  inner.className = 'marquee-inner';

  // Set up background image
  if (bgPicture) {
    // Ensure lazy loading on the img inside picture
    const img = bgPicture.querySelector('img');
    if (img) img.loading = 'lazy';
    bgPicture.classList.add('marquee-bg');
    block.prepend(bgPicture);
  }

  // Move content into inner wrapper
  if (contentRow) {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'marquee-content';

    // Move all children from contentRow's cell(s)
    [...contentRow.children].forEach((cell) => {
      while (cell.firstElementChild) {
        contentDiv.append(cell.firstElementChild);
      }
    });

    // Style links as CTA buttons
    contentDiv.querySelectorAll('a').forEach((a) => {
      a.classList.add('marquee-cta');
    });

    inner.append(contentDiv);
  }

  // Remove original rows
  rows.forEach((row) => row.remove());

  block.append(inner);
}
