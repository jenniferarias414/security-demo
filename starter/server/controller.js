//handles all the fxns to keep code clean
const bcrypt = require('bcryptjs')
const chats = []

module.exports = {
    createMessage: (req, res) => {
        const {pin, message} = req.body

        for(let i=0; i<chats.length; i++){
            let existingPin = bcrypt.compareSync(pin, chats[i].pinHash)

            if(existingPin) {
                chats[i].messages.push(message)
                let messagesToReturn = {...chats[i]}
                delete messagesToReturn.pinHash
                return res.status(200).send(messagesToReturn)
            }
        }

        console.log(req.body)
        const salt = bcrypt.genSaltSync(5) //salt adds random other values to make more complex, 5=lvl of complexity
        const pinHash = bcrypt.hashSync(pin, salt)
        // console.log(pin)
        // console.log(salt)
        // console.log(pinHash)
        const msgObj = {
            pinHash,
            messages: [message]
        }
        chats.push(msgObj)
        let messagesToReturn = {...msgObj}
        delete messagesToReturn.pinHash
        res.status(200).send(messagesToReturn)
    }
}