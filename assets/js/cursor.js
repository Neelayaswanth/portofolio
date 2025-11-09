/**
 * Custom Cursor Effect
 * Text cursor for text elements, normal cursor for buttons and navigation
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
  let isTextMode = false;
  const defaultColor = '#ececec';
  const hoverColor = '#ff922b'; // Orange

  // Check if element is text content (not button, nav, or interactive)
  function isTextElement(element) {
    if (!element) return false;
    
    // Don't apply to buttons, links, inputs, etc.
    const tagName = element.tagName.toLowerCase();
    const interactiveTags = ['a', 'button', 'input', 'textarea', 'select', 'img', 'svg'];
    if (interactiveTags.includes(tagName)) return false;
    
    // Don't apply to navigation menu
    if (element.closest('.navmenu')) return false;
    if (element.closest('nav')) return false;
    
    // Don't apply to buttons and button-like elements
    if (element.closest('.btn')) return false;
    if (element.closest('button')) return false;
    if (element.classList.contains('btn')) return false;
    
    // Don't apply to portfolio items, service cards, etc.
    const interactiveClasses = [
      'portfolio-wrap', 'service-card', 'scroll-top', 
      'portfolio-item', 'card-action', 'portfolio-links',
      'resume-item', 'skill-item', 'stat-card',
      'portfolio-info', 'service-icon', 'contact-form'
    ];
    
    for (const className of interactiveClasses) {
      if (element.classList.contains(className)) return false;
      if (element.closest('.' + className)) return false;
    }
    
    // Check if element has text content
    const textContent = element.textContent || element.innerText || '';
    const hasText = textContent.trim().length > 0;
    
    // Check if it's a text node or contains text
    if (element.nodeType === Node.TEXT_NODE) return true;
    if (hasText && !element.querySelector('a, button, .btn, input, textarea')) {
      return true;
    }
    
    return false;
  }

  // Get font size of text element
  function getTextFontSize(element) {
    if (!element) return 16;
    
    const computedStyle = window.getComputedStyle(element);
    const fontSize = parseFloat(computedStyle.fontSize);
    return fontSize || 16;
  }

  // Update mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update cursor immediately
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Update target position for follower
    if (!isHovering && !isTextMode) {
      targetX = mouseX;
      targetY = mouseY;
    }
  });

  // Smooth animation for follower
  function animateCursor() {
    // Smooth cursor follower movement with easing
    const dx = targetX - followerX;
    const dy = targetY - followerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Dynamic easing based on distance
    const ease = distance > 100 ? 0.2 : 0.12;
    
    followerX += dx * ease;
    followerY += dy * ease;
    
    // Smooth size transition
    currentWidth += (targetWidth - currentWidth) * 0.2;
    currentHeight += (targetHeight - currentHeight) * 0.2;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    cursorFollower.style.width = currentWidth + 'px';
    cursorFollower.style.height = currentHeight + 'px';
    cursorFollower.style.borderRadius = isHovering ? '12px' : '50%';
    
    requestAnimationFrame(animateCursor);
  }

  // Start animation
  animateCursor();

  // Find the hoverable element (closest interactive element)
  function findHoverableElement(element) {
    if (!element) return null;
    
    // Check if element itself is interactive
    const tagName = element.tagName.toLowerCase();
    const interactiveTags = ['a', 'button', 'input', 'textarea', 'select'];
    
    if (interactiveTags.includes(tagName)) return element;
    if (element.hasAttribute('role') && element.getAttribute('role') === 'button') return element;
    
    // Check for interactive classes
    const interactiveClasses = [
      'btn', 'portfolio-wrap', 'service-card', 'scroll-top', 
      'portfolio-item', 'card-action', 'portfolio-links',
      'navmenu', 'resume-item', 'skill-item', 'stat-card',
      'portfolio-info', 'service-icon', 'contact-form'
    ];
    
    for (const className of interactiveClasses) {
      if (element.classList.contains(className)) return element;
      const parent = element.closest('.' + className);
      if (parent) return parent;
    }
    
    // Check for links and buttons in parent
    const linkOrButton = element.closest('a, button, .btn');
    if (linkOrButton) return linkOrButton;
    
    // Check navigation menu
    if (element.closest('.navmenu')) {
      return element.closest('.navmenu a') || element.closest('.navmenu');
    }
    
    return null;
  }

  // Handle mouseover
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    
    // Check if it's a text element (not button/nav)
    if (isTextElement(target)) {
      isTextMode = true;
      const fontSize = getTextFontSize(target);
      
      // Hide follower cursor
      cursorFollower.style.opacity = '0';
      
      // Show text cursor with matching font size
      cursor.classList.add('text-cursor');
      cursor.style.height = fontSize + 'px';
      cursor.style.width = '2px';
      cursor.style.borderRadius = '1px';
      cursor.style.backgroundColor = '#ff922b';
      
      return;
    }
    
    // Reset text mode
    isTextMode = false;
    cursor.classList.remove('text-cursor');
    cursor.style.height = '8px';
    cursor.style.width = '8px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = defaultColor;
    cursorFollower.style.opacity = '1';
    
    // Check for interactive elements
    const hoverableElement = findHoverableElement(target);
    
    if (hoverableElement && hoverableElement !== currentHoverElement) {
      currentHoverElement = hoverableElement;
      isHovering = true;
      
      // Get element's bounding box
      const rect = hoverableElement.getBoundingClientRect();
      const padding = 12;
      
      // Calculate target size and position
      targetWidth = rect.width + (padding * 2);
      targetHeight = rect.height + (padding * 2);
      targetX = rect.left + (rect.width / 2);
      targetY = rect.top + (rect.height / 2);
      
      // Change to orange border only when hovering (no fill)
      cursorFollower.style.borderColor = hoverColor;
      
      // Add hover class
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
      cursorFollower.setAttribute('data-filling', 'true');
    }
  });

  // Handle mouseout
  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    
    // Check if leaving text element
    if (isTextElement(target)) {
      const relatedTarget = e.relatedTarget;
      if (!relatedTarget || !isTextElement(relatedTarget)) {
        isTextMode = false;
        cursor.classList.remove('text-cursor');
        cursor.style.height = '8px';
        cursor.style.width = '8px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = defaultColor;
        cursorFollower.style.opacity = '1';
      }
    }
    
    // Check for interactive elements
    const hoverableElement = findHoverableElement(target);
    
    if (hoverableElement === currentHoverElement) {
      // Check if we're actually leaving the element
      const relatedTarget = e.relatedTarget;
      if (!relatedTarget || !hoverableElement.contains(relatedTarget)) {
        currentHoverElement = null;
        isHovering = false;
        
        // Reset to normal size
        targetWidth = 40;
        targetHeight = 40;
        targetX = mouseX;
        targetY = mouseY;
        
        // Reset to default color (border only)
        cursorFollower.style.borderColor = defaultColor;
        
        // Remove hover class
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
        cursorFollower.removeAttribute('data-filling');
      }
    }
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    if (!isTextMode) {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
      if (!isHovering) {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
      }
    }
  });

  document.addEventListener('mouseup', () => {
    if (!isTextMode) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      if (!isHovering) {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    }
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    if (!isTextMode) {
      cursorFollower.style.opacity = '1';
    }
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
      
      // Reset hover state on resize
      if (isHovering) {
        currentHoverElement = null;
        isHovering = false;
        targetWidth = 40;
        targetHeight = 40;
        targetX = mouseX;
        targetY = mouseY;
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
        cursorFollower.removeAttribute('data-filling');
        cursorFollower.style.borderColor = defaultColor;
      }
      
      if (isTextMode) {
        isTextMode = false;
        cursor.classList.remove('text-cursor');
        cursor.style.height = '8px';
        cursor.style.width = '8px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = defaultColor;
        cursorFollower.style.opacity = '1';
      }
    }, 250);
  });
})();
