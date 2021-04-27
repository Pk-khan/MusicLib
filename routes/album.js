const express = require('express');
const router = express.Router();
const Album = require('../model/Album');
const Playlist = require('../model/Playlist');
const auth = require('../middleware/auth').auth;
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const { response } = require('express');

// Get Album of current logged in Artist
router.get('/', auth, async(request, response) => {

    var data;
    var user = await getCurrentUser(request.cookies);

    if (!user || !user.isArtist)
        return response.status(401).send("Invalid user");


    var album = await Album.find({ artist: user._id }).populate("artist");
    var playlists = await Playlist.find({ user: user._id });


    var data = {
        album,
        playlists,
        text: "My Albums"
    };

    response.render('../views/album.ejs', { data });

});


// Get songs of particular Album
router.get('/:id', auth, async(request, response) => {

    let album;
    try {
        album = await Album.findById(request.params.id).populate("songs").populate("artist");
    } catch (ex) {
        return response.status(404).send("Invalid Album");
    }
    if (!album)
        return response.send("Invalid Album");

    var user = await getCurrentUser(request.cookies);

    if (!user)
        return response.status(401).send("Invalid user");


    var playlists = await Playlist.find({ user: user._id });
    var data = {
        album,
        playlists
    };

    response.render("../views/showAlbum.ejs", { data });

});


// Get all albums
router.get('/:show/:all', auth, async(request, response) => {

    var user = await getCurrentUser(request.cookies);

    if (!user)
        return response.status(401).send("Invalid user");

    let album;
    try {
        album = await Album.find().populate("songs").populate("artist");
    } catch (ex) {
        return response.status(404).send("Invalid Album");
    }
    if (!album)
        return response.send("Invalid Album");

    var data = {
        album,
        text: "All Albums"
    };

    response.render("../views/album.ejs", { data });

});



// To Rename a specific Album by only Artist
router.post('/renameAlbum', auth, async(request, response) => {

    let user = await getCurrentUser(request.cookies);
    if (!user && !user.isArtist) {
        return response.status(401).send("User not found");
    }

    const albumId = request.body.albumId;
    const albumNewName = request.body.albumNewName;

    let resAlbum = await Album.findById(albumId);

    if (!resAlbum)
        return response.send({
            msg: "Playlist does not exist"
        });

    resAlbum.name = albumNewName;
    await resAlbum.save();

    response.send({ msg: "Playlist Rename successfully" });

});





module.exports = router;