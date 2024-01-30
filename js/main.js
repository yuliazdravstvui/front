let app = new Vue({
    el: '#app',
    data: {
        brand: "Vue Mastery",
        product: "Socks",
        altText: "A pair of socks",
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        selectedVariant: 0,
        onSale: true,
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
        cart: 0,
    },
    methods: {
        addToCart() {
            this.cart += 1
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

    }


})

