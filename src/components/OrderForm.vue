<template>
    <form @submit.prevent="submitOrder">
      <h2>Place Your Order</h2>
  
      <label for="name">Delivery To (Name):</label>
      <input type="text" id="name" v-model="customerName" placeholder="Enter name" required />
  
      <label for="deliveryAddress">Delivery Address:</label>
      <input type="text" id="deliveryAddress" v-model="deliveryAddress" placeholder="Enter delivery address" required />
  
      <label for="deliveryPhoneNumber">Delivery Phone Number:</label>
      <input type="tel" id="deliveryPhoneNumber" v-model="deliveryPhoneNumber" placeholder="Enter phone number" required pattern="[0-9]{10,15}" title="Please enter a valid phone number (10-15 digits)." />
  
      <!-- Product Selection -->
      <div class="product-selection">
        <label for="product">Select Product:</label>
        <select id="product" v-model="selectedProduct" @change="updateSelectedProduct">
          <option disabled value="">Select a product</option>
          <option v-for="product in products" :value="product.name" :key="product.id">
            {{ product.name }} - {{ product.price }}
          </option>
        </select>
  
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" v-model.number="selectedQuantity" min="1" />
  
        <button type="button" @click="addToCart">Add to Cart</button>
      </div>
  
      <!-- Cart Display -->
      <div class="cart">
        <h3>Cart</h3>
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <p>{{ item.product }} - {{ item.quantity }} x {{ item.price }} Naira</p>
          <button type="button" @click="removeFromCart(index)">Remove Item</button>
          <button type="button" @click="decrementQuantity(index)">-</button>
          <button type="button" @click="incrementQuantity(index)">+</button>
        </div>
        <div class="cart-summary">
          <p v-if="totalAmount > 0">Total Amount: {{ totalAmount }} Naira</p>
        </div>
      </div>
  
      <!-- Order Summary -->
      <div class="order-summary">
        <button type="submit">Submit Order</button>
      </div>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        customerName: '',
        deliveryAddress: '',
        deliveryPhoneNumber: '',
        selectedProduct: '',
        selectedQuantity: 1,
        cartItems: [],
        products: [
          { id: 1, name: 'Grilled Guineafowl', price: '8,000 Naira' },
          { id: 2, name: 'Grilled Turkey (4pieces)', price: '12,000 Naira' },
        ],
      };
    },
    computed: {
      totalAmount() {
        return this.cartItems.reduce((total, item) => {
          const price = parseInt(item.price.replace(/[^0-9]/g, ''), 10); // Remove non-numeric characters
          return total + (price * item.quantity);
        }, 0).toLocaleString();
      },
    },
    methods: {
      updateSelectedProduct() {
        const product = this.products.find(p => p.name === this.selectedProduct);
        if (product) {
          this.selectedQuantity = 1;
        }
      },
      addToCart() {
        if (!this.selectedProduct) {
          alert('Please select a product.');
          return;
        }
  
        const product = this.products.find(p => p.name === this.selectedProduct);
        if (product) {
          const existingItem = this.cartItems.find(item => item.product === this.selectedProduct);
          if (existingItem) {
            existingItem.quantity += this.selectedQuantity;
          } else {
            this.cartItems.push({
              product: this.selectedProduct,
              quantity: this.selectedQuantity,
              price: product.price,
            });
          }
  
          // Clear the selection after adding to the cart
          this.selectedProduct = '';
          this.selectedQuantity = 1;
        }
      },
      removeFromCart(index) {
        this.cartItems.splice(index, 1);
      },
      decrementQuantity(index) {
        if (this.cartItems[index].quantity > 1) {
          this.cartItems[index].quantity--;
        } else {
          this.removeFromCart(index);
        }
      },
      incrementQuantity(index) {
        this.cartItems[index].quantity++;
      },
      submitOrder() {
        if (!this.customerName || !this.deliveryAddress || !this.deliveryPhoneNumber) {
          alert('Please fill in all required fields.');
          return;
        }
  
        if (this.cartItems.length === 0) {
          alert('Please add at least one item to the cart.');
          return;
        }
  
        const orderDetails = this.cartItems.map(item => {
          return `${item.quantity} x ${item.product} at ${item.price}`;
        }).join('\n');
  
        const message = `*Order Summary:*\n\n` +
                        `*Customer Name:* ${this.customerName}\n` +
                        `*Delivery Address:* ${this.deliveryAddress}\n` +
                        `*Delivery Phone Number:* ${this.deliveryPhoneNumber}\n\n` +
                        `*Items:* \n${orderDetails}\n\n` +
                        `*Total Amount:* ${this.totalAmount} Naira`;
  
        const whatsappUrl = `https://wa.me/+32466405994?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      },
    },
  };
  </script>
  
  <style>
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    margin: auto;
  }
  
  label {
    margin: 10px 0 5px;
  }
  
  input, select, button {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 14px;
  }
  
  .product-selection {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .product-selection label {
    margin-bottom: 5px;
  }
  
  .product-selection select,
  .product-selection input {
    margin-bottom: 10px;
    padding: 8px;
  }
  
  .cart {
    margin-bottom: 20px;
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .cart-item p {
    margin: 0;
  }
  
  .cart-summary {
    margin-top: 10px;
  }
  
  .order-summary {
    margin-top: 20px;
  }
  
  .order-summary button {
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .order-summary button:hover {
    background-color: #0056b3;
  }
  </style>
  