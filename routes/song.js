const express = require('express');
const router = express.Router();
const Song = require('../model/Song');
const User = require('../model/User');
const Album = require('../model/Album');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth').auth;
const SongMediaFile = require('../Model/SongMediaFile');
const History = require('../Model/History');
const { getCurrentUser } = require('../middleware/auth');


// To get upload page for Artists
router.get('/upload', auth, async(request, response) => {

    response.render("../views/addNewSong.ejs", {});

});


// Fetch song with song id as params.id
router.get('/:id', auth, async(request, response) => {

    const user = await getCurrentUser(request.cookies);
    if (!user) return response.status(401).send("User not found");


    let song;
    try {
        song = await Song.findById(request.params.id);
    } catch (ex) {
        return response.status(404).send("Invalid Song");
    }
    if (!song)
        return response.status(404).send("Invalid song");


    song.plays = await song.plays + 1; // To increase play count
    await song.save();

    let history = await History.findOne({ user: user._id });

    if (!history) {
        history = {
            user: user._id
        };

        history = new History(history);

        await history.save();
    }

    if (history.songs.includes(song._id)) {
        await History.updateOne({ user: user._id }, { $pull: { songs: song._id } });
    }

    await History.updateOne({ user: user._id }, { $push: { songs: song._id } });

    song = await SongMediaFile.findById(song.url);

    response.send(song);
});









// To get uploaded song from the Artist
router.post('/upload', auth, async(request, response) => {

    const name = request.body.name;

    let url;
    if (request.body.url)
        url = await request.body.url;
    else {
        return response.status(404).send("Something went wrong");
    }

    let genre;
    if (request.body.genre)
        genre = request.body.genre;

    var user;

    try {
        const token = request.cookies.token;
        const decode = jwt.verify(token, process.env.jwtKey);
        user = await User.findById(decode);
        if (!user) {
            return response.status(401).send("Artist not found");

        }
        user = user._id;
    } catch (ex) {
        console.log(ex);
        return response.status(404).send(ex);

    }

    let album = request.body.album;

    let songMediaFile = new SongMediaFile({ songFile: url });
    let songMediaFileId = await songMediaFile.save();

    let song = {
        name,
        'url': songMediaFileId,
        genre,
        'artist': user,
        album
    };

    song = new Song(song);
    await song.save();

    // To add this song in Album
    album = await Album.findOne({
        name: request.body.album,
        artist: user,
    });

    if (!album) {
        album = {
            'name': request.body.album,
            'artist': user,
        };
        album = new Album(album)
        await album.save();
    }
    await Album.updateOne({ '_id': album._id }, { $push: { songs: song._id } });

    response.send({
        msg: 'Song uploaded success'
    });

});



module.exports = router;