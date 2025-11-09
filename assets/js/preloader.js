/**
 * Page Preloader Animation
 * Bike animation left to right, then "Yash" text appears, then portfolio reveals
 */

(function() {
  'use strict';

  // Create preloader HTML
  const preloaderHTML = `
    <div id="page-preloader" class="page-preloader">
      <div class="preloader-content">
        <div class="bike-container">
          <svg class="bike" width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
            <!-- Bike Frame -->
            <rect x="20" y="25" width="30" height="3" fill="#ff922b" rx="1"/>
            <rect x="15" y="20" width="5" height="15" fill="#ff922b" rx="1"/>
            <rect x="45" y="20" width="5" height="15" fill="#ff922b" rx="1"/>
            <!-- Wheels -->
            <circle cx="20" cy="40" r="8" fill="none" stroke="#ff922b" stroke-width="2"/>
            <circle cx="20" cy="40" r="3" fill="#ff922b"/>
            <circle cx="60" cy="40" r="8" fill="none" stroke="#ff922b" stroke-width="2"/>
            <circle cx="60" cy="40" r="3" fill="#ff922b"/>
            <!-- Spokes -->
            <line x1="20" y1="32" x2="20" y2="48" stroke="#ff922b" stroke-width="1"/>
            <line x1="12" y1="40" x2="28" y2="40" stroke="#ff922b" stroke-width="1"/>
            <line x1="60" y1="32" x2="60" y2="48" stroke="#ff922b" stroke-width="1"/>
            <line x1="52" y1="40" x2="68" y2="40" stroke="#ff922b" stroke-width="1"/>
            <!-- Handlebars -->
            <rect x="45" y="18" width="2" height="8" fill="#ff922b" rx="1"/>
            <rect x="43" y="16" width="6" height="2" fill="#ff922b" rx="1"/>
            <!-- Seat -->
            <rect x="15" y="20" width="4" height="3" fill="#ff922b" rx="1"/>
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
  const mainContent = document.querySelector('body');

  // Hide main content initially
  mainContent.style.overflow = 'hidden';

  // Animation timeline
  function startAnimation() {
    // Phase 1: Bike moves left to right (2 seconds)
    bike.style.animation = 'bikeMove 2s ease-in-out forwards';
    
    setTimeout(() => {
      // Hide bike
      bike.style.opacity = '0';
      bike.style.transition = 'opacity 0.5s ease-out';
      
      // Phase 2: Name appears letter by letter (1.5 seconds)
      setTimeout(() => {
        nameText.style.opacity = '1';
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.style.opacity = '1';
            letter.style.transform = 'translateY(0)';
          }, index * 200);
        });
      }, 500);
      
      // Phase 3: Fade out preloader and reveal portfolio (1 second)
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 1s ease-out';
        
        setTimeout(() => {
          preloader.style.display = 'none';
          mainContent.style.overflow = '';
          
          // Trigger any existing page animations
          if (typeof AOS !== 'undefined') {
            AOS.init();
          }
        }, 1000);
      }, 2000);
    }, 2000);
  }

  // Start animation when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimation);
  } else {
    startAnimation();
  }
})();

