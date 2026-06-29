/* ============================================================
   workspace.js — Drag, Resize, Window Management for Workspace
   ============================================================ */

(function () {
  const workspace = document.querySelector('.workspace-frame');
  if (!workspace) return;

  // Track active windows & z-index
  let topZIndex = 10;
  const windows = {};

  // Window default dimensions
  const DEFAULT_WIDTH = 686;
  const DEFAULT_HEIGHT = 350;

  // Window content mapping
  const windowData = {
    cal: {
      title: 'Book a call — Cal.com',
      content: `<iframe src="https://cal.com/salonidwivedi" style="width:100%;height:100%;border:none;" loading="lazy"></iframe>`,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    },
    linkedin: {
      title: 'Saloni Dwivedi | LinkedIn',
      content: `
        <div class="mock-linkedin">
          <div class="linkedin-banner">
            <img class="linkedin-profile-pic" src="images/about/_MG_4361.JPG" alt="Saloni Dwivedi" />
          </div>
          <div class="linkedin-content">
            <div class="linkedin-name">Saloni Dwivedi</div>
            <div class="linkedin-headline">Product Designer | Ex-CommendaHQ, Jumbochain</div>
            <div class="linkedin-meta">Bangalore, India • 500+ connections</div>
            <div class="linkedin-actions">
              <a href="mailto:saloni.dwivedi09@gmail.com" class="linkedin-btn-primary">Connect</a>
              <a href="mailto:saloni.dwivedi09@gmail.com" class="linkedin-btn-sec">Message</a>
            </div>
            
            <div class="linkedin-section">
              <h4>About</h4>
              <p style="font-size: 13.5px; line-height: 1.4; color: #333;">
                Product designer with 3+ years of experience designing scalable interfaces across AI, fintech, compliance, and web3 workflows. Pivoted from engineering to design, merging logical problem solving with user-centric visual storytelling.
              </p>
            </div>

            <div class="linkedin-section">
              <h4>Experience</h4>
              <div class="linkedin-exp-item">
                <div class="linkedin-exp-title">Product Designer</div>
                <div class="linkedin-exp-company">CommendaHQ • Full-time (2 yrs)</div>
              </div>
              <div class="linkedin-exp-item">
                <div class="linkedin-exp-title">UX Designer</div>
                <div class="linkedin-exp-company">Jumbochain • Full-time</div>
              </div>
            </div>
          </div>
        </div>`,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    },
    twitter: {
      title: 'Saloni Dwivedi (@salonidwivedi) / X',
      content: `
        <div class="mock-twitter">
          <div class="twitter-banner">
            <img class="twitter-profile-pic" src="images/about/_MG_4361.JPG" alt="Saloni Dwivedi" />
          </div>
          <div class="twitter-content">
            <div class="twitter-header">
              <div>
                <div class="twitter-name">Saloni Dwivedi</div>
                <div class="twitter-handle">@salonidwivedi</div>
              </div>
              <a href="mailto:saloni.dwivedi09@gmail.com" class="twitter-follow-btn">Follow</a>
            </div>
            <div class="twitter-bio">
              Designing better digital products & digital experiences. CS background turned full-time designer. Sunlight, mountains, and interfaces.
            </div>
            <div class="twitter-meta-row">
              <span>📍 Bangalore, India</span>
              <span>🔗 <a href="#" style="color:#1d9bf0; text-decoration:none;">saloni.design</a></span>
            </div>
            
            <div class="twitter-feed">
              <div class="twitter-tweet">
                <img class="tweet-avatar" src="images/about/_MG_4361.JPG" alt="Avatar" />
                <div class="tweet-main">
                  <div class="tweet-info">
                    <span class="tweet-author">Saloni Dwivedi</span>
                    <span class="tweet-handle">@salonidwivedi • 1d</span>
                  </div>
                  <div class="tweet-text">
                    Just optimized the workspace interactions for my new portfolio! Loving this macOS setup 🖥️✨
                  </div>
                </div>
              </div>
              <div class="twitter-tweet">
                <img class="tweet-avatar" src="images/about/_MG_4361.JPG" alt="Avatar" />
                <div class="tweet-main">
                  <div class="tweet-info">
                    <span class="tweet-author">Saloni Dwivedi</span>
                    <span class="tweet-handle">@salonidwivedi • 4d</span>
                  </div>
                  <div class="tweet-text">
                    Pivoting from CS engineering to Product Design was the best decision I ever made. The intersection of logic and beauty is a fun place to build.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    },
    gmail: {
      title: 'Compose Message — Gmail',
      content: `
        <form class="gmail-composer" onsubmit="event.preventDefault(); window.location.href='mailto:saloni.dwivedi09@gmail.com?subject=' + encodeURIComponent(this.subject.value) + '&body=' + encodeURIComponent(this.bodyText.value);">
          <div class="gmail-header">New Message</div>
          <div class="gmail-row">
            <label>To</label>
            <input type="text" value="saloni.dwivedi09@gmail.com" readonly />
          </div>
          <div class="gmail-row">
            <label>Subject</label>
            <input type="text" name="subject" placeholder="Let's build something together!" required />
          </div>
          <div class="gmail-body-wrap">
            <textarea name="bodyText" placeholder="Write your message here..." required></textarea>
          </div>
          <div class="gmail-footer">
            <button type="submit" class="gmail-send-btn">Send</button>
          </div>
        </form>`,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    },
    resume: {
      title: 'Saloni Dwivedi — Resume',
      content: `<iframe src="images/saloni.dwivedi.resume.pdf" style="width:100%;height:100%;border:none;"></iframe>`,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    }
  };

  // Convert dock items to interact with workspace.js
  const dockLinks = document.querySelectorAll('.workspace-dock a');
  dockLinks.forEach(link => {
    const tooltipText = link.getAttribute('data-tooltip').toLowerCase();
    let type = 'cal';
    if (tooltipText.includes('linkedin')) type = 'linkedin';
    else if (tooltipText.includes('twitter') || tooltipText.includes('x')) type = 'twitter';
    else if (tooltipText.includes('gmail')) type = 'gmail';
    else if (tooltipText.includes('resume')) type = 'resume';
    else if (tooltipText.includes('call') || tooltipText.includes('cal')) type = 'cal';

    // Prevent default linking behavior for items handled in workspace
    link.addEventListener('click', (e) => {
      e.preventDefault();
      createOrRestoreWindow(type);
    });
  });

  // Handle the default book-a-call window that already exists on startup
  const initialWin = document.querySelector('.workspace-window');
  if (initialWin) {
    setupWindowInteractions(initialWin, 'cal');
    windows['cal'] = initialWin;
    
    // Set default initial sizes
    initialWin.style.width = `${DEFAULT_WIDTH}px`;
    initialWin.style.height = `${DEFAULT_HEIGHT}px`;
    
    // Center it initially in the frame
    centerWindow(initialWin);
  }

  function createOrRestoreWindow(type) {
    if (windows[type]) {
      // Restore if minimized or closed
      const win = windows[type];
      win.style.display = 'flex';
      bringToFront(win);
      if (win.classList.contains('minimized')) {
        win.classList.remove('minimized');
      }
      return;
    }

    const data = windowData[type];
    if (!data) return;

    // Create new window element
    const win = document.createElement('div');
    win.className = 'workspace-window active-window';
    win.style.width = `${data.width}px`;
    win.style.height = `${data.height}px`;
    win.style.position = 'absolute';
    win.style.zIndex = ++topZIndex;

    win.innerHTML = `
      <div class="window-titlebar">
        <div class="window-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="window-title">${data.title}</span>
      </div>
      <div class="window-body">
        ${data.content}
      </div>
    `;

    workspace.appendChild(win);
    windows[type] = win;

    setupWindowInteractions(win, type);
    centerWindow(win);
    bringToFront(win);
  }

  function centerWindow(win) {
    const frameRect = workspace.getBoundingClientRect();
    const winWidth = win.offsetWidth || DEFAULT_WIDTH;
    const winHeight = win.offsetHeight || DEFAULT_HEIGHT;

    const left = (frameRect.width - winWidth) / 2;
    const top = (frameRect.height - winHeight) / 2;

    win.style.left = `${Math.max(0, left)}px`;
    win.style.top = `${Math.max(0, top)}px`;
  }

  function bringToFront(win) {
    topZIndex++;
    win.style.zIndex = topZIndex;
  }

  function setupWindowInteractions(win, type) {
    const titlebar = win.querySelector('.window-titlebar');
    const redDot = win.querySelector('.dot-red');
    const yellowDot = win.querySelector('.dot-yellow');
    const greenDot = win.querySelector('.dot-green');

    // Make window focused on click
    win.addEventListener('mousedown', () => bringToFront(win));

    // Handle Titlebar Close (Red)
    redDot.addEventListener('click', (e) => {
      e.stopPropagation();
      win.style.display = 'none';
      // Completely remove secondary windows to save memory/resource, keep cal
      if (type !== 'cal') {
        win.remove();
        delete windows[type];
      }
    });

    // Handle Titlebar Minimize (Yellow)
    yellowDot.addEventListener('click', (e) => {
      e.stopPropagation();
      win.classList.toggle('minimized');
      if (win.classList.contains('minimized')) {
        win.style.display = 'none';
      }
    });

    // Handle Titlebar Expand/Restore (Green)
    let preMaximizeStyle = null;
    greenDot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (win.classList.contains('maximized')) {
        // Restore
        win.classList.remove('maximized');
        if (preMaximizeStyle) {
          win.style.width = preMaximizeStyle.width;
          win.style.height = preMaximizeStyle.height;
          win.style.left = preMaximizeStyle.left;
          win.style.top = preMaximizeStyle.top;
        } else {
          win.style.width = `${DEFAULT_WIDTH}px`;
          win.style.height = `${DEFAULT_HEIGHT}px`;
          centerWindow(win);
        }
      } else {
        // Maximize
        preMaximizeStyle = {
          width: win.style.width,
          height: win.style.height,
          left: win.style.left,
          top: win.style.top
        };
        win.classList.add('maximized');
        win.style.width = '100%';
        win.style.height = '100%';
        win.style.left = '0px';
        win.style.top = '0px';
      }
    });

    // --- DRAGGING FUNCTIONALITY ---
    let isDragging = false;
    let dragStartX, dragStartY, initialLeft, initialTop;

    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('dot')) return; // ignore dots
      if (win.classList.contains('maximized')) return; // ignore when maximized

      isDragging = true;
      bringToFront(win);
      
      // Add cover to iframe to prevent cursor release issues during drag
      const iframes = win.querySelectorAll('iframe');
      iframes.forEach(iframe => iframe.style.pointerEvents = 'none');

      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialLeft = parseFloat(win.style.left) || 0;
      initialTop = parseFloat(win.style.top) || 0;

      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);
    });

    function dragMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      const frameRect = workspace.getBoundingClientRect();
      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      // Keep it within bounds of workspace frame roughly
      const minVisible = 60;
      if (newLeft < -win.offsetWidth + minVisible) newLeft = -win.offsetWidth + minVisible;
      if (newLeft > frameRect.width - minVisible) newLeft = frameRect.width - minVisible;
      if (newTop < 0) newTop = 0;
      if (newTop > frameRect.height - minVisible) newTop = frameRect.height - minVisible;

      win.style.left = `${newLeft}px`;
      win.style.top = `${newTop}px`;
    }

    function dragEnd() {
      isDragging = false;
      const iframes = win.querySelectorAll('iframe');
      iframes.forEach(iframe => iframe.style.pointerEvents = 'auto');

      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
    }

    // --- RESIZING FUNCTIONALITY ---
    // Add resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'window-resize-handle';
    win.appendChild(resizeHandle);

    let isResizing = false;
    let resizeStartX, resizeStartY, startW, startH;

    resizeHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (win.classList.contains('maximized')) return;

      isResizing = true;
      bringToFront(win);
      
      // Disable pointer events on all iframes inside workspace to prevent capture issues
      const iframes = win.querySelectorAll('iframe');
      iframes.forEach(iframe => iframe.style.pointerEvents = 'none');

      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      startW = win.offsetWidth;
      startH = win.offsetHeight;

      document.addEventListener('mousemove', resizeMove);
      document.addEventListener('mouseup', resizeEnd);
    });

    function resizeMove(e) {
      if (!isResizing) return;
      const dx = e.clientX - resizeStartX;
      const dy = e.clientY - resizeStartY;

      let newW = startW + dx;
      let newH = startH + dy;

      // Restrain dimensions
      if (newW < 320) newW = 320;
      if (newH < 240) newH = 240;

      win.style.width = `${newW}px`;
      win.style.height = `${newH}px`;
    }

    function resizeEnd() {
      isResizing = false;
      const iframes = win.querySelectorAll('iframe');
      iframes.forEach(iframe => iframe.style.pointerEvents = 'auto');

      document.removeEventListener('mousemove', resizeMove);
      document.removeEventListener('mouseup', resizeEnd);
    }
  }
})();
