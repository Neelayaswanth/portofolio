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
  let cursorX = 0;
  let cursorY = 0;
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
  let velocityX = 0;
  let velocityY = 0;
  let rotation = 0;
  let targetRotation = 0;

  // Update mouse position with velocity calculation
  let lastMouseX = 0;
  let lastMouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Calculate velocity for dynamic effects
    const deltaX = mouseX - lastMouseX;
    const deltaY = mouseY - lastMouseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    velocityX = deltaX * 0.5;
    velocityY = deltaY * 0.5;
    
    // Add slight rotation based on movement
    if (distance > 0) {
      targetRotation += distance * 0.1;
    }
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    
    // Update cursor with slight delay for more dynamic feel
    if (!isHovering) {
      targetX = mouseX;
      targetY = mouseY;
    }
  });

  // Smooth animation for follower with spring physics
  function animateCursor() {
    // Spring physics for smoother, more dynamic movement
    const spring = 0.15;
    const friction = 0.85;
    
    // Calculate distance and apply spring force
    const dx = targetX - followerX;
    const dy = targetY - followerY;
    
    // Apply spring physics
    velocityX += dx * spring;
    velocityY += dy * spring;
    
    // Apply friction
    velocityX *= friction;
    velocityY *= friction;
    
    // Update position
    followerX += velocityX;
    followerY += velocityY;
    
    // Smooth size transition with easing
    const sizeDiffX = targetWidth - currentWidth;
    const sizeDiffY = targetHeight - currentHeight;
    currentWidth += sizeDiffX * 0.25;
    currentHeight += sizeDiffY * 0.25;
    
    // Smooth rotation
    rotation += (targetRotation - rotation) * 0.1;
    
    // Apply transformations
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    cursorFollower.style.width = currentWidth + 'px';
    cursorFollower.style.height = currentHeight + 'px';
    cursorFollower.style.borderRadius = isHovering ? '8px' : '50%';
    
    // Add subtle rotation for dynamic feel
    if (!isHovering && Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
      cursorFollower.style.transform = `translate(-50%, -50%) rotate(${rotation * 0.1}deg)`;
    } else {
      cursorFollower.style.transform = 'translate(-50%, -50%)';
    }
    
    // Update cursor position with slight delay for trailing effect
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Add subtle scale based on velocity for dynamic feel
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const scale = 1 + Math.min(velocity * 0.01, 0.3);
    cursor.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
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
      'navmenu', 'resume-item', 'skill-item', 'stat-card'
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
      const padding = 12; // Add some padding
      
      // Calculate target size and position
      targetWidth = rect.width + (padding * 2);
      targetHeight = rect.height + (padding * 2);
      targetX = rect.left + (rect.width / 2);
      targetY = rect.top + (rect.height / 2);
      
      // Reset velocity for smooth transition
      velocityX = 0;
      velocityY = 0;
      
      // Add hover class with animation
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
      cursorFollower.setAttribute('data-filling', 'true');
      
      // Add pulse effect
      cursorFollower.style.transition = 'background-color 0.3s ease-out, border-color 0.3s ease-out';
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
        
        // Reset to normal size with smooth transition
        targetWidth = 40;
        targetHeight = 40;
        targetX = mouseX;
        targetY = mouseY;
        
        // Remove hover class
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
        cursorFollower.removeAttribute('data-filling');
        
        // Reset rotation
        targetRotation = rotation;
      }
    }
  });

  // Click effect with bounce animation
  document.addEventListener('mousedown', () => {
    cursor.style.transition = 'transform 0.1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
    
    if (!isHovering) {
      cursorFollower.style.transition = 'transform 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.85)';
    } else {
      // Slight shrink when clicking on filled element
      cursorFollower.style.transition = 'transform 0.1s ease-out';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.95)';
    }
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transition = 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    cursor.style.transform = 'translate(-50%, -50%) scale(1.1)';
    
    // Bounce back effect
    setTimeout(() => {
      cursor.style.transition = 'transform 0.15s ease-out';
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    if (!isHovering) {
      cursorFollower.style.transition = 'transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.05)';
      
      setTimeout(() => {
        cursorFollower.style.transition = 'transform 0.15s ease-out';
        cursorFollower.style.transform = 'translate(-50%, -50%)';
      }, 100);
    } else {
      cursorFollower.style.transition = 'transform 0.15s ease-out';
      cursorFollower.style.transform = 'translate(-50%, -50%)';
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
        cursorFollower.classList.remove('hover');
        cursorFollower.removeAttribute('data-filling');
      }
    }, 250);
  });
})();
