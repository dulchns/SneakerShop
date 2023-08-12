import { User } from "./User.js"
import { ShopItem } from "./ShopItem.js"
import { Cart } from "./Cart.js"
import { Wishlist } from "./Wishlist.js"
import { Checkout } from "./Checkout.js"

export class Router {
    static start() {
        JSON.parse(localStorage.getItem('items')).forEach(item => ShopItem.renderItemCard(item))
    }

    static route(target, link = target.href) {
        window.history.pushState(null, null, link)
        document.querySelector('.app').innerHTML = ''
        Router.getPageData(location.pathname)
    }

    static getPageData(page) {
        switch(page) {
            case '/': 
                Router.start()
            break
            case '/wishlist': 
                Wishlist.renderWishlistPage()
            break
            case '/user': 
                const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'))
                
                const container = document.createElement('div')
                container.classList.add('user-container')
                document.querySelector('.app').append(container)
                
                if(loggedUser) {
                     User.renderUserPage(loggedUser)
                } else {
                    User.signUpFormRender()
                    User.loginFormRender()
                }
            break
            case '/cart': 
                if(location.hash) Checkout.renderCheckoutPage()
                else Cart.render()
            break
            case '/catalog': 
                if(location.search) {
                    const itemId = location.search.slice(4)
                    const item = JSON.parse(localStorage.getItem('items')).find(item => item.id === itemId)
                    ShopItem.renderItemPage(item)
                } else if(location.hash) {
                    JSON.parse(localStorage.getItem('items'))
                        .filter(item => item.for.toLowerCase() === location.hash.slice(1))
                        .forEach(item => ShopItem.renderItemCard(item))   
                }
            break
            case '/about-us':
                document.querySelector('.app').insertAdjacentHTML('beforeend', 
                `<h2 class="about-title">About us<h2/>
                 <p class="about-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                 Integer sodales pulvinar tempor. Proin a lorem felis. Suspendisse et libero dignissim, mollis sem eget, facilisis metus. 
                 Nulla ornare aliquet hendrerit. Proin tincidunt felis accumsan dignissim imperdiet. Sed ut sapien eros. 
                 Cras tincidunt sagittis nulla eu auctor. Duis nec diam lacinia, feugiat velit eu, iaculis odio. 
                 Donec aliquet tristique vulputate. Vestibulum in turpis fringilla, luctus est vitae, facilisis turpis. 
                 Phasellus eget enim eget lectus gravida egestas. Quisque sed urna vel lectus feugiat mattis. 
                 Duis at facilisis leo, porta volutpat turpis.</p>
                 <h2 class="about-title">Our partners</h3>
                 <div class="about-partners">
                    <a href="nike.com">
                        <img src="/images/nike-partners.png">
                    </a>
                    <a href="adidas.com">
                        <img src="/images/adidas-partners.png">
                    </a>
                    <a href="puma.com">
                        <img src="/images/puma-partners.png">
                    </a>
                    <a href="reebok.com">
                        <img src="/images/reebok-partners.png">
                    </a>
                </div>`)
            break
        }
    }
}