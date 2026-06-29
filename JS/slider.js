(function () {
  const sliders = document.querySelectorAll('[data-slider]');
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const prev = slider.querySelector('[data-slider-prev]');
    const next = slider.querySelector('[data-slider-next]');
    const count = slider.querySelector('[data-slider-count]');
    const images = Array.from(slider.querySelectorAll('.image-slider-frame img'));

    if (!images.length || !prev || !next) return;

    let index = 0;

    const render = () => {
      images.forEach((img, i) => {
        if (i === index) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
      if (count) {
        count.textContent = `${index + 1} / ${images.length}`;
      }
    };

    prev.addEventListener('click', () => {
      index = (index - 1 + images.length) % images.length;
      render();
    });

    next.addEventListener('click', () => {
      index = (index + 1) % images.length;
      render();
    });

    render();
  });
})();
