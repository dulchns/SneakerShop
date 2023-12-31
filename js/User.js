import { Notification } from "./Notification.js"
import { createElement } from "./app.js"
import { Store } from "./Store.js"

export class User {
    constructor({login, firstName, password, lastName, email, phone}) {
        this.login = login
        this.password = password
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.phone = phone
        this.wishlist = []
        this.orders = []
    }

    static login(login, password) {
        const allUsers = new Store('users').getData()
        const loginValidate = allUsers.find(user => user.login === login)
    
        if(loginValidate && loginValidate.password === password) {
            new Store('loggedInUser').setData(loginValidate)
            new Store('wishlist').setData(loginValidate.wishlist)
            document.querySelector('.user-container').innerHTML = ''
            new User(loginValidate).renderUserPage()
        }
    }

    static signUp(data) {
        const allUsersStore = new Store('users')
        const allUsers = allUsersStore.getData()
        allUsers.push(new User(data))
        allUsersStore.setData(allUsers)
        User.login(data.login, data.password)
    }

    static createFormField = (type, name, id, placeholder, required) => {
        const field = document.createElement('input')
        field.type = type
        field.name = name
        field.id = id
        field.placeholder = placeholder
        field.required = required
    
        return field
    }
    
    static signUpFormRender = () => {
        const container = document.querySelector('.user-container') 

        const signUpContainer = createElement('div', 'sign-up')
        const signUpTitle = createElement('h2', 'user-form-title', 'Create new account')
        const signUpForm = createElement('form', 'sign-up-form')
        signUpForm.name = 'sign-up-form'
    
        const loginField = User.createFormField('text', 'login', 'login-signupform', "Login", true)
        const nameField = User.createFormField('text', 'firstName', 'name-signupform', 'Name', true)
        const passwordField = User.createFormField('password', 'password', 'password-signupform', 'Password', true)
    
        const submitButton = createElement('input')
        submitButton.type = "submit"
        submitButton.value = "Sign-up"
    
        signUpForm.append(signUpTitle, loginField, nameField, passwordField, submitButton)
        signUpContainer.append(signUpForm)
        container.append(signUpContainer)
    
        signUpForm.addEventListener('submit', (evt) => {
            evt.preventDefault() 
            const users = new Store('users').getData()
            const userData = Object.values(signUpForm.elements).slice(0,3).reduce((res, prev) => {
                res[prev.name] = prev.value
                return res
            }, {})
            if(!users.find(el => el.login === userData.login)) {
                User.signUp(userData)
                new Notification('Signed up successfully!').render(document.body, 'pop', 'success')
            } else new Notification('User already registered!').render(document.body, 'pop', 'error')
        })
    }
    
    static loginFormRender = () => {
        const  container = document.querySelector('.user-container') 

        const loginContainer = createElement('div', 'login')
        const loginTitle = createElement('h2', 'user-form-title', 'Login with existing account')
        const loginForm = createElement('form', 'login-form')
        loginForm.name = 'login-form'
    
        const loginField = User.createFormField('text', 'login', 'login-loginform', "Login", true)
        const passwordField = User.createFormField('password', 'password', 'password-loginform', 'Password', true)
    
        const submitButton = createElement('input')
        submitButton.type = "submit"
        submitButton.value = "Login"
    
        loginForm.append(loginTitle, loginField, passwordField, submitButton)
        loginContainer.append(loginForm)
        container.append(loginContainer)
    
        loginForm.addEventListener('submit', (evt) => {
            evt.preventDefault()
            const userData = Object.values(loginForm.elements).slice(0,2).map(el => el.value)
            User.login(...userData)
            if(new Store('loggedInUser').getData()) new Notification('Login successful!').render(document.body, 'pop', 'success')
            else new Notification('Incorrect username or password!').render(document.body, 'pop', 'error')
        })
    }

    renderUserPage() {
        const container = document.querySelector('.user-container')

        const panelContainer = createElement('div', 'user-panel')
        panelContainer.append(...User.userPanel())
        
        const userCard = createElement('div', 'user-card')
        this.userPage(null, userCard)
        
        Array.from(panelContainer.children).forEach(btn => {
            btn.addEventListener('click', (evt) => {
                userCard.innerHTML = ''
                if(evt.target.dataset.render !== 'log-out') {
                    this.userPage(evt.target.dataset.render, userCard)
                } else {
                    new Store('loggedInUser').remove()
                    new Store('wishlist').remove()
                    document.querySelector('.user-container').innerHTML = ''
                    User.signUpFormRender()
                    User.loginFormRender()
                }
            })
        })

        container.append(panelContainer, userCard) 
    }

