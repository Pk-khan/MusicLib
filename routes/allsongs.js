const express = require('express');
const router = express.Router();
const Song = require('../model/Song');
const Playlist = require('../model/Playlist');
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const auth = require('../middleware/auth').auth;

router.get('/', auth, async(request, response) => {

    var allSongs = await Song.find().populate("artist");

    var user = await getCurrentUser(request.cookies);

    var playlists = await Playlist.find({ user: user._id });

    data = {
        allSongs,
        playlists
    };

    response.render('../views/allsongs.ejs', { data });

});



router.get('/:songName', auth, async(request, response) => {

    var allSongs = await Song.find({
        $or: [{
                name: {
                    $regex: request.params.songName,
                    $options: 'i'
                }
            },
            {
                genre: {
                    $regex: request.params.songName,
                    $options: 'i'
                }
            }
        ]
    }).populate("artist");


    var user = await getCurrentUser(request.cookies);

    var playlists = await Playlist.find({ user: user._id });

    var songSearchName = 'No Song found!';
    if (allSongs.length > 0) {
        songSearchName = "Result for Songs having '" + request.params.songName + "'...";
    }

    data = {
        allSongs,
        playlists,
        songSearchName
    };

    response.render('../views/allsongs.ejs', { data });

});


module.exports = router;