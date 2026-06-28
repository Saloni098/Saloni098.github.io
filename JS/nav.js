/* ============================================================
   nav.js — shared nav active-state logic
   Works in 2 modes:
   1) Single-page (index.html): scroll-spy switches the dot between
      Home / Work / Play / About as the user scrolls past sections
      with matching ids (#home, #work, #play, #about).
   2) Sub-pages (about.html, play.html, case studies): the active
      link is simply the one whose href matches the current page —
      no scrolling needed, set via data-page on <body>.
   ============================================================ */

   (function () {
    const navLinks = document.querySelectorAll('nav a');
  
    // Sub-page mode: body has data-page="about" / "play" / etc.
    const currentPage = document.body.getAttribute('data-page');
  
    if (currentPage) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.navId === currentPage);
      });
      return; // no scroll-spy needed on sub-pages
    }
  
    // Single-page mode: scroll-spy across sections with matching ids
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;
  
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.navId === id);
      });
    };
  
    const scrollSpy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
  
    sections.forEach((s) => scrollSpy.observe(s));
  })();