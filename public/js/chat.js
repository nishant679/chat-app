const socket = io()


// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//tempelates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//reading username and room
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('countUpdated', (count, welcomeMsg) => {
    console.log("The count has been updated !! ", count);
    console.log(welcomeMsg)
})


//rendering a new message
socket.on('newMsg', ({ msg, user_name }) => {
    console.log(msg)

    const html = Mustache.render(messageTemplate, {
        // msg: msg,
        username: user_name,
        createdAt: moment(msg.createdAt).format('h:mm a'),
        msg,
        user_name
    })
    $messages.insertAdjacentHTML('beforeend', html)


})


//Rendring Users list
socket.on('roomData', ({ room, users }) => {
    console.log(room);
    console.log(users);
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


const msg_form = document.querySelector('#message-form').addEventListener('submit', (e) => {

    e.preventDefault()
    msg = e.target.elements.message.value;
    socket.emit('message', msg)
})

//emmiting a message when some user joins
socket.emit('join', { username, room })
