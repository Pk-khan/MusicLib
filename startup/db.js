const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async function() {

    try {
        await mongoose.connect(process.env.Mongo_Uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mongodb connection success');

    } catch (er) {
        console.log('Mongodb connection failed');
        console.log(er);
        process.exit(1);
    }

}