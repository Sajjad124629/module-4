import { products } from "./product.js";
import { cart } from "./cart.js";


//Show Product List
let productListContainer = document.getElementById('product-container');
const cartElement = document.querySelector('ul.products');
const cartCount = document.getElementById('cart-count');
const clearCartBtn = document.getElementById('clear-cart');
const removeCartButtons = document.getElementsByClassName('remove-item');

const ShowProduct = () => {
  cartCount.textContent = cart.getItems().length;
  products.forEach(item => {
    productListContainer.innerHTML += `
    <div class="row p-2 bg-white border rounded m-3">
      <div class="col-md-3 mt-1"><img   style="width: 170px;height: 160px;" class="img-fluid img-responsive rounded product-image" src="${item.img}"></div>
      <div class="col-md-6 mt-1">
        <h5>${item.name}</h5>
      </div>
      <div class="align-items-center align-content-center col-md-3 border-left mt-1">
        <div class="d-flex flex-row align-items-center">
          <h4 class="mr-1" id="product-price">$${item.price}</h4>
        </div>
        <h6 class="text-success">Free shipping</h6>
        <div class="d-flex flex-column mt-4">
          <button class="btn btn-outline-primary btn-sm mt-2 add-to-cart" data-id="${item.id}" type="button">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    `;
  });
}
if (productListContainer)
  ShowProduct();

//Navigate Cart Page

if (document.getElementById('navigate-cart-page')) {
  document.getElementById('navigate-cart-page').addEventListener('click', () => {
    location.href = "cart.html";
  });
}



const addToCartButtons = document.getElementsByClassName('add-to-cart');
Array.from(addToCartButtons).forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.dataset.id;
    console.log(productId);
    cart.addItem(products.find(product => product.id === productId));
    console.log(cart.items);
    cartCount.textContent = cart.items.length;
  });
});



const addEventToRemoveBtn = () => {
  Array.from(removeCartButtons).forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      console.log(productId);
      cart.removeItem(productId);
      console.log(button.parentElement.parentElement);
      button.parentElement.parentElement.remove();
      displayCartItems();
    });
  });


  document.querySelectorAll('input[type="number"]').forEach(quantity => {
    quantity.addEventListener('input', () => {
      const productId = quantity.dataset.id;
      cart.addItemWithQuantity(productId, quantity.value);
      // console.log(productId, quantity.value);
      displayCartItems();
    })
  })
}


if (window.location.href.endsWith('cart.html')) {
  displayCartItems();
}

function displayCartItems() {
  const items = cart.getItems();
  const cartItemCount = document.getElementById('cart-item-count');
  cartItemCount.textContent = items.length;
  if (items.length) {
    clearCartBtn.classList.remove('hidden');
  } else {
    clearCartBtn.classList.add('hidden');
  }
  cartElement.innerHTML = '';

  items.forEach(item => {
    const product = item.product;
    const newItem = document.createElement('li');
    newItem.classList.add('row');
    newItem.innerHTML = `
      <div class="col-md-10 left">
        <div class="thumbnail">
          <a href="#">
            <img style="width: 100px;height: 100px;" src="${product.img}" alt="${product.name}" />
          </a>
        </div>
        <div class="detail">
          <div class="name"><a href="#">${product.name}</a></div>
          <div class="description">${product.description}</div>
          <div class="price">$${product.price}</div>
        </div>
      </div>

      <div class="col-md-2 right">
        <div class="quantity">
          <input type="number" data-id="${product.id}" class="quantity" value="${item.quantity}" min="1" max="10" />
        </div>

        <div class="remove-item remove" data-id="${product.id}">
          <svg version="1.1" class="close" xmlns="//www.w3.org/2000/svg"
            xmlns:xlink="//www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 60"
            enable-background="new 0 0 60 60" xml:space="preserve">
            <polygon
              points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812">
            </polygon>
          </svg>
        </div>
      </div>
    `
    cartElement.appendChild(newItem);
  }
  );
  addEventToRemoveBtn();
  calculateTotal();
  // cartElement.appendChild(totalAmountElement);
}
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart.clearCart();
    calculateTotal(0);
    displayCartItems();
  })
}

if (document.getElementById('checkPromoCode')) {
  document.getElementById('checkPromoCode').addEventListener('click', () => {
    if (cart.getItems().length) {
      calculateTotal();
    } else {
      alert("No items in cart! Please add an item first.")
    }
  })
}


function calculateTotal(discount) {
  console.log("Clicked", discount);
  const totalAmount = parseFloat(cart.getTotalAmount());
  const totalAmountElement = document.getElementById('total');
  totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
  let discountAmount = 0;
  const promoCode = document.getElementById('promo-code').value;
  if (promoCode === 'Ostad' && cart.getItems().length) {
    discountAmount = parseFloat(cart.getDiscountAmount(!discount ? 15 : 0));
    document.getElementById('discount').textContent = `- $${discountAmount}`;
    document.getElementById('sub-total').textContent = `$${(totalAmount - discountAmount).toFixed(2)}`;
  } else if (!cart.getItems().length) {
    document.getElementById('discount').textContent = `$0.00`;
  }
  document.getElementById('sub-total').textContent = `$${(totalAmount - discountAmount).toFixed(2)}`;
}