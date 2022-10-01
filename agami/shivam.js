// const { Client } = require('pg')
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'postgres',
//   port: 5432,
// })

// client.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

const mongoose = require('mongoose')

const model = mongoose.Schema({
    id:{
        type: Number,
        required: true
        
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    photo: {
        type: String
    },
    fee: {
        type: Number
    },
    datetime: {
        type: String
    }
})

module.exports = mongoose.model('student',model)