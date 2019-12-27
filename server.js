const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const userRouter = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * MongoDB connection
 */
let mongoDbURI = "mongodb+srv://karthickram:6YksAdRKW4OBIjbL@castle-cluster-d92zc.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

/**
 * Routers registration
 */
app.use('/users', userRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});