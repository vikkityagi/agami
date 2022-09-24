const mongoose = require('mongoose');




const schema = mongoose.Schema({
    item_id: {
        type: Number,
        primarykey: true,
        required: true,
        default: Math.floor(Math.random()* (60000)+1000)
    },
    item_name: {
        type: String
    },
    shipped_by: {
        type: String
    },
    mobileno: {
        type: String
    },
    address: {
        type: String
    },
    toaddress:{
        type: String
    },
    photo: {
        type: String
    },
    distance:{
        type: Number
    },
    weight: {
        type: Number
    },
    price: {
        type: String
    },
    deleiverdate:{
        type: String
    }
})



module.exports = mongoose.model('usertable',schema)
