/**
 * Page Preloader Animation
 * Realistic ball bouncing with physics, revealing YASH in a straight line
 */

(function() {
  'use strict';

  // Create preloader HTML
  const preloaderHTML = `
    <div id="page-preloader" class="page-preloader">
      <div class="preloader-content">
        <div class="ball" id="ball">
          <div class="ball-highlight"></div>
          <div class="ball-shadow"></div>
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
    const bounceDecay = 0.7; // Energy loss per bounce
    let currentX = startX;
    let currentY = startY;
    let velocityX = (targetX - startX) * 0.1;
    let velocityY = 0;
    let bounces = 0;
    let lastBounceY = startY;
    
    const animate = () => {
      // Apply gravity
      velocityY += gravity;
      
      // Update position
      currentX += velocityX;
      currentY += velocityY;
      
      // Ground collision (bottom of screen)
      const groundY = window.innerHeight - 50;
      if (currentY >= groundY) {
        currentY = groundY;
        velocityY *= -bounceDecay; // Bounce with energy loss
        velocityX *= 0.95; // Slight friction
        bounces++;
        
        // Scale ball on bounce
        ball.style.transform = `translate(-50%, -50%) scale(0.9)`;
        setTimeout(() => {
          ball.style.transform = `translate(-50%, -50%) scale(1)`;
        }, 100);
        
        // Check if we should stop bouncing
        if (bounces >= bounceCount || Math.abs(velocityY) < 0.5) {
          currentY = groundY;
          velocityY = 0;
          if (onComplete) onComplete();
          return;
        }
      }
      
      // Update ball position
      ball.style.left = currentX + 'px';
      ball.style.top = currentY + 'px';
      
      // Continue animation
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
    const centerX = window.innerWidth / 2;
    const startY = -50;
    const groundY = window.innerHeight - 50;
    
    // Phase 1: Ball falls from top with realistic physics
    ball.style.left = centerX + 'px';
    ball.style.top = startY + 'px';
    ball.style.opacity = '1';
    ball.style.transform = 'translate(-50%, -50%) scale(1)';
    
    // Initial fall and bounce
    setTimeout(() => {
      bounceBall(centerX, startY, centerX, groundY, 3, () => {
        // After initial bounce, move to positions
        const positions = [
          centerX - 150, // Y position
          centerX - 50,  // a position
          centerX + 50,  // s position
          centerX + 150  // h position
        ];
        
        let currentPos = centerX;
        let letterIndex = 0;
        
        // Move ball to each position and reveal letter
        function moveToNextPosition() {
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
          
          // Bounce to next position
          bounceBall(currentPos, groundY, targetX, groundY, 2, () => {
            // Reveal letter when ball reaches position
            const letter = letters[letterIndex];
            letter.style.opacity = '1';
            letter.style.transform = 'translate(-50%, -50%) scale(1)';
            
            // Small bounce effect on letter
            setTimeout(() => {
              letter.style.transform = 'translate(-50%, -50%) scale(1.2)';
              setTimeout(() => {
                letter.style.transform = 'translate(-50%, -50%) scale(1)';
              }, 150);
            }, 100);
            
            currentPos = targetX;
            letterIndex++;
            
            // Move to next position
            setTimeout(moveToNextPosition, 300);
          });
        }
        
        moveToNextPosition();
      });
    }, 100);
  }

  // Start animation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimation);
  } else {
    startAnimation();
  }
})();
