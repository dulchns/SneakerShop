import { Router } from "./Router.js";
import { data } from "./db.js"
import { Store } from "./Store.js";

export const createElement = (elementName, className = null, text = null, src = null) => {
    const element = document.createElement(elementName)
    if(className) element.classList.add(className)
    if(text) element.textContent = text
    if(src) element.src  = src
    return element
}

const itemStore = new Store('items')
const db = itemStore.getData()
if(!db.length) {
    itemStore.setData(data)
}

Router.start()

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (evt) => {
        evt.preventDefault()
        new Router(link).route()
    })
})