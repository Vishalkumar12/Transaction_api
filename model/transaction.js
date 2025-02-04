const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    txHash : { type : String, required : true },
    from : {type : String, required : true},
    to : {type : String, required: true},
    amount : {type : Number, required : true},
    status : {type : String, enum : ['pending', 'confirmed', 'failed'], default : 'pending'},
    timestamp : {type: Date, default: Date.now()}
});

const transaction = mongoose.model('Transaction', transactionSchema)

module.exports = transaction;