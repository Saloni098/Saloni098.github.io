/* ============================================================
   slider.js — simple image slider for case-study slide sections
   ============================================================ */

(function () {
  const sliders = document.querySelectorAll('[data-slider]');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const image = slider.querySelector('[data-slider-image]');
    const prev = slider.querySelector('[data-slider-prev]');
    const next = slider.querySelector('[data-slider-next]');
    const count = slider.querySelector('[data-slider-count]');
    const slides = (slider.dataset.slides || '').split('|').filter(Boolean);
    const alts = (slider.dataset.alts || '').split('|');
    let index = 0;

    if (!image || !prev || !next || !slides.length) return;

    const render = () => {
      image.src = slides[index];
      image.alt = alts[index] || `Slide ${index + 1}`;
      if (count) count.textContent = `${index + 1} / ${slides.length}`;
    };

    prev.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      render();
    });

    next.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      render();
    });

    render();
  });
})();
