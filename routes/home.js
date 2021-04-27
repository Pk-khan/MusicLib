const express = require('express');
const router = express.Router();
const Song = require('../model/Song');
const Playlist = require('../model/Playlist');
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const auth = require('../middleware/auth').auth;

router.get('/', auth, async(request, response) => {

    var songs = await Song.find().populate("artist");

    // recentSongs.sort(function(a, b) {
    //     return b.time - a.time;
    // });

    var user = await getCurrentUser(request.cookies);

    var playlists = await Playlist.find({ user: user._id });

    data = {
        songs,
        playlists
    };

    response.render('../views/home.ejs', { data });

});

module.exports = router;