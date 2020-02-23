
const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

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
    socket.broadcast.emit("A new user has Joined ");

    //Join event
    socket.on('join', (options, callback) => {

        socket.broadcast.emit("A new user has Joined ");
        console.log("a new user joined");
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        //callback()

    })


    //defining actions for new user joins
    socket.on('message', (msg) => {
        const user = getUser(socket.id)
        let user_name = user.username;
        io.to(user.room).emit('newMsg', { msg, user_name });
        console.log(user.username)
    })



    //function to invoke when a user disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        console.log("user disconnected");
    })
})


// Enabling the server to listen on the 
// Appropriate port
server.listen(port, () => {
    console.log("the server is up and running on port ", port);
})

