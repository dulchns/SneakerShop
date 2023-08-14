import { Cart } from "./Cart.js"
import { Router } from "./Router.js"
import { Wishlist } from "./Wishlist.js"
import { createElement } from "./app.js"

export class ShopItem {
    constructor({ id, brand, model, size, sex, price, image }) {
        this.id = id
        this.brand = brand
        this.model = model 
        this.size = size
        this.sex = sex
        this.price = price
        this.image = image
    }

    static renderItemCard(item) {
        let shopContainer = document.querySelector('.shop-items')
        if(!shopContainer) {
            shopContainer = createElement('div', 'shop-items')
            document.querySelector('.app').append(shopContainer)
        }
        
        const card = createElement('div', 'item-card')
        const cardImage = createElement('img', 'item-image', null, item.image)
        const titleContainer = createElement('div', 'title-container')
        const cardTitle = createElement('p', 'item-title', `${item.brand} ${item.model}`)
        const cardPrice = createElement('p', 'item-price', `$${item.price}`)
        const btnContainer = createElement('div', 'btn-container')
        const addToCartContainer = createElement('div', 'add-to-cart')     
        const addToCartBtn = createElement('img', null, null, '/images/add-to-cart.svg')
        addToCartContainer.append(addToCartBtn)

        const addToCompareContainer = createElement('div', 'add-to-compare')
        const addToCompareBtn = createElement('img', null, null, '/images/to-compare.svg')
        addToCompareContainer.append(addToCompareBtn)

        const wishlistContainer = createElement('div', 'add-to-wishlist')
        const addToWishlistBtn = createElement('img')

        if(Wishlist.getWishlistData().find(el => el.id === item.id)) addToWishlistBtn.src = '/images/in-wishlist.svg'
        else addToWishlistBtn.src = '/images/non-wishlist.svg'

        wishlistContainer.append(addToWishlistBtn)
        
        cardImage.addEventListener('click', () => new Router(null, `/catalog?id=${item.id}`).route())
        cardTitle.addEventListener('click', () => new Router(null, `/catalog?id=${item.id}`).route())
        addToCartBtn.addEventListener('click', () => Cart.addToCart(item))
        addToWishlistBtn.addEventListener('click', () => {
            if(!Wishlist.getWishlistData().find(el => el.id === item.id)) {
                Wishlist.addToWishlist(item)
                addToWishlistBtn.src = '/images/in-wishlist.svg'
            } else {
                Wishlist.removeFromWishlist(item)
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

    static renderItemPage(item) {
        const container = createElement('div', 'shop-item')

        if(!item) {
            container.innerHTML = 'Product not found!'
            return
        }

        const imgBox = createElement('div','img-item-box')
        const image = createElement('img', null, null, item.image)
        imgBox.append(image)
        const aboutBox = createElement('div', 'about-item-box')
        const title = createElement('h2', null, `${item.brand} ${item.model}`)
        const price = createElement('p', null, `$${item.price}`)
        const sex = createElement('p', null, `${item.for}\`s Shoes`)
        const description = createElement('p', null, item.description)
        const btnBox = createElement('div', 'btn-box')
        const addToCartBtn = createElement('button', 'tocart-item', 'Add to cart')
        const addToCompareBtn = createElement('button', 'tocompare-item', 'Add to compare')
        const toWishListBtn = createElement('button', 'towishlist-item', 'To wishlist')
        addToCartBtn.addEventListener('click', () => Cart.addToCart(item))
        toWishListBtn.addEventListener('click', () => {
            if(!Wishlist.getWishlistData().find(el => el.id === item.id)) {
                Wishlist.addToWishlist(item)
                addToWishlistBtn.src = '/images/in-wishlist.svg'
            } else {
                Wishlist.removeFromWishlist(item)
                addToWishlistBtn.src = '/images/non-wishlist.svg'
            }
        })

        btnBox.append(addToCartBtn, addToCompareBtn, toWishListBtn)
        aboutBox.append(title, sex, description, price, btnBox)

        container.append(imgBox, aboutBox)
        document.querySelector('.app').append(container)
    }
}