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




socket.on('countUpdated', (count, welcomeMsg) => {
    console.log("The count has been updated !! ", count);
    console.log(welcomeMsg)
})

socket.on('newMsg', (msg) => {

    /*
    console.log('New msg arrieved', msg)
    //Rendering the message inside div

    const chat_container = document.querySelector('#chat-box');
    const writer = document.querySelector('#new_line');
    writer.innerHTML = msg;

    const p = document.createElement('p');
    p.innerHTML = msg;
    p.appendChild(msg);
    document.body.chat_container.appendChild(p);
 */
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        msg: msg,
        createdAt: moment(msg.createdAt).format('h:mm a'),
        msg
    })
    $messages.insertAdjacentHTML('beforeend', html)

})

//Sharing the geolocation

const share_location = document.querySelector('#send-location');
share_location.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit(position)

        socket.emit('location', {
            'lat': position.coords.latitude,
            'long': position.coords.longitude
        });
    });
    //console.log(curLoc);
})

const incrementer = document.querySelector('#increment');

/*
incrementer.addEventListener('click', () => {
    console.log("button clicked")

    socket.emit('increment')
})
*/


const msg_form = document.querySelector('#message-form').addEventListener('submit', (e) => {

    e.preventDefault()
    msg = e.target.elements.message.value;
    socket.emit('message', msg)
})

//msg = "Working successfully "
