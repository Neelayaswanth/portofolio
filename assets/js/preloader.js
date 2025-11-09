/**
 * Page Preloader Animation
 * Clean and elegant animation similar to modern portfolio sites
 */

(function() {
  'use strict';

  // Create preloader HTML
  const preloaderHTML = `
    <div id="page-preloader" class="page-preloader">
      <div class="preloader-content">
        <div class="bike-wrapper">
          <svg class="bike" width="100" height="60" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
            <!-- Back Wheel -->
            <g class="wheel wheel-back">
              <circle cx="20" cy="45" r="10" fill="none" stroke="#ff922b" stroke-width="2"/>
              <circle cx="20" cy="45" r="3" fill="#ff922b"/>
              <line x1="20" y1="35" x2="20" y2="55" stroke="#ff922b" stroke-width="1" opacity="0.6"/>
              <line x1="10" y1="45" x2="30" y2="45" stroke="#ff922b" stroke-width="1" opacity="0.6"/>
            </g>
            <!-- Front Wheel -->
            <g class="wheel wheel-front">
              <circle cx="75" cy="45" r="10" fill="none" stroke="#ff922b" stroke-width="2"/>
              <circle cx="75" cy="45" r="3" fill="#ff922b"/>
              <line x1="75" y1="35" x2="75" y2="55" stroke="#ff922b" stroke-width="1" opacity="0.6"/>
              <line x1="65" y1="45" x2="85" y2="45" stroke="#ff922b" stroke-width="1" opacity="0.6"/>
            </g>
            <!-- Frame -->
            <path d="M 20 45 L 30 25 L 50 20 L 70 25 L 75 45" stroke="#ff922b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Seat -->
            <ellipse cx="30" cy="23" rx="4" ry="2" fill="#ff922b"/>
            <!-- Handlebars -->
            <line x1="70" y1="25" x2="75" y2="18" stroke="#ff922b" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="73" y1="18" x2="77" y2="18" stroke="#ff922b" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="name-text" id="nameText">
          <span class="letter">Y</span>
          <span class="letter">a</span>
          <span class="letter">s</span>
          <span class="letter">h</span>
        </div>
      </div>
    </div>
  `;

  // Insert preloader at the start of body
  document.body.insertAdjacentHTML('afterbegin', preloaderHTML);

  const preloader = document.getElementById('page-preloader');
  const bike = preloader.querySelector('.bike');
  const nameText = document.getElementById('nameText');
  const letters = nameText.querySelectorAll('.letter');
  const backWheel = preloader.querySelector('.wheel-back');
  const frontWheel = preloader.querySelector('.wheel-front');
  const mainContent = document.body;

  // Hide main content initially
  mainContent.style.overflow = 'hidden';

  // Animation timeline
  function startAnimation() {
    // Phase 1: Bike moves left to right (2s)
    bike.style.animation = 'bikeMove 2s ease-in-out forwards';
    backWheel.style.animation = 'wheelRotate 0.4s linear infinite';
    frontWheel.style.animation = 'wheelRotate 0.4s linear infinite';
    
    setTimeout(() => {
      // Stop wheels and fade bike
      backWheel.style.animation = 'none';
      frontWheel.style.animation = 'none';
      bike.style.opacity = '0';
      bike.style.transition = 'opacity 0.5s ease-out';
      
      // Phase 2: Name appears letter by letter (1.5s)
      setTimeout(() => {
        nameText.style.opacity = '1';
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.style.opacity = '1';
            letter.style.transform = 'translateY(0)';
          }, index * 200);
        });
      }, 500);
      
      // Phase 3: Fade out and reveal portfolio (1s)
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
      }, 2000);
    }, 2000);
  }

  // Start animation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimation);
  } else {
    startAnimation();
  }
})();
