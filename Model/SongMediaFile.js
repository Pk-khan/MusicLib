const mongoose = require('mongoose');

const songMediaFileSchema = new mongoose.Schema({

    songFile: {
        type: String,
        required: true
    },

});

const SongMediaFile = mongoose.model('SongMediaFile', songMediaFileSchema);

module.exports = SongMediaFile;