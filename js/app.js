import { Router } from "./Router.js";

const db = localStorage.getItem('items')
if(!db) {
    const data = [{"id":"1","brand":"Nike","model":"Air 90","for":"Men","description":"Lace up and feel the legacy. Produced at the intersection of art, music and culture, this champion running shoe helped define the ‘90s. Worn by presidents, revolutionized through collabs and celebrated through rare colorways, its striking visuals, Waffle outsole, and exposed Air cushioning keep it alive and well.","price":"300","image":"/images/shop_items/item_1.jpg"},{"id":"2","brand":"Puma","model":"Shift","for":"Men","description":"The futuristic training silhouette gets a stylistic update with an all-over speckled upper and bold pops of neon.Future and retro collide in our Futro designs.","price":"120","image":"/images/shop_items/item_2.jpg"},{"id":"3","brand":"Puma","model":"Mirage Tech","for":"Women","description":"Introducing the Mirage Tech. Its trippy colors, eye-catching layers, and futuristic elements take inspiration from the lights, energy, and atmosphere of EDM shows. Bold combos plus statement overlay details make for a head-turning look. This reimagined silhouette is inspired by illusions and visions – the space between what’s real and what your senses tell you. And it’s ready to transport you into a world of new realities.","price":"165","image":"/images/shop_items/item_3.jpg"}]
    localStorage.setItem('items', JSON.stringify(data))
}

Router.start()

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (evt) => {
        evt.preventDefault()
        Router.route(link)
    })
})