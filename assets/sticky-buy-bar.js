/* Sticky buy bar connector: forward sticky bar clicks to the real product form.
   This keeps analytic hooks and dynamic-checkout behavior consistent. */
document.addEventListener('click', function(e){
  var btn = e.target.closest && (e.target.closest('[data-action="sticky-add"]') || e.target.closest('[data-action="sticky-buy-now"]'));
  if (!btn) return;
  
  var action = btn.getAttribute('data-action');
  var targetId = btn.getAttribute('data-target') || btn.dataset.target;
  if (!targetId) return;
  
  // Find the form by id or by data attribute.
  var form = document.getElementById(targetId) || document.querySelector('[data-product-form-id="'+targetId+'"]') || document.querySelector('#'+targetId);
  if (!form) {
    // fallback: try any product form on the page
    form = document.querySelector('product-form form') || document.querySelector('form[data-type="add-to-cart-form"]') || document.querySelector('form[action*="/cart/add"]');
  }
  if (!form) return;
  
  if (action === 'sticky-add') {
    // Try to click the real add button inside the form
    var addButton = form.querySelector('button[name="add"]') || form.querySelector('[type="submit"]');
    if (addButton) {
      addButton.click();
    } else {
      // as a fallback submit the form
      try { form.submit(); } catch(e) { /* ignore */ }
    }
  } else if (action === 'sticky-buy-now') {
    // For buy now, we need to add to cart and redirect to checkout
    var addButton = form.querySelector('button[name="add"]') || form.querySelector('[type="submit"]');
    if (addButton) {
      // First add to cart
      addButton.click();
      
      // Then redirect to checkout after a short delay
      setTimeout(function() {
        window.location.href = '/checkout';
      }, 500);
    } else {
      // Fallback: submit form and redirect
      try { 
        form.submit();
        setTimeout(function() {
          window.location.href = '/checkout';
        }, 500);
      } catch(e) { /* ignore */ }
    }
  }
});

/* Hide sticky bar when product is sold out (detect presence of sold-out class in form) */
function _updateStickyState(){
  var sticky = document.querySelector('.sticky-buy');
  if (!sticky) return;
  var form = document.getElementById(sticky.getAttribute('data-product-form-id')) || document.querySelector('form[data-type="add-to-cart-form"]') || document.querySelector('form[action*="/cart/add"]');
  if (!form) return;
  var sold = !!form.querySelector('.sold-out, .product-form__submit[disabled]');
  
  // Update both buttons' disabled state
  var addButton = sticky.querySelector('.sticky-buy__add');
  var buyNowButton = sticky.querySelector('.sticky-buy__buy-now');
  
  if (sold) {
    sticky.classList.add('is-sold-out');
    if (addButton) addButton.disabled = true;
    if (buyNowButton) buyNowButton.disabled = true;
  } else {
    sticky.classList.remove('is-sold-out');
    if (addButton) addButton.disabled = false;
    if (buyNowButton) buyNowButton.disabled = false;
  }
}
document.addEventListener('DOMContentLoaded', _updateStickyState);
document.addEventListener('product:variant:change', _updateStickyState);

/* Handle sticky Buy Now button in sticky bar */
document.addEventListener('DOMContentLoaded', function() {
  var stickyBuyNowForm = document.querySelector('#sticky-buy-now-form');
  if (!stickyBuyNowForm) return;
  
  // Update variant ID when product variant changes
  function updateStickyBuyNowVariant() {
    var mainForm = document.querySelector('form[data-type="add-to-cart-form"]');
    if (mainForm) {
      var mainVariantInput = mainForm.querySelector('input[name="id"]');
      var stickyVariantInput = stickyBuyNowForm.querySelector('input[name="id"]');
      
      if (mainVariantInput && stickyVariantInput) {
        stickyVariantInput.value = mainVariantInput.value;
      }
    }
  }
  
  // Listen for variant changes
  document.addEventListener('product:variant:change', updateStickyBuyNowVariant);
  
  // Initial update
  updateStickyBuyNowVariant();
});
