const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({

    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

});


const History = mongoose.model('History', historySchema);

module.exports = History;