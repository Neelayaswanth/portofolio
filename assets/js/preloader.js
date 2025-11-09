/**
 * Page Preloader Animation
 * Cricket ball comes from left, drops and reveals YASH letters
 */

(function() {
  'use strict';

  // Create preloader HTML
  const preloaderHTML = `
    <div id="page-preloader" class="page-preloader">
      <div class="preloader-content">
        <div class="ball" id="ball">
          <div class="seam seam-1"></div>
          <div class="seam seam-2"></div>
          <div class="seam seam-3"></div>
        </div>
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

  // Realistic bounce physics
  function bounceBall(startX, startY, targetX, targetY, bounceCount, onComplete) {
    const gravity = 0.5;
    const bounceDecay = 0.7;
    let currentX = startX;
    let currentY = startY;
    let velocityX = (targetX - startX) * 0.1;
    let velocityY = 0;
    let bounces = 0;
    
    const animate = () => {
      velocityY += gravity;
      currentX += velocityX;
      currentY += velocityY;
      
      const groundY = window.innerHeight - 50;
      if (currentY >= groundY) {
        currentY = groundY;
        velocityY *= -bounceDecay;
        velocityX *= 0.95;
        bounces++;
        
        ball.style.transform = `translate(-50%, -50%) scale(0.9)`;
        setTimeout(() => {
          ball.style.transform = `translate(-50%, -50%) scale(1)`;
        }, 100);
        
        if (bounces >= bounceCount || Math.abs(velocityY) < 0.5) {
          currentY = groundY;
          velocityY = 0;
          if (onComplete) onComplete();
          return;
        }
      }
      
      ball.style.left = currentX + 'px';
      ball.style.top = currentY + 'px';
      
      if (bounces < bounceCount && Math.abs(velocityY) > 0.1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    animate();
  }

  // Animation timeline
  function startAnimation() {
    const positions = [
      window.innerWidth * 0.25, // Y position
      window.innerWidth * 0.4,  // a position
      window.innerWidth * 0.6,  // s position
      window.innerWidth * 0.75   // h position
    ];
    
    const startX = -100;
    const startY = window.innerHeight * 0.3;
    const groundY = window.innerHeight - 50;
    
    let letterIndex = 0;
    let currentX = startX;
    
    function animateNextLetter() {
      if (letterIndex >= positions.length) {
        // All letters revealed, fade out
        setTimeout(() => {
          ball.style.opacity = '0';
          ball.style.transition = 'opacity 0.5s ease-out';
          
          setTimeout(() => {
            letters.forEach((letter, index) => {
              setTimeout(() => {
                letter.style.opacity = '0';
              }, index * 100);
            });
            
            setTimeout(() => {
              preloader.style.opacity = '0';
              preloader.style.transition = 'opacity 1s ease-out';
              
              setTimeout(() => {
                preloader.style.display = 'none';
                mainContent.style.overflow = '';
                
                if (typeof AOS !== 'undefined') {
                  AOS.init();
                }
              }, 1000);
            }, 800);
          }, 200);
        }, 500);
        return;
      }
      
      const targetX = positions[letterIndex];
      
      // Ball comes from left and drops at target position
      ball.style.left = currentX + 'px';
      ball.style.top = startY + 'px';
      ball.style.opacity = '1';
      ball.style.transform = 'translate(-50%, -50%) scale(1)';
      
      // Move ball horizontally first, then drop
      setTimeout(() => {
        // Move to target X position
        ball.style.left = targetX + 'px';
        ball.style.transition = 'left 0.8s ease-in-out';
        
        // When ball reaches target X, drop it
        setTimeout(() => {
          ball.style.transition = 'none';
          
          // Drop and bounce
          bounceBall(targetX, startY, targetX, groundY, 2, () => {
            // Reveal letter when ball stops bouncing
            const letter = letters[letterIndex];
            letter.style.opacity = '1';
            letter.style.transform = 'translate(-50%, -50%) scale(1)';
            letter.style.left = targetX + 'px';
            
            // Small bounce effect on letter
            setTimeout(() => {
              letter.style.transform = 'translate(-50%, -50%) scale(1.2)';
              setTimeout(() => {
                letter.style.transform = 'translate(-50%, -50%) scale(1)';
              }, 150);
            }, 100);
            
            currentX = targetX;
            letterIndex++;
            
            // Move to next position
            setTimeout(animateNextLetter, 500);
          });
        }, 800);
      }, 100);
    }
    
    // Start animation
    animateNextLetter();
  }

  // Start animation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimation);
  } else {
    startAnimation();
  }
})();
