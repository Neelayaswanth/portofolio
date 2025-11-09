/**
 * Custom Cursor Effect
 * Inspired by https://azumbrunnen.me/
 * Creates a smooth following cursor effect that fills elements on hover
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
  const hoverColor = '#ff922b'; // Orange

  // Update mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update cursor immediately
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Update target position for follower
    if (!isHovering) {
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

  // Check if element is text content
  function isTextElement(element) {
    if (!element) return false;
    
    const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'li', 'td', 'th', 'label', 'strong', 'em', 'b', 'i', 'a'];
    const tagName = element.tagName.toLowerCase();
    
    // Check if it's a text tag
    if (textTags.includes(tagName)) return true;
    
    // Check if it contains text and is not an interactive element
    const hasText = element.textContent && element.textContent.trim().length > 0;
    const isInteractive = ['a', 'button', 'input', 'textarea', 'select'].includes(tagName);
    
    // If it has text and is not already an interactive element, treat as text
    if (hasText && !isInteractive) {
      // Check if parent is a text container
      const parent = element.parentElement;
      if (parent && textTags.includes(parent.tagName.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }

  // Find the hoverable element (closest interactive element or text)
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
    
    // Check if it's a text element
    if (isTextElement(element)) {
      return element;
    }
    
    return null;
  }

  // Handle mouseover - expand cursor to fill element
  document.addEventListener('mouseover', (e) => {
    const hoverableElement = findHoverableElement(e.target);
    
    if (hoverableElement && hoverableElement !== currentHoverElement) {
      currentHoverElement = hoverableElement;
      isHovering = true;
      
      // Get element's bounding box
      const rect = hoverableElement.getBoundingClientRect();
      const isText = isTextElement(hoverableElement);
      
      if (isText) {
        // For text elements: show I-beam cursor with font-size matching
        const computedStyle = window.getComputedStyle(hoverableElement);
        const fontSize = parseFloat(computedStyle.fontSize);
        const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.2;
        
        // Calculate cursor height based on font size (slightly larger than font)
        const cursorHeight = Math.max(fontSize * 1.2, 16);
        
        cursorFollower.classList.add('text-hover');
        cursor.classList.add('text-cursor');
        // Hide follower, show text cursor
        cursorFollower.style.opacity = '0';
        cursor.style.width = '2px';
        cursor.style.height = cursorHeight + 'px';
        cursor.style.borderRadius = '1px';
        cursor.style.backgroundColor = hoverColor;
        cursor.style.transform = 'translate(-50%, -50%)';
      } else {
        // For interactive elements: form a box around the element
        const padding = 12;
        
        // Calculate target size and position
        targetWidth = rect.width + (padding * 2);
        targetHeight = rect.height + (padding * 2);
        targetX = rect.left + (rect.width / 2);
        targetY = rect.top + (rect.height / 2);
        
        // Change to orange border when hovering
        cursorFollower.style.borderColor = hoverColor;
        cursorFollower.style.opacity = '1';
        
        // Reset cursor to normal dot
        cursor.classList.remove('text-cursor');
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = defaultColor;
        cursor.style.transform = 'translate(-50%, -50%)';
        
        cursorFollower.classList.remove('text-hover');
        cursorFollower.setAttribute('data-filling', 'true');
      }
      
      // Add hover class
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    }
  });

  // Handle mouseout - shrink cursor back
  document.addEventListener('mouseout', (e) => {
    const hoverableElement = findHoverableElement(e.target);
    
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
        cursor.classList.remove('text-cursor');
        cursorFollower.classList.remove('hover');
        cursorFollower.classList.remove('text-hover');
        cursorFollower.removeAttribute('data-filling');
        
        // Reset cursor to normal
        cursorFollower.style.opacity = '1';
        cursor.style.width = '8px';
        cursor.style.height = '8px';
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
      
      // Reset hover state on resize
      if (isHovering) {
        currentHoverElement = null;
        isHovering = false;
        targetWidth = 40;
        targetHeight = 40;
        targetX = mouseX;
        targetY = mouseY;
        cursor.classList.remove('hover');
        cursor.classList.remove('text-cursor');
        cursorFollower.classList.remove('hover');
        cursorFollower.classList.remove('text-hover');
        cursorFollower.removeAttribute('data-filling');
        cursorFollower.style.borderColor = defaultColor;
        
        // Reset cursor to normal
        cursorFollower.style.opacity = '1';
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.borderRadius = '50%';
        cursor.style.backgroundColor = defaultColor;
      }
    }, 250);
  });
})();
