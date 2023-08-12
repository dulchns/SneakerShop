import { Router } from './Router.js'
import { Cart } from './Cart.js'
import { User } from './User.js'
import { Notification } from './Notification.js'

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
        const wishlistContainer = document.createElement('div')
        wishlistContainer.classList.add('wishlist')
        const innerContainer = document.createElement('div')
        innerContainer.classList.add('container')
    
        const wishlistData = Wishlist.getWishlistData()
        
        if(wishlistData.length === 0) {
            new Notification('Your wishlist is empty :(').render(innerContainer, 'static', 'message')
            const backBtn = document.createElement('button')
            backBtn.textContent = 'Back to shopping!'
            backBtn.classList.add('back-btn')
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
        const elContainer = document.createElement('div')
        elContainer.classList.add('wishlist-item')

        const elImg = document.createElement('img')
        elImg.classList.add('wishlist-item-image')
        elImg.src = element.image

        const elTitle = document.createElement('p')
        elTitle.classList.add('wishlist-item-title')
        elTitle.textContent = `${element.brand} ${element.model}`

        const elPrice = document.createElement('p')
        elPrice.classList.add('wishlist-item-price')
        elPrice.textContent = `$${element.price}`

        const elAddToCartBtn = document.createElement('button')
        elAddToCartBtn.classList.add('wishlist-tocart-btn')
        elAddToCartBtn.textContent = 'Add to cart'
        elAddToCartBtn.addEventListener('click', () => Cart.addToCart(element))

        const elDelFromWishlistBtn = document.createElement('span')
        elDelFromWishlistBtn.classList.add('wishlist-del-btn')
        elDelFromWishlistBtn.textContent = 'Delete'
        elDelFromWishlistBtn.addEventListener('click', () => {
            Wishlist.removeFromWishlist(element)
            document.querySelector('.app').innerHTML = ''
            Wishlist.renderWishlistPage()
        })

        elContainer.append(elImg, elTitle, elPrice, elAddToCartBtn, elDelFromWishlistBtn)
        return elContainer
    }
}