import { Notification } from "./Notification.js"

export class User {
    constructor(login, fisrtName, password, lastName, email, phone) {
        this.login = login
        this.password = password
        this.fisrtName = fisrtName
        this.lastName = lastName
        this.email = email
        this.phone = phone
        this.wishlist = []
        this.orders = []
    }

    static getUsers() {
        const allUsers = localStorage.getItem('users')
        if(allUsers) return JSON.parse(allUsers)
        else return []
    }

    static login(login, password) {
        const allUsers = User.getUsers()
        const loginValidate = allUsers.find(user => user.login === login)
    
        if(loginValidate && loginValidate.password === password) {
            localStorage.setItem('loggedInUser', JSON.stringify(loginValidate))
            document.querySelector('.user-container').innerHTML = ''
            localStorage.setItem('wishlist', JSON.stringify(loginValidate.wishlist))
            User.renderUserPage(loginValidate)
        }
    }

    static signUp(...data) {
        const allUsers = User.getUsers()
        allUsers.push(new User(...data))
        localStorage.setItem('users', JSON.stringify(allUsers))
        console.log(data)
        User.login(data[0], data[2])
    }

    static renderUserPage(user) {
        const container = document.querySelector('.user-container')

        const panelContainer = document.createElement('div')
        panelContainer.append(...User.userPanel())
        panelContainer.classList.add('user-panel')

        const userCard = document.createElement('div')
        userCard.classList.add('user-card')
        User.userPage(user, null, userCard)
        
        Array.from(panelContainer.children).forEach(btn => {
            btn.addEventListener('click', (evt) => {
                userCard.innerHTML = ''
                if(evt.target.dataset.render !== 'log-out') {
                    User.userPage(user, evt.target.dataset.render, userCard)
                } else {
                    localStorage.removeItem('loggedInUser')
                    localStorage.removeItem('wishlist')
                    document.querySelector('.user-container').innerHTML = ''
                    User.signUpFormRender()
                    User.loginFormRender()
                }
            })
        })

        container.append(panelContainer, userCard) 
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

        const signUpContainer = document.createElement('div')
        signUpContainer.classList.add('sign-up')
    
        const signUpTitle = document.createElement('h2')
        signUpTitle.classList.add('user-form-title')
        signUpTitle.textContent = 'Create new account'
    
        const signUpForm = document.createElement('form')
        signUpForm.classList.add('sign-up-form')
        signUpForm.name = 'sign-up-form'
    
        const loginField = User.createFormField('text', 'login-field', 'login-signupform', "Login", true)
        const nameField = User.createFormField('text', 'name-field', 'name-signupform', 'Name', true)
        const passwordField = User.createFormField('password', 'password-field', 'password-signupform', 'Password', true)
    
        const submitButton = document.createElement('input')
        submitButton.type = "submit"
        submitButton.value = "Sign-up"
    
        signUpForm.append(signUpTitle, loginField, nameField, passwordField, submitButton)
        signUpContainer.append(signUpForm)
        container.append(signUpContainer)
    
        signUpForm.addEventListener('submit', (evt) => {
            evt.preventDefault() 
            const users = User.getUsers()
            const userData = Object.values(signUpForm.elements).slice(0,3).map(el => el.value)
            if(!users.find(el => el.login === userData[0])) {
                User.signUp(...userData)
                new Notification('Signed up successfully!').render(document.body, 'pop', 'success')
            } else new Notification('User already registered!').render(document.body, 'pop', 'error')
        })
    }
    
