const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ItemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    specs:{
        type: String,
        default: 'not available right now'
    },
    price:{
        type: Number,
        default: 0
    },
    category:{
        type: String,
        required: true,
        trim: true
    }
});

ItemSchema.plugin(timestamp);
const Items = mongoose.model('Items', ItemSchema);
module.exports = Items;