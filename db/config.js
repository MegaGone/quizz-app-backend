const mongoose = require('mongoose');
require('colors');

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('DB connected'.green);

    } catch (error) {
        console.log(error);
        throw new Error('Error to connect DB')
    }
}

module.exports = {
    dbConnection
}