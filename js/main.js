Vue.component('shipping-tab', {
    template: `
    <div>
      <p v-if="premium">Free Shipping</p>
      <p v-else>Cost: $3</p>
    </div>
  `,
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    }
});

Vue.component('details-tab', {
    template: `
    <div>
      <p>Product Details:</p>
      <ul>
        <li>80% cotton </li>
        <li>  20% polyester  </li>
        <li> Gender-neutral  </li>
      </ul>
    </div>
  `,
    props: {
        details: {
            type: Array,
            required: true
        }
    }
});
let eventBus = new Vue();

Vue.component('product-tabs', {
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Shipping'">
        <shipping-tab :premium="premium"></shipping-tab>
      </div>
      <div v-show="selectedTab === 'Details'">
        <details-tab :details="details"></details-tab>
      </div>
     </div>
`,


    props: {
        reviews: {
            type: Array,
            required: false
        }
    },

    data() {
            return {
                tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
                selectedTab: 'Reviews'  // устанавливается с помощью @click
            }
        },
})


Vue.component('product-review', {
    template: `
          <form class="review-form" @submit.prevent="onSubmit">
           <p v-if="errors.length">
         <b>Please correct the following error(s):</b>
         <ul>
           <li v-for="error in errors">{{ error }}</li>
         </ul>
        </p>
     <p>
       <label for="name">Name:</label>
       <input id="name" v-model="name" placeholder="name">
     </p>
    
     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review"></textarea>
     </p>
    
     <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
     </p>
    
    <p>
      <label for="recommend">Would you recommend this product?</label><br>
      <input type="radio" id="recommend-yes" value="yes" v-model="recommend"> <label for="recommend-yes">Yes</label><br>
      <input type="radio" id="recommend-no" value="no" v-model="recommend"> <label for="recommend-no">No</label>
    </p>
    
     <p>
       <input type="submit" value="Submit"> 
     </p>
    
       </form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],

        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})


Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
        `
});


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: {
            type: Array,
            required: true
        }
    },
        template: `
   <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p> {{ sale }}</p>
            <p v-if="inStock">In stock</p>
            <p v-else>Out of Stock</p>
            <ul>
               <li v-for="detail in details">{{ detail }}</li>
            </ul>
            <p>Shipping: {{ shipping }}</p>
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)">
            </div>

            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>

            <button v-on:click="deleteFromCart" class="deleteFromCart">Delete from cart</button>
                <div>
                    <h2 ><product-tabs :reviews="reviews"></product-tabs></h2>
                                        
                </div>
        </div>
   </div>
 `,
    data() {
        return {
            brand: "Vue Mastery",
            product: "Socks",
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            selectedVariant: 0,
            onSale: true,
            reviews: [],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
            this.variants[this.selectedVariant].variantId);

        },
        deleteFromCart() {
            if (this.cart.length > 0) {
                this.$emit('delete-from-cart', this.cart[this.cart.length - 1]);

            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;

        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if(this.onSale === true) {
                return this.brand + ' ' + this.product + ' on sale';
            }
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 3
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        deleteFromCart(id) {
            let index = this.cart.indexOf(id);
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
        },
    }
})

