import { Cart } from './Cart.js'
import { User } from './User.js'
import { Notification } from './Notification.js'
import { Router } from './Router.js'
import { createElement } from './app.js'

export class Checkout {
    static renderCheckoutPage() {
        const container = createElement('div', 'checkout-container')
        Checkout.renderCheckoutForm(container)
        Checkout.renderOrderInfo(container)
        document.querySelector('.app').append(container)
    }

    static renderCheckoutForm(container) {
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
            Checkout.completeOrder()
            setTimeout(() => Router.route(this, '/'), 1000)
        })
        container.append(form)
    }

    static renderOrderInfo(container) {
        const info = createElement('aside', 'order-info')
        const h2 = createElement('h2', null, 'Your order')
        const orderList = createElement('ul')
        const orderData = Cart.getCartItems()
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

    static completeOrder() {
        const form = document.querySelector('.checkout-form')
        const billingData = Object.values(form.elements).reduce((obj, prop) => {
            if(prop.placeholder) obj[prop.placeholder] = prop.value
            return obj
        }, {})

        const generateOrderId = () => {
            const lastOrder = Number(JSON.parse(localStorage.getItem('lastorder'))?.id || 0)
            let newId = (lastOrder + 1).toString()
            return newId.padStart(7 - newId.length, '0')
        } 

        const orderData = {'shoppings': Cart.getCartItems(), 'bill': JSON.parse(localStorage.getItem('bill'))}

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
        const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'))
        const users = User.getUsers().filter(user => user.login !== loggedUser.login)
        localStorage.setItem('lastorder', JSON.stringify(completeOrder))
        loggedUser.orders.push(completeOrder)
        users.push(loggedUser)
        localStorage.removeItem('bill')
        localStorage.setItem('loggedInUser', JSON.stringify(loggedUser))
        localStorage.setItem('users', JSON.stringify(users))
        
        Cart.clearAll()
        new Notification('Order successful!').render(document.body, 'pop', 'success')
    }
}
