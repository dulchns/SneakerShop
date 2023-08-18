import { Cart } from "./Cart.js"
import { Router } from "./Router.js"
import { Wishlist } from "./Wishlist.js"
import { createElement } from "./app.js"

export class ShopItem {
    constructor({ id, brand, model, size, sex, price, image, description }) {
        this.id = id
        this.brand = brand
        this.model = model 
        this.size = size
        this.sex = sex
        this.price = price
        this.image = image
        this.description = description
    }

    renderItemCard() {
        let shopContainer = document.querySelector('.shop-items')
        if(!shopContainer) {
            shopContainer = createElement('div', 'shop-items')
            document.querySelector('.app').append(shopContainer)
        }
        
        const card = createElement('div', 'item-card')
        const cardImage = createElement('img', 'item-image', null, this.image)
        const titleContainer = createElement('div', 'title-container')
        const cardTitle = createElement('p', 'item-title', `${this.brand} ${this.model}`)
        const cardPrice = createElement('p', 'item-price', `$${this.price}`)
        const btnContainer = createElement('div', 'btn-container')
        const addToCartContainer = createElement('div', 'add-to-cart')     
        const addToCartBtn = createElement('img', null, null, '/images/add-to-cart.svg')
        addToCartContainer.append(addToCartBtn)

        const addToCompareContainer = createElement('div', 'add-to-compare')
        const addToCompareBtn = createElement('img', null, null, '/images/to-compare.svg')
        addToCompareContainer.append(addToCompareBtn)

        const wishlistContainer = createElement('div', 'add-to-wishlist')
        const addToWishlistBtn = createElement('img')
        const wishlist = new Wishlist()

        if(wishlist.store.getData().find(el => el.id === this.id)) addToWishlistBtn.src = '/images/in-wishlist.svg'
        else addToWishlistBtn.src = '/images/non-wishlist.svg'

        wishlistContainer.append(addToWishlistBtn)
        
        cardImage.addEventListener('click', () => new Router(null, `/catalog?id=${this.id}`).route())
        cardTitle.addEventListener('click', () => new Router(null, `/catalog?id=${this.id}`).route())
        addToCartBtn.addEventListener('click', () => new Cart().addToCart(this))
        addToWishlistBtn.addEventListener('click', () => {
            if(!wishlist.store.getData().find(el => el.id === this.id)) {
                wishlist.addToWishlist(this)
                addToWishlistBtn.src = '/images/in-wishlist.svg'
            } else {
                wishlist.removeFromWishlist(this)
                addToWishlistBtn.src = '/images/non-wishlist.svg'
            }
        
        })

        const bottomContainer = createElement('div', 'card-bottom')
        
        btnContainer.append(addToCartContainer, addToCompareContainer, wishlistContainer)
        bottomContainer.append(cardPrice, titleContainer, btnContainer)
        card.append(cardImage, cardTitle, bottomContainer)
        shopContainer.append(card)

        return card
    }

    renderItemPage() {
        const container = createElement('div', 'shop-item')

        if(!this) {
            container.innerHTML = 'Product not found!'
            return
        }

        const imgBox = createElement('div','img-item-box')
        const image = createElement('img', null, null, this.image)
        imgBox.append(image)
        const aboutBox = createElement('div', 'about-item-box')
        const title = createElement('h2', null, `${this.brand} ${this.model}`)
        const price = createElement('p', null, `$${this.price}`)
        const sex = createElement('p', null, `${this.sex}\`s Shoes`)
        const description = createElement('p', null, this.description)
        const btnBox = createElement('div', 'btn-box')
        const addToCartBtn = createElement('button', 'tocart-item', 'Add to cart')
        const addToCompareBtn = createElement('button', 'tocompare-item', 'Add to compare')
        const toWishListBtn = createElement('button', 'towishlist-item', 'To wishlist')
        addToCartBtn.addEventListener('click', () => new Cart().addToCart(this))
        const wishlist = new Wishlist()
        toWishListBtn.addEventListener('click', () => {
            if(!wishlist.store.getData().find(el => el.id === this.id)) {
                wishlist.addToWishlist(this)
                toWishListBtn.src = '/images/in-wishlist.svg'
            } else {
                wishlist.removeFromWishlist(this)
                toWishListBtn.src = '/images/non-wishlist.svg'
            }
        })

        btnBox.append(addToCartBtn, addToCompareBtn, toWishListBtn)
        aboutBox.append(title, sex, description, price, btnBox)

        container.append(imgBox, aboutBox)
        document.querySelector('.app').append(container)
    }
}