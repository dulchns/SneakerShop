import { Cart } from './Cart.js'
import { User } from './User.js'
import { Notification } from './Notification.js'
import { Router } from './Router.js'
import { Store } from './Store.js'
import { createElement } from './app.js'

export class Checkout {
    constructor() {
        this.bill = new Store('bill').getData()
        this.cart = new Store('itemsInCart').getData()
    }

    renderCheckoutPage() {
        const container = createElement('div', 'checkout-container')
        this.renderCheckoutForm(container)
        this.renderOrderInfo(container)
        document.querySelector('.app').append(container)
    }

    renderCheckoutForm(container) {
        const form = createElement('form', 'checkout-form')
        form.id = 'checkout-form'
        const title = document.createElement('h2', null, 'Billing details')

        const fieldCreate = (type, placeholder, required) =>  {
            const field = document.createElement('input')
            field.classList.add('checkout-input')
            field.type = type
            field.placeholder = placeholder
            field.required = required

            return field
        }

        const firstNameField = fieldCreate('text', 'First name', true)
        const lastNameField = fieldCreate('text', 'Last name', true)
        const emailField = fieldCreate('email', 'Email',true)
        const telField = fieldCreate('tel','Phone', true)
        const addressCountryField = fieldCreate('text', 'Country/Region', true)
        const addressCityField = fieldCreate('text', 'City', true)
        const addressPostField = fieldCreate('text', 'Postcode/ZIP', true)
        const addressStreetField = fieldCreate('text', 'Street', true)

        form.append(title, firstNameField, lastNameField, 
                    emailField, telField, addressCountryField, 
                    addressCityField, addressPostField, addressStreetField)
        form.addEventListener('submit', (evt) => {
            evt.preventDefault()
            Object.values(evt.target.elements).forEach(el => el.disabled = true)
            this.completeOrder()
            setTimeout(() => new Router(null, '/').route(), 1000)
        })
        container.append(form)
    }

    renderOrderInfo(container) {
        const info = createElement('aside', 'order-info')
        const h2 = createElement('h2', null, 'Your order')
        const orderList = createElement('ul')
        const orderData = this.cart
        const orderElements = orderData.map(el => {
            const li = createElement('li', 'order-item')
            const item = el[0]
            const qty = el[1]
            const text = createElement('p', null, `${item.brand} ${item.model} x ${qty}`)
            const price = createElement('p', null, `$${item.price * qty}`)
            li.append(text, price)
            return li
        })

        orderList.append(...orderElements)

        const finalList = createElement('ul', 'order-final')

        const createLi = (text, price) => {
            const li = createElement('li')
            const textP = createElement('p', null, text)
            const priceP = createElement('p', null, price)
            li.append(textP, priceP)
            return li
        }

        const { subTotal, tax, taxSum, delivery, total } = JSON.parse(localStorage.getItem('bill'))
        const subPrice = createLi('Subtotal:', `$${subTotal}`)
        const deliveryPrice = createLi('Delivery:', `$${delivery}`)
        const taxPrice = createLi(`Tax: ${tax}%`, `$${taxSum}`)
        const totalPrice = createLi('Total:', `$${total}`)
        
        finalList.append(subPrice, deliveryPrice, taxPrice, totalPrice)

        const checkoutBtn = createElement('button', 'checkout-btn', 'Place order')
        checkoutBtn.type = 'submit'
        checkoutBtn.setAttribute('form', 'checkout-form')

        info.append(h2, orderList, finalList, checkoutBtn)
        container.append(info)
    }

    completeOrder() {
        const form = document.querySelector('.checkout-form')
        const billingData = Object.values(form.elements).reduce((obj, prop) => {
            if(prop.placeholder) obj[prop.placeholder] = prop.value
            return obj
        }, {})

        const generateOrderId = () => {
            const lastOrder = Number(new Store('lastorder').getData()?.id || 0)
            let newId = (lastOrder + 1).toString()
            return newId.padStart(7 - newId.length, '0')
        } 

        const orderData = {'shoppings': this.cart, 'bill': this.bill}

        const date = new Date()
        const dateCorrector = (val) => {
            if(val < 10) return '0' + val
            else return val
        }

        const hours = dateCorrector(date.getHours())
        const minutes = dateCorrector(date.getMinutes())
        const day = dateCorrector(date.getDate())
        const month = dateCorrector(date.getMonth() + 1)
        const year = dateCorrector(date.getFullYear())
        const completeOrder = { 'id': generateOrderId(),
                                'date': `${hours}:${minutes} ${day}.${month}.${year}`,
                                 ...orderData, 
                                 'data': billingData }
        const loggedUserStore = new Store('loggedInUser')
        const userStore = new Store('users')
        const loggedUser = loggedUserStore.getData()
        const users = userStore.getData().filter(user => user.login !== loggedUser.login)
        loggedUser.orders.push(completeOrder)
        users.push(loggedUser)
        loggedUserStore.setData(loggedUser)
        new Store('lastorder').setData(completeOrder)
        new Store('bill').remove()
        userStore.setData(users)
        new Cart().clearAll()
        new Notification('Order successful!').render(document.body, 'pop', 'success')
    }
}
