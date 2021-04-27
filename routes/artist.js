const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Album = require('../model/Album');
const auth = require('../middleware/auth').auth;
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const { response, request } = require('express');

// Get Artist.ejs
router.get('/', auth, async(request, response) => {

    var artists = await User.find({ isArtist: true });

    var data = {
        artists,
        text: "All Artists"
    };

    response.render('../views/artist.ejs', { data });

});



// Get all albums of particular Artist with id as param.id
router.get('/:id', auth, async(request, response) => {

    var album = await Album.find({ artist: request.params.id }).populate("artist");
    var artist = await User.findById(request.params.id);
    var data = {
        album,
        text: ` ${artist.name }' Album `
    };

    response.render('../views/album.ejs', { data });

});









module.exports = router;