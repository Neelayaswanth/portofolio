/**
 * Custom Cursor Effect
 * Simple round cursor, box cursor for interactive elements, text cursor for words
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
  let followerX = 0;
  let followerY = 0;
  let currentHoverElement = null;
  let targetWidth = 40;
  let targetHeight = 40;
  let currentWidth = 40;
  let currentHeight = 40;
  let targetX = 0;
  let targetY = 0;
  let isHovering = false;
  const defaultColor = '#ececec';
  const hoverColor = '#ff922b';

  // Update mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    if (!isHovering) {
      targetX = mouseX;
      targetY = mouseY;
    }
  });

  // Smooth animation for follower
  function animateCursor() {
    const dx = targetX - followerX;
    const dy = targetY - followerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const ease = distance > 100 ? 0.2 : 0.12;
    
    followerX += dx * ease;
    followerY += dy * ease;
    
    currentWidth += (targetWidth - currentWidth) * 0.2;
    currentHeight += (targetHeight - currentHeight) * 0.2;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    cursorFollower.style.width = currentWidth + 'px';
    cursorFollower.style.height = currentHeight + 'px';
    cursorFollower.style.borderRadius = isHovering ? '12px' : '50%';
    
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Check if element is interactive
  function isInteractiveElement(element) {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    if (['a', 'button', 'input', 'textarea', 'select'].includes(tagName)) return true;
    if (element.hasAttribute('role') && element.getAttribute('role') === 'button') return true;
    
    const interactiveClasses = [
      'btn', 'portfolio-wrap', 'service-card', 'scroll-top', 
      'portfolio-item', 'card-action', 'portfolio-links',
      'navmenu', 'resume-item', 'skill-item', 'stat-card',
      'portfolio-info', 'service-icon', 'contact-form'
    ];
    
    for (const className of interactiveClasses) {
      if (element.classList.contains(className)) return true;
      if (element.closest('.' + className)) return true;
    }
    
    if (element.closest('a, button, .btn')) return true;
    
    return false;
  }

  // Check if element is text
  function isTextElement(element) {
    if (!element) return false;
    if (isInteractiveElement(element)) return false;
    
    const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li', 'td', 'th', 'label', 'strong', 'em', 'b', 'i'];
    const tagName = element.tagName.toLowerCase();
    
    if (textTags.includes(tagName)) return true;
    
    const hasText = element.textContent && element.textContent.trim().length > 0;
    const isInteractive = ['a', 'button', 'input', 'textarea', 'select'].includes(tagName);
    
    if (hasText && !isInteractive) {
      const parent = element.parentElement;
      if (parent && textTags.includes(parent.tagName.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }

  // Find hoverable element
  function findHoverableElement(element) {
    if (!element) return null;
    
    if (isInteractiveElement(element)) return element;
    
    const interactiveParent = element.closest('a, button, .btn, [role="button"]');
    if (interactiveParent) return interactiveParent;
    
    const interactiveClasses = [
      'btn', 'portfolio-wrap', 'service-card', 'scroll-top', 
      'portfolio-item', 'card-action', 'portfolio-links',
      'navmenu', 'resume-item', 'skill-item', 'stat-card',
      'portfolio-info', 'service-icon', 'contact-form'
    ];
    
    for (const className of interactiveClasses) {
      const parent = element.closest('.' + className);
      if (parent) return parent;
    }
    
    if (element.closest('.navmenu')) {
      return element.closest('.navmenu a') || element.closest('.navmenu');
    }
    
    if (isTextElement(element)) return element;
    
    return null;
  }

  // Handle mouseover
  document.addEventListener('mouseover', (e) => {
    const hoverableElement = findHoverableElement(e.target);
    
    if (hoverableElement && hoverableElement !== currentHoverElement) {
      currentHoverElement = hoverableElement;
      isHovering = true;
      
      const rect = hoverableElement.getBoundingClientRect();
      const isText = isTextElement(hoverableElement);
      
      if (isText) {
        // Text cursor
        const computedStyle = window.getComputedStyle(hoverableElement);
        const fontSize = parseFloat(computedStyle.fontSize);
        const cursorHeight = Math.max(fontSize * 1.2, 16);
        
        cursorFollower.style.opacity = '0';
        cursor.classList.add('text-cursor');
        cursor.style.width = '2px';
        cursor.style.height = cursorHeight + 'px';
        cursor.style.borderRadius = '1px';
        cursor.style.backgroundColor = hoverColor;
      } else {
        // Box cursor for interactive elements
        const padding = 12;
        targetWidth = rect.width + (padding * 2);
        targetHeight = rect.height + (padding * 2);
        targetX = rect.left + (rect.width / 2);
        targetY = rect.top + (rect.height / 2);
        
        cursorFollower.style.borderColor = hoverColor;
        cursorFollower.style.opacity = '1';
        cursorFollower.classList.add('no-glass');
        
        cursor.classList.remove('text-cursor');
        cursor.style.width = '6px';
        cursor.style.height = '6px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = defaultColor;
        
        cursorFollower.setAttribute('data-filling', 'true');
      }
    }
  });

  // Handle mouseout
  document.addEventListener('mouseout', (e) => {
    const hoverableElement = findHoverableElement(e.target);
    
    if (hoverableElement === currentHoverElement) {
      const relatedTarget = e.relatedTarget;
      if (!relatedTarget || !hoverableElement.contains(relatedTarget)) {
        currentHoverElement = null;
        isHovering = false;
        
        targetWidth = 40;
        targetHeight = 40;
        targetX = mouseX;
        targetY = mouseY;
        
        cursorFollower.style.borderColor = defaultColor;
        cursorFollower.style.opacity = '1';
        cursorFollower.classList.remove('no-glass');
        cursorFollower.removeAttribute('data-filling');
        
        cursor.classList.remove('text-cursor');
        cursor.style.width = '6px';
        cursor.style.height = '6px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = defaultColor;
      }
    }
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
    if (!isHovering) {
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    if (!isHovering) {
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  });

  // Hide/show cursor
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
      
      if (isHovering) {
        currentHoverElement = null;
        isHovering = false;
        targetWidth = 40;
        targetHeight = 40;
        targetX = mouseX;
        targetY = mouseY;
        cursorFollower.style.borderColor = defaultColor;
        cursorFollower.style.opacity = '1';
        cursorFollower.classList.remove('no-glass');
        cursorFollower.removeAttribute('data-filling');
        cursor.classList.remove('text-cursor');
        cursor.style.width = '6px';
        cursor.style.height = '6px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = defaultColor;
      }
    }, 250);
  });
})();
