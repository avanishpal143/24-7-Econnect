/**
 * Pricing Animations Module
 * Manages all animations and transitions for the pricing page
 * Requirements: 4.1, 4.2, 4.5, 4.8, 5.1, 5.2, 5.3, 5.4, 5.6
 */

const PricingAnimations = (() => {
  'use strict';

  // Animation configuration
  const CONFIG = {
    duration: {
      fast: 200,
      medium: 400,
      slow: 600
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    staggerDelay: 100,
    intersectionThreshold: 0.15,
    intersectionRootMargin: '0px 0px -50px 0px'
  };

  // Track active animations to prevent conflicts
  const activeAnimations = new Map();
  let intersectionObserver = null;
  let prefersReducedMotion = false;

  /**
   * Initialize animation engine
   */
  function init() {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mediaQuery.matches;
    
    mediaQuery.addEventListener('change', (e) => {
      prefersReducedMotion = e.matches;
      
      // If reduced motion is enabled, cancel all active animations
      if (prefersReducedMotion) {
        cancelAllAnimations();
        
        // Make all animated elements immediately visible
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }
    });

    // Initialize intersection observer for scroll animations
    initScrollObserver();
    
    // Start observing elements with data-animate attributes
    observeScrollAnimations();
    
    // If reduced motion is already enabled, make elements visible immediately
    if (prefersReducedMotion) {
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  /**
   * Initialize intersection observer for scroll-triggered animations
   */
  function initScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported');
      return;
    }

    const options = {
      threshold: CONFIG.intersectionThreshold,
      rootMargin: CONFIG.intersectionRootMargin
    };

    intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.getAttribute('data-animate');
          const delay = parseInt(element.getAttribute('data-delay') || '0', 10);

          // Schedule animation
          if (delay > 0) {
            setTimeout(() => {
              triggerScrollAnimation(element, animationType);
            }, delay);
          } else {
            triggerScrollAnimation(element, animationType);
          }

          // Unobserve after animation is triggered
          intersectionObserver.unobserve(element);
        }
      });
    }, options);
  }

  /**
   * Observe elements for scroll animations
   * @param {string} selector - CSS selector for elements to observe
   */
  function observeScrollAnimations(selector = '[data-animate]') {
    if (!intersectionObserver) return;

    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      intersectionObserver.observe(element);
    });
  }

  /**
   * Trigger scroll animation on element
   * @param {HTMLElement} element - Element to animate
   * @param {string} animationType - Type of animation
   */
  function triggerScrollAnimation(element, animationType) {
    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    switch (animationType) {
      case 'fade-in':
        fadeIn(element);
        break;
      case 'slide-in':
        slideIn(element, 'up');
        break;
      case 'scale-in':
        scaleIn(element);
        break;
      default:
        fadeIn(element);
    }
  }

  /**
   * Fade in animation
   * @param {HTMLElement} element - Element to animate
   * @param {Object} config - Animation configuration
   * @returns {Promise<void>}
   */
  function fadeIn(element, config = {}) {
    if (prefersReducedMotion) {
      element.style.opacity = '1';
      return Promise.resolve();
    }

    const duration = config.duration || CONFIG.duration.medium;
    const easing = config.easing || CONFIG.easing;
    const delay = config.delay || 0;

    // Cancel any existing animation on this element
    cancelAnimation(element);

    return new Promise((resolve) => {
      const animation = element.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], {
        duration,
        easing,
        delay,
        fill: 'forwards'
      });

      activeAnimations.set(element, animation);

      animation.onfinish = () => {
        activeAnimations.delete(element);
        element.style.opacity = '1';
        resolve();
      };
    });
  }

  /**
   * Fade out animation
   * @param {HTMLElement} element - Element to animate
   * @param {Object} config - Animation configuration
   * @returns {Promise<void>}
   */
  function fadeOut(element, config = {}) {
    if (prefersReducedMotion) {
      element.style.opacity = '0';
      return Promise.resolve();
    }

    const duration = config.duration || CONFIG.duration.fast;
    const easing = config.easing || CONFIG.easing;
    const delay = config.delay || 0;

    // Cancel any existing animation on this element
    cancelAnimation(element);

    return new Promise((resolve) => {
      const animation = element.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration,
        easing,
        delay,
        fill: 'forwards'
      });

      activeAnimations.set(element, animation);

      animation.onfinish = () => {
        activeAnimations.delete(element);
        element.style.opacity = '0';
        resolve();
      };
    });
  }

  /**
   * Slide in animation
   * @param {HTMLElement} element - Element to animate
   * @param {string} direction - Direction: 'up', 'down', 'left', 'right'
   * @param {Object} config - Animation configuration
   * @returns {Promise<void>}
   */
  function slideIn(element, direction = 'up', config = {}) {
    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return Promise.resolve();
    }

    const duration = config.duration || CONFIG.duration.medium;
    const easing = config.easing || CONFIG.easing;
    const delay = config.delay || 0;
    const distance = config.distance || 30;

    // Cancel any existing animation on this element
    cancelAnimation(element);

    const transforms = {
      up: [`translateY(${distance}px)`, 'translateY(0)'],
      down: [`translateY(-${distance}px)`, 'translateY(0)'],
      left: [`translateX(${distance}px)`, 'translateX(0)'],
      right: [`translateX(-${distance}px)`, 'translateX(0)']
    };

    const [from, to] = transforms[direction] || transforms.up;

    return new Promise((resolve) => {
      const animation = element.animate([
        { opacity: 0, transform: from },
        { opacity: 1, transform: to }
      ], {
        duration,
        easing,
        delay,
        fill: 'forwards'
      });

      activeAnimations.set(element, animation);

      animation.onfinish = () => {
        activeAnimations.delete(element);
        element.style.opacity = '1';
        element.style.transform = 'none';
        resolve();
      };
    });
  }

  /**
   * Scale in animation
   * @param {HTMLElement} element - Element to animate
   * @param {Object} config - Animation configuration
   * @returns {Promise<void>}
   */
  function scaleIn(element, config = {}) {
    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return Promise.resolve();
    }

    const duration = config.duration || CONFIG.duration.medium;
    const easing = config.easing || CONFIG.easing;
    const delay = config.delay || 0;

    // Cancel any existing animation on this element
    cancelAnimation(element);

    return new Promise((resolve) => {
      const animation = element.animate([
        { opacity: 0, transform: 'scale(0.9)' },
        { opacity: 1, transform: 'scale(1)' }
      ], {
        duration,
        easing,
        delay,
        fill: 'forwards'
      });

      activeAnimations.set(element, animation);

      animation.onfinish = () => {
        activeAnimations.delete(element);
        element.style.opacity = '1';
        element.style.transform = 'none';
        resolve();
      };
    });
  }

  /**
   * Stagger animation for multiple elements
   * @param {Array<HTMLElement>} elements - Elements to animate
   * @param {Function} animationFn - Animation function to apply
   * @param {number} staggerDelay - Delay between each element (ms)
   * @returns {Promise<void>}
   */
  async function staggerAnimation(elements, animationFn, staggerDelay = CONFIG.staggerDelay) {
    if (!Array.isArray(elements) || elements.length === 0) {
      return Promise.resolve();
    }

    if (prefersReducedMotion) {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return Promise.resolve();
    }

    const promises = elements.map((element, index) => {
      return animationFn(element, { delay: index * staggerDelay });
    });

    return Promise.all(promises);
  }

  /**
   * Cancel active animation on element
   * @param {HTMLElement} element - Element with animation to cancel
   */
  function cancelAnimation(element) {
    const animation = activeAnimations.get(element);
    if (animation) {
      animation.cancel();
      activeAnimations.delete(element);
    }
  }

  /**
   * Cancel all active animations
   */
  function cancelAllAnimations() {
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations.clear();
  }

  /**
   * Check if element is currently animating
   * @param {HTMLElement} element - Element to check
   * @returns {boolean}
   */
  function isAnimating(element) {
    return activeAnimations.has(element);
  }

  /**
   * Check if user prefers reduced motion
   * @returns {boolean}
   */
  function getPrefersReducedMotion() {
    return prefersReducedMotion;
  }

  /**
   * Cleanup and destroy animation engine
   */
  function destroy() {
    cancelAllAnimations();
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      intersectionObserver = null;
    }
  }

  /**
   * BillingToggle class - Manages billing period toggle functionality
   * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 9.4
   */
  class BillingToggle {
    constructor(options = {}) {
      this.toggleElement = null;
      this.currentPeriod = 'monthly';
      this.onToggleCallback = options.onToggle || null;
      this.discount = options.discount || 20;
    }

    /**
     * Initialize billing toggle
     * @param {string} selector - CSS selector for toggle input
     * @param {Function} onToggle - Callback when toggle changes
     */
    init(selector = '#billingToggle', onToggle = null) {
      this.toggleElement = document.querySelector(selector);
      
      if (!this.toggleElement) {
        console.error('Billing toggle element not found:', selector);
        return;
      }

      if (onToggle) {
        this.onToggleCallback = onToggle;
      }

      // Set initial state
      this.toggleElement.checked = false;
      this.currentPeriod = 'monthly';

      // Add event listener
      this.toggleElement.addEventListener('change', (e) => {
        this.handleToggle(e);
      });

      // Add keyboard accessibility
      this.toggleElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleElement.checked = !this.toggleElement.checked;
          this.handleToggle({ target: this.toggleElement });
        }
      });
    }

    /**
     * Handle toggle state change
     * @param {Event} event - Change event
     */
    async handleToggle(event) {
      const isYearly = event.target.checked;
      const newPeriod = isYearly ? 'yearly' : 'monthly';
      
      // Don't do anything if period hasn't changed
      if (newPeriod === this.currentPeriod) {
        return;
      }

      this.currentPeriod = newPeriod;

      // Update ARIA attribute for accessibility
      if (this.toggleElement) {
        this.toggleElement.setAttribute('aria-checked', isYearly ? 'true' : 'false');
      }

      // Update all prices with animation
      await this.updateAllPrices(newPeriod);

      // Call callback if provided
      if (this.onToggleCallback) {
        this.onToggleCallback(newPeriod);
      }

      // Announce change to screen readers
      this.announceChange(newPeriod);
    }

    /**
     * Update all displayed prices with animation
     * @param {string} period - 'monthly' or 'yearly'
     */
    async updateAllPrices(period) {
      // Get all price elements
      const priceElements = document.querySelectorAll('.price-card__amount:not(.price-card__amount--custom)');
      const periodElements = document.querySelectorAll('.price-card__period');

      if (priceElements.length === 0) {
        return;
      }

      // Step 1: Fade out all prices
      const fadeOutPromises = Array.from(priceElements).map(element => {
        return fadeOut(element, { duration: 200 });
      });

      await Promise.all(fadeOutPromises);

      // Step 2: Update price values and period labels
      priceElements.forEach(element => {
        const monthlyPrice = element.getAttribute('data-monthly');
        const yearlyPrice = element.getAttribute('data-yearly');
        
        if (period === 'yearly' && yearlyPrice) {
          element.textContent = yearlyPrice;
        } else if (period === 'monthly' && monthlyPrice) {
          element.textContent = monthlyPrice;
        }
      });

      // Update period labels
      periodElements.forEach(element => {
        element.textContent = period === 'yearly' ? '/year' : '/month';
      });

      // Step 3: Fade in all prices
      const fadeInPromises = Array.from(priceElements).map(element => {
        return fadeIn(element, { duration: 200 });
      });

      await Promise.all(fadeInPromises);
    }

    /**
     * Announce billing period change to screen readers
     * @param {string} period - 'monthly' or 'yearly'
     */
    announceChange(period) {
      // Create or update aria-live region
      let liveRegion = document.getElementById('billing-toggle-announcement');
      
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'billing-toggle-announcement';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
      }

      const message = period === 'yearly' 
        ? 'Switched to yearly billing. Prices updated with 20% discount.'
        : 'Switched to monthly billing. Prices updated.';
      
      liveRegion.textContent = message;
    }

    /**
     * Get current billing period
     * @returns {string} - 'monthly' or 'yearly'
     */
    getCurrentPeriod() {
      return this.currentPeriod;
    }

    /**
     * Set billing period programmatically
     * @param {string} period - 'monthly' or 'yearly'
     */
    setPeriod(period) {
      if (period !== 'monthly' && period !== 'yearly') {
        console.error('Invalid period:', period);
        return;
      }

      const shouldBeChecked = period === 'yearly';
      
      if (this.toggleElement && this.toggleElement.checked !== shouldBeChecked) {
        this.toggleElement.checked = shouldBeChecked;
        this.handleToggle({ target: this.toggleElement });
      }
    }

    /**
     * Toggle between monthly and yearly
     */
    toggle() {
      if (this.toggleElement) {
        this.toggleElement.checked = !this.toggleElement.checked;
        this.handleToggle({ target: this.toggleElement });
      }
    }

    /**
     * Cleanup and remove event listeners
     */
    destroy() {
      if (this.toggleElement) {
        this.toggleElement.removeEventListener('change', this.handleToggle);
        this.toggleElement.removeEventListener('keydown', this.handleToggle);
      }
    }
  }

  /**
   * PricingCard class - Renders individual pricing tier cards
   * Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 2.7
   */
  class PricingCard {
    constructor(tier, options = {}) {
      this.tier = tier;
      this.billingPeriod = options.billingPeriod || 'monthly';
      this.index = options.index || 0;
      this.element = null;
    }

    /**
     * Render pricing card element
     * @returns {HTMLElement} - Rendered card element
     */
    render() {
      const card = document.createElement('div');
      card.className = 'price-card' + (this.tier.isPopular ? ' price-card--popular' : '');
      card.style.opacity = '0';
      card.setAttribute('data-animate', 'fade-in');
      card.setAttribute('data-delay', (this.index * 100).toString());
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `${this.tier.name} pricing plan`);
      
      // Requirement 2.2: Display "Most Popular" badge for featured tiers
      const badge = this.tier.isPopular 
        ? '<div class="price-card__badge" aria-label="Most popular plan">Most Popular</div>' 
        : '';
      
      // Requirement 2.1: Render tier name and description
      const nameHTML = `<h3 class="price-card__name">${this.tier.name}</h3>`;
      
      // Requirement 2.1: Render price
      const priceHTML = this.renderPrice();
      
      // Requirement 2.5: Display feature list
      const featuresHTML = this.renderFeatures();
      
      // Requirement 2.3: Include CTA button with appropriate text and link
      const ctaHTML = this.renderCTA();
      
      card.innerHTML = `
        ${badge}
        ${nameHTML}
        ${priceHTML}
        ${featuresHTML}
        ${ctaHTML}
      `;
      
      this.element = card;
      return card;
    }

    /**
     * Render price display
     * @returns {string} - Price HTML
     */
    renderPrice() {
      // Handle custom pricing (Enterprise plans)
      if (this.tier.isCustomPricing) {
        return `
          <div class="price-card__price">
            <span class="price-card__amount price-card__amount--custom">Custom</span>
          </div>
        `;
      }

      // Format prices for display
      const monthlyFormatted = this.tier.monthlyPrice.toLocaleString('en-IN');
      const yearlyFormatted = this.tier.yearlyPrice.toLocaleString('en-IN');
      
      return `
        <div class="price-card__price" aria-label="Price: ${monthlyFormatted} rupees per month">
          <span class="price-card__currency" aria-hidden="true">&#8377;</span>
          <span class="price-card__amount" data-monthly="${monthlyFormatted}" data-yearly="${yearlyFormatted}">${monthlyFormatted}</span>
          <span class="price-card__period">/month</span>
        </div>
      `;
    }

    /**
     * Render features list
     * @returns {string} - Features HTML
     */
    renderFeatures() {
      // Requirement 2.6: Use checkmark icons for included features
      const strokeColor = this.tier.isPopular ? '#fff' : '#10b981';
      
      const featuresItems = this.tier.features.map(feature => {
        return `
          <li>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            ${feature.text}
          </li>
        `;
      }).join('');
      
      return `
        <ul class="price-card__features" aria-label="Plan features">
          ${featuresItems}
        </ul>
      `;
    }

    /**
     * Render CTA button
     * @returns {string} - CTA button HTML
     */
    renderCTA() {
      // Requirement 2.7: Apply appropriate styling based on tier importance
      const btnClass = this.tier.isPopular 
        ? 'price-card__btn price-card__btn--white' 
        : 'price-card__btn';
      
      const btnAriaLabel = this.tier.ctaText === 'Contact Sales' 
        ? `Contact sales for ${this.tier.name} plan` 
        : `Get started with ${this.tier.name} plan`;
      
      return `
        <a href="${this.tier.ctaLink}" class="${btnClass}" aria-label="${btnAriaLabel}">
          ${this.tier.ctaText}
        </a>
      `;
    }

    /**
     * Update price display when billing period changes
     * @param {string} period - 'monthly' or 'yearly'
     */
    updatePrice(period) {
      if (!this.element || this.tier.isCustomPricing) {
        return;
      }

      this.billingPeriod = period;
      
      const amountElement = this.element.querySelector('.price-card__amount');
      const periodElement = this.element.querySelector('.price-card__period');
      
      if (amountElement) {
        const monthlyPrice = amountElement.getAttribute('data-monthly');
        const yearlyPrice = amountElement.getAttribute('data-yearly');
        
        if (period === 'yearly' && yearlyPrice) {
          amountElement.textContent = yearlyPrice;
        } else if (period === 'monthly' && monthlyPrice) {
          amountElement.textContent = monthlyPrice;
        }
      }
      
      if (periodElement) {
        periodElement.textContent = period === 'yearly' ? '/year' : '/month';
      }
    }

    /**
     * Animate card entrance
     * @returns {Promise<void>}
     */
    animateIn() {
      if (!this.element) {
        return Promise.resolve();
      }
      return fadeIn(this.element, { duration: 400, delay: this.index * 100 });
    }

    /**
     * Animate card exit
     * @returns {Promise<void>}
     */
    animateOut() {
      if (!this.element) {
        return Promise.resolve();
      }
      return fadeOut(this.element, { duration: 300 });
    }

    /**
     * Get the rendered element
     * @returns {HTMLElement|null}
     */
    getElement() {
      return this.element;
    }

    /**
     * Destroy card and cleanup
     */
    destroy() {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
    }
  }

  /**
   * PriceCalculator utility - Price calculation and formatting
   * Requirements: 3.4, 3.7, 9.4, 10.5
   */
  const PriceCalculator = {
    /**
     * Calculate yearly price with discount
     * @param {number} monthlyPrice - Monthly price
     * @param {number} discountPercentage - Discount percentage (default: 20)
     * @returns {number} - Yearly price with discount applied
     */
    calculateYearlyPrice(monthlyPrice, discountPercentage = 20) {
      // Validate inputs
      if (typeof monthlyPrice !== 'number' || monthlyPrice <= 0) {
        console.error('Invalid monthly price:', monthlyPrice);
        return NaN;
      }
      
      if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100) {
        console.error('Invalid discount percentage:', discountPercentage);
        return monthlyPrice * 12;
      }
      
      const yearlyPrice = monthlyPrice * 12 * (1 - discountPercentage / 100);
      return Math.round(yearlyPrice * 100) / 100; // Round to 2 decimal places
    },

    /**
     * Format price with currency symbol
     * @param {number} price - Price to format
     * @param {string} currency - Currency symbol (default: ₹)
     * @returns {string} - Formatted price string
     */
    formatPrice(price, currency = '₹') {
      // Handle invalid prices
      if (typeof price !== 'number' || isNaN(price) || price < 0 || !isFinite(price)) {
        return 'Contact Sales';
      }
      
      return `${currency}${price.toLocaleString('en-IN')}`;
    },

    /**
     * Validate price calculation result
     * @param {number} result - Calculation result
     * @returns {boolean} - True if valid
     */
    isValidPrice(result) {
      return typeof result === 'number' && !isNaN(result) && isFinite(result) && result >= 0;
    }
  };

  // Public API
  return {
    init,
    fadeIn,
    fadeOut,
    slideIn,
    scaleIn,
    staggerAnimation,
    observeScrollAnimations,
    cancelAnimation,
    cancelAllAnimations,
    isAnimating,
    getPrefersReducedMotion,
    destroy,
    CONFIG,
    BillingToggle,
    PricingCard,
    PriceCalculator
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PricingAnimations;
}
