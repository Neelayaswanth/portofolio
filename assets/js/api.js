/**
 * Portfolio API Integration
 * Handles contact form submissions and profile view tracking
 */

// API Configuration - Auto-detect based on current origin
const getApiBaseUrl = () => {
  const currentOrigin = window.location.origin;
  // If running on 127.0.0.1, use 127.0.0.1 for API too
  if (currentOrigin.includes('127.0.0.1')) {
    return 'http://127.0.0.1:3000/api';
  }
  // Otherwise use localhost
  return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Generate or retrieve session ID
function getSessionId() {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
}

// Track profile view
async function trackProfileView() {
  try {
    const sessionId = getSessionId();
    const referrer = document.referrer || 'direct';
    
    const response = await fetch(`${API_BASE_URL}/views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        referrer: referrer
      })
    });

    const data = await response.json();
    if (data.success) {
      console.log('Profile view tracked');
      // Optionally update view count display
      updateViewCount();
    }
  } catch (error) {
    console.error('Error tracking profile view:', error);
    // Silently fail - don't interrupt user experience
  }
}

// Get and display view count
async function updateViewCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/views/count`);
    const data = await response.json();
    
    if (data.success) {
      // Update view count display if element exists
      const viewCountElement = document.getElementById('view-count');
      if (viewCountElement) {
        viewCountElement.textContent = data.count.toLocaleString();
      }
    }
  } catch (error) {
    console.error('Error fetching view count:', error);
  }
}

// Submit contact form
async function submitContactForm(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection and try again.'
    };
  }
}

// Initialize API integration
document.addEventListener('DOMContentLoaded', function() {
  // Track profile view on page load
  trackProfileView();

  // Handle contact form submission
  const contactForm = document.querySelector('.php-email-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const form = e.target;
      const submitButton = form.querySelector('button[type="submit"]');
      const loadingDiv = form.querySelector('.loading');
      const errorMessage = form.querySelector('.error-message');
      const sentMessage = form.querySelector('.sent-message');

      // Get form data
      const formData = {
        name: form.querySelector('input[name="name"]').value.trim(),
        email: form.querySelector('input[name="email"]').value.trim(),
        subject: form.querySelector('input[name="subject"]').value.trim(),
        message: form.querySelector('textarea[name="message"]').value.trim()
      };

      // Validation
      if (!formData.name || !formData.email || !formData.message) {
        if (errorMessage) {
          errorMessage.innerHTML = 'Please fill in all required fields.';
          errorMessage.style.display = 'block';
        }
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        if (errorMessage) {
          errorMessage.innerHTML = 'Please enter a valid email address.';
          errorMessage.style.display = 'block';
        }
        return;
      }

      // Hide previous messages
      if (errorMessage) errorMessage.style.display = 'none';
      if (sentMessage) sentMessage.style.display = 'none';
      if (loadingDiv) loadingDiv.style.display = 'block';
      
      // Disable submit button
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      // Submit to API
      try {
        const result = await submitContactForm(formData);

        // Hide loading
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }

        // Show result
        if (result && result.success) {
          // Hide error message if visible
          if (errorMessage) {
            errorMessage.style.display = 'none';
          }
          if (sentMessage) {
            sentMessage.style.display = 'block';
            // Hide success message after 5 seconds
            setTimeout(() => {
              sentMessage.style.display = 'none';
            }, 5000);
          }
          form.reset();
        } else {
          // Show error
          if (errorMessage) {
            errorMessage.innerHTML = result?.message || 'Failed to send message. Please try again.';
            errorMessage.style.display = 'block';
          }
          if (sentMessage) {
            sentMessage.style.display = 'none';
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        // Hide loading
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
        // Show error
        if (errorMessage) {
          errorMessage.innerHTML = 'Network error. Please check your connection and try again.';
          errorMessage.style.display = 'block';
        }
        if (sentMessage) {
          sentMessage.style.display = 'none';
        }
      }
    });
  }
});

// Export functions for use in other scripts
window.PortfolioAPI = {
  trackProfileView,
  updateViewCount,
  submitContactForm,
  getSessionId
};

