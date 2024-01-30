Vue.component('product-tabs', {
    template: `
   <div>
     <span class="tab" v-for="(tab, index) in tabs" :key="index">{{ tab }}</span>
   </div>
 `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review']
        }
    }
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
            this.errors = [];
            if (!this.name) this.errors.push("Name required.");
            if (!this.review) this.errors.push("Review required.");
            if (!this.rating) this.errors.push("Rating required.");
            if (!this.recommend) this.errors.push("Recommendation required.");

            if (this.errors.length === 0) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
            }
            this.$emit('review-submitted', productReview);
            this.name = null;
            this.review = null;
            this.rating = null;
            this.recommend = null;

        },
        addReview(productReview) {
            this.reviews.push(productReview)
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
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews yet.</p>
                    <ul>
                        <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        </li>
                    </ul>
                    
                </div>

            <product-review @review-submitted="addReview"></product-review>
            

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
                return 2.99
            }
        }
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
        }
    }
})

