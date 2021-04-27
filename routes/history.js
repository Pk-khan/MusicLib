const express = require('express');
const router = express.Router();
const History = require('../Model/History');
const getCurrentUser = require('../middleware/auth').getCurrentUser;


router.get('/', async function(request, response) {

    const user = await getCurrentUser(request.cookies);

    if (!user) return response.status(404).send("User not found");


    let historySongs = await History.findOne({ user: user._id }).populate("songs");

    response.render('../views/history.ejs', { historySongs });
});




module.exports = router;