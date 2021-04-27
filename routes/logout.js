const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.get('/', async function(request, response) {
    const token = request.cookies.token;

    if (!token) {
        response.redirect('/');
        return;
    }
    response.cookie('token', '', { maxAge: 1 });

    response.redirect('/');


});


module.exports = router;