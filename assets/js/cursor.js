/**
 * Custom Cursor Effect
 * Inspired by https://azumbrunnen.me/
 * Creates a smooth following cursor effect
 */

(function() {
  'use strict';

  // Only run on desktop devices
  if (window.innerWidth < 992) {
    return;
  }

  const cursor = document.getElementById('customCursor');
  const cursorFollower = document.getElementById('customCursorFollower');
  
  if (!cursor || !cursorFollower) {
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let followerX = 0;
  let followerY = 0;

  // Update mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update cursor immediately
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth animation for follower
  function animateCursor() {
    // Smooth cursor follower movement
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
  }

  // Start animation
  animateCursor();

  // Hover effects on interactive elements using event delegation
  function isInteractiveElement(element) {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    const interactiveTags = ['a', 'button', 'input', 'textarea', 'select'];
    
    if (interactiveTags.includes(tagName)) return true;
    if (element.hasAttribute('role') && element.getAttribute('role') === 'button') return true;
    if (element.classList.contains('btn')) return true;
    if (element.classList.contains('portfolio-wrap')) return true;
    if (element.classList.contains('service-card')) return true;
    if (element.classList.contains('scroll-top')) return true;
    if (element.classList.contains('portfolio-item')) return true;
    if (element.classList.contains('card-action')) return true;
    if (element.closest('.navmenu')) return true;
    
    return false;
  }

  // Use event delegation for better performance
  document.addEventListener('mouseover', (e) => {
    if (isInteractiveElement(e.target) || isInteractiveElement(e.target.closest('a, button, .btn'))) {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (isInteractiveElement(e.target) || isInteractiveElement(e.target.closest('a, button, .btn'))) {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    }
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.9)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth < 992) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
      } else {
        cursor.style.display = 'block';
        cursorFollower.style.display = 'block';
      }
    }, 250);
  });
})();

