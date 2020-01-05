const jwt = require('jsonwebtoken')
const User = require('../model/user.model')

const auth = async (req, res, next) =>{
    try{
        const token = req.header('Athorization').replace('Bearer', '')
        const decoded = jwt.verify(token, process.env.TOKEN) // this is the actual password
        const user = await User.findOne({ _id: decoded._id, "tokens.token" : token })

        if(!user){
            throw new Error();
        }

        req.token = token
        req.user = user
        next()
    } catch (e){
        res.status(400).send(e)
    }
}

module.exports = auth