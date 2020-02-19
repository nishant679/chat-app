
const express = require('express')
const path = require('path')

const app = express()


// Setting up the localhost port at 3000 and 
// Heroku port when hosted on server
const port = process.env.PORT || 3002


// Adding the path for the public directory
const public_dir_path = path.join(__dirname, '../public')

app.use(express.static(public_dir_path))


// Enabling the server to listen on the 
// Appropriate port
app.listen(port, () => {
    console.log("the server is up and running on port ", port);
})

