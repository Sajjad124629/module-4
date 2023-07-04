const cart = {
  items: [],
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(this.items));
  },

  addItemWithQuantity(productId, quantity) {
    const existingItem = this.items.find(item => item.product.id === productId);
    if (existingItem) {
      existingItem.quantity = quantity;
    }
    localStorage.setItem('cart', JSON.stringify(this.items));
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(this.items));
  },

  getItems() {
    this.items = JSON.parse(localStorage.getItem('cart'));
    if (!this.items) this.items = [];
    return this.items;
  },

  getTotalAmount() {
    let totalAmount = 0;
    this.items.forEach(item => {
      totalAmount += parseFloat(item.product.price) * item.quantity;
    });
    return totalAmount.toFixed(2);
  },

  getDiscountAmount(percentage=10){
    let discountAmount = 0;
    this.items.forEach(item => {
      discountAmount += parseFloat(item.product.price) * item.quantity;
    });
    return (discountAmount*percentage/100).toFixed(2);
  },

  clearCart() {
    this.items = [];
    localStorage.setItem('cart', JSON.stringify(this.items));
  },
};

export { cart };