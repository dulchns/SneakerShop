import { Router } from "./Router.js"
import { Notification } from "./Notification.js"
import { createElement } from "./app.js"

export class Cart {
    static getCartItems() {
        const cartItems = localStorage.getItem('itemsInCart')
        if(cartItems) return JSON.parse(cartItems)
        else return []
    }

    static render() {
        const container = createElement('div', 'cart')
        const cartItems = Cart.getCartItems()

        if(cartItems.length === 0) {
            new Notification('Cart is empty :(').render(container, 'static', 'message')

            const backBtn = createElement('button', 'back-btn', 'Back to shopping!')
            backBtn.addEventListener('click', () => new Router(null, '/').route())
            container.append(backBtn)
            document.querySelector('.app').append(container)
            return
        }

        const table = createElement('table', 'cart-table')
        const thRow = createElement('tr', 'cart-table-header')
        const thNo = createElement('th', null, '№')
        const thProduct = createElement('th', null, 'Product')
        thProduct.colSpan = 2
        const thQty = createElement('th', null, 'Qty')
        const thPrice = createElement('th', null, 'Price')
        const thTotal = createElement('th', null, 'Total')
        thRow.append(thNo, thProduct, thQty, thPrice, thTotal)
        const elements = cartItems.map((el, index) => Cart.createCartElement(el, index + 1))
        table.append(thRow, ...elements)

        const cartToOrderContainer = createElement('div', 'cart-to-order')
        const purchaseBtn = createElement('button', 'purchase-btn', 'Proceed to purchase')

        purchaseBtn.addEventListener('click', () => {
            const subTotal = Cart.total()
            const tax = 0
            const taxSum = subTotal * tax
            const delivery = 25
            const total = subTotal + taxSum + delivery
            localStorage.setItem('bill', JSON.stringify({subTotal, tax, taxSum, delivery, total}))
            new Router(null, '/cart#checkout').route()
        })

        const totalPrice = createElement('p', 'total-price', `Total price: $${Cart.total()}`)
        const clearAllCartBtn = createElement('p', 'clear-cart-btn', 'Clear cart')
        clearAllCartBtn.addEventListener('click', () => {
            Cart.clearAll()
            document.querySelector('.app').innerHTML = ''
            Cart.render()
        })

        cartToOrderContainer.append(totalPrice, purchaseBtn)
        container.append(table, cartToOrderContainer, clearAllCartBtn)
        document.querySelector('.app').append(container)
    }

    static createCartElement(item, index) {
        const { brand, model, price, image } = item[0]
        const elRow = createElement('tr')
        const elNo = createElement('td', 'no-data', `${index}`)
        const elImg = createElement('td', 'img-data')
        const img = createElement('img')
        img.src = image
        elImg.append(img)
        const elProduct = createElement('td', 'title-data', `${brand} ${model}`)
        const elQty = createElement('td', 'qty-data')
        const elPrice = createElement('td', 'price-data', `$${price}`)
        const elTotalPrice = createElement('td', 'price-data', `$${price * item[1]}`)
        const elQtyPlusBtn = createElement('span', null, '+')
        const elQtyMinusBtn = createElement('span', null, '–')
        const elQtyInput = createElement('input')
        elQtyInput.value = item[1]
        elQtyInput.readOnly = true
        elQtyMinusBtn.addEventListener('click', () => {
            if(+elQtyInput.value === 0) return
            const getCartItems = Cart.getCartItems().filter(el => el[0].id !== item[0].id)
            const newValue = --elQtyInput.value
            getCartItems.push([item[0], newValue])
            localStorage.setItem('itemsInCart', JSON.stringify(getCartItems))
            elTotalPrice.textContent = `$${price * elQtyInput.value}`
            document.querySelector('.total-price').textContent = `Total price: $${Cart.total()}`
        })
        elQtyPlusBtn.addEventListener('click', () => {
            if(+elQtyInput.value === 5) return
            const getCartItems = Cart.getCartItems().filter(el => el[0].id !== item[0].id)
            const newValue = ++elQtyInput.value
            getCartItems.push([item[0], newValue])
            localStorage.setItem('itemsInCart', JSON.stringify(getCartItems))
            elTotalPrice.textContent = `$${price * elQtyInput.value}`
            document.querySelector('.total-price').textContent = `Total price: $${Cart.total()}`
        })

        const deleteBtnTd = createElement('td', 'delete-data')
        const deleteBtn = createElement('span', 'delete-from-cart-btn', 'Delete')
        deleteBtn.addEventListener('click', () => {
            Cart.removeFromCart(item)
            document.querySelector('.app').innerHTML = ''
            Cart.render()
        })

        deleteBtnTd.append(deleteBtn)
        elQty.append(elQtyMinusBtn, elQtyInput, elQtyPlusBtn)
        elRow.append(elNo, elImg, elProduct, elQty, elPrice, elTotalPrice, deleteBtnTd)
        return elRow
    }

    static addToCart(item) {
        let getCartItems = Cart.getCartItems()
        let includedItem = getCartItems.find(el => el[0].id === item.id)
    
        if(includedItem && includedItem[1] === 5) return

        getCartItems = getCartItems.filter(el => el[0].id !== item.id)

        if(includedItem) getCartItems.push([item, ++includedItem[1]])
        else getCartItems.push([item, 1])

        localStorage.setItem('itemsInCart', JSON.stringify(getCartItems))
    }

    static removeFromCart(item) {
        let cartItems = Cart.getCartItems()
        cartItems = cartItems.filter(el => el[0].id !== item[0].id)
        
        if(!cartItems.length) localStorage.removeItem('itemsInCart')
        else localStorage.setItem('itemsInCart', JSON.stringify(cartItems))
    }

    static total() {
        return Cart.getCartItems().reduce((curr, prev) => curr + (prev[0].price * prev[1]), 0)
    }

    static clearAll() {
        localStorage.removeItem('itemsInCart')
    }
}