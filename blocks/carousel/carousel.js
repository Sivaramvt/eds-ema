import { createOptimizedPicture } from '../../scripts/aem.js';

function buildSlide(row, index) {
  const slide = document.createElement('li');
  slide.className = 'carousel-slide';
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `Slide ${index + 1}`);
  slide.dataset.slideIndex = index;

  [...row.children].forEach((cell, cellIndex) => {
    if (cellIndex === 0) {
      // First cell: image
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'carousel-slide-image';
      const picture = cell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt || '', false, [
            { media: '(min-width: 900px)', width: '1200' },
            { width: '750' },
          ]);
          optimized.querySelector('img').setAttribute('loading', 'lazy');
          imageWrapper.append(optimized);
        } else {
          imageWrapper.append(picture);
        }
      }
      slide.append(imageWrapper);
    } else {
      // Remaining cells: content (heading, text, CTA)
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'carousel-slide-content';
      while (cell.firstChild) contentWrapper.append(cell.firstChild);
      // Wrap any <a> tags that are direct children or within <p> as CTAs
      contentWrapper.querySelectorAll('a').forEach((a) => {
        if (!a.closest('.carousel-slide-cta') && a.parentElement.tagName === 'P') {
          a.parentElement.classList.add('carousel-slide-cta');
        }
      });
      slide.append(contentWrapper);
    }
  });

  return slide;
}

function updateSlideVisibility(track, currentIndex) {
  const slides = track.querySelectorAll('.carousel-slide');
  slides.forEach((slide, i) => {
    const active = i === currentIndex;
    slide.setAttribute('aria-hidden', !active);
    slide.classList.toggle('carousel-slide--active', active);
  });
}

function updateDots(dotsContainer, currentIndex) {
  dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    const active = i === currentIndex;
    dot.classList.toggle('carousel-dot--active', active);
    dot.setAttribute('aria-selected', active);
    dot.setAttribute('tabindex', active ? '0' : '-1');
  });
}

function goToSlide(state, index, track, dotsContainer, totalSlides) {
  // Clamp index with wrapping
  let next = index;
  if (next < 0) next = totalSlides - 1;
  if (next >= totalSlides) next = 0;

  state.current = next;
  const offset = -next * 100;
  track.style.transform = `translateX(${offset}%)`;
  updateSlideVisibility(track, next);
  updateDots(dotsContainer, next);
}

export default function decorate(block) {
  const rows = [...block.children];
  const totalSlides = rows.length;
  if (totalSlides === 0) return;

  const autoplay = block.dataset.autoplay !== undefined;
  const autoplayDelay = parseInt(block.dataset.autoplayDelay, 10) || 5000;

  // Build structure
  const container = document.createElement('div');
  container.className = 'carousel-container';
  container.setAttribute('role', 'region');
  container.setAttribute('aria-roledescription', 'carousel');
  container.setAttribute('aria-label', 'Content carousel');

  const track = document.createElement('ul');
  track.className = 'carousel-track';
  track.setAttribute('aria-live', autoplay ? 'off' : 'polite');

  rows.forEach((row, i) => {
    const slide = buildSlide(row, i);
    track.append(slide);
  });

  // Prev / Next buttons
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'carousel-btn carousel-btn--prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '<span aria-hidden="true">&#8249;</span>';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'carousel-btn carousel-btn--next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '<span aria-hidden="true">&#8250;</span>';

  // Dot indicators
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Slide indicators');

  for (let i = 0; i < totalSlides; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.dataset.index = i;
    dotsContainer.append(dot);
  }

  container.append(track, prevBtn, nextBtn, dotsContainer);
  block.replaceChildren(container);

  // Set slide count so CSS can hide nav for single-slide carousels
  block.dataset.slides = totalSlides;

  // State
  const state = { current: 0, timer: null };

  const go = (index) => goToSlide(state, index, track, dotsContainer, totalSlides);

  // Initialize
  go(0);

  // Button events
  prevBtn.addEventListener('click', () => {
    go(state.current - 1);
    if (autoplay) resetAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    go(state.current + 1);
    if (autoplay) resetAutoplay();
  });

  // Dot events
  dotsContainer.addEventListener('click', (e) => {
    const dot = e.target.closest('.carousel-dot');
    if (!dot) return;
    go(parseInt(dot.dataset.index, 10));
    if (autoplay) resetAutoplay();
  });

  // Keyboard navigation
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(state.current - 1);
      if (autoplay) resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(state.current + 1);
      if (autoplay) resetAutoplay();
    }
  });

  // Dots keyboard navigation (tab role)
  dotsContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const newIndex = e.key === 'ArrowLeft' ? state.current - 1 : state.current + 1;
      go(newIndex < 0 ? totalSlides - 1 : newIndex >= totalSlides ? 0 : newIndex);
      const activeDot = dotsContainer.querySelector('.carousel-dot--active');
      if (activeDot) activeDot.focus();
    }
  });

  // Autoplay
  function startAutoplay() {
    state.timer = setInterval(() => go(state.current + 1), autoplayDelay);
  }

  function stopAutoplay() {
    clearInterval(state.timer);
    state.timer = null;
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (autoplay) {
    startAutoplay();
    // Pause on hover/focus
    block.addEventListener('mouseenter', stopAutoplay);
    block.addEventListener('mouseleave', startAutoplay);
    block.addEventListener('focusin', stopAutoplay);
    block.addEventListener('focusout', startAutoplay);
  }
}
