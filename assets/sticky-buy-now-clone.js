// Sticky Add to Cart + Buy Now pair (simplified with event delegation)
(function () {
  console.log('🚀 Sticky buy buttons script loaded');

  // Create the sticky container
  function createContainer() {
    var container = document.createElement('div');
    container.className = 'sticky-buy-pair';
    container.innerHTML = `
      <div class="sticky-buy-pair__inner">
        <div class="sticky-buy-pair__add">
          <button type="button" class="button sticky-add-btn">Add to Cart</button>
        </div>
        <div class="sticky-buy-pair__buy">
          <button type="button" class="shopify-payment-button__button sticky-buy-btn">Buy Now</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    console.log('✅ Sticky container created and added to DOM');
    return container;
  }

  // Check if we're on a product page
  function isProductPage() {
    return !!(
      document.querySelector('form[action*="/cart/add"]') ||
      document.querySelector('[data-product-form]') ||
      document.querySelector('.product-form')
    );
  }

  // Find original Add to Cart button
  function findOriginalAddButton() {
    var selectors = [
      'form[action*="/cart/add"] button[name="add"]',
      '.product-form__buttons button[name="add"]',
      '.product-form__buttons .product-form__submit',
      '.product-form__submit',
      'button[type="submit"]'
    ];
    
    for (var i = 0; i < selectors.length; i++) {
      var button = document.querySelector(selectors[i]);
      if (button && button.closest('form[action*="/cart/add"]')) {
        console.log('✅ Found original Add to Cart:', selectors[i]);
        return button;
      }
    }
    console.log('❌ No Add to Cart button found');
    return null;
  }

  // Find original Buy Now button
  function findOriginalBuyButton() {
    var selectors = [
      '.shopify-payment-button button',
      '.shopify-payment-button__button',
      '.dynamic-checkout button',
      '[data-shopify-pay-button] button'
    ];
    
    for (var i = 0; i < selectors.length; i++) {
      var button = document.querySelector(selectors[i]);
      if (button) {
        console.log('✅ Found original Buy Now:', selectors[i]);
        return button;
      }
    }
    console.log('❌ No Buy Now button found');
    return null;
  }

  // Update visibility based on product availability
  function updateVisibility(container) {
    var form = document.querySelector('form[action*="/cart/add"]');
    var isAvailable = true;
    
    if (form) {
      var submitBtn = form.querySelector('button[name="add"]');
      isAvailable = submitBtn && !submitBtn.disabled && !submitBtn.classList.contains('sold-out');
    }
    
    // Force show for testing - remove this later
    container.style.display = 'block';
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.zIndex = '1600';
    container.style.background = 'rgba(255, 255, 255, 0.98)';
    container.style.padding = '12px 16px';
    container.style.borderTop = '1px solid rgba(0,0,0,0.08)';
    
    console.log('🔧 Sticky bar forced visible for testing');
    console.log('📱 Window width:', window.innerWidth);
    console.log('✅ Product available:', isAvailable);
  }

  // Event delegation for sticky buttons
  function setupEventDelegation() {
    document.addEventListener('click', function(e) {
      // Handle Add to Cart clicks
      if (e.target.closest('.sticky-add-btn')) {
        e.preventDefault();
        console.log('🛒 Sticky Add to Cart clicked');
        
        var originalAdd = findOriginalAddButton();
        if (originalAdd) {
          originalAdd.click();
          console.log('✅ Original Add to Cart triggered');
        } else {
          console.log('❌ Could not find original Add to Cart button');
        }
      }
      
      // Handle Buy Now clicks
      if (e.target.closest('.sticky-buy-btn')) {
        e.preventDefault();
        console.log('💳 Sticky Buy Now clicked');
        
        var originalBuy = findOriginalBuyButton();
        if (originalBuy) {
          originalBuy.click();
          console.log('✅ Original Buy Now triggered');
        } else {
          console.log('❌ Could not find original Buy Now button');
        }
      }
    });
    
    console.log('✅ Event delegation set up');
  }

  // Initialize everything
  function init() {
    console.log('🔍 Initializing sticky buy buttons...');
    console.log('📱 Window width:', window.innerWidth);
    console.log('🛍️ Is product page:', isProductPage());
    
    // Force initialization for testing
    console.log('🔧 Force initializing for testing...');

    var container = createContainer();
    console.log('📦 Container HTML:', container.innerHTML);
    console.log('🔍 Buttons in container:', container.querySelectorAll('button').length);
    
    setupEventDelegation();
    updateVisibility(container);

    // Update visibility on window resize
    window.addEventListener('resize', function() {
      updateVisibility(container);
    });

    // Update visibility on variant changes
    document.addEventListener('product:variant:change', function() {
      updateVisibility(container);
    });

    console.log('✅ Sticky buy buttons initialized');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();