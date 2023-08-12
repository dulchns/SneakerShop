import { Cart } from "./Cart.js"
import { Router } from "./Router.js"
import { Wishlist } from "./Wishlist.js"

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
            shopContainer = document.createElement('div')
            shopContainer.classList.add('shop-items')
            document.querySelector('.app').append(shopContainer)
        }
        
        const card = document.createElement('div')
        card.classList.add('item-card')

        const cardImage = document.createElement('img')
        cardImage.classList.add('item-image')
        cardImage.src = item.image

        const titleContainer = document.createElement('div')
        titleContainer.classList.add('title-container')

        const cardTitle = document.createElement('p')
        cardTitle.textContent = `${item.brand} ${item.model}`
        cardTitle.classList.add('item-title')

        const cardPrice = document.createElement('p')
        cardPrice.textContent = `$${item.price}`
        cardPrice.classList.add('item-price')

        const btnContainer = document.createElement('div')
        btnContainer.classList.add('btn-container')

        const addToCartContainer = document.createElement('div')
        addToCartContainer.classList.add('add-to-cart')        
        const addToCartBtn = document.createElement('img')
        addToCartBtn.src = '/images/add-to-cart.svg'
        addToCartContainer.append(addToCartBtn)

        const addToCompareContainer = document.createElement('div')
        addToCompareContainer.classList.add('add-to-compare')
        const addToCompareBtn = document.createElement('img')
        addToCompareBtn.src = '/images/to-compare.svg'
        addToCompareContainer.append(addToCompareBtn)

        const wishlistContainer = document.createElement('div')
        wishlistContainer.classList.add('add-to-wishlist')
        const addToWishlistBtn = document.createElement('img')

        if(Wishlist.getWishlistData().find(el => el.id === item.id)) addToWishlistBtn.src = '/images/in-wishlist.svg'
        else addToWishlistBtn.src = '/images/non-wishlist.svg'

        wishlistContainer.append(addToWishlistBtn)
        
        cardImage.addEventListener('click', () => Router.route(this, `/catalog?id=${item.id}`))
        cardTitle.addEventListener('click', () => Router.route(this, `/catalog?id=${item.id}`))
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

        const bottomContainer = document.createElement('div')
        bottomContainer.classList.add('card-bottom')
        
        btnContainer.append(addToCartContainer, addToCompareContainer, wishlistContainer)
        bottomContainer.append(cardPrice, titleContainer, btnContainer)
        card.append(cardImage, cardTitle, bottomContainer)
        shopContainer.append(card)

        return card
    }

    static renderItemPage(item) {
        const container = document.createElement('div')
        container.classList.add('shop-item')

        if(!item) {
            container.innerHTML = 'Product not found!'
            return
        }

        const imgBox = document.createElement('div')
        imgBox.classList.add('img-item-box')

        const image = document.createElement('img')
        image.src = item.image

        imgBox.append(image)

        const aboutBox = document.createElement('div')
        aboutBox.classList.add('about-item-box')

        const title = document.createElement('h2')
        title.textContent = `${item.brand} ${item.model}`

        const price = document.createElement('p')
        price.textContent = `$${item.price}`

        const sex = document.createElement('p')
        sex.textContent = `${item.for}\`s Shoes`

        const description = document.createElement('p')
        description.textContent = item.description

        const btnBox = document.createElement('div')
        btnBox.classList.add('btn-box')

        const addToCartBtn = document.createElement('button')
        addToCartBtn.classList.add('tocart-item')
        addToCartBtn.textContent = 'Add to cart'

        const addToCompareBtn = document.createElement('button')
        addToCompareBtn.classList.add('tocompare-item')
        addToCompareBtn.textContent = 'Add to compare'

        const toWishListBtn = document.createElement('button')
        toWishListBtn.classList.add('towishlist-item')
        toWishListBtn.textContent = 'To wishlist'

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