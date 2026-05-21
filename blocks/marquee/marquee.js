export default function decorate(block) {
  const [imageRow, contentRow] = [...block.children[0].children];

  // Background image
  const bg = document.createElement('div');
  bg.className = 'marquee-bg';
  bg.append(imageRow.querySelector('picture'));

  // Content overlay
  const content = document.createElement('div');
  content.className = 'marquee-content';
  content.append(...contentRow.children);

  // Style CTA links as buttons
  content.querySelectorAll('p > a').forEach((a) => a.classList.add('marquee-cta'));

  // Set fetchpriority on hero image
  const img = bg.querySelector('img');
  if (img) {
    img.fetchPriority = 'high';
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
  }

  block.textContent = '';
  block.append(bg, content);
}
