import { Router } from "./Router.js"
import { Notification } from "./Notification.js"

export class Cart {
    static getCartItems() {
        const cartItems = localStorage.getItem('itemsInCart')
        if(cartItems) return JSON.parse(cartItems)
        else return []
    }

    static render() {
        const container = document.createElement('div')
        container.classList.add('cart')
        const cartItems = Cart.getCartItems()

        if(cartItems.length === 0) {
            new Notification('Cart is empty :(').render(container, 'static', 'message')

            const backBtn = document.createElement('button')
            backBtn.textContent = 'Back to shopping!'
            backBtn.classList.add('back-btn')
            backBtn.addEventListener('click', () => Router.route(this, '/'))

            container.append(backBtn)
            document.querySelector('.app').append(container)
            return
        }

        const table = document.createElement('table')
        table.classList.add('cart-table')

        const thRow = document.createElement('tr')
        thRow.classList.add('cart-table-header')
        const thNo = document.createElement('th')
        thNo.textContent = '№'
        const thImg = document.createElement('th')
        const thProduct = document.createElement('th')
        thProduct.textContent = 'Product'
        const thQty = document.createElement('th')
        thQty.textContent = 'Qty'
        const thPrice = document.createElement('th')
        thPrice.textContent = 'Price'
        const thTotal = document.createElement('th')
        thTotal.textContent = 'Total'
        thRow.append(thNo, thImg, thProduct, thQty, thPrice, thTotal)
        const elements = cartItems.map((el, index) => Cart.createCartElement(el, index + 1))
        table.append(thRow, ...elements)

        const cartToOrderContainer = document.createElement('div')
        cartToOrderContainer.classList.add('cart-to-order')

        const purchaseBtn = document.createElement('button')
        purchaseBtn.classList.add('purchase-btn')
        purchaseBtn.textContent = 'Proceed to purchase'
        purchaseBtn.addEventListener('click', () => {
            const subTotal = Cart.total()
            const tax = 0
            const taxSum = subTotal * tax
            const delivery = 25
            const total = subTotal + taxSum + delivery
            localStorage.setItem('bill', JSON.stringify({subTotal, tax, taxSum, delivery, total}))
            Router.route(this, '/cart#checkout')
        })

        const totalPrice = document.createElement('p')
        totalPrice.classList.add('total-price')
        totalPrice.textContent = `Total price: $${Cart.total()}`

        const clearAllCartBtn = document.createElement('p')
        clearAllCartBtn.classList.add('clear-cart-btn')
        clearAllCartBtn.textContent = 'Clear cart'
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

        const elRow = document.createElement('tr')
        const elNo = document.createElement('td')
        elNo.classList.add('no-data')
        const elImg = document.createElement('td')
        elImg.classList.add('img-data')
        const img = document.createElement('img')
        img.src = image
        elImg.append(img)
        const elProduct = document.createElement('td')
        elProduct.classList.add('title-data')
        const elQty = document.createElement('td')
        elQty.classList.add('qty-data')
        const elPrice = document.createElement('td')
        elPrice.classList.add('price-data')
        const elTotalPrice = document.createElement('td')
        elTotalPrice.classList.add('price-data')

        elNo.textContent = `${index}`
        elProduct.textContent = `${brand} ${model}`
        elPrice.textContent = `$${price}`
        elTotalPrice.textContent = `$${price * item[1]}`

        const elQtyPlusBtn = document.createElement('span')
        elQtyPlusBtn.textContent = '+'
        const elQtyMinusBtn = document.createElement('span')
        elQtyMinusBtn.textContent = '–'
        const elQtyInput = document.createElement('input')
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

        const deleteBtnTd = document.createElement('td')
        deleteBtnTd.classList.add('delete-data')
        const deleteBtn = document.createElement('span')
        deleteBtn.classList.add('delete-from-cart-btn')
        deleteBtn.textContent = 'Delete'
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