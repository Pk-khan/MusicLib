const express = require('express');
const validate = require('../inputValidate/validateNewUser');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

router.get('/', async(request, response) => {

    response.render('../views/register.ejs', { msg: '' });

});

router.post('/', async(request, response) => {

    const result = await validate.validateUser(request.body);

    if (result.error) {

        if (result.error.message.includes("name")) {
            response.send({
                "errors": {
                    "name": result.error.message
                }
            });
        } else if (result.error.message.includes("email")) {
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





    const isUserEmailExist = await User.findOne({ email: request.body.email });

    if (isUserEmailExist) return response.send({ 'errors': { 'email': "email in use already" } });

    let user = new User(request.body);

    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = await user.generateAuthToken();
    response.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7 });


    response.send({
        "successMessage": "User register success"
    });

});



module.exports = router;