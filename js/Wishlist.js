import { Router } from './Router.js'
import { Cart } from './Cart.js'
import { User } from './User.js'
import { Notification } from './Notification.js'
import { Store } from './Store.js'
import { createElement } from './app.js'

export class Wishlist {
    constructor() {
        this.store = new Store('wishlist')
    }
    
    addToWishlist(item) {
        const loggedUserStore = new Store('loggedInUser')
        const loggedUser = loggedUserStore.getData()
        let wishlist = this.store.getData()
        wishlist.push(item)

        if(loggedUser.login) {
            const userStore = new Store('users')
            loggedUser.wishlist = wishlist
            let users = userStore.getData()
            users = users.filter(el => el.id !== loggedUser.id)
            users.push(loggedUser)
            loggedUserStore.setData(loggedUser)
            userStore.setData(users)
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }

    removeFromWishlist(item) {
        let wishlist = this.store.getData()
        wishlist = wishlist.filter(el => el.id !== item.id)
        const loggedUserStore = new Store('loggedInUser')
        const loggedUser = loggedUserStore.getData()

        if(!wishlist.length) this.store.remove()
        else this.store.setData(wishlist)

        if(loggedUser.login) {
            const userStore = new Store('users')
            loggedUser.wishlist = wishlist
            let users = userStore.getData()
            users = users.filter(el => el.id !== loggedUser.id)
            users.push(loggedUser)
            loggedUserStore.setData(loggedUser)
            userStore.setData(users)
        }
    }

    renderWishlistPage() {
        const wishlistContainer = createElement('div', 'wishlist')
        const innerContainer = createElement('div', 'container')
        const wishlistData = this.store.getData()
        
        if(wishlistData.length === 0) {
            new Notification('Your wishlist is empty :(').render(innerContainer, 'static', 'message')
            const backBtn = createElement('button', 'back-btn', 'Back to shopping!')
            backBtn.addEventListener('click', () => new Router(null, '/').route())
            innerContainer.append(backBtn)
        } else {
            const containerElements = wishlistData.map(el => this.createWishlistElement(el))
            innerContainer.append(...containerElements)
        }

        wishlistContainer.append(innerContainer)
        document.querySelector('.app').append(wishlistContainer)
    }

    createWishlistElement(element) {
        const elContainer = createElement('div', 'wishlist-item')
        const elImg = createElement('img', 'wishlist-item-image', null, element.image)
        const elTitle = createElement('p', 'wishlist-item-title', `${element.brand} ${element.model}`)
        const elPrice = createElement('p', 'wishlist-item-price', `$${element.price}`)
        const elAddToCartBtn = createElement('button', 'wishlist-tocart-btn', 'Add to cart')
        elAddToCartBtn.addEventListener('click', () => new Cart().addToCart(element))
        const elDelFromWishlistBtn = createElement('span', 'wishlist-del-btn', 'Delete')
        elDelFromWishlistBtn.addEventListener('click', () => {
            this.removeFromWishlist(element)
            document.querySelector('.app').innerHTML = ''
            this.renderWishlistPage()
        })

        elContainer.append(elImg, elTitle, elPrice, elAddToCartBtn, elDelFromWishlistBtn)
        return elContainer
    }
}