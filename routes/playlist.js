const express = require('express');
const router = express.Router();
const Song = require('../model/Song');
const Playlist = require('../model/Playlist');
const auth = require('../middleware/auth').auth;
const getCurrentUser = require('../middleware/auth').getCurrentUser;
const { response } = require('express');


// To get all playlist of currently logged in user
router.get('/', auth, async(request, response) => {

    let allPlaylist;

    let user = await getCurrentUser(request.cookies);
    if (!user) {
        return response.status(404).send("User not found");
    }

    try {
        allPlaylist = await Playlist.find({ 'user': user._id });
    } catch (ex) {
        return response.status(400).send("Invalid Playlists");
    }

    var data = {
        allPlaylist
    };

    response.render("../views/playlist.ejs", { data });

});


// To get particular playlist with params.id
router.get('/:id', auth, async(request, response) => {

    let playlist;
    try {
        playlist = await Playlist.findById(request.params.id).populate("songs").populate("user");
    } catch (ex) {
        return response.status(400).send("Invalid Playlist");
    }
    if (!playlist)
        return response.send("Invalid Playlist");

    var data = {
        playlist
    };

    response.render("../views/showPlaylist.ejs", { data });

});


// To Create a New Playlist
router.post('/createNewPlaylist', auth, async(request, response) => {

    let user = await getCurrentUser(request.cookies);
    if (!user) {

        return response.status(401).send("User not found");
    }

    let playlistName = request.body.name;

    const isPlaylistAlreadyExist = await Playlist.findOne({ 'name': playlistName, 'user': user._id });

    if (isPlaylistAlreadyExist)
        return response.send({
            msg: "Playlist already exists"
        });

    let playlist = {
        'name': playlistName,
        'user': user
    };

    playlist = new Playlist(playlist);
    await playlist.save();

    response.send({ msg: playlist.name + " playlist created..." });
});




// To Rename a specific playlist
router.post('/renamePlaylist', auth, async(request, response) => {

    let user = await getCurrentUser(request.cookies);
    if (!user) {

        return response.status(401).send("User not found");
    }

    const playlistId = request.body.playlistId;
    const playlistNewName = request.body.playlistNewName;

    let resPlaylist = await Playlist.findById(playlistId);

    if (!resPlaylist)
        return response.send({
            msg: "Playlist does not exist"
        });

    resPlaylist.name = playlistNewName;
    await resPlaylist.save();


    response.send({ msg: "Playlist Rename successfully" });

});






// To delete a specific playlist
router.post('/deletePlaylist', auth, async(request, response) => {

    let user = await getCurrentUser(request.cookies);
    if (!user) {

        return response.status(401).send("User not found");
    }

    let playlistId = request.body.playlistId;

    const res = await Playlist.findById(playlistId);

    if (!res)
        return response.send({
            msg: "Playlist does not exist"
        });


    await Playlist.deleteOne({ _id: playlistId });

    response.send({ msg: "Playlist delete successfully" });

});




// To add Song into the particular playlist
router.post('/addSongIntoPlaylist', auth, async(request, response) => {

    let user = await getCurrentUser(request.cookies);
    if (!user) {
        return response.status(401).send("User not found");
    }

    let songId = request.body.songId;
    let playlistId = request.body.playlistId;
    let song, playlist;
    try {

        playlist = await Playlist.findOne({
            _id: playlistId,
            user: user._id
        });
        song = await Song.findById(songId);

    } catch (ex) {
        return response.status(400).send(ex);
    }

    if (!playlist || !song)
        return response.send({
            msg: "Something went wrong"
        });

    let songs = playlist.songs;

    if (songs.includes(songId))
        return response.send({
            msg: "Song already added"
        });



    await Playlist.updateOne({
        _id: playlistId
    }, { $push: { songs: songId } });


    response.send({
        msg: "Song added successfully"
    });

});





// To remove a song from a specific playlist
router.post('/removeSong', auth, async(request, response) => {

    let user = await getCurrentUser(request.cookies);
    if (!user) {
        return response.status(401).send("User not found");
    }

    let playlistId = request.body.playlistId;
    let songId = request.body.songId;

    const resPlaylist = await Playlist.findById(playlistId);
    const songs = resPlaylist.songs;

    if (!resPlaylist)
        return response.send({
            msg: "Playlist does not exist"
        });


    if (!songs.includes(songId)) {
        return response.send({
            msg: "Song does not exist"
        });
    }


    await Playlist.updateOne({
        _id: playlistId
    }, { $pull: { songs: songId } });


    response.send({
        msg: "Song removed successfully"
    });

});




module.exports = router;