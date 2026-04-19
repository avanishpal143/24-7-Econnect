/**
 * Pricing Data Module
 * Defines pricing data structures and validation for all service categories
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6
 */

const PricingData = (() => {
  'use strict';

  // Configuration
  const CONFIG = {
    yearlyDiscount: 20, // 20% discount for yearly billing
    currency: '₹',
    minFeaturesPerTier: 3
  };

  /**
   * Validates a single pricing tier
   * @param {Object} tier - Pricing tier object
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  function validatePricingTier(tier) {
    const errors = [];

    // Requirement 9.2: Validate all required fields are present
    const requiredFields = ['id', 'name', 'description', 'monthlyPrice', 'yearlyPrice', 'features', 'isPopular', 'ctaText', 'ctaLink'];
    requiredFields.forEach(field => {
      if (tier[field] === undefined || tier[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Requirement 9.3: Validate prices are positive numbers (skip for custom pricing)
    if (!tier.isCustomPricing) {
      if (typeof tier.monthlyPrice === 'number' && tier.monthlyPrice <= 0) {
        errors.push(`monthlyPrice must be positive, got: ${tier.monthlyPrice}`);
      }
      if (typeof tier.yearlyPrice === 'number' && tier.yearlyPrice <= 0) {
        errors.push(`yearlyPrice must be positive, got: ${tier.yearlyPrice}`);
      }

      // Requirement 9.4: Validate yearly price reflects discount
      if (typeof tier.monthlyPrice === 'number' && typeof tier.yearlyPrice === 'number') {
        const expectedYearlyMax = tier.monthlyPrice * 12;
        if (tier.yearlyPrice >= expectedYearlyMax) {
          errors.push(`yearlyPrice (${tier.yearlyPrice}) must be less than monthlyPrice * 12 (${expectedYearlyMax})`);
        }
      }
    }

    // Requirement 9.5: Validate at least 3 features
    if (!Array.isArray(tier.features) || tier.features.length < CONFIG.minFeaturesPerTier) {
      errors.push(`Tier must have at least ${CONFIG.minFeaturesPerTier} features, got: ${tier.features?.length || 0}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates pricing data for a service category
   * @param {Object} categoryData - Service category pricing data
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  function validateCategoryData(categoryData) {
    const errors = [];

    // Requirement 9.1: Validate service category has unique identifier
    if (!categoryData.serviceCategory || typeof categoryData.serviceCategory !== 'string') {
      errors.push('Missing or invalid serviceCategory identifier');
    }

    // Validate tiers array exists
    if (!Array.isArray(categoryData.tiers) || categoryData.tiers.length === 0) {
      errors.push('Category must have at least one pricing tier');
    } else {
      // Validate each tier
      categoryData.tiers.forEach((tier, index) => {
        const tierValidation = validatePricingTier(tier);
        if (!tierValidation.valid) {
          errors.push(`Tier ${index} (${tier.name || 'unnamed'}): ${tierValidation.errors.join(', ')}`);
        }
      });

      // Requirement 9.6: Ensure at least one tier is marked as popular
      const hasPopularTier = categoryData.tiers.some(tier => tier.isPopular === true);
      if (!hasPopularTier) {
        errors.push('At least one pricing tier must be marked as popular (isPopular: true)');
      }

      // Requirement 9.1: Validate tier IDs are unique within category
      const tierIds = categoryData.tiers.map(t => t.id);
      const uniqueIds = new Set(tierIds);
      if (tierIds.length !== uniqueIds.size) {
        errors.push('All tier IDs must be unique within a category');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates all pricing data
   * @param {Object} allData - Object containing all service categories
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  function validateAllPricingData(allData) {
    const errors = [];
    const categoryIds = [];

    Object.keys(allData).forEach(key => {
      const categoryData = allData[key];
      
      // Track category IDs for uniqueness check
      if (categoryData.serviceCategory) {
        categoryIds.push(categoryData.serviceCategory);
      }

      // Validate each category
      const categoryValidation = validateCategoryData(categoryData);
      if (!categoryValidation.valid) {
        errors.push(`Category ${key}: ${categoryValidation.errors.join(', ')}`);
      }
    });

    // Requirement 9.1: Validate all service categories have unique identifiers
    const uniqueCategoryIds = new Set(categoryIds);
    if (categoryIds.length !== uniqueCategoryIds.size) {
      errors.push('All service category identifiers must be unique');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculates yearly price with discount
   * @param {number} monthlyPrice - Monthly price
   * @param {number} discountPercentage - Discount percentage (default: 20)
   * @returns {number} - Yearly price with discount applied
   */
  function calculateYearlyPrice(monthlyPrice, discountPercentage = CONFIG.yearlyDiscount) {
    if (typeof monthlyPrice !== 'number' || monthlyPrice <= 0) {
      console.error('Invalid monthly price:', monthlyPrice);
      return 0;
    }
    if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100) {
      console.error('Invalid discount percentage:', discountPercentage);
      return monthlyPrice * 12;
    }
    
    const yearlyPrice = monthlyPrice * 12 * (1 - discountPercentage / 100);
    return Math.round(yearlyPrice * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Formats price with currency symbol
   * @param {number} price - Price to format
   * @param {string} currency - Currency symbol (default: ₹)
   * @returns {string} - Formatted price string
   */
  function formatPrice(price, currency = CONFIG.currency) {
    if (typeof price !== 'number' || isNaN(price) || price < 0 || !isFinite(price)) {
      return 'Contact Sales';
    }
    return `${currency}${price.toLocaleString('en-IN')}`;
  }

  // Pricing data for all service categories
  const PRICING_DATA = {
    sms: {
      serviceCategory: 'sms',
      currency: CONFIG.currency,
      yearlyDiscount: CONFIG.yearlyDiscount,
      tiers: [
        {
          id: 'sms-starter',
          name: 'Starter',
          description: 'Perfect for small businesses',
          monthlyPrice: 2999,
          yearlyPrice: calculateYearlyPrice(2999),
          features: [
            { text: '10,000 messages/month', isIncluded: true, icon: 'check' },
            { text: 'Basic analytics dashboard', isIncluded: true, icon: 'check' },
            { text: 'Email support', isIncluded: true, icon: 'check' },
            { text: 'API access', isIncluded: true, icon: 'check' },
            { text: 'DLT registration support', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'sms-professional',
          name: 'Professional',
          description: 'For growing businesses',
          monthlyPrice: 9999,
          yearlyPrice: calculateYearlyPrice(9999),
          features: [
            { text: '1,00,000 messages/month', isIncluded: true, icon: 'check' },
            { text: 'Advanced analytics', isIncluded: true, icon: 'check' },
            { text: 'Priority support', isIncluded: true, icon: 'check' },
            { text: 'Full API access', isIncluded: true, icon: 'check' },
            { text: 'WhatsApp Business API', isIncluded: true, icon: 'check' },
            { text: 'Dedicated account manager', isIncluded: true, icon: 'check' }
          ],
          isPopular: true,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'sms-enterprise',
          name: 'Enterprise',
          description: 'For large organizations',
          monthlyPrice: 0, // Custom pricing
          yearlyPrice: 0,
          features: [
            { text: 'Unlimited messages', isIncluded: true, icon: 'check' },
            { text: 'Custom analytics & reports', isIncluded: true, icon: 'check' },
            { text: '24/7 dedicated support', isIncluded: true, icon: 'check' },
            { text: 'Custom integrations', isIncluded: true, icon: 'check' },
            { text: 'SLA guarantee', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Contact Sales',
          ctaLink: '/#contact',
          isCustomPricing: true
        }
      ]
    },
    whatsapp: {
      serviceCategory: 'whatsapp',
      currency: CONFIG.currency,
      yearlyDiscount: CONFIG.yearlyDiscount,
      tiers: [
        {
          id: 'wa-starter',
          name: 'Starter',
          description: 'Get started with WhatsApp Business',
          monthlyPrice: 4999,
          yearlyPrice: calculateYearlyPrice(4999),
          features: [
            { text: '5,000 conversations/month', isIncluded: true, icon: 'check' },
            { text: 'WhatsApp Business API', isIncluded: true, icon: 'check' },
            { text: 'Basic templates', isIncluded: true, icon: 'check' },
            { text: 'Email support', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'wa-professional',
          name: 'Professional',
          description: 'Scale your WhatsApp engagement',
          monthlyPrice: 14999,
          yearlyPrice: calculateYearlyPrice(14999),
          features: [
            { text: '50,000 conversations/month', isIncluded: true, icon: 'check' },
            { text: 'Advanced templates', isIncluded: true, icon: 'check' },
            { text: 'Rich media support', isIncluded: true, icon: 'check' },
            { text: 'Priority support', isIncluded: true, icon: 'check' },
            { text: 'Analytics dashboard', isIncluded: true, icon: 'check' }
          ],
          isPopular: true,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'wa-enterprise',
          name: 'Enterprise',
          description: 'Enterprise-grade WhatsApp solution',
          monthlyPrice: 0,
          yearlyPrice: 0,
          features: [
            { text: 'Unlimited conversations', isIncluded: true, icon: 'check' },
            { text: 'Custom templates', isIncluded: true, icon: 'check' },
            { text: 'Dedicated support', isIncluded: true, icon: 'check' },
            { text: 'Custom integrations', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Contact Sales',
          ctaLink: '/#contact',
          isCustomPricing: true
        }
      ]
    },
    rcs: {
      serviceCategory: 'rcs',
      currency: CONFIG.currency,
      yearlyDiscount: CONFIG.yearlyDiscount,
      tiers: [
        {
          id: 'rcs-starter',
          name: 'Starter',
          description: 'Experience rich messaging',
          monthlyPrice: 5999,
          yearlyPrice: calculateYearlyPrice(5999),
          features: [
            { text: '10,000 RCS messages/month', isIncluded: true, icon: 'check' },
            { text: 'Rich media cards', isIncluded: true, icon: 'check' },
            { text: 'Basic analytics', isIncluded: true, icon: 'check' },
            { text: 'Email support', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'rcs-professional',
          name: 'Professional',
          description: 'Advanced RCS capabilities',
          monthlyPrice: 19999,
          yearlyPrice: calculateYearlyPrice(19999),
          features: [
            { text: '1,00,000 RCS messages/month', isIncluded: true, icon: 'check' },
            { text: 'Carousel & rich cards', isIncluded: true, icon: 'check' },
            { text: 'Advanced analytics', isIncluded: true, icon: 'check' },
            { text: 'Priority support', isIncluded: true, icon: 'check' },
            { text: 'A/B testing', isIncluded: true, icon: 'check' }
          ],
          isPopular: true,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'rcs-enterprise',
          name: 'Enterprise',
          description: 'Complete RCS solution',
          monthlyPrice: 0,
          yearlyPrice: 0,
          features: [
            { text: 'Unlimited RCS messages', isIncluded: true, icon: 'check' },
            { text: 'Custom rich cards', isIncluded: true, icon: 'check' },
            { text: 'Dedicated support', isIncluded: true, icon: 'check' },
            { text: 'Custom integrations', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Contact Sales',
          ctaLink: '/#contact',
          isCustomPricing: true
        }
      ]
    },
    voice: {
      serviceCategory: 'voice',
      currency: CONFIG.currency,
      yearlyDiscount: CONFIG.yearlyDiscount,
      tiers: [
        {
          id: 'voice-starter',
          name: 'Starter',
          description: 'Voice & IVR basics',
          monthlyPrice: 3999,
          yearlyPrice: calculateYearlyPrice(3999),
          features: [
            { text: '5,000 minutes/month', isIncluded: true, icon: 'check' },
            { text: 'Basic IVR system', isIncluded: true, icon: 'check' },
            { text: 'Call recording', isIncluded: true, icon: 'check' },
            { text: 'Email support', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'voice-professional',
          name: 'Professional',
          description: 'Advanced voice solutions',
          monthlyPrice: 12999,
          yearlyPrice: calculateYearlyPrice(12999),
          features: [
            { text: '50,000 minutes/month', isIncluded: true, icon: 'check' },
            { text: 'Advanced IVR with multi-level', isIncluded: true, icon: 'check' },
            { text: 'Call analytics', isIncluded: true, icon: 'check' },
            { text: 'Priority support', isIncluded: true, icon: 'check' },
            { text: 'Text-to-speech', isIncluded: true, icon: 'check' }
          ],
          isPopular: true,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'voice-enterprise',
          name: 'Enterprise',
          description: 'Enterprise voice platform',
          monthlyPrice: 0,
          yearlyPrice: 0,
          features: [
            { text: 'Unlimited minutes', isIncluded: true, icon: 'check' },
            { text: 'Custom IVR flows', isIncluded: true, icon: 'check' },
            { text: 'Dedicated support', isIncluded: true, icon: 'check' },
            { text: 'Custom integrations', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Contact Sales',
          ctaLink: '/#contact',
          isCustomPricing: true
        }
      ]
    },
    email: {
      serviceCategory: 'email',
      currency: CONFIG.currency,
      yearlyDiscount: CONFIG.yearlyDiscount,
      tiers: [
        {
          id: 'email-starter',
          name: 'Starter',
          description: 'Email marketing essentials',
          monthlyPrice: 1999,
          yearlyPrice: calculateYearlyPrice(1999),
          features: [
            { text: '25,000 emails/month', isIncluded: true, icon: 'check' },
            { text: 'Basic templates', isIncluded: true, icon: 'check' },
            { text: 'Email analytics', isIncluded: true, icon: 'check' },
            { text: 'Email support', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'email-professional',
          name: 'Professional',
          description: 'Professional email marketing',
          monthlyPrice: 7999,
          yearlyPrice: calculateYearlyPrice(7999),
          features: [
            { text: '2,00,000 emails/month', isIncluded: true, icon: 'check' },
            { text: 'Advanced templates', isIncluded: true, icon: 'check' },
            { text: 'A/B testing', isIncluded: true, icon: 'check' },
            { text: 'Priority support', isIncluded: true, icon: 'check' },
            { text: 'Automation workflows', isIncluded: true, icon: 'check' }
          ],
          isPopular: true,
          ctaText: 'Get Started',
          ctaLink: '/#contact'
        },
        {
          id: 'email-enterprise',
          name: 'Enterprise',
          description: 'Enterprise email solution',
          monthlyPrice: 0,
          yearlyPrice: 0,
          features: [
            { text: 'Unlimited emails', isIncluded: true, icon: 'check' },
            { text: 'Custom templates', isIncluded: true, icon: 'check' },
            { text: 'Dedicated support', isIncluded: true, icon: 'check' },
            { text: 'Custom integrations', isIncluded: true, icon: 'check' }
          ],
          isPopular: false,
          ctaText: 'Contact Sales',
          ctaLink: '/#contact',
          isCustomPricing: true
        }
      ]
    }
  };

  // Validate all pricing data on module load
  const validation = validateAllPricingData(PRICING_DATA);
  if (!validation.valid) {
    console.error('Pricing data validation failed:', validation.errors);
  } else {
    console.log('Pricing data validation passed');
  }

  // Public API
  return {
    PRICING_DATA,
    CONFIG,
    validatePricingTier,
    validateCategoryData,
    validateAllPricingData,
    calculateYearlyPrice,
    formatPrice,
    getPricingForCategory: (category) => PRICING_DATA[category] || null,
    getAllCategories: () => Object.keys(PRICING_DATA)
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PricingData;
}
