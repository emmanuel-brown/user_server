require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helmet = require('helmet')
const morgan = require('morgan')
const mongoose = require('mongoose')
const compression = require('compression')
const PORT = process.env.PORT || 5001

const app = express()

app.use(compression()) //enable connection to react app even though they're seperate
app.use(morgan('tiny'))
app.use(helmet())
app.use(express.urlencoded())
app.use(express.json())

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	uri = process.env.ATLAS_URI  // connection string for Atlas here  
} else {
	uri = process.env.ATLAS_URI   // connection string for localhost mongo here  
}

client = mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, client) => {
    if (err) {    
        console.log(err) 
        return
    }   
    console.log("Connected successfully to database") 
});

/////////////////////////
///  api end points  ///
///////////////////////

const usersRouter = require('./routes/users')

app.use('/users', usersRouter)

// const myFunction = async () => {
//     const password = 'Red12345!'
//     const hashedPassword = await bcrypt.hash(password, 8)
//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
//     console.log("isMatch:", isMatch)
// }

// const webToken = async () =>{
//     const token = jwt.sign({ _id: 'something' }, process.env.TOKEN)
//     console.log("Token:", token)

//     const data = jwt.verify(token, process.env.TOKEN)
//     console.log("data", data)
// }

// myFunction()
// webToken()


app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })