require('dotenv').config()
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema
const model = mongoose.model

const userSchema = Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email input is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error(`password cannot contain "password"`)
            }
        }
    },
    info: [ Object ],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    console.log(user)
    const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN)
    user.tokens = user.tokens.concat({ token })
    return token
}   

userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await UserModel.findOne({ email })

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const UserModel = model("users", userSchema)

module.exports = UserModel