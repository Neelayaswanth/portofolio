/**
 * Page Preloader Animation
 * Realistic cricket ball bouncing in 4 places, revealing YASH letters
 */

(function() {
  'use strict';

  // Create preloader HTML
  const preloaderHTML = `
    <div id="page-preloader" class="page-preloader">
      <div class="preloader-content">
        <div class="ball-container">
          <div class="ball" id="ball">
            <div class="ball-surface">
              <div class="seam seam-main-1"></div>
              <div class="seam seam-main-2"></div>
              <div class="seam seam-cross-1"></div>
              <div class="seam seam-cross-2"></div>
              <div class="ball-highlight"></div>
            </div>
            <div class="ball-shadow" id="ballShadow"></div>
          </div>
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
  const ballShadow = document.getElementById('ballShadow');
  const nameText = document.getElementById('nameText');
  const letters = nameText.querySelectorAll('.letter');
  const mainContent = document.body;

  // Hide main content initially
  mainContent.style.overflow = 'hidden';

  // Realistic bounce physics with rotation
  let ballRotation = 0;
  function bounceBall(startX, startY, targetX, targetY, bounceCount, onComplete) {
    const gravity = 0.6;
    const bounceDecay = 0.65;
    const rotationSpeed = 15;
    let currentX = startX;
    let currentY = startY;
    let velocityX = (targetX - startX) * 0.12;
    let velocityY = 0;
    let bounces = 0;
    let lastBounceY = startY;
    
    const animate = () => {
      // Apply gravity
      velocityY += gravity;
      
      // Update position
      currentX += velocityX;
      currentY += velocityY;
      
      // Rotate ball based on movement
      ballRotation += rotationSpeed;
      ball.style.transform = `translate(-50%, -50%) rotate(${ballRotation}deg)`;
      
      // Update shadow
      const shadowSize = Math.max(30, 50 - (groundY - currentY) * 0.1);
      const shadowOpacity = Math.max(0.2, 0.6 - (groundY - currentY) * 0.01);
      ballShadow.style.width = shadowSize + 'px';
      ballShadow.style.height = shadowSize * 0.3 + 'px';
      ballShadow.style.opacity = shadowOpacity;
      ballShadow.style.left = currentX + 'px';
      
      // Ground collision
      const groundY = window.innerHeight - 50;
      if (currentY >= groundY) {
        currentY = groundY;
        velocityY *= -bounceDecay;
        velocityX *= 0.92; // Friction
        bounces++;
        
        // Squash effect on bounce
        ball.style.transform = `translate(-50%, -50%) rotate(${ballRotation}deg) scaleY(0.7) scaleX(1.2)`;
        setTimeout(() => {
          ball.style.transform = `translate(-50%, -50%) rotate(${ballRotation}deg) scale(1)`;
        }, 120);
        
        // Shadow expands on bounce
        ballShadow.style.width = '60px';
        ballShadow.style.height = '20px';
        setTimeout(() => {
          ballShadow.style.width = shadowSize + 'px';
          ballShadow.style.height = shadowSize * 0.3 + 'px';
        }, 120);
        
        if (bounces >= bounceCount || Math.abs(velocityY) < 0.3) {
          currentY = groundY;
          velocityY = 0;
          if (onComplete) onComplete();
          return;
        }
      }
      
      // Update ball position
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
    const startY = window.innerHeight * 0.25;
    const groundY = window.innerHeight - 50;
    
    let letterIndex = 0;
    let currentX = startX;
    
    function animateNextLetter() {
      if (letterIndex >= positions.length) {
        // All letters revealed, fade out
        setTimeout(() => {
          ball.style.opacity = '0';
          ball.style.transition = 'opacity 0.5s ease-out';
          ballShadow.style.opacity = '0';
          
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
      
      // Ball comes from left and moves to position
      ball.style.left = currentX + 'px';
      ball.style.top = startY + 'px';
      ball.style.opacity = '1';
      ball.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
      ballShadow.style.opacity = '0.3';
      
      // Move ball horizontally first
      setTimeout(() => {
        ball.style.left = targetX + 'px';
        ball.style.transition = 'left 0.7s ease-in-out';
        
        // Rotate while moving
        let moveRotation = 0;
        const rotateInterval = setInterval(() => {
          moveRotation += 20;
          ball.style.transform = `translate(-50%, -50%) rotate(${moveRotation}deg)`;
        }, 50);
        
        // When ball reaches target X, drop it
        setTimeout(() => {
          clearInterval(rotateInterval);
          ball.style.transition = 'none';
          
          // Drop and bounce with realistic physics
          bounceBall(targetX, startY, targetX, groundY, 3, () => {
            // Reveal letter when ball stops bouncing
            const letter = letters[letterIndex];
            letter.style.opacity = '1';
            letter.style.transform = 'translate(-50%, -50%) scale(1)';
            letter.style.left = targetX + 'px';
            
            // Bounce effect on letter
            setTimeout(() => {
              letter.style.transform = 'translate(-50%, -50%) scale(1.3)';
              setTimeout(() => {
                letter.style.transform = 'translate(-50%, -50%) scale(1)';
              }, 200);
            }, 100);
            
            currentX = targetX;
            letterIndex++;
            
            // Move to next position
            setTimeout(animateNextLetter, 600);
          });
        }, 700);
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
