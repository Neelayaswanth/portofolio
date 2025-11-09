/**
 * Page Preloader Animation
 * Ball falls and bounces to 4 positions, revealing YASH letters
 */

(function() {
  'use strict';

  // Create preloader HTML
  const preloaderHTML = `
    <div id="page-preloader" class="page-preloader">
      <div class="preloader-content">
        <div class="ball" id="ball"></div>
        <div class="name-text" id="nameText">
          <span class="letter" data-position="1">Y</span>
          <span class="letter" data-position="2">a</span>
          <span class="letter" data-position="3">s</span>
          <span class="letter" data-position="4">h</span>
        </div>
      </div>
    </div>
  `;

  // Insert preloader at the start of body
  document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

  const preloader = document.getElementById('page-preloader');
  const ball = document.getElementById('ball');
  const nameText = document.getElementById('nameText');
  const letters = nameText.querySelectorAll('.letter');
  const mainContent = document.body;

  // Hide main content initially
  mainContent.style.overflow = 'hidden';

  // Get viewport dimensions
  const getViewportCenter = () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });

  // Calculate 4 positions around the center
  const getPositions = () => {
    const center = getViewportCenter();
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    
    return [
      { x: center.x - radius, y: center.y - radius }, // Top-left
      { x: center.x + radius, y: center.y - radius }, // Top-right
      { x: center.x - radius, y: center.y + radius }, // Bottom-left
      { x: center.x + radius, y: center.y + radius }  // Bottom-right
    ];
  };

  // Animation timeline
  function startAnimation() {
    const positions = getPositions();
    const center = getViewportCenter();
    
    // Phase 1: Ball falls from top to center (0.8s)
    ball.style.left = center.x + 'px';
    ball.style.top = '-50px';
    ball.style.opacity = '1';
    ball.style.transform = 'translate(-50%, -50%) scale(1)';
    
    setTimeout(() => {
      ball.style.top = center.y + 'px';
      ball.style.transition = 'top 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Bounce effect when landing
      setTimeout(() => {
        ball.style.transform = 'translate(-50%, -50%) scale(1.2)';
        setTimeout(() => {
          ball.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
      }, 800);
    }, 100);
    
    // Phase 2: Ball jumps to 4 positions, revealing letters
    setTimeout(() => {
      positions.forEach((pos, index) => {
        setTimeout(() => {
          // Move ball to position
          ball.style.left = pos.x + 'px';
          ball.style.top = pos.y + 'px';
          ball.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          
          // Bounce effect
          setTimeout(() => {
            ball.style.transform = 'translate(-50%, -50%) scale(1.3)';
            setTimeout(() => {
              ball.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 200);
          }, 100);
          
          // Reveal letter after ball reaches position
          setTimeout(() => {
            const letter = letters[index];
            letter.style.opacity = '1';
            letter.style.transform = 'scale(1)';
            letter.style.left = pos.x + 'px';
            letter.style.top = pos.y + 'px';
          }, 400);
        }, index * 600);
      });
      
      // Phase 3: Fade out and reveal portfolio
      setTimeout(() => {
        // Fade out ball
        ball.style.opacity = '0';
        ball.style.transition = 'opacity 0.5s ease-out';
        
        // Fade out letters
        setTimeout(() => {
          letters.forEach((letter, index) => {
            setTimeout(() => {
              letter.style.opacity = '0';
            }, index * 100);
          });
        }, 200);
        
        // Fade out preloader
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.transition = 'opacity 1s ease-out';
          
          setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.style.overflow = '';
            
            // Trigger AOS animations
            if (typeof AOS !== 'undefined') {
              AOS.init();
            }
          }, 1000);
        }, 800);
      }, 2400 + 600); // Wait for all 4 jumps + delay
    }, 1200); // Wait for initial fall + bounce
  }

  // Start animation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimation);
  } else {
    startAnimation();
  }
})();
