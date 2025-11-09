/**
 * Page Preloader Animation
 * Enhanced bike animation with rotating wheels, smooth transitions, and polished effects
 */

(function() {
  'use strict';

  // Create preloader HTML with better bike design
  const preloaderHTML = `
    <div id="page-preloader" class="page-preloader">
      <div class="preloader-content">
        <div class="bike-container">
          <svg class="bike" width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
            <!-- Back Wheel -->
            <g class="wheel wheel-back">
              <circle cx="25" cy="55" r="12" fill="none" stroke="#ff922b" stroke-width="2.5"/>
              <circle cx="25" cy="55" r="4" fill="#ff922b"/>
              <!-- Spokes -->
              <g class="spokes">
                <line x1="25" y1="43" x2="25" y2="67" stroke="#ff922b" stroke-width="1.5" opacity="0.8"/>
                <line x1="13" y1="55" x2="37" y2="55" stroke="#ff922b" stroke-width="1.5" opacity="0.8"/>
                <line x1="18" y1="48" x2="32" y2="62" stroke="#ff922b" stroke-width="1.5" opacity="0.8"/>
                <line x1="32" y1="48" x2="18" y2="62" stroke="#ff922b" stroke-width="1.5" opacity="0.8"/>
              </g>
            </g>
            <!-- Front Wheel -->
            <g class="wheel wheel-front">
              <circle cx="85" cy="55" r="12" fill="none" stroke="#ff922b" stroke-width="2.5"/>
              <circle cx="85" cy="55" r="4" fill="#ff922b"/>
              <!-- Spokes -->
              <g class="spokes">
                <line x1="85" y1="43" x2="85" y2="67" stroke="#ff922b" stroke-width="1.5" opacity="0.8"/>
                <line x1="73" y1="55" x2="97" y2="55" stroke="#ff922b" stroke-width="1.5" opacity="0.8"/>
                <line x1="78" y1="48" x2="92" y2="62" stroke="#ff922b" stroke-width="1.5" opacity="0.8"/>
                <line x1="92" y1="48" x2="78" y2="62" stroke="#ff922b" stroke-width="1.5" opacity="0.8"/>
              </g>
            </g>
            <!-- Bike Frame -->
            <path d="M 25 55 L 35 35 L 55 30 L 75 35 L 85 55" stroke="#ff922b" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Seat Tube -->
            <line x1="25" y1="55" x2="30" y2="30" stroke="#ff922b" stroke-width="3" stroke-linecap="round"/>
            <!-- Seat -->
            <ellipse cx="30" cy="28" rx="5" ry="2" fill="#ff922b"/>
            <!-- Handlebars -->
            <line x1="75" y1="35" x2="80" y2="25" stroke="#ff922b" stroke-width="3" stroke-linecap="round"/>
            <line x1="78" y1="25" x2="82" y2="25" stroke="#ff922b" stroke-width="4" stroke-linecap="round"/>
            <!-- Chain -->
            <path d="M 25 55 Q 50 50 85 55" stroke="#ff922b" stroke-width="1.5" fill="none" opacity="0.6" stroke-dasharray="2,2"/>
          </svg>
          <div class="bike-trail"></div>
        </div>
        <div class="name-text" id="nameText">
          <span class="letter" data-letter="Y">Y</span>
          <span class="letter" data-letter="a">a</span>
          <span class="letter" data-letter="s">s</span>
          <span class="letter" data-letter="h">h</span>
        </div>
      </div>
    </div>
  `;

  // Insert preloader at the start of body
  document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

  const preloader = document.getElementById('page-preloader');
  const bike = preloader.querySelector('.bike');
  const bikeContainer = preloader.querySelector('.bike-container');
  const nameText = document.getElementById('nameText');
  const letters = nameText.querySelectorAll('.letter');
  const mainContent = document.querySelector('body');
  const backWheel = preloader.querySelector('.wheel-back');
  const frontWheel = preloader.querySelector('.wheel-front');

  // Hide main content initially
  mainContent.style.overflow = 'hidden';
  mainContent.style.opacity = '0';

  // Animation timeline with better timing
  function startAnimation() {
    // Phase 1: Bike moves left to right with rotating wheels (2.5 seconds)
    bike.style.animation = 'bikeMove 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    backWheel.style.animation = 'wheelRotate 0.3s linear infinite';
    frontWheel.style.animation = 'wheelRotate 0.3s linear infinite';
    
    // Add trail effect
    setTimeout(() => {
      bikeContainer.classList.add('trail-active');
    }, 200);
    
    setTimeout(() => {
      // Stop wheel rotation
      backWheel.style.animation = 'none';
      frontWheel.style.animation = 'none';
      
      // Bike scales up and fades
      bike.style.transform = 'scale(1.5)';
      bike.style.opacity = '0';
      bike.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      // Phase 2: Name appears with impressive animation (2 seconds)
      setTimeout(() => {
        nameText.style.opacity = '1';
        nameText.style.transform = 'scale(1)';
        
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.style.opacity = '1';
            letter.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
            letter.style.textShadow = '0 0 20px rgba(255, 146, 43, 0.8)';
            
            // Add bounce effect
            setTimeout(() => {
              letter.style.transform = 'translateY(-10px) scale(1.1)';
              setTimeout(() => {
                letter.style.transform = 'translateY(0) scale(1)';
              }, 150);
            }, 300);
          }, index * 150);
        });
      }, 800);
      
      // Phase 3: Fade out preloader and reveal portfolio (1.5 seconds)
      setTimeout(() => {
        // Add glow effect to name
        nameText.style.animation = 'nameGlow 1s ease-in-out';
        
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.transform = 'scale(1.1)';
          preloader.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          
          // Fade in main content
          mainContent.style.transition = 'opacity 1s ease-in 0.5s';
          mainContent.style.opacity = '1';
          
          setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.style.overflow = '';
            
            // Trigger any existing page animations
            if (typeof AOS !== 'undefined') {
              AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true
              });
            }
          }, 1500);
        }, 1000);
      }, 2000);
    }, 2500);
  }

  // Start animation when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimation);
  } else {
    setTimeout(startAnimation, 100);
  }
})();
