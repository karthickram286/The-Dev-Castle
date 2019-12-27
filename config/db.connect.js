const mongoose = require('mongoose');
const config = require('config');

const mongoDBURI = config.get('MongoDBURI');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log(`Connected to MongoDB...`);
    } catch (err) {
        console.log(`Can't connect to MongoDB ${err}`);
        process.exit(1);
    }
}

module.exports = connectDB;