const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db.connect');

const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ extended: false  }));

/**
 * MongoDB connection
 */
connectDB();

/**
 * Routers registration
 */
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});