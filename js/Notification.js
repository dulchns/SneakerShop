export class Notification {
    constructor(message) {
        this.message = message
    }

    render(container, type, style) {
        const notification = document.createElement('div')
        notification.classList.add('notification')

        const notificationImg = document.createElement('img')

        const notificationText = document.createElement('p')
        notificationText.textContent = this.message 
        
        switch(style) {
            case 'message':
                notification.style.backgroundColor = '#a1d2ff'
                notificationImg.src = '/images/info.svg'
            break
            case 'warning':
                notification.style.backgroundColor = '#ffd966'
                notificationImg.src = '/images/warning.svg'
            break
            case 'error':
                notification.style.backgroundColor = '#da1919'
                notificationImg.src = '/images/error.svg'
            break
            case 'success':
                notification.style.backgroundColor = '#5dbea3'
                notificationImg.src = '/images/success.svg'
            break
        }

        notification.append(notificationImg, notificationText)

        switch(type) {
            case 'pop':
                notification.style.position = 'fixed'
                notification.style.bottom = '0'
                notification.style.right = '0'
                notification.style.transform = 'translateX(100%)'
                container.append(notification)
                setTimeout(() => {
                    notification.style.transform = 'translateX(0%)'
                    setTimeout(() => {
                        notification.style.transform = 'translateX(100%)'
                    }, 2500)
                }, 0)
            break
            case 'static':
                container.append(notification)
            break
        }  
    }
}