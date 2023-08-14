import { Router } from "./Router.js";
import { data } from "./db.js"

export const createElement = (elementName, className = null, text = null, src = null) => {
    const element = document.createElement(elementName)
    if(className) element.classList.add(className)
    if(text) element.textContent = text
    if(src) element.src  = src
    return element
}

const db = localStorage.getItem('items')
if(!db) {
    localStorage.setItem('items', JSON.stringify(data))
}

Router.start()

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (evt) => {
        evt.preventDefault()
        new Router(link).route()
    })
})