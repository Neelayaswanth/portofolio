/**
 * Custom Cursor Effect
 * Inspired by https://azumbrunnen.me/
 * Creates a smooth following cursor effect with colorful animations
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
  let colorIndex = 0;
  const colors = ['#ececec', '#4a9eff', '#ff6b6b', '#51cf66', '#ffd43b', '#ae3ec9', '#ff922b'];

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
    
    // Change color on movement for dynamic effect
    const distance = Math.sqrt(Math.pow(mouseX - followerX, 2) + Math.pow(mouseY - followerY, 2));
    if (distance > 50 && !isHovering) {
      colorIndex = (colorIndex + 1) % colors.length;
      updateCursorColor();
    }
  });

  // Update cursor colors
  function updateCursorColor() {
    const color = colors[colorIndex];
    cursor.style.backgroundColor = color;
    cursorFollower.style.borderColor = color;
    cursorFollower.style.boxShadow = `0 0 20px ${color}40`;
  }

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
    
    // Add subtle scale animation based on movement
    if (!isHovering) {
      const scale = 1 + Math.min(distance * 0.001, 0.2);
      cursorFollower.style.transform = `translate(-50%, -50%) scale(${scale})`;
    } else {
      cursorFollower.style.transform = 'translate(-50%, -50%)';
    }
    
    requestAnimationFrame(animateCursor);
  }

  // Start animation
  animateCursor();
  updateCursorColor();

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

  // Handle mouseover - expand cursor to fill element
  document.addEventListener('mouseover', (e) => {
    const hoverableElement = findHoverableElement(e.target);
    
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
      
      // Change to a vibrant color when hovering
      const hoverColor = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
      cursor.style.backgroundColor = hoverColor;
      cursorFollower.style.borderColor = hoverColor;
      cursorFollower.style.backgroundColor = hoverColor + '20';
      cursorFollower.style.boxShadow = `0 0 30px ${hoverColor}60, inset 0 0 20px ${hoverColor}20`;
      
      // Add hover class
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
      cursorFollower.setAttribute('data-filling', 'true');
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
        
        // Reset colors
        updateCursorColor();
        cursorFollower.style.backgroundColor = 'transparent';
        
        // Remove hover class
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
        cursorFollower.removeAttribute('data-filling');
      }
    }
  });

  // Click effect with color change
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.6)';
    const clickColor = colors[Math.floor(Math.random() * colors.length)];
    cursor.style.backgroundColor = clickColor;
    
    if (!isHovering) {
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
      cursorFollower.style.borderColor = clickColor;
    }
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    updateCursorColor();
    
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

  // Auto-rotate colors periodically
  setInterval(() => {
    if (!isHovering) {
      colorIndex = (colorIndex + 1) % colors.length;
      updateCursorColor();
    }
  }, 3000);

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
        updateCursorColor();
        cursorFollower.style.backgroundColor = 'transparent';
      }
    }, 250);
  });
})();
