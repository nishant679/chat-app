
const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()


// Setting up the localhost port at 3000 and 
// Heroku port when hosted on server
const port = process.env.PORT || 3002
const server = http.createServer(app)
const io = socketio(server)


// Adding the path for the public directory
const public_dir_path = path.join(__dirname, '../public')

app.use(express.static(public_dir_path))

let count = 0
const welcomeMsg = "Hello!! Welcome to NChat"


io.on('connection', (socket) => {
    console.log("New websocket connection !!")
    socket.emit('countUpdated', count, welcomeMsg)
    socket.broadcast.emit("A new user has Joined ");
    //console.log(socket["id"])

    socket.on('increment', () => {
        count++;
        socket.emit('countUpdated', count)
    })

    socket.on('message', (msg) => {
        socket.broadcast.emit('newMsg', msg);
    })

    socket.on('location', (loc) => {
        socket.emit(loc);
        console.log(loc)
    })
})


// Enabling the server to listen on the 
// Appropriate port
server.listen(port, () => {
    console.log("the server is up and running on port ", port);
})

