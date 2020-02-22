const socket = io()

socket.on('countUpdated', (count, welcomeMsg) => {
    console.log("The count has been updated !! ", count);
    console.log(welcomeMsg)
})

socket.on('newMsg', (msg) => {
    console.log('New msg arrieved', msg)
    //Rendering the message inside div

    const writer = document.querySelector('#new_line');
    writer.innerHTML = msg;

    const p = document.createElement("p");
    p.innerHTML = msg;
    document.body.appendChild(p);

})

//Sharing the geolocation

const share_location = document.querySelector('#location');
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

incrementer.addEventListener('click', () => {
    console.log("button clicked")

    socket.emit('increment')
})



const msg_form = document.querySelector('#message_form').addEventListener('submit', (e) => {

    e.preventDefault()
    msg = e.target.elements.message.value;
    socket.emit('message', msg)
})

//msg = "Working successfully "