    static userPanel() {
        const userPanelBtn = (text, page) => {
            const btn = createElement('button', 'user-panel-btn', text)
            btn.dataset.render = page
            return btn
        }

        const profilePageBtn = userPanelBtn('My profile', 'profile')
        const ordersPageBtn = userPanelBtn('Orders', 'orders')
        const logOutBtn = userPanelBtn('Log out', 'log-out')

        return [profilePageBtn, ordersPageBtn, logOutBtn]
    }

    userPage(page, container) {
        switch(page) {
            case 'orders':
                const orders = new Store('loggedInUser').getData().orders.reverse()
                if(!orders.length) {
                    new Notification('Order history is empty!').render(container, 'static', 'message')
                }

                const createOrderElement = (order) => {
                    const orderContainer = createElement('div', 'order-container')
                    const orderID = createElement('p', null, `Order #${order.id}`)
                    const orderPrice = createElement('p', null, `Total: $${order.bill.total}`)
                    const orderDate = createElement('p', null, order.date)
                    let expanded = null
                    orderContainer.addEventListener('click', (evt) => {
                        if(expanded) {
                            expanded.classList.remove('opened')
                            setTimeout(() => {
                                expanded.remove()
                                expanded = null
                            }, 400)
                        } else {
                            expanded = User.expandedOrderHistoryRender(order, orderContainer)
                            setTimeout(() => {
                                expanded.classList.add('opened')
                            }, 0)
                        }
                    })

                    orderContainer.append(orderID, orderPrice, orderDate)
                    return orderContainer
                }
                container.append(...orders.map(order => createOrderElement(order)))
            break
            default:
                container.append(this.profileRender())
            break
        }
    }

    profileRender() {
        const profileContainer = createElement('div', 'profile-container')
        const userLogin = createElement('p', null, `Login: ${this.login}`)
        const userFirstName = createElement('p', null, `First name: ${this.firstName}`)
        const userLastName = createElement('p', null, `Last name: ${this.lastName || 'Not specified'}`)
        const userEmail = createElement('p', null, `Email: ${this.email || 'Not specified'}`)
        const userPhone = createElement('p', null, `Phone: ${this.phone || 'Not specified'}`)

        profileContainer.append(userLogin, userFirstName, userLastName, userEmail, userPhone)
        return profileContainer
    }

    static expandedOrderHistoryRender(order, container) {
        const expandedContainer = createElement('div', 'order-history-expanded')
        const detailsTitle = createElement('p', 'details-title', 'Details')
        const detailsContainer = createElement('div', 'order-details')
        const dataContainer = createElement('ul', 'order-data-list')
        const shoppingTable = createElement('table', 'order-shopping-table')
        const data = order.data
        const shoppings = order.shoppings
        const bill = order.bill

        Object.entries(data).forEach(el => {
            const li = createElement('li', null, el.join(': '))
            dataContainer.append(li)
        })
        
        const tableHeader = createElement('tr', 'order-table-header')
        
        const createTableCell = (type, val, className = null) => {
            const cell = createElement(type, null, val)
            if(className) cell.classList.add(className)
            return cell
        }

        tableHeader.append(createTableCell('th', 'Product'), 
                           createTableCell('th', 'Qty'),
                           createTableCell('th', 'Price'),
                           createTableCell('th', 'Total'),)
        shoppingTable.append(tableHeader)
        shoppings.map(el => {
            const item = el[0]
            const qty = el[1]
            const elRow = document.createElement('tr')
            const nameTd = createTableCell('td', `${item.brand} ${item.model}`)
            const qtyTd = createTableCell('td', `${qty}`)
            const priceTd = createTableCell('td', `$${item.price}`)
            const totalTd = createTableCell('td', `$${item.price * qty}`)
            elRow.append(nameTd, qtyTd, priceTd, totalTd)
            shoppingTable.append(elRow)
        })

        Object.entries(bill).forEach((el, index) => {
            const tr = document.createElement('tr')

            if(index === 0) {
                const emptyCell = createTableCell('td', '')
                emptyCell.colSpan = 2
                emptyCell.rowSpan = 5
                tr.append(emptyCell)
            }
            
            const title = el[0].at(0).toUpperCase() + el[0].toLowerCase().slice(1)
            const price = index === 1 ? `${el[1]}%` : `$${el[1]}`
            tr.append(createTableCell('td', title, 'bill-title'),
                      createTableCell('td', price))
            shoppingTable.append(tr)
        })
        
        detailsContainer.append(detailsTitle, dataContainer)
        expandedContainer.append(detailsContainer, shoppingTable)
        container.after(expandedContainer)
        return expandedContainer
    }
}