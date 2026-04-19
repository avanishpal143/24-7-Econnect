/**
 * Pricing Tabs Module
 * Manages service category tab navigation and content switching
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
 */

const PricingTabs = (() => {
  'use strict';

  // Tab configuration
  const TABS_CONFIG = [
    { id: 'sms', label: 'SMS & OTP', icon: 'sms' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
    { id: 'rcs', label: 'Google RCS', icon: 'rcs' },
    { id: 'voice', label: 'Voice & IVR', icon: 'voice' },
    { id: 'email', label: 'Email', icon: 'email' }
  ];

  let activeTabId = 'sms';
  let isAnimating = false;
  let tabElements = {};
  let onTabSwitchCallback = null;

  /**
   * Initialize tab controller
   * @param {Object} options - Configuration options
   */
  function init(options = {}) {
    activeTabId = options.defaultTab || 'sms';
    onTabSwitchCallback = options.onTabSwitch || null;

    // Check URL hash for initial tab
    const hash = window.location.hash.substring(1);
    if (hash && TABS_CONFIG.some(tab => tab.id === hash)) {
      activeTabId = hash;
    }

    renderTabs(options.container);
    attachEventListeners();
  }

  /**
   * Render tab navigation
   * @param {HTMLElement|string} container - Container element or selector
   */
  function renderTabs(container) {
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;

    if (!containerEl) {
      console.error('Tab container not found');
      return;
    }

    const tabsHTML = `
      <div class="pricing-tabs" role="tablist" aria-label="Service categories">
        ${TABS_CONFIG.map(tab => `
          <button 
            class="pricing-tab ${tab.id === activeTabId ? 'pricing-tab--active' : ''}"
            role="tab"
            aria-selected="${tab.id === activeTabId}"
            aria-controls="pricing-panel"
            id="tab-${tab.id}"
            data-tab-id="${tab.id}"
            tabindex="${tab.id === activeTabId ? '0' : '-1'}"
            aria-label="${tab.label} pricing"
          >
            <span class="pricing-tab__icon pricing-tab__icon--${tab.icon}" aria-hidden="true"></span>
            <span class="pricing-tab__label">${tab.label}</span>
          </button>
        `).join('')}
      </div>
    `;

    containerEl.innerHTML = tabsHTML;

    // Store tab elements for quick access
    TABS_CONFIG.forEach(tab => {
      tabElements[tab.id] = containerEl.querySelector(`[data-tab-id="${tab.id}"]`);
    });
  }

  /**
   * Attach event listeners to tabs
   */
  function attachEventListeners() {
    Object.keys(tabElements).forEach(tabId => {
      const tabEl = tabElements[tabId];
      
      // Click event
      tabEl.addEventListener('click', () => switchTab(tabId));

      // Keyboard navigation
      tabEl.addEventListener('keydown', (e) => {
        handleKeyboardNavigation(e, tabId);
      });
    });

    // Handle browser back/forward
    window.addEventListener('hashchange', handleHashChange);
  }

  /**
   * Handle keyboard navigation for tabs
   * @param {KeyboardEvent} e - Keyboard event
   * @param {string} currentTabId - Current tab ID
   */
  function handleKeyboardNavigation(e, currentTabId) {
    const currentIndex = TABS_CONFIG.findIndex(tab => tab.id === currentTabId);
    let targetIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        targetIndex = currentIndex > 0 ? currentIndex - 1 : TABS_CONFIG.length - 1;
        e.preventDefault();
        break;
      case 'ArrowRight':
        targetIndex = currentIndex < TABS_CONFIG.length - 1 ? currentIndex + 1 : 0;
        e.preventDefault();
        break;
      case 'Home':
        targetIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        targetIndex = TABS_CONFIG.length - 1;
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        switchTab(currentTabId);
        e.preventDefault();
        return;
      default:
        return;
    }

    const targetTab = TABS_CONFIG[targetIndex];
    if (targetTab) {
      tabElements[targetTab.id].focus();
    }
  }

  /**
   * Handle URL hash changes
   */
  function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && TABS_CONFIG.some(tab => tab.id === hash) && hash !== activeTabId) {
      switchTab(hash, false); // Don't update hash again
    }
  }

  /**
   * Switch to a different tab
   * @param {string} newTabId - ID of tab to switch to
   * @param {boolean} updateHash - Whether to update URL hash (default: true)
   * @returns {Promise<void>}
   */
  async function switchTab(newTabId, updateHash = true) {
    // Validate tab ID exists and is a string
    if (typeof newTabId !== 'string' || !newTabId) {
      console.error('[TabController] Invalid tab ID type or empty value:', {
        providedValue: newTabId,
        expectedType: 'string',
        currentActiveTab: activeTabId,
        availableTabs: TABS_CONFIG.map(t => t.id)
      });
      return;
    }

    // Validate tab ID exists in configuration
    const tabExists = TABS_CONFIG.some(tab => tab.id === newTabId);
    if (!tabExists) {
      console.error('[TabController] Attempted to switch to non-existent tab:', {
        requestedTabId: newTabId,
        currentActiveTab: activeTabId,
        availableTabs: TABS_CONFIG.map(t => t.id),
        action: 'Tab switch prevented, maintaining current state'
      });
      return;
    }

    // Don't switch if already active
    if (newTabId === activeTabId) {
      console.log('[TabController] Tab already active:', newTabId);
      return;
    }

    // Don't switch if animating
    if (isAnimating) {
      console.warn('[TabController] Tab switch blocked - animation in progress:', {
        requestedTabId: newTabId,
        currentActiveTab: activeTabId,
        action: 'Request ignored, maintaining current state'
      });
      return;
    }

    isAnimating = true;
    const oldTabId = activeTabId; // Store old tab ID before updating

    try {
      // Update tab UI
      updateTabUI(newTabId);

      // Update URL hash
      if (updateHash) {
        window.history.pushState(null, '', `#${newTabId}`);
      }

      // Update active tab BEFORE calling callback
      activeTabId = newTabId;

      // Call callback if provided
      if (onTabSwitchCallback && typeof onTabSwitchCallback === 'function') {
        await onTabSwitchCallback(oldTabId, newTabId);
      }

      // Announce tab change to screen readers
      announceTabChange(newTabId);

      // Manage focus - move to the pricing panel
      manageFocusAfterTabSwitch(newTabId);

    } catch (error) {
      // Restore previous state on error
      console.error('[TabController] Error during tab switch, restoring previous state:', {
        errorMessage: error.message,
        errorStack: error.stack,
        attemptedTabId: newTabId,
        restoredTabId: oldTabId,
        timestamp: new Date().toISOString()
      });

      // Restore previous active tab
      activeTabId = oldTabId;
      updateTabUI(oldTabId);

      // Restore URL hash if it was updated
      if (updateHash) {
        window.history.replaceState(null, '', `#${oldTabId}`);
      }
    } finally {
      isAnimating = false;
    }
  }

  /**
   * Announce tab change to screen readers
   * @param {string} tabId - ID of newly active tab
   */
  function announceTabChange(tabId) {
    const tab = TABS_CONFIG.find(t => t.id === tabId);
    if (!tab) return;

    // Create or update aria-live region
    let liveRegion = document.getElementById('tab-switch-announcement');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'tab-switch-announcement';
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

    liveRegion.textContent = `${tab.label} pricing loaded`;
  }

  /**
   * Manage focus after tab switch
   * @param {string} tabId - ID of newly active tab
   */
  function manageFocusAfterTabSwitch(tabId) {
    // Find the pricing panel
    const pricingPanel = document.getElementById('pricing-panel');
    
    if (pricingPanel) {
      // Make panel focusable temporarily
      pricingPanel.setAttribute('tabindex', '-1');
      
      // Focus the panel after a short delay to allow animations to start
      setTimeout(() => {
        pricingPanel.focus();
        
        // Remove tabindex after focus to restore natural tab order
        setTimeout(() => {
          pricingPanel.removeAttribute('tabindex');
        }, 100);
      }, 100);
    }
  }

  /**
   * Update tab UI to reflect active state
   * @param {string} newTabId - ID of newly active tab
   */
  function updateTabUI(newTabId) {
    // Update all tabs
    TABS_CONFIG.forEach(tab => {
      const tabEl = tabElements[tab.id];
      const isActive = tab.id === newTabId;

      if (isActive) {
        tabEl.classList.add('pricing-tab--active');
        tabEl.setAttribute('aria-selected', 'true');
        tabEl.setAttribute('tabindex', '0');
      } else {
        tabEl.classList.remove('pricing-tab--active');
        tabEl.setAttribute('aria-selected', 'false');
        tabEl.setAttribute('tabindex', '-1');
      }
    });
  }

  /**
   * Get current active tab ID
   * @returns {string}
   */
  function getActiveTab() {
    return activeTabId;
  }

  /**
   * Get all available tabs
   * @returns {Array}
   */
  function getAllTabs() {
    return [...TABS_CONFIG];
  }

  /**
   * Check if currently animating
   * @returns {boolean}
   */
  function getIsAnimating() {
    return isAnimating;
  }

  /**
   * Cleanup event listeners
   */
  function destroy() {
    Object.keys(tabElements).forEach(tabId => {
      const tabEl = tabElements[tabId];
      if (tabEl) {
        tabEl.replaceWith(tabEl.cloneNode(true));
      }
    });
    window.removeEventListener('hashchange', handleHashChange);
    tabElements = {};
  }

  // Public API
  return {
    init,
    switchTab,
    getActiveTab,
    getAllTabs,
    getIsAnimating,
    destroy
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PricingTabs;
}
