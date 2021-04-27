const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],

    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    time: {
        type: Date,
        default: Date.now()
    }

});


const Album = mongoose.model('Album', albumSchema);

module.exports = Album;