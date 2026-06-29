/* ============================================================
   nav.js — shared nav active-state logic
   Works in 2 modes:
   1) Single-page (index.html): "Work" is always active since the
      home page IS the work page. Clicking Work scrolls to top.
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
  
    // Home page mode: Work is always active
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.navId === 'work');
    });

    // Handle clicking Work link (href="#") to scroll to top smoothly
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === '#') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    });
  })();