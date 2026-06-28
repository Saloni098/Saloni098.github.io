/* ============================================================
   animations.js — scroll-triggered fade-in for content blocks
   ============================================================ */

   (function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;
  
    if (prefersReduced) {
      targets.forEach((t) => t.classList.add('visible'));
      return;
    }
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
  
    targets.forEach((t) => observer.observe(t));
  })();