    static loginFormRender = () => {
        const  container = document.querySelector('.user-container') 

        const loginContainer = document.createElement('div')
        loginContainer.classList.add('login')
    
        const loginTitle = document.createElement('h2')
        loginTitle.classList.add('user-form-title')
        loginTitle.textContent = 'Login with existing account'
    
        const loginForm = document.createElement('form')
        loginForm.classList.add('login-form')
        loginForm.name = 'login-form'
    
        const loginField = User.createFormField('text', 'login-field', 'login-loginform', "Login", true)
        const passwordField = User.createFormField('password', 'password-field', 'password-loginform', 'Password', true)
    
        const submitButton = document.createElement('input')
        submitButton.type = "submit"
        submitButton.value = "Login"
    
        loginForm.append(loginTitle, loginField, passwordField, submitButton)
        loginContainer.append(loginForm)
        container.append(loginContainer)
    
        loginForm.addEventListener('submit', (evt) => {
            evt.preventDefault()
            const userData = Object.values(loginForm.elements).slice(0,2).map(el => el.value)
            User.login(...userData)
            if(localStorage.getItem('loggedInUser')) new Notification('Login successful!').render(document.body, 'pop', 'success')
            else new Notification('Incorrect username or password!').render(document.body, 'pop', 'error')
        })
    }

    static userPanel() {
        const userPanelBtn = (text, page) => {
            const btn = document.createElement('button')
            btn.classList.add('user-panel-btn')
            btn.dataset.render = page
            btn.textContent = text
            return btn
        }

        const profilePageBtn = userPanelBtn('My profile', 'profile')
        const ordersPageBtn = userPanelBtn('Orders', 'orders')
        const logOutBtn = userPanelBtn('Log out', 'log-out')

        return [profilePageBtn, ordersPageBtn, logOutBtn]
    }

    static userPage(user, page, container) {
        switch(page) {
            case 'orders':
                const orders = JSON.parse(localStorage.getItem('loggedInUser')).orders.reverse()
                if(!orders.length) {
                    new Notification('Order history is empty!').render(container, 'static', 'message')
                }

                const createOrderElement = (order) => {
                    const orderContainer = document.createElement('div')
                    orderContainer.classList.add('order-container')

                    const orderID = document.createElement('p')
                    orderID.textContent = `Order #${order.id}`

                    const orderPrice = document.createElement('p')
                    orderPrice.textContent = `Total: $${order.bill.total}`

                    const orderDate = document.createElement('p')
                    orderDate.textContent = order.date

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
                container.append(User.profileRender(user))
            break
        }
    }

    static expandedOrderHistoryRender(order, container) {
        const expandedContainer = document.createElement('div')
        expandedContainer.classList.add('order-history-expanded')
        const detailsTitle = document.createElement('p')
        detailsTitle.textContent = 'Details'
        detailsTitle.classList.add('details-title')
        const detailsContainer = document.createElement('div')
        detailsContainer.classList.add('order-details')
        const dataContainer = document.createElement('ul')
        dataContainer.classList.add('order-data-list')
        const shoppingTable = document.createElement('table')
        shoppingTable.classList.add('order-shopping-table')
        
        const data = order.data
        const shoppings = order.shoppings
        const bill = order.bill

        Object.entries(data).forEach(el => {
            const li = document.createElement('li')
            li.textContent = el.join(': ')
            dataContainer.append(li)
        })
        
        const tableHeader = document.createElement('tr')
        tableHeader.classList.add('order-table-header')
        
        const createTableCell = (type, val, className = null) => {
            const cell = document.createElement(type)
            cell.textContent = val
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

    static profileRender(user) {
        const profileContainer = document.createElement('div')
        profileContainer.classList.add('profile-container')

        const userLogin = document.createElement('p')
        userLogin.textContent = `Login: ${user.login}`
        
        const userFirstName = document.createElement('p')
        userFirstName.textContent = `First name: ${user.fisrtName}`

        const userLastName = document.createElement('p')
        userLastName.textContent = `Last name: ${user.lastName || 'Not specified'}`
        
        const userEmail = document.createElement('p')
        userEmail.textContent =  `Email: ${user.email || 'Not specified'}`

        const userPhone = document.createElement('p')
        userPhone.textContent =  `Phone: ${user.phone || 'Not specified'}`

        profileContainer.append(userLogin, userFirstName, userLastName, userEmail, userPhone)

        return profileContainer
    }
}