import { Router } from './Router.js'
import { Cart } from './Cart.js'
import { User } from './User.js'
import { Notification } from './Notification.js'
import { createElement } from './app.js'

export class Wishlist {
    static getWishlistData() {
            const wishlistData = JSON.parse(localStorage.getItem('wishlist'))
            if(wishlistData) return wishlistData
            else return []
    }

    static addToWishlist(item) {
        const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'))
        let wishlist = Wishlist.getWishlistData()
        wishlist.push(item)

        if(loggedUser) {
            loggedUser.wishlist = wishlist
            let users = User.getUsers()
            users = users.filter(el => el.id !== loggedUser.id)
            users.push(loggedUser)
            localStorage.setItem('loggedInUser', JSON.stringify(loggedUser))
            localStorage.setItem('users', JSON.stringify(users))
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }

    static removeFromWishlist(item) {
        let wishlist = Wishlist.getWishlistData()
        wishlist = wishlist.filter(el => el.id !== item.id)
        const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'))

        if(!wishlist.length) localStorage.removeItem('wishlist')
        else localStorage.setItem('wishlist', JSON.stringify(wishlist))

        if(loggedUser) {
            loggedUser.wishlist = wishlist
            let users = User.getUsers()
            users = users.filter(el => el.id !== loggedUser.id)
            users.push(loggedUser)
            localStorage.setItem('loggedInUser', JSON.stringify(loggedUser))
            localStorage.setItem('users', JSON.stringify(users))
        }
    }

    static renderWishlistPage() {
        const wishlistContainer = createElement('div', 'wishlist')
        const innerContainer = document.createElement('div', 'container')
        const wishlistData = Wishlist.getWishlistData()
        
        if(wishlistData.length === 0) {
            new Notification('Your wishlist is empty :(').render(innerContainer, 'static', 'message')
            const backBtn = createElement('button', 'back-btn', 'Back to shopping!')
            backBtn.addEventListener('click', () => Router.route(this, '/'))
            innerContainer.append(backBtn)
        } else {
            const containerElements = wishlistData.map(el => Wishlist.createWishlistElement(el))
            innerContainer.append(...containerElements)
        }

        wishlistContainer.append(innerContainer)
        document.querySelector('.app').append(wishlistContainer)
    }

    static createWishlistElement(element) {
        const elContainer = createElement('div', 'wishlist-item')
        const elImg = createElement('img', 'wishlist-item-image', null, element.image)
        const elTitle = createElement('p', 'wishlist-item-title', `${element.brand} ${element.model}`)
        const elPrice = createElement('p', 'wishlist-item-price', `$${element.price}`)
        const elAddToCartBtn = createElement('button', 'wishlist-tocart-btn', 'Add to cart')
        elAddToCartBtn.addEventListener('click', () => Cart.addToCart(element))
        const elDelFromWishlistBtn = createElement('span', 'wishlist-del-btn', 'Delete')
        elDelFromWishlistBtn.addEventListener('click', () => {
            Wishlist.removeFromWishlist(element)
            document.querySelector('.app').innerHTML = ''
            Wishlist.renderWishlistPage()
        })

        elContainer.append(elImg, elTitle, elPrice, elAddToCartBtn, elDelFromWishlistBtn)
        return elContainer
    }
}