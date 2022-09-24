var mongoose = require('mongoose');



var dmodel  = mongoose.Schema({
    ditemid: {
        type: Number,
        required: true
    },
    deletetime:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('ditemtable',dmodel);