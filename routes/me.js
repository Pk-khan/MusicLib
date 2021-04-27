const express = require('express');
const router = express.Router();
const getCurrentUser = require('../middleware/auth').getCurrentUser;

router.get('/', async function(request, response) {


    const user = await getCurrentUser(request.cookies);

    if (!user)
        return response.status(401).send("Invalid user");

    var data = {
        user
    };

    response.render('../views/me.ejs', { data });
});


module.exports = router;