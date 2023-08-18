export class Store {
    constructor(data) {
        this.data = data
    }

    getData() {
        const data = localStorage.getItem(this.data)
        if(data) return JSON.parse(data)
        else return []
    }

    setData(value) {
        localStorage.setItem(this.data, JSON.stringify(value))
    }

    remove() {
        localStorage.removeItem(this.data)
    }
}