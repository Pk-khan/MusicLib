const express = require('express');
const validate = require('../inputValidate/validateNewUser');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

router.get('/', async(request, response) => {

    response.render('../views/login.ejs', {});

});

router.post('/', async function(request, response) {

    const result = await validate.validateLogin(request.body);

    if (result.error) {

        if (result.error.message.includes("email")) {
            response.send({
                "errors": {
                    "email": result.error.message
                }
            });
        } else if (result.error.message.includes("password")) {
            response.send({
                "errors": {
                    "password": result.error.message
                }
            });
        }

        return;
    }

    var user = await User.findOne({ email: request.body.email });

    if (!user) {
        response.send({
            "errors": {
                "password": "Invalid email or password"
            }
        });
        return;
    }


    if ((!await bcrypt.compare(request.body.password, user.password))) {
        response.send({
            "errors": {
                "password": "Invalid email or password"
            }
        });
        return
    }

    const token = await user.generateAuthToken();
    response.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7 });


    response.send({
        "successMessage": "User Login success"
    });

});







module.exports = router;